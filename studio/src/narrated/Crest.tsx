import React from 'react';
import { C, DISPLAY, dim } from './theme';

export type Part = 'tl' | 'tr' | 'band' | 'bottom' | 'ball' | 'frame';

// Stylised fan drawing of the crest (not the official artwork): viewBox 400 x 480.
const OUTLINE =
  'M 8 14 C 70 40, 150 44, 200 24 C 250 44, 330 40, 392 14 C 380 60, 370 110, 376 170 ' +
  'C 384 300, 300 420, 200 470 C 100 420, 16 300, 24 170 C 30 110, 20 60, 8 14 Z';

export const CREST_OUTLINE = OUTLINE;

type Props = {
  size: number; // rendered width in px
  off?: Partial<Record<Part, number>>; // 0 = full colour, 1 = greyed out
  id?: string;
  ballSpin?: number; // degrees
};

export const Crest: React.FC<Props> = ({ size, off = {}, id = 'crest', ballSpin = 0 }) => {
  const o = (p: Part) => off[p] ?? 0;
  const clip = `${id}-clip`;
  const stripesTR = Array.from({ length: 9 }, (_, i) => i);
  const stripesB = Array.from({ length: 7 }, (_, i) => i);
  const lineCol = dim('#16161a', 0);
  return (
    <svg width={size} height={(size * 480) / 400} viewBox="-10 -10 420 500" style={{ overflow: 'visible' }}>
      <defs>
        <clipPath id={clip}>
          <path d={OUTLINE} />
        </clipPath>
        <radialGradient id={`${id}-shine`} cx="35%" cy="25%" r="80%">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.22} />
          <stop offset="55%" stopColor="#fff" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.25} />
        </radialGradient>
        <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="18" stdDeviation="22" floodColor="#000" floodOpacity="0.55" />
        </filter>
      </defs>
      <g filter={`url(#${id}-shadow)`}>
        <path d={OUTLINE} fill={dim(C.goldDeep, o('frame'))} />
      </g>
      <g clipPath={`url(#${clip})`}>
        {/* top-left: St George's cross */}
        <rect x={0} y={0} width={200} height={185} fill={dim(C.white, o('tl'))} />
        <rect x={88} y={0} width={44} height={185} fill={dim(C.red, o('tl'))} />
        <rect x={0} y={86} width={200} height={44} fill={dim(C.red, o('tl'))} />
        {/* top-right: the Senyera */}
        {stripesTR.map((i) => (
          <rect key={i} x={200 + (i * 200) / 9} y={0} width={200 / 9 + 0.5} height={185}
            fill={dim(i % 2 ? C.red : C.gold, o('tr'))} />
        ))}
        {/* band with the initials */}
        <rect x={0} y={185} width={400} height={62} fill={dim('#efe4c4', o('band'))} />
        <text x={200} y={233} textAnchor="middle" fontFamily={DISPLAY} 
          fontSize={50} letterSpacing={30} fill={dim(C.ink, o('band'))} dx={13}>FCB</text>
        {/* bottom: blaugrana */}
        {stripesB.map((i) => (
          <rect key={i} x={(i * 400) / 7} y={247} width={400 / 7 + 0.5} height={240}
            fill={dim(i % 2 ? C.garnet : C.blue, o('bottom'))} />
        ))}
        <rect x={0} y={0} width={400} height={480} fill={`url(#${id}-shine)`} />
      </g>
      {/* dividing lines and inner rim */}
      <g stroke={lineCol} strokeWidth={7} fill="none">
        <line x1={200} y1={20} x2={200} y2={185} />
        <line x1={0} y1={185} x2={400} y2={185} />
        <line x1={0} y1={247} x2={400} y2={247} />
      </g>
      <path d={OUTLINE} fill="none" stroke={lineCol} strokeWidth={6} />
      <path d={OUTLINE} fill="none" stroke={dim(C.goldDeep, o('frame'))} strokeWidth={18}
        transform="translate(200 240) scale(1.035) translate(-200 -240)" />
      <path d={OUTLINE} fill="none" stroke="#000" strokeOpacity={0.5} strokeWidth={3}
        transform="translate(200 240) scale(1.07) translate(-200 -240)" />
      {/* the old football */}
      <g transform={`translate(200 345) rotate(${ballSpin})`}>
        <circle r={44} fill={dim(C.gold, o('ball'))} stroke={dim('#6b4a12', o('ball'))} strokeWidth={4} />
        <g stroke={dim('#6b4a12', o('ball'))} strokeWidth={3.5} fill="none" strokeLinecap="round">
          <path d="M -40 -14 C -14 -6, 14 -6, 40 -14" />
          <path d="M -42 10 C -14 18, 14 18, 42 10" />
          <path d="M -12 -42 C -20 -14, -20 14, -12 42" />
          <path d="M 14 -41 C 20 -14, 20 14, 14 41" />
        </g>
        <circle r={44} fill={`url(#${id}-ball)`} />
      </g>
      <defs>
        <radialGradient id={`${id}-ball`} cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.3} />
        </radialGradient>
      </defs>
    </svg>
  );
};
