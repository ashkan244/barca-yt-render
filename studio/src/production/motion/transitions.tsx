// Cut transitions for incoming shots. Each is a pure function of `local` (frames since the cut), so any frame
// renders identically in a chunked/parallel render. The incoming layer is transformed; overlays sit on top.
import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {noise2D} from '@remotion/noise';
import {LightLeak} from './overlays';

export type TransitionName = 'cut' | 'flash' | 'whip' | 'zoom' | 'glitch' | 'push' | 'iris' | 'wipe' | 'leak' | 'dip';
export type Direction = 'left' | 'right' | 'up' | 'down';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1); // fast-out, soft landing
const k = (local: number, d: number) => interpolate(local, [0, d], [0, 1], {...clamp, easing: ease});

/** Duration (frames) and sound role of each transition. Only motion that reads as a physical move gets a sound. */
export const TRANSITIONS: Record<TransitionName, {frames: number; sfx?: {src: string; volume: number}}> = {
  cut: {frames: 0},
  flash: {frames: 5, sfx: {src: 'shutter', volume: .07}},
  whip: {frames: 9, sfx: {src: 'whoosh', volume: .11}},
  zoom: {frames: 10, sfx: {src: 'hit', volume: .09}},
  glitch: {frames: 8, sfx: {src: 'tick', volume: .18}},
  push: {frames: 12},
  iris: {frames: 14},
  wipe: {frames: 14, sfx: {src: 'whoosh', volume: .07}},
  leak: {frames: 22},
  dip: {frames: 10},
};

const offset = (dir: Direction, amount: number) => dir === 'left' ? [amount, 0] : dir === 'right' ? [-amount, 0] : dir === 'up' ? [0, amount] : [0, -amount];

/** Wraps the incoming shot. `dir` is the direction of travel (whip/push). */
export const TransitionIn: React.FC<{name?: TransitionName; local: number; dir?: Direction; seed?: number; children: React.ReactNode}> = ({name = 'cut', local, dir = 'left', seed = 1, children}) => {
  const d = TRANSITIONS[name].frames;
  if (name === 'cut' || local >= d + 1) return <>{children}</>;
  const p = k(local, d);
  let style: React.CSSProperties = {};
  if (name === 'whip') {
    const [x, y] = offset(dir, (1 - p) * 70);
    style = {transform: `translate(${x}%, ${y}%) scale(${1 + .08 * (1 - p)}, 1)`, filter: `blur(${(1 - p) * 26}px)`};
  } else if (name === 'zoom') {
    style = {transform: `scale(${1.28 - .28 * p})`, filter: `blur(${(1 - p) * 12}px)`};
  } else if (name === 'glitch') {
    const j = (1 - local / d) * 34;
    style = {transform: `translate(${noise2D(seed, local * .9, 0) * j}px, ${noise2D(seed + 7, 0, local * .9) * j * .3}px)`,
      filter: `hue-rotate(${noise2D(seed + 3, local, 1) * 90}deg) saturate(${1 + (1 - p)}) contrast(${1 + .35 * (1 - p)})`};
  } else if (name === 'push') {
    const [x, y] = offset(dir, (1 - p) * 100);
    style = {transform: `translate(${x}%, ${y}%)`};
  } else if (name === 'iris') {
    style = {clipPath: `circle(${p * 75}% at 50% 45%)`};
  } else if (name === 'wipe') {
    const e = -20 + p * 140; // diagonal edge position in %
    style = {clipPath: `polygon(0 0, ${e}% 0, ${e - 20}% 100%, 0 100%)`};
  }
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

/** Overlay drawn above the incoming shot during the transition (flash, glitch bars, gold wipe edge, leak, dip). */
export const TransitionOverlay: React.FC<{name?: TransitionName; local: number; seed?: number}> = ({name = 'cut', local, seed = 1}) => {
  const d = TRANSITIONS[name].frames;
  if (name === 'cut' || local > d + 2) return null;
  const p = k(local, d);
  if (name === 'flash') return <AbsoluteFill style={{background: '#fff', opacity: .6 * (1 - local / d)}} />;
  if (name === 'zoom') return <AbsoluteFill style={{background: '#fff', opacity: .22 * (1 - p)}} />;
  if (name === 'dip') return <AbsoluteFill style={{background: '#000', opacity: 1 - p}} />;
  if (name === 'leak') return <LightLeak progress={local / d} seed={seed} />;
  if (name === 'wipe') {
    const e = -20 + p * 140;
    return <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: 'absolute', inset: 0}}>
        <line x1={e} y1={0} x2={e - 20} y2={100} stroke="#f2c230" strokeWidth={1.2} vectorEffect="non-scaling-stroke" style={{filter: 'drop-shadow(0 0 6px #f2c230)'}} />
      </svg>
    </AbsoluteFill>;
  }
  if (name === 'glitch') {
    const bars = [0, 1, 2, 3, 4].map((i) => ({y: 50 + noise2D(seed + i, local * .7, i) * 48, h: 2 + Math.abs(noise2D(seed - i, i, local)) * 9, c: i % 2 ? '#00e5ff' : '#ff2bd6'}));
    return <AbsoluteFill style={{mixBlendMode: 'screen', opacity: 1 - local / d}}>
      {bars.map((b, i) => <div key={i} style={{position: 'absolute', left: 0, right: 0, top: `${b.y}%`, height: `${b.h}%`, background: b.c, opacity: .55, transform: `translateX(${noise2D(seed, i, local) * 40}px)`}} />)}
    </AbsoluteFill>;
  }
  return null;
};

/** Outgoing shot during a push/whip: it leaves in the direction of travel. Other transitions keep it still underneath. */
export const TransitionOut: React.FC<{name?: TransitionName; local: number; dir?: Direction; children: React.ReactNode}> = ({name = 'cut', local, dir = 'left', children}) => {
  const d = TRANSITIONS[name].frames;
  if (name !== 'push' && name !== 'whip') return <AbsoluteFill>{children}</AbsoluteFill>;
  const p = k(local, d);
  const [x, y] = offset(dir, -p * (name === 'push' ? 100 : 60));
  return <AbsoluteFill style={{transform: `translate(${x}%, ${y}%)`, filter: name === 'whip' ? `blur(${p * 26}px)` : undefined}}>{children}</AbsoluteFill>;
};

/** Transitions that reveal the previous shot underneath (so it must still be drawn). */
export const needsOutgoing = (name: TransitionName) => name === 'push' || name === 'whip' || name === 'iris' || name === 'wipe';

/** Preset rotations so an edit can ask for a style instead of naming every cut. `cue` is used where a new sentence
 *  starts (it may carry a sound), `inner` between photos inside one sentence (light, silent: no whoosh per photo). */
export const TRANSITION_STYLES: Record<string, {cue: TransitionName[]; inner: TransitionName[]}> = {
  energetic: {cue: ['whip', 'zoom', 'whip', 'glitch'], inner: ['flash', 'zoom', 'push']},
  documentary: {cue: ['dip', 'leak', 'push'], inner: ['flash', 'push', 'cut']},
  clean: {cue: ['flash', 'push'], inner: ['cut', 'flash']},
};
export type TransitionStyle = keyof typeof TRANSITION_STYLES;
export const styleTransition = (style: string | undefined, index: number, inner = false): TransitionName => {
  const set = TRANSITION_STYLES[style ?? 'energetic'] ?? TRANSITION_STYLES.energetic;
  const list = inner ? set.inner : set.cue;
  return list[index % list.length];
};
/** Travel direction alternates so consecutive whips/pushes don't all go the same way. */
export const styleDirection = (index: number): Direction => (index % 2 ? 'right' : 'left');
