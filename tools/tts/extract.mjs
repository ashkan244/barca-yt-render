// Extract narration lines from an episode script (Markdown) into say.mjs JSON.
// Line syntax:  > [PL-012] [speed 0.95] Sentence text. [pause 1.5]
// Usage: node extract.mjs ../../episodes/01-PL-pedri.md [voice] > PL.json
import fs from 'node:fs';

const [file, voice = 'am_michael'] = process.argv.slice(2);
const md = fs.readFileSync(file, 'utf8');
const out = [];
for (const raw of md.split(/\r?\n/)) {
  const m = raw.match(/^>\s*\[([A-Z]{2}-\d{3}[a-z]?)\]\s*(.+)$/);
  if (!m) continue;
  let text = m[2].trim();
  let speed = 1.0, pause = 0;
  const sp = text.match(/^\[speed\s+([\d.]+)\]\s*/);
  if (sp) { speed = Number(sp[1]); text = text.slice(sp[0].length); }
  const pa = text.match(/\s*\[pause\s+([\d.]+)\]\s*$/);
  if (pa) { pause = Number(pa[1]); text = text.slice(0, pa.index).trim(); }
  out.push({id: m[1], text, voice, speed, pause});
}
const ids = new Set();
for (const l of out) { if (ids.has(l.id)) throw new Error('duplicate id ' + l.id); ids.add(l.id); }
const words = out.reduce((a, l) => a + l.text.split(/\s+/).length, 0);
process.stderr.write(`${out.length} lines, ${words} words ≈ ${(words / 150).toFixed(1)} min narration at 150 wpm\n`);
console.log(JSON.stringify(out, null, 1));
