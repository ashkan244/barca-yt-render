// QC stills for a Radar Story: one frame per spoken line (at 60 % of the line) + end screen.
// Usage: node scripts/qc-radar.mjs HK-RADAR HK   -> out/qc-radar/HK/NN-Lxx.jpg
import {openBrowser, selectComposition, renderStill} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [comp, code] = process.argv.slice(2);
const serveUrl = path.join(root, process.env.BUNDLE ?? 'build-radar');
const ed = JSON.parse(fs.readFileSync(path.join(root, 'src/radar', `${code}.edit.json`), 'utf8'));
const dir = path.join(root, 'out/qc-radar', code);
fs.mkdirSync(dir, {recursive: true});
const browser = await openBrowser('chrome');
const composition = await selectComposition({serveUrl, id: comp, puppeteerInstance: browser});
const frames = ed.lines.map((l) => ({tag: l.id, f: Math.round((l.s + (l.e - l.s) * 0.6) * 30)}));
frames.push({tag: 'END', f: composition.durationInFrames - 60});
for (const [k, x] of frames.entries()) {
  await renderStill({serveUrl, composition, frame: x.f, output: path.join(dir, `${String(k).padStart(2, '0')}-${x.tag}.jpeg`), imageFormat: 'jpeg', scale: 0.5, puppeteerInstance: browser});
}
await browser.close({silent: true});
console.log(frames.length, 'stills');
