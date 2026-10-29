// Render selected frames of a composition as PNGs with a single bundle (fast visual QA, no video render).
// Usage: node scripts/stills.mjs <out-dir> <COMPOSITION-ID> <frame> [frame…]   (env SCALE=0.4, REMOTION_BROWSER=<chrome path>)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const [, , out, id, ...frames] = process.argv;
if (!out || !id || !frames.length) { console.error('usage: node scripts/stills.mjs <out-dir> <COMPOSITION-ID> <frame> [frame…]'); process.exit(2); }
const browserExecutable = process.env.REMOTION_BROWSER || ['/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'].find((p) => fs.existsSync(p)) || null;
const scale = Number(process.env.SCALE || 0.4);
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id, browserExecutable});
for (const f of frames) {
  const output = path.join(out, `${id}-${String(f).padStart(5, '0')}.png`);
  await renderStill({composition, serveUrl, output, frame: Number(f), scale, browserExecutable});
  console.log(output);
}
