// QC: one still per presenter line (at 60% of the line) + the poll, for a Barça Radar episode, from a prebuilt bundle.
// Usage: BUNDLE=build-radar node scripts/qc-radar.mjs HO-RADAR HO  -> out/qc-radar/<ID>/NN.png
import {openBrowser, selectComposition, renderStill} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const serveUrl = path.join(root, process.env.BUNDLE ?? 'build-radar');
const [id, code] = process.argv.slice(2);
const ed = JSON.parse(fs.readFileSync(path.join(root, 'src/radar', `${code}.edit.json`), 'utf8'));
const browser = await openBrowser('chrome');
const composition = await selectComposition({serveUrl, id, puppeteerInstance: browser});
const out = path.join(root, 'out/qc-radar', id);
fs.mkdirSync(out, {recursive: true});
const frames = ed.lines.map((l) => Math.round((l.s + (l.e - l.s) * 0.6) * 30)).concat([Math.round((ed.duration + 6) * 30)]);
for (const [k, frame] of frames.entries()) {
  await renderStill({serveUrl, composition, frame, output: path.join(out, `${String(k).padStart(2, '0')}.png`), scale: 0.25, puppeteerInstance: browser});
}
console.log(id, frames.length, 'stills');
await browser.close({silent: true});
