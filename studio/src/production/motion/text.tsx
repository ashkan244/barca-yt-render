// Kinetic type: slams, word pops, typewriter, counters, marker highlight, stamps and a lower third.
// All driven by `local` (frames since the element appears) so chunked renders stay frame-exact.
import React from 'react';
import {Easing, interpolate, spring} from 'remotion';
import {LOCAL_FONTS} from '../fonts';
import {formatCounter} from '../numbers.mjs';

const FPS = 30;
const GOLD = '#f2c230';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const pop = (local: number, delay = 0, damping = 11) => spring({frame: local - delay, fps: FPS, config: {damping, stiffness: 180, mass: .7}});

/** Lines slam in one after another (oversized → landed, tiny overshoot). The last line is the accent. */
export const Slam: React.FC<{lines: string[]; local: number; size?: number; color?: string; accent?: string; gap?: number; font?: string}> = ({lines, local, size = 150, color = '#fff', accent = GOLD, gap = 7, font = LOCAL_FONTS.display}) =>
  <div style={{textAlign: 'center'}}>
    {lines.map((l, i) => {
      const s = pop(local, i * gap, 9);
      return <div key={i} style={{fontFamily: font, fontSize: size, lineHeight: 1, letterSpacing: 2, color: i === lines.length - 1 && lines.length > 1 ? accent : color,
        opacity: interpolate(local - i * gap, [0, 2], [0, 1], clamp), transform: `scale(${2.2 - 1.2 * s}) rotate(${(1 - s) * (i % 2 ? 4 : -4)}deg)`, textShadow: '0 6px 24px #0008'}}>{l}</div>;
    })}
  </div>;

/** Words pop in on a stagger; `hot` words get the accent colour. */
export const WordPop: React.FC<{text: string; local: number; size?: number; hot?: string[]; stagger?: number; color?: string}> = ({text, local, size = 76, hot = [], stagger = 3, color = '#fff'}) =>
  <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: `0 ${size * .28}px`}}>
    {text.split(/\s+/).map((w, i) => {
      const s = pop(local, i * stagger);
      const isHot = hot.some((h) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '') === h.toLowerCase());
      return <span key={i} style={{display: 'inline-block', fontFamily: LOCAL_FONTS.display, fontSize: size, lineHeight: 1.08, color: isHot ? GOLD : color,
        opacity: Math.min(1, s * 2), transform: `translateY(${(1 - s) * size * .5}px) scale(${.6 + .4 * s})`}}>{w}</span>;
    })}
  </div>;

/** Character reveal with a blinking caret (quotes, headlines, "breaking"). `cps` = characters per second. */
export const Typewriter: React.FC<{text: string; local: number; cps?: number; size?: number; color?: string; font?: string}> = ({text, local, cps = 28, size = 54, color = '#fff', font = LOCAL_FONTS.body}) => {
  const n = Math.floor(Math.max(0, local) * cps / FPS);
  const caret = n < text.length || Math.floor(local / 15) % 2 === 0;
  return <div style={{fontFamily: font, fontWeight: 800, fontSize: size, color, lineHeight: 1.2, whiteSpace: 'pre-wrap'}}>
    {text.slice(0, n)}<span style={{opacity: caret ? 1 : 0, color: GOLD}}>▌</span>
  </div>;
};

/** Number that counts up to its value (scores, dates and mixed text stay literal, see numbers.mjs). */
export const Counter: React.FC<{value: string | number; local: number; frames?: number; label?: string; size?: number; color?: string}> = ({value, local, frames = 30, label, size = 200, color = GOLD}) => {
  const p = interpolate(local, [0, frames], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const land = pop(local, frames - 2, 8);
  return <div style={{textAlign: 'center'}}>
    <div style={{fontFamily: LOCAL_FONTS.display, fontSize: size, lineHeight: 1, color, transform: `scale(${1 + .06 * Math.sin(Math.min(1, land) * Math.PI)})`, fontVariantNumeric: 'tabular-nums'}}>{formatCounter(value, p)}</div>
    {label && <div style={{fontFamily: LOCAL_FONTS.body, fontWeight: 800, fontSize: size * .2, letterSpacing: 4, color: '#fff', opacity: interpolate(local, [8, 16], [0, 1], clamp)}}>{label}</div>}
  </div>;
};

/** Marker highlight sweeping behind a phrase. */
export const Highlight: React.FC<{text: string; local: number; delay?: number; size?: number; color?: string; ink?: string}> = ({text, local, delay = 4, size = 70, color = GOLD, ink = '#0a0f1c'}) => {
  const p = interpolate(local, [delay, delay + 10], [0, 100], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return <span style={{fontFamily: LOCAL_FONTS.display, fontSize: size, lineHeight: 1.15, padding: '0 .18em', color: p > 50 ? ink : '#fff', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone',
    background: `linear-gradient(100deg, ${color} ${p}%, transparent ${p}%)`, transform: 'skewX(-4deg)', display: 'inline'}}>{text}</span>;
};

/** Metallic sheen passing across display text (titles, covers, the brand line). */
export const Shine: React.FC<{text: string; frame: number; size?: number; base?: string; period?: number}> = ({text, frame, size = 120, base = GOLD, period = 75}) => {
  const p = (frame % period) / period * 220 - 60;
  return <span style={{fontFamily: LOCAL_FONTS.display, fontSize: size, lineHeight: 1, color: 'transparent', WebkitBackgroundClip: 'text', backgroundClip: 'text',
    backgroundImage: `linear-gradient(110deg, ${base} ${p - 18}%, #fffbe8 ${p}%, ${base} ${p + 18}%)`}}>{text}</span>;
};

/** Rubber stamp slammed onto a frame: CONFIRMED / RUMOUR / OFFICIAL. */
export const Stamp: React.FC<{text: string; local: number; color?: string; size?: number; angle?: number}> = ({text, local, color = '#e0303a', size = 90, angle = -8}) => {
  const s = pop(local, 0, 7);
  return <div style={{display: 'inline-block', fontFamily: LOCAL_FONTS.display, fontSize: size, letterSpacing: 6, color, border: `${size * .08}px solid ${color}`, borderRadius: size * .14, padding: `${size * .05}px ${size * .3}px`,
    opacity: Math.min(1, s * 3) * .92, transform: `rotate(${angle}deg) scale(${2.4 - 1.4 * s})`, mixBlendMode: 'screen', textShadow: `0 0 2px ${color}`}}>{text}</div>;
};

/** News lower third: gold bar wipes in, then name + role slide out of it. */
export const LowerThird: React.FC<{title: string; sub?: string; local: number; size?: number}> = ({title, sub, local, size = 48}) => {
  const bar = interpolate(local, [0, 8], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const txt = interpolate(local, [5, 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return <div style={{display: 'flex', alignItems: 'stretch', gap: 14}}>
    <div style={{width: 8, background: GOLD, transform: `scaleY(${bar})`, transformOrigin: 'bottom'}} />
    <div style={{overflow: 'hidden'}}>
      <div style={{transform: `translateX(${(txt - 1) * 105}%)`}}>
        <div style={{fontFamily: LOCAL_FONTS.display, fontSize: size, lineHeight: 1.05, color: '#fff', background: '#050914e6', padding: '6px 18px'}}>{title}</div>
        {sub && <div style={{fontFamily: LOCAL_FONTS.body, fontWeight: 800, fontSize: size * .5, letterSpacing: 3, color: '#0a0f1c', background: GOLD, padding: '4px 18px', display: 'inline-block'}}>{sub}</div>}
      </div>
    </div>
  </div>;
};
