import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BODY, C, DISPLAY } from './theme';

export type SceneProps = { frames: number };

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export const DarkBg: React.FC<{ glow?: string }> = ({ glow = '#3a3a42' }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 45% at 50% 42%, ${glow} 0%, #141418 55%, ${C.bgDark} 100%)` }} />
);

export const BlaugranaBg: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = Math.sin(frame / 60) * 3;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(90deg, #0a2f78 0%, #0c3a8f ${44 + shift}%, #6b0b30 ${56 + shift}%, #4a0620 100%)` }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 80% 55% at 50% 42%, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)' }} />
    </AbsoluteFill>
  );
};

export const Parchment: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse 85% 60% at 50% 40%, #efe0b8 0%, #d9bf86 55%, #8f6f3c 100%)' }} />
    <AbsoluteFill style={{ background: 'repeating-linear-gradient(17deg, rgba(120,80,30,0.05) 0 3px, rgba(0,0,0,0) 3px 9px)' }} />
  </AbsoluteFill>
);

// static film grain + a slow drifting light leak, laid over every scene (photographic feel of the reference)
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const x = 50 + Math.sin(frame / 90) * 30;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 40% at ${x}% 10%, rgba(255,190,120,0.10), rgba(0,0,0,0) 70%)`, mixBlendMode: 'screen' }} />
      <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.09, mixBlendMode: 'overlay' }}>
        <filter id="nr-grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 6} /></filter>
        <rect width="100%" height="100%" filter="url(#nr-grain)" />
      </svg>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 62%, rgba(0,0,0,0.55) 100%)' }} />
    </AbsoluteFill>
  );
};

export const Center: React.FC<{ y?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ y = 820, children, style }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 0, ...style }}>
    {children}
  </div>
);

export const useIn = (delay = 0, damping = 16) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness: 120 } });
};

export const useDrift = (frames: number, to = 1.06) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, frames], [1, to], { ...clamp, easing: Easing.inOut(Easing.sin) });
};

export const Kicker: React.FC<{ text: string; color?: string; y?: number }> = ({ text, color = C.gold, y = 210 }) => {
  const s = useIn(4);
  return (
    <div style={{
      position: 'absolute', top: y, left: 0, right: 0, textAlign: 'center', fontFamily: DISPLAY,
      fontSize: 64, letterSpacing: 4, color, opacity: s, transform: `translateY(${(1 - s) * 30}px)`,
      textShadow: '0 3px 14px rgba(0,0,0,0.6)', textTransform: 'uppercase',
    }}>{text}</div>
  );
};

export const Label: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 44, color = '#fff', style }) => (
  <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: size, color, ...style }}>{children}</div>
);

// Barça Radar mark (same language as the channel's Mark: navy disc, garnet ring, gold BR)
export const RadarMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="86" fill="#0b1220" />
    <circle cx="100" cy="100" r="86" fill="none" stroke={C.garnet} strokeWidth="16" />
    <circle cx="100" cy="100" r="66" fill="none" stroke={C.gold} strokeWidth="3" strokeDasharray="8 7" opacity="0.9" />
    <text x="100" y="126" textAnchor="middle" fontFamily={DISPLAY} fontSize="78" fill={C.gold} letterSpacing="2">BR</text>
  </svg>
);

// a stylised gold trophy (not any real trophy's design)
export const Cup: React.FC<{ w: number; tall?: boolean; label?: string }> = ({ w, tall = false, label }) => (
  <svg width={w} height={w * (tall ? 1.6 : 1.25)} viewBox={`0 0 200 ${tall ? 320 : 250}`}>
    <defs>
      <linearGradient id={`cup-${tall}`} x1="0" x2="1">
        <stop offset="0" stopColor="#8a6410" /><stop offset="0.35" stopColor="#ffe08a" /><stop offset="0.6" stopColor="#e2b23a" /><stop offset="1" stopColor="#7a560c" />
      </linearGradient>
    </defs>
    {tall ? (
      <g fill={`url(#cup-${tall})`} stroke="#5a3f08" strokeWidth={3}>
        <path d="M 40 20 L 160 20 C 160 110, 130 150, 112 170 L 112 220 L 88 220 L 88 170 C 70 150, 40 110, 40 20 Z" />
        <path d="M 40 40 C 0 40, 0 110, 52 120" fill="none" strokeWidth={10} stroke="#c9961f" />
        <path d="M 160 40 C 200 40, 200 110, 148 120" fill="none" strokeWidth={10} stroke="#c9961f" />
        <rect x="60" y="220" width="80" height="26" rx="4" />
        <rect x="45" y="246" width="110" height="60" rx="6" fill="#2a2a30" stroke="#c9961f" />
      </g>
    ) : (
      <g fill={`url(#cup-${tall})`} stroke="#5a3f08" strokeWidth={3}>
        <circle cx="100" cy="82" r="62" />
        <path d="M 70 140 L 130 140 L 118 180 L 82 180 Z" />
        <rect x="55" y="180" width="90" height="56" rx="6" fill="#2a2a30" stroke="#c9961f" />
        <path d="M 52 60 C 70 40, 130 40, 148 60 M 40 92 C 70 110, 130 110, 160 92" fill="none" stroke="#7a560c" strokeWidth={4} />
      </g>
    )}
    {label ? <text x="100" y={tall ? 286 : 216} textAnchor="middle" fontFamily={DISPLAY} fontSize="24" fill={C.gold} letterSpacing="2">{label}</text> : null}
  </svg>
);
