// Barça Radar vertical Shorts cut from a Radar Story (1080×1920).
// Two models:
//   RADAR CUT  — one story moment: hook line + a contiguous passage; presenter full-width, graphics take over in beats
//   STAT DROP  — the numbers passage + the closing question; stat graphics dominate, presenter in a bubble
// Pieces are line ranges of the long edit (output time), re-joined back to back (jump cuts).
import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {DISPLAY, BODY, Grain, clamp} from '../lib';
import {Mark} from '../Branding';
import {Edit, FPS, NAVY, GOLD, GRANA, BLAU, RED, GREEN, RadarBg, ramp, popIn, fadeIn, Chip, Card, Count, Ball, Trophy} from './RadarStory';

export type Piece = {from: string; to: string};
export type Cut = {dur: number; pieces: {a: number; b: number; o: number}[]; lines: Edit['lines']; words: Edit['words']; segStarts: number[]};

/** Re-time a set of line ranges of the long edit into one short timeline (seconds). */
export const makeCut = (ed: Edit, pieces: Piece[], pad = 0.18): Cut => {
  const out: Cut = {dur: 0, pieces: [], lines: [], words: [], segStarts: ed.segments.map((g) => g.o)};
  let o = 0;
  for (const p of pieces) {
    const i0 = ed.lines.findIndex((l) => l.id === p.from), i1 = ed.lines.findIndex((l) => l.id === p.to);
    const a = Math.max(0, ed.lines[i0].s - pad), b = ed.lines[i1].e + pad + 0.1;
    out.pieces.push({a, b, o});
    for (const l of ed.lines.slice(i0, i1 + 1)) out.lines.push({...l, s: l.s - a + o, e: l.e - a + o});
    for (const w of ed.words.filter((w) => ed.lines.slice(i0, i1 + 1).some((l) => l.id === w.line))) out.words.push({...w, s: w.s - a + o, e: w.e - a + o});
    o += b - a;
  }
  out.dur = o;
  return out;
};
export const cutT = (c: Cut) => ({
  s: (id: string) => Math.round(c.lines.find((l) => l.id === id)!.s * FPS),
  e: (id: string) => Math.round(c.lines.find((l) => l.id === id)!.e * FPS),
  w: (id: string, n: number) => { const ws = c.words.filter((x) => x.line === id); return Math.round(ws[Math.min(n, ws.length - 1)].s * FPS); },
});

// presenter: 'full' = 1000×1000 square under the title band; 'bubble' = 300 circle top-right while graphics own the square
type VBox = {x: number; y: number; w: number; r: number};
const VB: Record<'full' | 'bubble', VBox> = {full: {x: 40, y: 330, w: 1000, r: 36}, bubble: {x: 726, y: 1016, w: 290, r: 145}};
export const GRAPH = {x: 40, y: 330, w: 1000, h: 1000}; // graphics area (same square)

