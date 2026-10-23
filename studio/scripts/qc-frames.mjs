// QC stills: N evenly spaced frames of any composition. Usage: node scripts/qc-frames.mjs <COMP> [N=16]
import {openBrowser, selectComposition, renderStill} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [comp, nArg] = process.argv.slice(2);
const N = Number(nArg ?? 16);
const serveUrl = path.join(root, process.env.BUNDLE ?? 'build-radar');
const dir = path.join(root, 'out/qc-frames', comp);
fs.mkdirSync(dir, {recursive: true});
const browser = await openBrowser('chrome');
const composition = await selectComposition({serveUrl, id: comp, puppeteerInstance: browser});
for (let k = 0; k < N; k++) {
  const frame = Math.round(((k + 0.5) / N) * (composition.durationInFrames - 1));
  await renderStill({serveUrl, composition, frame, output: path.join(dir, `${String(k).padStart(3, '0')}.jpeg`), imageFormat: 'jpeg', scale: 0.4, puppeteerInstance: browser});
}
await browser.close({silent: true});
console.log(comp, N, 'stills');
