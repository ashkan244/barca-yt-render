import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {LOCAL_FONTS} from './production/fonts';

export const DISPLAY = LOCAL_FONTS.display;
export const BODY = LOCAL_FONTS.body;
export const CHALK = LOCAL_FONTS.marker;

// Brand palette: club colours as accents on a slate "chalkboard"
export const C = {
  slate: '#17201c',
  slate2: '#223029',
  chalk: '#ecebe4',
  chalkDim: '#ecebe48c',
  blau: '#1f5fd6',
  grana: '#b3123f',
  gold: '#f2c230',
  red: '#ff4d4d',
};

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};

/** Keyframed value: kf = [[frame, value], ...] */
export const kf = (frame: number, keys: [number, number][]) =>
  interpolate(frame, keys.map((k) => k[0]), keys.map((k) => k[1]), ease);

/** Film/board grain, re-seeded each frame. */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.08}) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 3) % 40; // refresh every 3 frames: keeps texture, cuts bitrate
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity}}>
      <svg width="100%" height="100%">
        <filter id={`gr${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#gr${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Slate chalkboard background with smudges. */
export const Chalkboard: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 40% 35%, ${C.slate2} 0%, ${C.slate} 70%, #0d1311 100%)`}}>
    <svg width="100%" height="100%" style={{position: 'absolute', opacity: 0.18}}>
      <filter id="smudge">
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="7" />
        <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#smudge)" />
    </svg>
  </AbsoluteFill>
);

/** SVG filter defs that make strokes look like chalk (rough edges). Mount once per composition. */
export const ChalkDefs: React.FC = () => (
  <svg width="0" height="0" style={{position: 'absolute'}}>
    <defs>
      <filter id="chalk" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="d" />
        <feComposite in="d" in2="n" operator="in" result="speck" />
        <feBlend in="d" in2="speck" mode="multiply" />
      </filter>
      {/* Illustrated/ink look for archival photos: grayscale -> posterize -> edges -> duotone */}
      <filter id="ink" colorInterpolationFilters="sRGB">
        <feColorMatrix in="SourceGraphic" type="saturate" values="0" result="g0" />
        <feGaussianBlur in="g0" stdDeviation="0.9" result="g" />
        <feComponentTransfer in="g" result="post">
          <feFuncR type="discrete" tableValues="0.05 0.3 0.55 0.8 1" />
          <feFuncG type="discrete" tableValues="0.05 0.3 0.55 0.8 1" />
          <feFuncB type="discrete" tableValues="0.05 0.3 0.55 0.8 1" />
        </feComponentTransfer>
        <feConvolveMatrix in="g" order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" result="edge" />
        <feColorMatrix in="edge" type="matrix" values="-3 0 0 0 1  -3 0 0 0 1  -3 0 0 0 1  0 0 0 1 0" result="lines" />
        <feBlend in="post" in2="lines" mode="multiply" result="inked" />
        <feComponentTransfer in="inked">
          <feFuncR type="table" tableValues="0.05 0.95" />
          <feFuncG type="table" tableValues="0.10 0.91" />
          <feFuncB type="table" tableValues="0.26 0.82" />
        </feComponentTransfer>
      </filter>
    </defs>
  </svg>
);

/** Halftone dot overlay for the illustrated look. */
export const Halftone: React.FC<{opacity?: number; size?: number}> = ({opacity = 0.22, size = 7}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none', mixBlendMode: 'multiply', opacity,
      backgroundImage: `radial-gradient(circle, #0b1f4d 28%, transparent 30%)`,
      backgroundSize: `${size}px ${size}px`,
    }}
  />
);

/** Text that pops in with a spring. */
export const Pop: React.FC<{delay?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({delay = 0, children, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = spring({frame: frame - delay, fps, config: {damping: 12, stiffness: 230, mass: 0.6}});
  return <div style={{opacity: Math.min(1, sp * 2), transform: `scale(${0.7 + 0.3 * sp}) translateY(${(1 - sp) * 26}px)`, filter: `blur(${Math.max(0, 1 - sp) * 6}px)`, ...style}}>{children}</div>;
};

/** Narration: plays each voice line at its frame and shows its caption for exactly the audio length.
 *  durations = {id: seconds} produced by tools/tts/say.mjs (durations.json). */
export type Line = {id: string; from: number; text: string};
export const Narration: React.FC<{dir: string; lines: Line[]; durations: Record<string, number>; volume?: number}> = ({dir, lines, durations, volume = 1}) => {
  const {fps} = useVideoConfig();
  return (
    <>
      {lines.map((l) => {
        const secs = durations[l.id] ?? 2;
        const len = Math.ceil(secs * fps);
        return (
          <Sequence key={l.id} from={l.from} durationInFrames={len + 4}>
            <Audio src={staticFile(`audio/${dir}/${l.id}.wav`)} volume={volume} />
            <Caption start={0} end={len + 4} text={l.text} wps={(l.text.split(' ').length / Math.max(0.5, secs)) * 1.08} />
          </Sequence>
        );
      })}
    </>
  );
};

/** Word-by-word caption line (simulates narration subtitles). */
export const Caption: React.FC<{text: string; start: number; end: number; wps?: number}> = ({text, start, end, wps = 2.6}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  const n = Math.max(0, Math.min(words.length, Math.floor(((frame - start) / fps) * wps) + 1));
  if (frame < start || frame >= end) return null;
  return (
    <div style={{position: 'absolute', bottom: 70, left: 0, right: 0, textAlign: 'center'}}>
      <span style={{fontFamily: BODY, fontWeight: 700, fontSize: 40, color: '#fff', background: 'rgba(0,0,0,.55)', padding: '8px 20px', borderRadius: 8}}>
        {words.slice(0, n).join(' ')}
      </span>
    </div>
  );
};
