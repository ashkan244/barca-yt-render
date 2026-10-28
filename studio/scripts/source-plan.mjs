// Plans a source-led episode render from its spec (src/episodes-source/<file>.spec.json).
// node scripts/source-plan.mjs <EPISODE-ID> info|matrix|chapters [chunks] [outputs: short,long,clips,archive]
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
  archive: {comp: `${id}-ARCHIVE`, frames: Math.round(spec.duration * FPS), profile: 'vertical'},
  // Episode-specific compositions on the same source timeline (e.g. adaptive layout).
  ...Object.fromEntries(Object.entries(spec.extraOutputs ?? {}).map(([k, o]) => [k, {comp: o.comp, frames: Math.round(spec.duration * FPS), profile: o.profile}])),
};
const clips = (spec.clips ?? []).map((c) => ({comp: `${id}-CLIP-${c.name}`, frames: Math.round((c.b - c.a) * FPS), profile: 'vertical'}));
const selected = outputsArg.split(',').map((s) => s.trim()).filter(Boolean).flatMap((k) => {
  if (k === 'clips') return clips;
  if (!outputs[k] || (k === 'archive' && !spec.archive)) throw new Error(`Unknown output ${k}`); return [outputs[k]];
});
const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

if (cmd === 'info') {
  console.log(JSON.stringify({media: spec.media, docs: spec.docs, manifest: spec.manifest ?? '', archive: spec.archive ? (spec.archive.media ?? spec.media).replace('host/', 'archive/') : '', sha256: spec.source.sha256, duration: spec.duration, longDuration: spec.duration + end}));
} else if (cmd === 'matrix') {
  const n = Math.max(1, parseInt(chunksArg, 10)); const include = [];
  for (const o of selected) {
    const k = Math.min(n, Math.ceil(o.frames / 1200)), size = Math.ceil(o.frames / k);
    for (let i = 0; i < k; i++) { const start = i * size, last = Math.min(o.frames - 1, start + size - 1); if (start <= last) include.push({comp: o.comp, index: i, start, end: last}); }
  }
  console.log(JSON.stringify({render: {include}, finalize: {include: selected.map(({comp, profile}) => ({comp, profile}))}}));
} else if (cmd === 'chapters') {
  console.log(spec.chapters.map((c) => `${mmss(c.at)} ${c.title}`).join('\n'));
} else throw new Error('Command must be info, matrix or chapters');
