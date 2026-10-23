// Edit decision list for ONE continuous presenter recording (Barça Radar).
//  1. drop retakes: a phrase that is said again within 30 s → keep only the last attempt
//  2. align the spoken script (episodes/host/<ID>-recorded.json) to the Whisper words
//  3. tighten pauses (> 0.6 s → ~0.33 s, section breaks → ~0.55 s) = jump cuts
//  4. write the timeline in OUTPUT time: segments, lines, caption words
// Usage: node tools/host/radar-edit.mjs HK-TM studio/.audio-tmp/HK-words.json
// Out:   studio/src/radar/<CODE>.edit.json  +  studio/.audio-tmp/<CODE>-cut.txt (ffmpeg filter for the cut)
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const [id, wordsFile] = process.argv.slice(2);
const rec = JSON.parse(fs.readFileSync(path.join(root, 'episodes/host', `${id.split('-')[0]}-recorded.json`), 'utf8'));
const heardAll = JSON.parse(fs.readFileSync(path.resolve(wordsFile), 'utf8')).words;
const code = id.split('-')[0];
const norm = (w) => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
const sim = (a, b) => a === b || (a.length > 3 && b.length > 3 && (a.startsWith(b.slice(0, 4)) || b.startsWith(a.slice(0, 4))));

// 1. retakes — same 4 words again within 30 s: cut from the first attempt to the restart
const H = heardAll.map((w) => ({...w, n: norm(w.text)}));
const cuts = [];
for (let i = 0; i + 5 < H.length; i++) {
  for (let j = i + 5; j + 5 < H.length && H[j].s - H[i].s < 30; j++) {
    const same = [0, 1, 2, 3, 4].every((k) => H[i + k].n && H[i + k].n === H[j + k].n);
    if (same && [0, 1, 2, 3, 4].some((k) => H[i + k].n.length >= 5)) { cuts.push([H[i].s - 0.05, H[j].s - 0.05, i, j]); i = j - 1; break; }
  }
}
const heard = H.filter((w) => !cuts.some(([a, b]) => w.s >= a && w.s < b));

// 2. align script words → heard words (in order, small look-ahead), interpolate the gaps
const sw = rec.lines.flatMap((l) => l.text.split(/\s+/).filter((w) => norm(w)).map((w) => ({w, line: l.id})));
const t = new Array(sw.length).fill(null);
let j = 0;
for (let i = 0; i < sw.length; i++) {
  const w = norm(sw[i].w);
  for (let k = j; k < Math.min(heard.length, j + 8); k++) if (sim(w, heard[k].n)) { t[i] = {s: heard[k].s, e: heard[k].e}; j = k + 1; break; }
}
for (let i = 0; i < t.length; i++) if (!t[i]) {
  let a = i - 1; while (a >= 0 && !t[a]) a--;
  let b = i + 1; while (b < t.length && !t[b]) b++;
  const t0 = a >= 0 ? t[a].e : t[b].s - 0.3 * (b - i), t1 = b < t.length ? t[b].s : t0 + 0.3 * (i - a);
  const n = b - a - 1, k = i - a;
  t[i] = {s: t0 + ((t1 - t0) * (k - 1)) / n, e: t0 + ((t1 - t0) * k) / n, guessed: true};
}
const matched = t.filter((x) => !x.guessed).length;

// 3. keep segments (source time)
const secOf = Object.fromEntries(rec.lines.map((l) => [l.id, l.sec]));
const segs = [];
let cur = {a: Math.max(0, t[0].s - 0.25), b: t[0].e};
for (let i = 1; i < t.length; i++) {
  const gap = t[i].s - t[i - 1].e;
  const secBreak = secOf[sw[i].line] !== secOf[sw[i - 1].line];
  const crossesCut = cuts.some(([a, b]) => a > t[i - 1].e - 0.01 && a < t[i].s);
  if (gap > (secBreak ? 0.75 : 0.6) || crossesCut) {
    cur.b = t[i - 1].e + (secBreak ? 0.32 : 0.18);
    segs.push(cur);
    cur = {a: t[i].s - (secBreak ? 0.22 : 0.15), b: t[i].e};
  } else cur.b = t[i].e;
}
cur.b = t[t.length - 1].e + 0.9;
segs.push(cur);
let o = 0;
for (const s of segs) { s.a = +s.a.toFixed(3); s.b = +s.b.toFixed(3); s.o = +o.toFixed(3); o += s.b - s.a; }
const toOut = (x) => { const s = segs.find((g) => x >= g.a - 1e-6 && x <= g.b + 1e-6) ?? segs.reduce((p, g) => (Math.abs(g.a - x) < Math.abs(p.a - x) ? g : p)); return +(s.o + Math.min(Math.max(x, s.a), s.b) - s.a).toFixed(3); };

// 4. output timeline
const words = sw.map((x, i) => ({w: x.w, line: x.line, s: toOut(t[i].s), e: toOut(t[i].e)}));
const lines = rec.lines.map((l) => { const ws = words.filter((w) => w.line === l.id); return {id: l.id, sec: l.sec, text: l.text, s: ws[0].s, e: ws[ws.length - 1].e}; });
const out = {id, duration: +o.toFixed(3), segments: segs, lines, words, cuts: cuts.map(([a, b]) => [+a.toFixed(2), +b.toFixed(2)])};
fs.mkdirSync(path.join(root, 'studio/src/radar'), {recursive: true});
fs.writeFileSync(path.join(root, 'studio/src/radar', `${code}.edit.json`), JSON.stringify(out));
// ffmpeg filter_complex for the cut (video + audio), used by the render workflow
const f = segs.map((s, k) => `[0:v]trim=${s.a}:${s.b},setpts=PTS-STARTPTS[v${k}];[0:a]atrim=${s.a}:${s.b},asetpts=PTS-STARTPTS[a${k}]`).join(';')
  + ';' + segs.map((_, k) => `[v${k}][a${k}]`).join('') + `concat=n=${segs.length}:v=1:a=1[v][a]`;
fs.writeFileSync(path.join(root, 'studio/src/radar', `${code}.cut.txt`), f);
console.log(`retakes cut: ${JSON.stringify(out.cuts)}`);
console.log(`aligned ${matched}/${sw.length} words; ${segs.length} segments; ${heardAll[heardAll.length - 1].e.toFixed(1)} s → ${o.toFixed(1)} s`);
for (const l of lines) console.log(`${l.id} ${l.s.toFixed(1)}–${l.e.toFixed(1)} ${l.text.slice(0, 50)}`);
