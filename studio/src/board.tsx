import React from 'react';
import {interpolate} from 'remotion';
import {C, CHALK, clamp} from './lib';

// Pitch coordinates are metres: x 0..105 (Barça defend x=0), y 0..68.
export const PW = 105, PH = 68;
export const SCALE = 15; // px per metre inside the board svg
export const BW = PW * SCALE, BH = PH * SCALE;
export const px = (m: number) => m * SCALE;

/** Chalk pitch markings. */
export const PitchLines: React.FC = () => {
  const s = {stroke: C.chalk, strokeWidth: 3, fill: 'none', filter: 'url(#chalk)', opacity: 0.85} as const;
  return (
    <g>
      <rect x={0} y={0} width={BW} height={BH} {...s} />
      <line x1={px(52.5)} y1={0} x2={px(52.5)} y2={BH} {...s} />
      <circle cx={px(52.5)} cy={px(34)} r={px(9.15)} {...s} />
      <rect x={0} y={px(13.84)} width={px(16.5)} height={px(40.32)} {...s} />
      <rect x={BW - px(16.5)} y={px(13.84)} width={px(16.5)} height={px(40.32)} {...s} />
      <rect x={0} y={px(24.84)} width={px(5.5)} height={px(18.32)} {...s} />
      <rect x={BW - px(5.5)} y={px(24.84)} width={px(5.5)} height={px(18.32)} {...s} />
      <circle cx={px(11)} cy={px(34)} r={4} fill={C.chalk} />
      <circle cx={BW - px(11)} cy={px(34)} r={4} fill={C.chalk} />
    </g>
  );
};

export type Side = 'barca' | 'opp';

/** A player token drawn in chalk. */
export const Token: React.FC<{x: number; y: number; side: Side; label?: string; highlight?: string; opacity?: number}> = ({x, y, side, label, highlight, opacity = 1}) => {
  const fill = side === 'barca' ? C.blau : 'transparent';
  const stroke = highlight ?? (side === 'barca' ? C.grana : C.chalk);
  return (
    <g transform={`translate(${px(x)},${px(y)})`} opacity={opacity}>
      {highlight && <circle r={50} fill="none" stroke={highlight} strokeWidth={7} opacity={0.9} />}
      <circle r={30} fill={fill} stroke={stroke} strokeWidth={side === 'barca' ? 8 : 6} filter="url(#chalk)" />
      {label && (
        <text y={11} textAnchor="middle" fontFamily={CHALK} fontSize={32} fill={side === 'barca' ? '#fff' : C.chalk}>{label}</text>
      )}
    </g>
  );
};

/** Chalk arrow drawn progressively (0..1). */
export const ChalkArrow: React.FC<{from: [number, number]; to: [number, number]; progress: number; color?: string; dashed?: boolean; curve?: number}> = ({from, to, progress, color = C.chalk, dashed, curve = 0}) => {
  const [x1, y1] = [px(from[0]), px(from[1])];
  const [x2, y2] = [px(to[0]), px(to[1])];
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const nx = -(y2 - y1), ny = x2 - x1; // normal for curvature
  const len = Math.hypot(nx, ny) || 1;
  const cx = mx + (nx / len) * curve, cy = my + (ny / len) * curve;
  const p = Math.max(0, Math.min(1, progress));
  // de Casteljau split of the quadratic at t=p -> partial curve from start
  const qx = x1 + (cx - x1) * p, qy = y1 + (cy - y1) * p;
  const ex = (1 - p) * (1 - p) * x1 + 2 * (1 - p) * p * cx + p * p * x2;
  const ey = (1 - p) * (1 - p) * y1 + 2 * (1 - p) * p * cy + p * p * y2;
  const d = `M${x1},${y1} Q${qx},${qy} ${ex},${ey}`;
  const ang = Math.atan2(ey - qy, ex - qx);
  if (p <= 0) return null;
  return (
    <g filter="url(#chalk)">
      <path d={d} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeDasharray={dashed ? '14 12' : undefined} />
      {p > 0.97 && (
        <path d={`M${ex},${ey} l${-30 * Math.cos(ang - 0.45)},${-30 * Math.sin(ang - 0.45)} M${ex},${ey} l${-30 * Math.cos(ang + 0.45)},${-30 * Math.sin(ang + 0.45)}`} stroke={color} strokeWidth={5} strokeLinecap="round" />
      )}
    </g>
  );
};

/** Vertical offside line across the pitch at x metres. */
export const OffsideLine: React.FC<{x: number; opacity: number; color?: string}> = ({x, opacity, color = C.gold}) => (
  <g opacity={opacity}>
    <line x1={px(x)} y1={-20} x2={px(x)} y2={BH + 20} stroke={color} strokeWidth={6} strokeDasharray="22 10" />
  </g>
);

/** Shaded zone (rectangle in metres). */
export const Zone: React.FC<{x: number; y: number; w: number; h: number; color: string; opacity: number}> = ({x, y, w, h, color, opacity}) => (
  <rect x={px(x)} y={px(y)} width={px(w)} height={px(h)} fill={color} opacity={opacity} />
);

/** Tilted board wrapper (signature 3D chalkboard look). */
export const Board: React.FC<{tilt?: number; zoom?: number; focusX?: number; focusY?: number; children: React.ReactNode}> = ({tilt = 26, zoom = 1, focusX = 52.5, focusY = 34, children}) => (
  <div style={{position: 'absolute', left: '50%', top: '53%', width: BW, height: BH, marginLeft: -BW / 2, marginTop: -BH / 2,
    transform: `perspective(1800px) rotateX(${tilt}deg) scale(${0.98 * zoom}) translate(${(52.5 - focusX) * SCALE}px, ${(34 - focusY) * SCALE}px)`, transformOrigin: '50% 50%'}}>
    <svg width={BW} height={BH} style={{overflow: 'visible'}}>{children}</svg>
  </div>
);

export const lerp = (f: number, a: number, b: number, v0: number, v1: number) => interpolate(f, [a, b], [v0, v1], clamp);
