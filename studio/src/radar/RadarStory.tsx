// BARÇA RADAR — "Radar Story" format: one continuous presenter take, jump-cut, with a moving presenter
// frame (full → split → pip → off) and section graphics driven by the presenter's own word timings.
// Timeline source: src/radar/<CODE>.edit.json (tools/host/radar-edit.mjs). Video: public/host/<CODE>/<CODE>-edit.mp4.
import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {C, DISPLAY, BODY, Grain, clamp} from '../lib';
import {Mark} from '../Branding';

export const FPS = 30;
export const END_SECS = 20;
export type Edit = {id: string; duration: number; segments: {a: number; b: number; o: number}[];
  lines: {id: string; sec: string; text: string; s: number; e: number}[]; words: {w: string; line: string; s: number; e: number}[]};

export const NAVY = '#07102a', GOLD = '#f2c230', GRANA = '#b3123f', BLAU = '#1f5fd6', RED = '#ff3b5c', GREEN = '#2fd47e', INK = '#0b1530';
export const ramp = (f: number, a: number, b: number, from = 0, to = 1, e = Easing.out(Easing.cubic)) => interpolate(f, [a, b], [from, to], {...clamp, easing: e});
export const fadeIn = (f: number, a: number, d = 8) => ramp(f, a, a + d);
export const popIn = (f: number, a: number) => interpolate(f, [a, a + 6, a + 11], [0, 1.08, 1], {...clamp, easing: Easing.out(Easing.cubic)});

/** Time helpers bound to an edit. All results in frames. */
export const makeT = (ed: Edit) => {
  const line = (id: string) => ed.lines.find((l) => l.id === id)!;
  return {
    s: (id: string) => Math.round(line(id).s * FPS),
    e: (id: string) => Math.round(line(id).e * FPS),
    w: (id: string, n: number) => { const ws = ed.words.filter((x) => x.line === id); return Math.round(ws[Math.min(n, ws.length - 1)].s * FPS); },
  };
};

// ---------------- presenter frame ----------------
type Box = {x: number; y: number; w: number; h: number; r: number};
export type Mode = 'full' | 'split' | 'pip' | 'off';
const BOX: Record<Mode, Box> = {
  full: {x: 110, y: 58, w: 860, h: 860, r: 30},
  split: {x: 64, y: 210, w: 600, h: 600, r: 26},
  pip: {x: 1590, y: 690, w: 270, h: 270, r: 135},
  off: {x: 1725, y: 825, w: 0, h: 0, r: 0},
};
const lerpBox = (a: Box, b: Box, t: number): Box => ({x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, w: a.w + (b.w - a.w) * t, h: a.h + (b.h - a.h) * t, r: a.r + (b.r - a.r) * t});

export const modeAt = (f: number, sched: {at: number; mode: Mode}[]) => {
  let i = 0; while (i + 1 < sched.length && sched[i + 1].at <= f) i++;
  const cur = sched[i], prev = sched[Math.max(0, i - 1)];
  const t = i === 0 ? 1 : ramp(f, cur.at, cur.at + 14, 0, 1, Easing.inOut(Easing.cubic));
  return {mode: cur.mode, box: lerpBox(BOX[prev.mode], BOX[cur.mode], t), t};
};

