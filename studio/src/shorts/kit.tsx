// Shorts kit (1080×1920): shell with narration, music, SFX, word captions, progress bar, brand mark,
// plus the motion primitives every Short uses (slam, pop, counter, flash, shake).
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, DISPLAY, BODY, Grain, clamp} from '../lib';
import {Mark} from '../Branding';
import {estimateWords} from '../engine/Captions';

export type ShortLine = {id: string; text: string; from: number; len: number};
export type ShortData = {id: string; title: string; music: string; lines: ShortLine[]; total: number};
export type Ctx = {f: number; i: number; lf: number; L: ShortLine; d: ShortData; at: (i: number) => number; end: (i: number) => number;
  /** seconds-into-line → frame offset helper for word-synced beats */
  word: (i: number, n: number) => number};
export type Sfx = {at: number; src: 'hit' | 'whoosh' | 'tick' | 'riser' | 'impact' | 'pop' | 'shutter' | 'crowd'; vol?: number};

export const W = 1080, H = 1920;
// Shorts UI covers the bottom ~22% and the right edge; keep content in the stage band.
export const STAGE = {top: 230, bottom: 1170};
export const CAP_Y = 1250;

export const pop = (f: number, at: number, fps = 30, damping = 11) => spring({frame: f - at, fps, config: {damping, stiffness: 170, mass: 0.6}});
export const fade = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
export const ramp = (f: number, a: number, b: number, from: number, to: number, e = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, b], [from, to], {...clamp, easing: e});

/** Big text that lands from oversized + blurred. */
export const Slam: React.FC<{f: number; at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({f, at, children, style}) => {
  if (f < at) return null;
  const k = ramp(f, at, at + 7, 0, 1, Easing.out(Easing.back(1.6)));
  return <div style={{transform: `scale(${2.1 - 1.1 * k})`, filter: `blur(${(1 - k) * 10}px)`, opacity: Math.min(1, k * 2), ...style}}>{children}</div>;
};

export const Counter: React.FC<{f: number; a: number; b: number; from?: number; to: number; style?: React.CSSProperties; pad?: number}> = ({f, a, b, from = 0, to, style, pad}) => {
  const v = Math.round(ramp(f, a, b, from, to));
  return <span style={style}>{pad ? String(v).padStart(pad, '0') : v}</span>;
};

export const Flash: React.FC<{f: number; at: number[]; color?: string; dur?: number}> = ({f, at, color = '#fff', dur = 8}) => {
  const o = Math.max(0, ...at.map((a) => (f >= a && f < a + dur ? 1 - (f - a) / dur : 0)));
  return o > 0 ? <AbsoluteFill style={{background: color, opacity: o * 0.85, mixBlendMode: 'screen'}} /> : null;
};

export const shakeAt = (f: number, at: number[], amp = 22) => {
  let x = 0, y = 0;
  for (const a of at) {
    const d = f - a;
    if (d >= 0 && d < 14) { const e = amp * Math.exp(-d / 4); x += e * Math.sin(d * 2.7); y += e * Math.cos(d * 3.3); }
  }
  return `translate(${x}px, ${y}px)`;
};

/** Frame at which word n of line j starts (estimated from the line audio length). */
export const wordAt = (d: ShortData, j: number, n: number) => {
  const ws = estimateWords(d.lines[j].text, d.lines[j].len);
  return d.lines[j].from + Math.round((ws[Math.min(n, ws.length - 1)]?.s ?? 0) * 30);
};

const chunkWords = (text: string, len: number) => {
  const words = estimateWords(text, len);
  const out: typeof words[] = []; let cur: typeof words = [];
  for (const w of words) {
    if (cur.length && (cur.length >= 3 || cur.map((x) => x.w).join(' ').length + w.w.length > 18)) { out.push(cur); cur = []; }
    cur.push(w);
    if (/[.!?:;—…,]$/.test(w.w)) { out.push(cur); cur = []; }
  }
  if (cur.length) out.push(cur);
  return out;
};

/** Word-by-word captions, 1–3 words at a time, active word highlighted. */
const Captions: React.FC<{d: ShortData; f: number; accent: string}> = ({d, f, accent}) => {
  const L = d.lines.find((l) => f >= l.from && f < l.from + l.len + 6);
  if (!L) return null;
  const t = (f - L.from) / 30;
  const chunks = chunkWords(L.text, L.len);
  const ci = chunks.findIndex((c) => t < c[c.length - 1].e + 0.05);
  const ch = chunks[ci === -1 ? chunks.length - 1 : ci];
  const start = Math.round(ch[0].s * 30);
  const k = pop(f - L.from, start, 30, 12);
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: CAP_Y, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 22px',
      transform: `scale(${0.82 + 0.18 * k})`, opacity: Math.min(1, k * 1.6)}}>
      {ch.map((w, j) => {
        const on = t >= w.s - 0.02;
        return <span key={j} style={{fontFamily: DISPLAY, fontSize: 104, lineHeight: 1.08, textTransform: 'uppercase', letterSpacing: 1,
          color: on ? (j === ch.length - 1 || /[!.]$/.test(w.w) ? accent : '#fff') : '#ffffff55',
          WebkitTextStroke: '3px #000', paintOrder: 'stroke fill', textShadow: '0 8px 0 #000a, 0 0 30px #0008'}}>{w.w.replace(/[—…]/g, '')}</span>;
      })}
    </div>
  );
};

