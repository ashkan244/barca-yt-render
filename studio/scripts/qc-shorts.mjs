// QC: render stills of each Short (two per narration line) from the prebuilt bundle, one browser for all.
// Usage: node scripts/qc-shorts.mjs [ID ...]   -> out/qc-shorts/<ID>/NN.png
import {openBrowser, selectComposition, renderStill} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const serveUrl = path.join(root, process.env.BUNDLE ?? 'build-shorts');
const src = fs.readFileSync(path.join(root, 'src/shorts/data.generated.ts'), 'utf8');
const shorts = JSON.parse(src.slice(src.indexOf('= [') + 2, src.lastIndexOf(';')));
const want = process.argv.slice(2);
const browser = await openBrowser('chrome');
for (const d of shorts.filter((s) => !want.length || want.includes(s.id))) {
  const inputProps = {d};
  const composition = await selectComposition({serveUrl, id: d.id, inputProps, puppeteerInstance: browser});
  const dir = path.join(root, 'out/qc-shorts', d.id);
  fs.mkdirSync(dir, {recursive: true});
  const frames = d.lines.flatMap((l) => [l.from + Math.round(l.len * 0.35), l.from + l.len - 4]);
  for (const [k, frame] of frames.entries()) {
    await renderStill({serveUrl, composition, inputProps, frame, output: path.join(dir, `${String(k).padStart(2, '0')}.png`), scale: 0.4, puppeteerInstance: browser});
  }
  console.log(d.id, frames.length, 'stills');
}
await browser.close({silent: true});