const Presenter: React.FC<{ed: Edit; src: string; box: Box}> = ({ed, src, box}) => {
  const f = useCurrentFrame();
  const sec = f / FPS;
  const si = Math.max(0, ed.segments.findIndex((s, k) => sec >= s.o && sec < (ed.segments[k + 1]?.o ?? 1e9)));
  const punch = si % 2 ? 1.13 : 1.02; // jump-cut punch-in, alternates every cut
  const drift = 1 + 0.015 * Math.sin(f / 90);
  if (box.w < 4) return null;
  return (
    <div style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: box.r, overflow: 'hidden',
      boxShadow: '0 30px 90px #000c, 0 0 0 3px #f2c23055', background: '#000'}}>
      <OffthreadVideo src={staticFile(src)} muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${punch * drift})`, transformOrigin: '50% 34%'}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: box.r, boxShadow: 'inset 0 0 0 2px #ffffff22', pointerEvents: 'none'}} />
    </div>
  );
};

// ---------------- background: animated radar ----------------
export const RadarBg: React.FC<{tint?: string}> = ({tint = BLAU}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 70% 45%, ${tint}38 0%, ${NAVY} 55%, #02040c 100%)`}}>
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(#ffffff07 2px, transparent 2px), linear-gradient(90deg, #ffffff07 2px, transparent 2px)', backgroundSize: '80px 80px'}} />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <g transform="translate(1420 540)" opacity={0.5}>
          {[160, 300, 440, 580].map((r) => <circle key={r} r={r} fill="none" stroke="#ffffff12" strokeWidth={2} />)}
          <line x1={-640} y1={0} x2={640} y2={0} stroke="#ffffff0d" /><line x1={0} y1={-640} x2={0} y2={640} stroke="#ffffff0d" />
          <g transform={`rotate(${(f * 1.6) % 360})`}>
            <path d="M0 0 L620 0 A620 620 0 0 0 537 -310 Z" fill={`url(#sweep)`} />
          </g>
          {[[220, -120], [-300, 210], [410, 260], [-180, -380]].map(([x, y], k) => {
            const ang = (Math.atan2(y, x) * 180) / Math.PI, sweep = (f * 1.6) % 360;
            const d = ((sweep - ((ang + 360) % 360)) + 360) % 360;
            return <circle key={k} cx={x} cy={y} r={7} fill={GOLD} opacity={Math.max(0, 1 - d / 120) * 0.9} />;
          })}
        </g>
        <defs><linearGradient id="sweep" x1="0" y1="0" x2="1" y2="-0.5"><stop offset="0" stopColor={GOLD} stopOpacity="0.28" /><stop offset="1" stopColor={GOLD} stopOpacity="0" /></linearGradient></defs>
      </svg>
    </AbsoluteFill>
  );
};

// ---------------- captions ----------------
const Captions: React.FC<{ed: Edit; compact: boolean}> = ({ed, compact}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const li = ed.lines.find((l) => t >= l.s - 0.1 && t <= l.e + 0.25);
  if (!li) return null;
  const ws = ed.words.filter((w) => w.line === li.id);
  // chunks of up to 6 words, broken after punctuation
  const chunks: typeof ws[] = []; let cur: typeof ws = [];
  for (const w of ws) { cur.push(w); if (cur.length >= 6 || /[.,:;?!—]$/.test(w.w)) { chunks.push(cur); cur = []; } }
  if (cur.length) chunks.push(cur);
  const ch = chunks.find((c) => t <= c[c.length - 1].e + 0.12) ?? chunks[chunks.length - 1];
  return (
    <div style={{position: 'absolute', left: compact ? 80 : 0, right: compact ? 420 : 0, bottom: 52, display: 'flex', justifyContent: 'center'}}>
      <div style={{background: '#050914d9', borderRadius: 16, padding: '10px 26px', border: '1px solid #ffffff1c', display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1500}}>
        {ch.map((w, k) => <span key={k} style={{fontFamily: BODY, fontWeight: 800, fontSize: 44, color: t >= w.s - 0.03 ? (t <= w.e + 0.05 ? GOLD : '#fff') : '#ffffff70'}}>{w.w.replace(/—/g, '')}</span>)}
      </div>
    </div>
  );
};

// ---------------- shared graphic atoms ----------------
export const Chip: React.FC<{children: React.ReactNode; bg?: string; color?: string; size?: number; style?: React.CSSProperties}> = ({children, bg = GOLD, color = '#000', size = 40, style}) => (
  <span style={{fontFamily: DISPLAY, fontSize: size, color, background: bg, padding: '2px 22px', borderRadius: 10, display: 'inline-block', letterSpacing: 1, ...style}}>{children}</span>
);
export const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties; accent?: string}> = ({children, style, accent = GOLD}) => (
  <div style={{background: 'linear-gradient(160deg, #142046f0, #0a1230f0)', border: '1px solid #ffffff1f', borderLeft: `8px solid ${accent}`, borderRadius: 20, padding: '22px 28px', boxShadow: '0 24px 60px #0009', ...style}}>{children}</div>
);
export const In: React.FC<{f: number; at: number; children: React.ReactNode; dx?: number; dy?: number; style?: React.CSSProperties}> = ({f, at, children, dx = 60, dy = 0, style}) => {
  const k = ramp(f, at, at + 12);
  return <div style={{opacity: k, transform: `translate(${(1 - k) * dx}px, ${(1 - k) * dy}px)`, ...style}}>{children}</div>;
};
export const Count: React.FC<{f: number; a: number; b: number; to: number; from?: number; style?: React.CSSProperties}> = ({f, a, b, to, from = 0, style}) =>
  <span style={style}>{Math.round(ramp(f, a, b, from, to))}</span>;

