// Motion layer: makes every scene feel edited rather than static.
//  - CamRig: a virtual camera that re-frames (punch-in / shift) at the start of every narration line, with a slow drift in between,
//    so a 30-second list or statement reads like a sequence of 3–5 second shots.
//  - Enter/exit transitions between scenes (slide with motion blur, zoom-through, flash), chosen per scene type.
//  - Ambience: a moving soft light and floating dust over the whole frame.
import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {clamp} from '../lib';
import type {SceneTiming} from './timeline';

// framings: scale, transform-origin (%). Origins near the centre keep edge content inside the frame.
const FRAMINGS = [
  {s: 1.0, ox: 50, oy: 50},
  {s: 1.16, ox: 36, oy: 40},
  {s: 1.1, ox: 64, oy: 56},
  {s: 1.2, ox: 50, oy: 36},
  {s: 1.12, ox: 42, oy: 62},
];
// scenes with their own camera (board) or wide layouts that must not be cropped
const NO_RIG = new Set(['board', 'endscreen', 'title', 'gallery']);
// wide layouts: smaller moves so edge content stays in frame
const GENTLE = new Set(['compare', 'bars', 'timeline', 'map', 'duo', 'collage', 'photo']);

export const CamRig: React.FC<{st: SceneTiming; index: number; children: React.ReactNode}> = ({st, index, children}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  if (NO_RIG.has(st.scene.type)) return <>{children}</>;
  const starts = [0, ...st.lines.slice(1).map((l) => l.from - st.from)];
  let k = 0; for (let i = 0; i < starts.length; i++) if (f >= starts[i]) k = i;
  const amp = GENTLE.has(st.scene.type) ? 0.45 : 1;
  const fr = (i: number) => { const F = FRAMINGS[(i + index) % FRAMINGS.length]; return {s: 1 + (F.s - 1) * amp, ox: F.ox, oy: F.oy}; };
  const cur = fr(k), prev = fr(Math.max(0, k - 1));
  const p = k === 0 ? 1 : spring({frame: f - starts[k], fps, config: {damping: 15, stiffness: 210, mass: 0.6}});
  const segEnd = k + 1 < starts.length ? starts[k + 1] : st.dur;
  const drift = interpolate(f, [starts[k], segEnd], [0, 0.04 * amp], clamp); // slow push-in inside each shot
  const s = prev.s + (cur.s - prev.s) * p + drift;
  const ox = prev.ox + (cur.ox - prev.ox) * p, oy = prev.oy + (cur.oy - prev.oy) * p;
  return <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: `${ox}% ${oy}%`}}>{children}</AbsoluteFill>;
};

export type Transition = 'slide' | 'slideUp' | 'zoom' | 'flash' | 'cut';
export const transitionFor = (type: string, index: number): Transition =>
  index === 0 ? 'cut' : type === 'chapter' ? 'flash' : ['photo', 'gallery', 'title', 'duo', 'collage'].includes(type) ? 'zoom' : index % 2 ? 'slide' : 'slideUp';

export const XF = 10; // transition length in frames
const ease = {...clamp, easing: Easing.out(Easing.cubic)};

/** Incoming scene: wraps the first XF frames. */
export const Enter: React.FC<{kind: Transition; children: React.ReactNode}> = ({kind, children}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, XF], [0, 1], ease);
  if (kind === 'cut' || p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  const blur = (1 - p) * 14;
  const style: React.CSSProperties =
    kind === 'slide' ? {transform: `translateX(${(1 - p) * 100}%)`, filter: `blur(${blur}px)`}
    : kind === 'slideUp' ? {transform: `translateY(${(1 - p) * 100}%)`, filter: `blur(${blur}px)`}
    : kind === 'zoom' ? {transform: `scale(${1.25 - 0.25 * p})`, opacity: p, filter: `blur(${blur}px)`}
    : {transform: `scale(${1.12 - 0.12 * p})`, opacity: Math.min(1, p * 2)};
  return (
    <AbsoluteFill style={style}>
      {children}
      {kind === 'flash' && <AbsoluteFill style={{background: '#fff', opacity: interpolate(f, [0, 3, XF], [0.85, 0.6, 0], clamp)}} />}
    </AbsoluteFill>
  );
};

/** Outgoing scene during the next scene's transition (frames after its own end). */
export const Exit: React.FC<{kind: Transition; dur: number; children: React.ReactNode}> = ({kind, dur, children}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [dur, dur + XF], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  if (p <= 0 || kind === 'cut') return <AbsoluteFill>{children}</AbsoluteFill>;
  const style: React.CSSProperties =
    kind === 'slide' ? {transform: `translateX(${-35 * p}%)`, filter: `blur(${p * 10}px)`, opacity: 1 - 0.4 * p}
    : kind === 'slideUp' ? {transform: `translateY(${-30 * p}%)`, filter: `blur(${p * 10}px)`, opacity: 1 - 0.4 * p}
    : kind === 'zoom' ? {transform: `scale(${1 + 0.35 * p})`, filter: `blur(${p * 12}px)`}
    : {};
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

/** Moving soft light + floating dust, over everything (subtle). */
export const Ambience: React.FC<{total: number}> = ({total}) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const lx = 50 + 30 * Math.sin(t / 9), ly = 40 + 18 * Math.cos(t / 11);
  const motes = React.useMemo(() => Array.from({length: 26}, (_, i) => ({
    x: random(`x${i}`) * 100, y: random(`y${i}`) * 100, r: 1 + random(`r${i}`) * 2.4, v: 0.4 + random(`v${i}`) * 1.2, ph: random(`p${i}`) * 6.28,
  })), []);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at ${lx}% ${ly}%, rgba(255,240,200,.10) 0%, rgba(255,240,200,0) 45%)`, mixBlendMode: 'screen'}} />
      <svg width="1920" height="1080" style={{position: 'absolute', opacity: interpolate(f, [0, 30, total - 30, total], [0, 1, 1, 0], clamp)}}>
        {motes.map((m, i) => {
          const y = ((m.y - t * m.v * 1.6) % 100 + 100) % 100;
          const x = m.x + 1.2 * Math.sin(t * 0.6 + m.ph);
          return <circle key={i} cx={(x / 100) * 1920} cy={(y / 100) * 1080} r={m.r} fill="#fff" opacity={0.10 + 0.08 * Math.sin(t + m.ph)} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};