const VPresenter: React.FC<{c: Cut; src: string; sched: {at: number; m: 'full' | 'bubble'}[]}> = ({c, src, sched}) => {
  const f = useCurrentFrame();
  let i = 0; while (i + 1 < sched.length && sched[i + 1].at <= f) i++;
  const cur = VB[sched[i].m], prev = VB[sched[Math.max(0, i - 1)].m];
  const t = i === 0 ? 1 : ramp(f, sched[i].at, sched[i].at + 12, 0, 1, Easing.inOut(Easing.cubic));
  const b = {x: prev.x + (cur.x - prev.x) * t, y: prev.y + (cur.y - prev.y) * t, w: prev.w + (cur.w - prev.w) * t, r: prev.r + (cur.r - prev.r) * t};
  const pi = Math.max(0, c.pieces.findIndex((p, k) => f / FPS >= p.o && f / FPS < (c.pieces[k + 1]?.o ?? 1e9)));
  const srcT = c.pieces[pi].a + (f / FPS - c.pieces[pi].o);
  const seg = c.segStarts.filter((o) => o <= srcT).length;
  const punch = (seg + pi) % 2 ? 1.12 : 1.03;
  return (
    <>
      {c.pieces.map((p, k) => (
        <Sequence key={k} from={Math.round(p.o * FPS)} durationInFrames={Math.round((p.b - p.a) * FPS)}>
          <Audio src={staticFile(src)} startFrom={Math.round(p.a * FPS)} />
        </Sequence>
      ))}
      <div style={{position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.w, borderRadius: b.r, overflow: 'hidden', boxShadow: '0 30px 90px #000c, 0 0 0 4px #f2c23066', background: '#000', zIndex: 5}}>
        {c.pieces.map((p, k) => (
          <Sequence key={k} from={Math.round(p.o * FPS)} durationInFrames={Math.round((p.b - p.a) * FPS)}>
            <OffthreadVideo src={staticFile(src)} startFrom={Math.round(p.a * FPS)} muted
              style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${punch})`, transformOrigin: '50% 34%'}} />
          </Sequence>
        ))}
      </div>
    </>
  );
};

/** Big word-by-word captions, 1–3 words, under the square. */
const VCaptions: React.FC<{c: Cut}> = ({c}) => {
  const f = useCurrentFrame(), t = f / FPS;
  const li = c.lines.find((l) => t >= l.s - 0.1 && t <= l.e + 0.2);
  if (!li) return null;
  const ws = c.words.filter((w) => w.line === li.id);
  const chunks: typeof ws[] = []; let cur: typeof ws = [];
  for (const w of ws) { cur.push(w); if (cur.length >= 3 || /[.,:;?!—]$/.test(w.w)) { chunks.push(cur); cur = []; } }
  if (cur.length) chunks.push(cur);
  const ch = chunks.find((x) => t <= x[x.length - 1].e + 0.08) ?? chunks[chunks.length - 1];
  const k = popIn(f, Math.round(ch[0].s * FPS));
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: 1362, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 20px', transform: `scale(${0.85 + 0.15 * k})`, zIndex: 8}}>
      {ch.map((w, j) => <span key={j} style={{fontFamily: DISPLAY, fontSize: 92, lineHeight: 1.05, textTransform: 'uppercase', color: t >= w.s - 0.03 ? (j === ch.length - 1 ? GOLD : '#fff') : '#ffffff66',
        WebkitTextStroke: '3px #000', paintOrder: 'stroke fill', textShadow: '0 8px 0 #000a'}}>{w.w.replace(/—/g, '')}</span>)}
    </div>
  );
};

export const VShell: React.FC<{c: Cut; src: string; tag: string; title: React.ReactNode; sched: {at: number; m: 'full' | 'bubble'}[];
  music: string; sfx: {at: number; src: string; vol?: number}[]; band?: (f: number) => React.ReactNode; graph?: (f: number) => React.ReactNode}> =
  ({c, src, tag, title, sched, music, sfx, band, graph}) => {
  const f = useCurrentFrame();
  const total = Math.round(c.dur * FPS) + 12;
  return (
    <AbsoluteFill style={{background: NAVY, fontFamily: BODY, overflow: 'hidden'}}>
      <RadarBg tint={GRANA} />
      {/* brand + series tag */}
      <div style={{position: 'absolute', left: 40, top: 60, display: 'flex', alignItems: 'center', gap: 16}}>
        <Mark size={84} brand="radar" />
        <div><div style={{fontFamily: DISPLAY, fontSize: 38, color: '#fff', lineHeight: 1}}>BARÇA RADAR</div><div style={{fontFamily: BODY, fontWeight: 900, fontSize: 22, color: GOLD, letterSpacing: 4}}>{tag}</div></div>
      </div>
      {/* title band (y 165–320) */}
      <div style={{position: 'absolute', left: 40, right: 40, top: 168, height: 150, display: 'flex', alignItems: 'center'}}>{band?.(f) ?? title}</div>
      {/* graphics square (under presenter when full; owns it in bubble mode) */}
      <div style={{position: 'absolute', left: GRAPH.x, top: GRAPH.y, width: GRAPH.w, height: GRAPH.h, borderRadius: 36, overflow: 'hidden', background: '#0a1230d9', border: '1px solid #ffffff1a'}}>{graph?.(f)}</div>
      <VPresenter c={c} src={src} sched={sched} />
      <VCaptions c={c} />
      <div style={{position: 'absolute', left: 0, top: 0, height: 10, width: `${(f / total) * 100}%`, background: GOLD}} />
      <Grain opacity={0.05} />
      <Audio src={staticFile(music)} volume={(fr) => interpolate(fr, [0, 15, total - 20, total], [0, 0.07, 0.07, 0], clamp)} />
      {sfx.map((s, k) => <Sequence key={k} from={Math.max(0, s.at)}><Audio src={staticFile(`sfx/${s.src}.wav`)} volume={s.vol ?? 0.35} /></Sequence>)}
    </AbsoluteFill>
  );
};

export const H = (txt: string, size = 92, color = '#fff') => <div style={{fontFamily: DISPLAY, fontSize: size, color, lineHeight: 1.0}}>{txt}</div>;
export const S = ({children, color = '#ffffffb0', size = 30}: {children: React.ReactNode; color?: string; size?: number}) =>
  <div style={{fontFamily: BODY, fontWeight: 800, fontSize: size, color, letterSpacing: 3}}>{children}</div>;
export {NAVY, GOLD, GRANA, BLAU, RED, GREEN, ramp, popIn, fadeIn, Chip, Card, Count, Ball, Trophy};