export const Ball: React.FC<{size?: number}> = ({size = 46}) => (
  <svg width={size} height={size} viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#fff" stroke="#111" strokeWidth="4" /><polygon points="50,30 69,44 62,66 38,66 31,44" fill="#111" /></svg>
);
export const Trophy: React.FC<{size?: number; color?: string}> = ({size = 120, color = GOLD}) => (
  <svg width={size} height={size} viewBox="0 0 100 100"><path d="M28 12 H72 V30 C72 48 62 58 50 60 C38 58 28 48 28 30 Z" fill={color} /><path d="M28 18 H14 C14 34 22 40 30 40 M72 18 H86 C86 34 78 40 70 40" fill="none" stroke={color} strokeWidth="6" /><rect x="44" y="60" width="12" height="16" fill={color} /><rect x="32" y="76" width="36" height="10" rx="3" fill={color} /></svg>
);

/** Section sting: radar wipe + chapter title over everything for ~1.4 s. */
export const Sting: React.FC<{f: number; at: number; num: string; title: string}> = ({f, at, num, title}) => {
  const d = f - at; if (d < 0 || d > 46) return null;
  const k = ramp(f, at, at + 10), out = ramp(f, at + 36, at + 46);
  return (
    <AbsoluteFill style={{background: NAVY, clipPath: `circle(${(k - out) * 140}% at 74% 50%)`}}>
      <RadarBg tint={GRANA} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: BODY, fontWeight: 900, fontSize: 34, letterSpacing: 10, color: GOLD}}>{num}</div>
        <div style={{fontFamily: DISPLAY, fontSize: 150, color: '#fff', transform: `scale(${1.15 - 0.15 * k})`}}>{title}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------- the shell ----------------
export const RadarShell: React.FC<{ed: Edit; video: string; sched: {at: number; mode: Mode}[]; music: {src: string; from: number; to: number}[];
  sfx: {at: number; src: string; vol?: number}[]; render: (f: number, mode: Mode, box: Box) => React.ReactNode; overlay?: (f: number) => React.ReactNode;
  endScreen: React.ReactNode; tint?: (f: number) => string}> = ({ed, video, sched, music, sfx, render, overlay, endScreen, tint}) => {
  const f = useCurrentFrame();
  const main = Math.round(ed.duration * FPS);
  const {mode, box} = modeAt(f, sched);
  const total = main + END_SECS * FPS;
  const musicVol = (fr: number) => fr < main ? 0.07 : interpolate(fr, [main, main + 20, total - 30, total], [0.07, 0.22, 0.22, 0], clamp);
  return (
    <AbsoluteFill style={{background: NAVY, fontFamily: BODY}}>
      <RadarBg tint={tint?.(f)} />
      {f < main && render(f, mode, box)}
      {f < main && <Presenter ed={ed} src={video} box={box} />}
      {f < main && f < 6 * FPS && f > 20 && (
        <div style={{position: 'absolute', left: BOX.full.x + 40, top: BOX.full.y + BOX.full.h - 150, opacity: fadeIn(f, 24) * (1 - fadeIn(f, 5.4 * FPS)), transform: `translateX(${(1 - fadeIn(f, 24)) * -40}px)`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, background: '#050914e6', padding: '12px 26px 12px 14px', borderRadius: 16, borderLeft: `8px solid ${GOLD}`}}>
            <Mark size={70} brand="radar" />
            <div><div style={{fontFamily: DISPLAY, fontSize: 46, color: '#fff', lineHeight: 1}}>MORTI</div><div style={{fontFamily: BODY, fontWeight: 900, fontSize: 22, color: GOLD, letterSpacing: 4}}>BARÇA RADAR</div></div>
          </div>
        </div>
      )}
      {f < main && <Captions ed={ed} compact={mode === 'pip'} />}
      {f < main && overlay?.(f)}
      {f >= main && <Sequence from={main}>{endScreen}</Sequence>}
      <div style={{position: 'absolute', right: 36, top: 30, opacity: 0.9}}><Mark size={74} brand="radar" /></div>
      <Grain opacity={0.05} />
      <Audio src={staticFile(video)} />
      {music.map((m, k) => <Sequence key={k} from={m.from} durationInFrames={m.to - m.from}><Audio src={staticFile(m.src)} volume={(fr) => musicVol(fr + m.from) * interpolate(fr, [0, 20, m.to - m.from - 25, m.to - m.from], [0, 1, 1, 0], clamp)} /></Sequence>)}
      {sfx.map((s, k) => <Sequence key={'x' + k} from={Math.max(0, s.at)}><Audio src={staticFile(`sfx/${s.src}.wav`)} volume={s.vol ?? 0.35} /></Sequence>)}
    </AbsoluteFill>
  );
};
