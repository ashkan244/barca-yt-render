// Atmosphere overlays. Procedural (CSS gradients + seeded noise): no WebGL, so they render on any headless runner.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {noise2D} from '@remotion/noise';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Warm film light leak sweeping across the frame. `progress` 0→1 over the leak's life. */
export const LightLeak: React.FC<{progress: number; seed?: number; intensity?: number}> = ({progress, seed = 1, intensity = .85}) => {
  const env = interpolate(progress, [0, .35, 1], [0, 1, 0], clamp) * intensity;
  if (env <= 0) return null;
  const x = 10 + progress * 80 + noise2D(seed, progress * 2, 0) * 10;
  const y = 30 + noise2D(seed + 5, progress * 2, 1) * 25;
  return <AbsoluteFill style={{mixBlendMode: 'screen', opacity: env, pointerEvents: 'none',
    background: `radial-gradient(ellipse 55% 70% at ${x}% ${y}%, #ffb347cc, transparent 70%), radial-gradient(ellipse 40% 50% at ${x + 25}% ${y + 35}%, #ff4e7a99, transparent 70%), radial-gradient(ellipse 80% 40% at ${x - 30}% ${y - 20}%, #fff3c480, transparent 70%)`}} />;
};

/** CRT/scan texture for archive or "broadcast" moments. */
export const ScanLines: React.FC<{opacity?: number}> = ({opacity = .12}) =>
  <AbsoluteFill style={{pointerEvents: 'none', opacity, backgroundImage: 'repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 2px, transparent 4px)'}} />;

/** Soft edge darkening that pulls the eye to the centre. */
export const Vignette: React.FC<{strength?: number}> = ({strength = .6}) =>
  <AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(0,0,0,${strength}) 100%)`}} />;

/** Slow-moving light pass for titles and covers. */
export const Sheen: React.FC<{frame: number; period?: number; opacity?: number}> = ({frame, period = 90, opacity = .25}) => {
  const p = (frame % period) / period;
  return <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', opacity,
    background: `linear-gradient(105deg, transparent ${p * 140 - 30}%, #ffffff ${p * 140 - 15}%, transparent ${p * 140}%)`}} />;
};
