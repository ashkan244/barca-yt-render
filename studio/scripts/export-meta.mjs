// Export YouTube chapters + SRT captions for an episode (same timing rules as src/engine/timeline.ts).
// Usage: node scripts/export-meta.mjs <EPISODE-ID> <outDir>
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [id, outDir = path.join(root, 'out')] = process.argv.slice(2);
const spec = JSON.parse(fs.readFileSync(path.join(root, 'src/episodes/specs', `${id}.json`), 'utf8'));
const narration = JSON.parse(fs.readFileSync(path.join(root, 'src/episodes/narration', `${spec.code}.json`), 'utf8'));
const durFile = path.join(root, 'public/audio', spec.code, 'durations.json');
const durations = fs.existsSync(durFile) ? JSON.parse(fs.readFileSync(durFile, 'utf8')) : {};
const FPS = 30;
const order = narration.map((l) => l.id);
const byId = new Map(narration.map((l) => [l.id, l]));
const expand = (s) => { if (!s) return []; if (Array.isArray(s)) return s; const [a, b] = s.split('..'); return b ? order.slice(order.indexOf(a), order.indexOf(b) + 1) : [a]; };
let cursor = 0; const lines = []; const chapters = [];
spec.scenes.forEach((sc, i) => {
  const ids = expand(sc.lines);
  if (sc.type === 'chapter') chapters.push([cursor, sc.title]);
  else if (i === 0) chapters.push([0, 'Intro']);
  let t = Math.round((sc.lead ?? (ids.length ? 0.15 : 0)) * FPS);
  for (const lid of ids) {
    const l = byId.get(lid);
    const len = Math.ceil((durations[lid] ?? Math.max(1, l.text.split(/\s+/).length / 2.35)) * FPS);
    lines.push({from: cursor + t, len, text: l.text});
    t += len + Math.round((l.pause ?? 0.12) * FPS);
  }
  cursor += ids.length ? t + Math.round((sc.hold ?? 0.25) * FPS) : Math.round((sc.secs ?? 3) * FPS);
});
const mmss = (f) => { const s = Math.floor(f / FPS); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const ts = (f) => { const ms = Math.round((f / FPS) * 1000); const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000); return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
fs.mkdirSync(outDir, {recursive: true});
fs.writeFileSync(path.join(outDir, `${id}.chapters.txt`), chapters.map(([f, t]) => `${mmss(f)} ${t}`).join('\n') + '\n');
fs.writeFileSync(path.join(outDir, `${id}.srt`), lines.map((l, i) => `${i + 1}\n${ts(l.from)} --> ${ts(l.from + l.len)}\n${l.text}\n`).join('\n'));
console.log(`${id}: ${mmss(cursor)} total, ${chapters.length} chapters, ${lines.length} captions`);
