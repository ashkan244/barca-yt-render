// Draw-on strokes (chalk/marker feel) built on @remotion/paths evolvePath.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useVideoConfig} from 'remotion';
import {evolvePath, scalePath} from '@remotion/paths';
import {LOCAL_FONTS} from '../fonts';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const GOLD = '#f2c230';

/** A path drawn on over `frames`, optionally ending in an arrowhead. `d` is in % of the box (0–100 on both axes);
 *  it is scaled to the box's pixels so stroke width and the draw-on dash stay uniform. `box` defaults to the frame. */
export const DrawPath: React.FC<{d: string; local: number; frames?: number; color?: string; width?: number; arrow?: boolean; dashed?: boolean; box?: [number, number]}> = ({d, local, frames = 18, color = GOLD, width = 9, arrow = false, dashed = false, box}) => {
  const cfg = useVideoConfig();
  const [w, h] = box ?? [cfg.width, cfg.height];
  const px = React.useMemo(() => scalePath(d, w / 100, h / 100), [d, w, h]);
  const p = interpolate(local, [0, frames], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  if (p <= 0) return null;
  const {strokeDasharray, strokeDashoffset} = evolvePath(p, px);
  const id = `ah${Math.abs(d.length * 31 + width * 7) | 0}`;
  const done = dashed && p >= 1;
  return <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none'}}>
    <defs><marker id={id} markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto"><path d="M0 0L4 2L0 4Z" fill={color} /></marker></defs>
    <path d={px} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray={done ? `${width * 2.2} ${width * 2}` : strokeDasharray} strokeDashoffset={done ? 0 : strokeDashoffset}
      markerEnd={arrow && p > .95 ? `url(#${id})` : undefined} style={{filter: `drop-shadow(0 0 6px ${color}99)`}} />
  </svg>;
};

/** Hand-drawn ring around a detail of a photo plus a tag: "look here". x/y = centre in % of the box, r = radius in % of
 *  its width (the ring stays round in any box). Drawn with a conic mask, so the stroke is even at any size. */
export const Callout: React.FC<{local: number; x: number; y: number; r?: number; label?: string; color?: string}> = ({local, x, y, r = 12, label, color = GOLD}) => {
  if (local < 0) return null;
  const p = interpolate(local, [0, 14], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const t = interpolate(local, [12, 20], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const mask = `conic-gradient(from -100deg, #000 ${p * 340}deg, transparent ${p * 340}deg)`; // 340°: a drawn ring, slightly open
  return <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div style={{position: 'absolute', left: `${x - r}%`, top: `${y}%`, width: `${r * 2}%`, aspectRatio: '1', transform: 'translateY(-50%) rotate(-8deg) scaleY(.92)',
      borderRadius: '50%', border: `7px solid ${color}`, boxShadow: `0 0 14px ${color}88`, WebkitMaskImage: mask, maskImage: mask}} />
    {label && <div style={{position: 'absolute', left: `${Math.min(62, x + r * .55)}%`, top: `${y}%`, opacity: t, transform: `translateY(calc(-50% - ${r * 4.2}px)) translateY(${(1 - t) * 10}px)`,
      fontFamily: LOCAL_FONTS.body, fontWeight: 900, fontSize: 30, letterSpacing: 2, color: '#000', background: color, padding: '4px 14px', borderRadius: 8, whiteSpace: 'nowrap'}}>{label}</div>}
  </AbsoluteFill>;
};
