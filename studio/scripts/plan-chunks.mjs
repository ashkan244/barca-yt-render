// Prints a GitHub Actions matrix (JSON) splitting a composition into frame-range chunks.
// Usage: node scripts/plan-chunks.mjs <bundleDir> <compositionId> <chunks>
import {selectComposition} from '@remotion/renderer';
import path from 'node:path';

const [bundleDir, id, chunksArg] = process.argv.slice(2);
const chunks = Math.max(1, parseInt(chunksArg || '4', 10));
const comp = await selectComposition({serveUrl: path.resolve(bundleDir), id});
const total = comp.durationInFrames;
const size = Math.ceil(total / chunks);
const include = [];
for (let i = 0; i < chunks; i++) {
  const start = i * size;
  const end = Math.min(total - 1, (i + 1) * size - 1);
  if (start <= end) include.push({index: i, start, end});
}
console.log(JSON.stringify({include}));
