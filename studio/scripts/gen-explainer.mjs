// Timeline for an Explainer Short from shorts/<dir>/beats.json.
//  - final voice: ElevenLabs one-call audio + character alignment (josh.mp3 + josh-align.json) → exact word timings
//  - final voice from the website: josh.mp3 + josh-words.json (tools/tts/explainer-align.mjs, Whisper) → word timings
//  - placeholder: Kokoro per-beat wavs (public/audio/explainer/<id>/<beat>.wav + durations.json) → estimated word timings
// Usage: node scripts/gen-explainer.mjs clasico   → src/explainer/<dir>.timing.json
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = process.argv[2];
const B = JSON.parse(fs.readFileSync(path.join(root, '../shorts', dir, 'beats.json'), 'utf8'));
const alignFile = path.join(root, '../shorts', dir, 'josh-align.json');
const wordsFile = path.join(root, '../shorts', dir, 'josh-words.json'); // tools/tts/explainer-align.mjs (take made on the website)
const out = {id: B.id, mode: '', audio: [], beats: [], words: [], duration: 0};
if (fs.existsSync(alignFile)) {
  // final: the whole script was sent as beats joined by spaces/newlines; find each beat's span in the aligned characters
  const al = JSON.parse(fs.readFileSync(alignFile, 'utf8'));
  const chars = al.characters.join('');
  let cur = 0;
  for (const b of B.beats) {
    const i = chars.indexOf(b.text, cur); if (i < 0) throw new Error(`beat not found in alignment: ${b.id}`);
    const j = i + b.text.length - 1; cur = j + 1;
    const s = al.character_start_times_seconds[i], e = al.character_end_times_seconds[j];
    out.beats.push({id: b.id, v: b.v, text: b.text, s, e});
    // words: split on spaces inside the span
    let k = i;
    for (const w of b.text.split(/\s+/)) { const wi = chars.indexOf(w, k); out.words.push({w, beat: b.id, s: al.character_start_times_seconds[wi], e: al.character_end_times_seconds[wi + w.length - 1]}); k = wi + w.length; }
  }
  out.mode = 'final'; out.audio = [{src: `audio/explainer/${dir}/josh.mp3`, at: 0}];
  out.duration = al.character_end_times_seconds.at(-1) + 1.2;
} else if (fs.existsSync(wordsFile)) {
  const J = JSON.parse(fs.readFileSync(wordsFile, 'utf8'));
  out.words = J.words;
  for (const b of B.beats) { const ws = J.words.filter((x) => x.beat === b.id); out.beats.push({id: b.id, v: b.v, text: b.text, s: ws[0].s, e: ws.at(-1).e}); }
  out.mode = 'final'; out.audio = [{src: `audio/explainer/${dir}/josh.mp3`, at: 0}];
  out.duration = Math.max(J.duration, out.beats.at(-1).e) + 1.2;
} else {
  const dur = JSON.parse(fs.readFileSync(path.join(root, 'public/audio/explainer', dir, 'durations.json'), 'utf8'));
  let t = 0.3;
  for (const b of B.beats) {
    const d = dur[b.id]; out.beats.push({id: b.id, v: b.v, text: b.text, s: t, e: t + d});
    const ws = b.text.split(/\s+/); const wt = ws.map((w) => w.replace(/[^\p{L}\p{N}]/gu, '').length + 2 + (/[.,;:!?]$/.test(w) ? 3 : 0)); const tot = wt.reduce((a, x) => a + x, 0);
    let x = t; ws.forEach((w, k) => { const dd = (wt[k] / tot) * d; out.words.push({w, beat: b.id, s: x, e: x + dd}); x += dd; });
    out.audio.push({src: `audio/explainer/${dir}/${b.id}.wav`, at: t});
    t += d + 0.12;
  }
  out.mode = 'placeholder'; out.duration = t + 1.0;
}
fs.mkdirSync(path.join(root, 'src/explainer'), {recursive: true});
fs.writeFileSync(path.join(root, 'src/explainer', `${dir}.timing.json`), JSON.stringify(out));
console.log(`${out.mode}: ${out.beats.length} beats, ${out.duration.toFixed(1)} s`);