export const ShortShell: React.FC<{d: ShortData; bg: React.ReactNode; accent: string; sfx?: Sfx[]; shake?: number[];
  render: (c: Ctx) => React.ReactNode; overlay?: (c: Ctx) => React.ReactNode; tag: string}> = ({d, bg, accent, sfx = [], shake = [], render, overlay, tag}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  let i = d.lines.findIndex((l, j) => f < (d.lines[j + 1]?.from ?? Infinity));
  if (i < 0) i = d.lines.length - 1;
  const L = d.lines[i];
  const ctx: Ctx = {f, i, lf: f - L.from, L, d, at: (j) => d.lines[j].from, end: (j) => d.lines[j].from + d.lines[j].len,
    word: (j, n) => wordAt(d, j, n)};
  const musicVol = (fr: number) => interpolate(fr, [0, 12, durationInFrames - 20, durationInFrames], [0, 0.2, 0.2, 0], clamp);
  return (
    <AbsoluteFill style={{background: '#000', fontFamily: BODY, overflow: 'hidden'}}>
      {bg}
      <AbsoluteFill style={{transform: shakeAt(f, shake)}}>{render(ctx)}</AbsoluteFill>
      {overlay?.(ctx)}
      <Captions d={d} f={f} accent={accent} />
      {/* brand + series tag */}
      <div style={{position: 'absolute', left: 44, top: 70, display: 'flex', alignItems: 'center', gap: 16}}>
        <Mark size={84} />
        <div style={{lineHeight: 1.05}}>
          <div style={{fontFamily: DISPLAY, fontSize: 34, color: '#fff', letterSpacing: 1}}>THE CULER FILES</div>
          <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 22, color: accent, letterSpacing: 3}}>{tag}</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, top: 0, height: 10, width: `${(f / durationInFrames) * 100}%`, background: accent}} />
      <Grain opacity={0.07} />
      <Audio src={staticFile(`music/${d.music}`)} volume={musicVol} />
      {d.lines.map((l) => <Sequence key={l.id} from={l.from}><Audio src={staticFile(`audio/shorts/${l.id}.wav`)} /></Sequence>)}
      {sfx.map((s, j) => <Sequence key={j} from={Math.max(0, s.at)}><Audio src={staticFile(`sfx/${s.src}.wav`)} volume={s.vol ?? 0.5} /></Sequence>)}
    </AbsoluteFill>
  );
};

/** Two-team scoreboard plate. */
export const Score: React.FC<{home: string; away: string; hs: number | string; as: number | string; label?: string; accent?: string; w?: number; hot?: 'h' | 'a'}> =
  ({home, away, hs, as, label, accent = C.gold, w = 900, hot}) => (
  <div style={{width: w, borderRadius: 26, overflow: 'hidden', boxShadow: '0 30px 80px #000c', border: '3px solid #ffffff22'}}>
    {label && <div style={{background: accent, color: '#000', fontFamily: BODY, fontWeight: 900, fontSize: 30, letterSpacing: 4, textAlign: 'center', padding: '8px 0'}}>{label}</div>}
    <div style={{display: 'flex', alignItems: 'center', background: 'linear-gradient(180deg,#141b2e,#0a0f1c)', padding: '18px 30px'}}>
      <div style={{flex: 1, fontFamily: DISPLAY, fontSize: 60, color: '#fff', textAlign: 'left'}}>{home}</div>
      <div style={{fontFamily: DISPLAY, fontSize: 120, color: hot === 'h' ? accent : '#fff', minWidth: 90, textAlign: 'center'}}>{hs}</div>
      <div style={{fontFamily: DISPLAY, fontSize: 80, color: '#ffffff55', margin: '0 10px'}}>–</div>
      <div style={{fontFamily: DISPLAY, fontSize: 120, color: hot === 'a' ? accent : '#fff', minWidth: 90, textAlign: 'center'}}>{as}</div>
      <div style={{flex: 1, fontFamily: DISPLAY, fontSize: 60, color: '#fff', textAlign: 'right'}}>{away}</div>
    </div>
  </div>
);

export const Center: React.FC<{y: number; children: React.ReactNode; style?: React.CSSProperties}> = ({y, children, style}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', ...style}}>{children}</div>
);

export const Ball: React.FC<{size?: number}> = ({size = 70}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="#fff" stroke="#111" strokeWidth="4" />
    <polygon points="50,30 69,44 62,66 38,66 31,44" fill="#111" />
    {[[50, 4, 50, 30], [94, 38, 69, 44], [78, 90, 62, 66], [22, 90, 38, 66], [6, 38, 31, 44]].map(([a, b, c, e], k) => <line key={k} x1={a} y1={b} x2={c} y2={e} stroke="#111" strokeWidth="4" />)}
  </svg>
);
