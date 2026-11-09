// Local narration with Kokoro-82M (Apache-2.0, CPU, offline after first download).
// Usage: node say.mjs <lines.json> <outDir>
//   lines.json: [{ "id": "tx-01", "text": "...", "voice": "bm_george", "speed": 1.0 }, ...]
//     or { "dtype": "fp32", "trim": true, "lines": [...] } to pick the model precision (default q8; fp32 is cleaner
//     but slower) and to cut the ~0.4 s of silence Kokoro puts before and ~0.6 s after every line
// Writes <outDir>/<id>.wav and <outDir>/durations.json ({id: seconds}).
import {KokoroTTS} from 'kokoro-js';
import fs from 'node:fs';
import path from 'node:path';

const [linesFile, outDir] = process.argv.slice(2);
const spec = JSON.parse(fs.readFileSync(linesFile, 'utf8'));
const lines = Array.isArray(spec) ? spec : spec.lines;
const dtype = Array.isArray(spec) ? 'q8' : spec.dtype ?? 'q8';
const trim = !Array.isArray(spec) && spec.trim === true;

// first/last sample louder than -40 dBFS, keeping 60 ms of air on each side
const trimmed = (x, sr) => {
  const th = 0.01, pad = Math.round(sr * 0.06);
  let a = 0, b = x.length - 1;
  while (a < x.length && Math.abs(x[a]) < th) a++;
  while (b > a && Math.abs(x[b]) < th) b--;
  return x.subarray(Math.max(0, a - pad), Math.min(x.length, b + pad));
};
fs.mkdirSync(outDir, {recursive: true});

const t0 = Date.now();
const tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {dtype, device: 'cpu'});
console.log(`model (${dtype}) ready in ${((Date.now() - t0) / 1000).toFixed(1)}s`);

const durFile = path.join(outDir, 'durations.json');
const durations = fs.existsSync(durFile) ? JSON.parse(fs.readFileSync(durFile, 'utf8')) : {};
for (const l of lines) {
  const t = Date.now();
  const audio = await tts.generate(l.text, {voice: l.voice ?? 'bm_george', speed: l.speed ?? 1.0});
  if (trim) audio.audio = trimmed(audio.audio, audio.sampling_rate);
  const file = path.join(outDir, `${l.id}.wav`);
  audio.save(file);
  const secs = audio.audio.length / audio.sampling_rate;
  durations[l.id] = Number(secs.toFixed(3));
  console.log(`${l.id}: ${secs.toFixed(2)}s audio in ${((Date.now() - t) / 1000).toFixed(1)}s  [${l.voice}] ${l.text}`);
}
fs.writeFileSync(durFile, JSON.stringify(durations, null, 2));
