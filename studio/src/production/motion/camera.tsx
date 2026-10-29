// Virtual camera: handheld drift, impact shake and a pseudo-depth parallax for single photographs.
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import {noise2D} from '@remotion/noise';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Organic camera drift (seeded noise), for presenter frames and boards that would otherwise sit dead still. */
export const Handheld: React.FC<{frame: number; amount?: number; seed?: number; children: React.ReactNode}> = ({frame, amount = 1, seed = 11, children}) => {
  const t = frame / 45;
  const x = noise2D(seed, t, 0) * 7 * amount, y = noise2D(seed + 1, 0, t) * 5 * amount, r = noise2D(seed + 2, t, t) * .35 * amount;
  return <AbsoluteFill style={{transform: `translate(${x}px, ${y}px) rotate(${r}deg)`}}>{children}</AbsoluteFill>;
};

/** Decaying shake after an impact at `at` (frames, same timeline as `frame`). */
export const Shake: React.FC<{frame: number; at: number; amount?: number; frames?: number; children: React.ReactNode}> = ({frame, at, amount = 14, frames = 12, children}) => {
  const l = frame - at;
  const a = l >= 0 && l < frames ? amount * Math.exp(-l / (frames / 3)) : 0;
  const x = a * Math.sin(l * 2.7), y = a * .6 * Math.cos(l * 3.3);
  return <AbsoluteFill style={{transform: `translate(${x}px, ${y}px)`}}>{children}</AbsoluteFill>;
};

/** Pseudo-depth from one photo: a blurred, darker background plate drifts slowly while a soft-masked
 *  foreground around the focus point pushes in faster. Pixels are only moved and blurred, never invented. */
export const Parallax: React.FC<{src: string; local: number; len: number; focus?: [number, number]; filter?: string; dir?: 1 | -1}> = ({src, local, len, focus = [50, 40], filter = '', dir = 1}) => {
  const p = interpolate(local, [0, Math.max(1, len)], [0, 1], clamp);
  const [fx, fy] = focus;
  const img = (extra: React.CSSProperties) => <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${fx}% ${fy}%`, transformOrigin: `${fx}% ${fy}%`, ...extra}} />;
  return <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
    {img({transform: `scale(${1.12 + .03 * p}) translateX(${dir * -12 * p}px)`, filter: `${filter} blur(5px) brightness(.72)`})}
    <AbsoluteFill style={{WebkitMaskImage: `radial-gradient(ellipse 42% 55% at ${fx}% ${fy + 8}%, #000 55%, transparent 100%)`, maskImage: `radial-gradient(ellipse 42% 55% at ${fx}% ${fy + 8}%, #000 55%, transparent 100%)`}}>
      {img({transform: `scale(${1.06 + .1 * p}) translateX(${dir * 22 * p}px)`, filter})}
    </AbsoluteFill>
  </AbsoluteFill>;
};
