// Local narration with Kokoro-82M (Apache-2.0, CPU, offline after first download).
// Usage: node say.mjs <lines.json> <outDir>
//   lines.json: [{ "id": "tx-01", "text": "...", "voice": "bm_george", "speed": 1.0 }, ...]
// Writes <outDir>/<id>.wav and <outDir>/durations.json ({id: seconds}).
import {KokoroTTS} from 'kokoro-js';
import fs from 'node:fs';
import path from 'node:path';

const [linesFile, outDir] = process.argv.slice(2);
const lines = JSON.parse(fs.readFileSync(linesFile, 'utf8'));
fs.mkdirSync(outDir, {recursive: true});

const t0 = Date.now();
const tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {dtype: 'q8', device: 'cpu'});
console.log(`model ready in ${((Date.now() - t0) / 1000).toFixed(1)}s`);

const durFile = path.join(outDir, 'durations.json');
const durations = fs.existsSync(durFile) ? JSON.parse(fs.readFileSync(durFile, 'utf8')) : {};
for (const l of lines) {
  const t = Date.now();
  const audio = await tts.generate(l.text, {voice: l.voice ?? 'bm_george', speed: l.speed ?? 1.0});
  const file = path.join(outDir, `${l.id}.wav`);
  audio.save(file);
  const secs = audio.audio.length / audio.sampling_rate;
  durations[l.id] = Number(secs.toFixed(3));
  console.log(`${l.id}: ${secs.toFixed(2)}s audio in ${((Date.now() - t) / 1000).toFixed(1)}s  [${l.voice}] ${l.text}`);
}
fs.writeFileSync(durFile, JSON.stringify(durations, null, 2));
