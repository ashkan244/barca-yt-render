// Cut a Short's source from the long presenter edit: line ranges → one continuous mp4 (same padding as makeCut in
// studio/src/radar/RadarShorts.tsx, so the composition's timings match).
// Usage: node tools/host/prep-cut.mjs <CODE> "L01-L03,L41-L46" <out.mp4>
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const [code, spec, out] = process.argv.slice(2);
const ed = JSON.parse(fs.readFileSync(path.join(root, 'studio/src/radar', `${code}.edit.json`), 'utf8'));
const src = path.join(root, 'studio/public/host', code, `${code}-edit.mp4`);
const pad = 0.18;
const parts = spec.split(',').map((r) => { const [a, b] = r.split('-'); const la = ed.lines.find((l) => l.id === a), lb = ed.lines.find((l) => l.id === (b ?? a));
  return [Math.max(0, la.s - pad), lb.e + pad + 0.1]; });
const f = parts.map(([a, b], k) => `[0:v]trim=${a.toFixed(3)}:${b.toFixed(3)},setpts=PTS-STARTPTS[v${k}];[0:a]atrim=${a.toFixed(3)}:${b.toFixed(3)},asetpts=PTS-STARTPTS[a${k}]`).join(';')
  + ';' + parts.map((_, k) => `[v${k}][a${k}]`).join('') + `concat=n=${parts.length}:v=1:a=1[v][a]`;
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', src, '-filter_complex', f, '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '192k', out], {stdio: 'inherit'});
console.log(`cut ${parts.length} pieces -> ${out}`);
