// QC: stills of an Explainer Short — one mid-beat and one late-beat frame per beat, from a prebuilt bundle.
// Usage: BUNDLE=build-explainer node scripts/qc-explainer.mjs CF-CLASICO-WHY clasico  -> out/qc-explainer/<ID>/NN.png
import {openBrowser, selectComposition, renderStill} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const serveUrl = path.join(root, process.env.BUNDLE ?? 'build-explainer');
const [id, dir] = process.argv.slice(2);
const T = JSON.parse(fs.readFileSync(path.join(root, 'src/explainer', `${dir}.timing.json`), 'utf8'));
const browser = await openBrowser('chrome');
const composition = await selectComposition({serveUrl, id, puppeteerInstance: browser});
const out = path.join(root, 'out/qc-explainer', id);
fs.mkdirSync(out, {recursive: true});
const frames = T.beats.flatMap((b) => [Math.round((b.s + (b.e - b.s) * 0.4) * 30), Math.round(b.e * 30) - 2]);
for (const [k, frame] of frames.entries()) {
  await renderStill({serveUrl, composition, frame, output: path.join(out, `${String(k).padStart(2, '0')}.png`), scale: 0.4, puppeteerInstance: browser});
}
console.log(id, frames.length, 'stills');
await browser.close({silent: true});
