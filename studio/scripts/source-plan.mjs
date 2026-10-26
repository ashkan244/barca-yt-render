// Plans a source-led episode render from its spec (src/episodes-source/<file>.spec.json).
// node scripts/source-plan.mjs <EPISODE-ID> info|matrix|chapters [chunks] [outputs]
import fs from 'node:fs';
import path from 'node:path';

const [id, cmd, chunksArg = '4', outputsArg = 'short,long'] = process.argv.slice(2);
const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../src/episodes-source');
const spec = fs.readdirSync(dir).filter((f) => f.endsWith('.spec.json')).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))).find((s) => s.id === id);
if (!spec) throw new Error(`No spec with id ${id}`);
const FPS = 30, end = spec.long?.endSeconds ?? 20;
const outputs = {
  short: {comp: `${id}-SHORT`, frames: Math.round(spec.duration * FPS), profile: 'vertical'},
  long: {comp: `${id}-LONG`, frames: Math.round((spec.duration + end) * FPS), profile: 'landscape'},
};
const selected = outputsArg.split(',').map((s) => s.trim()).filter(Boolean).map((k) => {
  if (!outputs[k]) throw new Error(`Unknown output ${k}`); return outputs[k];
});
const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

if (cmd === 'info') {
  console.log(JSON.stringify({media: spec.media, docs: spec.docs, sha256: spec.source.sha256, duration: spec.duration, longDuration: spec.duration + end}));
} else if (cmd === 'matrix') {
  const n = Math.max(1, parseInt(chunksArg, 10)); const include = [];
  for (const o of selected) {
    const size = Math.ceil(o.frames / n);
    for (let i = 0; i < n; i++) { const start = i * size, last = Math.min(o.frames - 1, start + size - 1); if (start <= last) include.push({comp: o.comp, index: i, start, end: last}); }
  }
  console.log(JSON.stringify({render: {include}, finalize: {include: selected.map(({comp, profile}) => ({comp, profile}))}}));
} else if (cmd === 'chapters') {
  console.log(spec.chapters.map((c) => `${mmss(c.at)} ${c.title}`).join('\n'));
} else throw new Error('Command must be info, matrix or chapters');
