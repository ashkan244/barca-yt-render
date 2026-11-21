// KOEMAN-LONG: "The Defender Who Scored Like a Striker". Presenter beside a graphics stage; every beat is timed to
// the spoken words (times from the supplied take). All drawings are original vector art: no club crests except the
// real FCB crest (CrestArt), no photos, and every pitch sketch is labelled schematic.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {fitText} from '@remotion/layout-utils';
import {LOCAL_FONTS} from '../fonts';
import {ReviewedCaptions} from '../Captions';
import {RadarBg, GRANA, BLAU} from '../../radar/RadarStory';
import {Mark} from '../../Branding';
import {EndScreen, FPS, Presenter, emphasisFor, longFrames, media, shortFrames, type SourceEpisodeProps} from './SourceEpisode';
import {CREST, Crest} from './CrestArt';

const GOLD = '#f2c230';
const INK = '#f5f4ef';
const MUTED = '#aab7ca';
const ORANGE = '#ff7a1a';
const RED = '#e03a4c';
const GREEN = '#2ec27e';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const sec = (s: number) => Math.round(s * FPS);
const ramp = (f: number, at: number, d = 12) => interpolate(f, [sec(at), sec(at) + d], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
const slide = (f: number, a: number, b: number) => interpolate(f, [sec(a), sec(b)], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
const appear = (p: number, dy = 18): React.CSSProperties => ({opacity: p, transform: `translateY(${(1 - p) * dy}px)`});
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const D = LOCAL_FONTS.display;

type Box = {x: number; y: number; w: number; h: number};
type Layout = 'split' | 'full';
const PRESENTER: Record<Layout, Box> = {split: {x: 70, y: 150, w: 760, h: 760}, full: {x: 70, y: 606, w: 300, h: 300}};
const STAGE: Record<Layout, Box> = {split: {x: 870, y: 122, w: 980, h: 812}, full: {x: 70, y: 122, w: 1780, h: 812}};
const ART: Record<Layout, Box> = {split: {x: 880, y: 300, w: 960, h: 620}, full: {x: 410, y: 300, w: 1430, h: 620}};
const S = ART.split; const F = ART.full;
const OUTRO = 276.0; // the take ends mid-breath on "right foot."; the graphics carry the last moment

// ---------------- building blocks ----------------
const Head: React.FC<{f: number; at: number; kicker: string; title: string; layout: Layout}> = ({f, at, kicker, title, layout}) => {
  const p = ramp(f, at, 10); const x = layout === 'split' ? 920 : 410; const w = 1810 - x;
  const size = Math.min(layout === 'full' ? 80 : 68, Math.floor(fitText({text: title, withinWidth: w, fontFamily: D}).fontSize));
  return <div style={{position: 'absolute', left: x, top: 150, width: w, ...appear(p, 14)}}>
    <div style={{color: GOLD, fontWeight: 800, fontSize: 23, letterSpacing: 4}}>{kicker}</div>
    <div style={{fontFamily: D, fontSize: size, lineHeight: 1.04, color: INK, marginTop: 6, whiteSpace: 'nowrap'}}>{title}</div>
  </div>;
};
const Chip: React.FC<{f: number; at: number; x: number; y: number; w?: number; big?: boolean; gold?: boolean; red?: boolean; style?: React.CSSProperties; children: React.ReactNode}> = ({f, at, x, y, w, big, gold, red, style, children}) =>
  <div style={{position: 'absolute', left: x, top: y, width: w, ...appear(ramp(f, at, 10)), background: '#081127ee', borderLeft: `6px solid ${red ? RED : gold ? GOLD : '#3d6fd8'}`,
    borderRadius: 12, padding: big ? '16px 22px' : '11px 18px', boxShadow: '0 14px 34px #0007', fontWeight: 800, letterSpacing: 2, fontSize: big ? 32 : 23, color: red ? RED : gold ? GOLD : INK, lineHeight: 1.25, ...style}}>{children}</div>;
const Note: React.FC<{f: number; at: number; x: number; y: number; w: number; children: React.ReactNode}> = ({f, at, x, y, w, children}) =>
  <div style={{position: 'absolute', left: x, top: y, width: w, ...appear(ramp(f, at, 10), 10), fontSize: 20, fontWeight: 700, letterSpacing: 2.5, lineHeight: 1.35, color: MUTED}}>{children}</div>;
const At: React.FC<{x: number; y: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, children, style}) => <div style={{position: 'absolute', left: x, top: y, ...style}}>{children}</div>;
const Big: React.FC<{f: number; at: number; box: Box; size: number; color?: string; align?: 'left' | 'center' | 'right'; dy?: number; children: React.ReactNode}> = ({f, at, box, size, color = INK, align = 'center', dy = 0, children}) =>
  <div style={{position: 'absolute', left: box.x, top: box.y + dy, width: box.w, textAlign: align, fontFamily: D, fontSize: size, lineHeight: 1.02, color, textShadow: '0 16px 50px #000b', ...appear(ramp(f, at, 10), 24)}}>{children}</div>;
const Stamp: React.FC<{f: number; at: number; box: Box; size?: number; rot?: number; red?: boolean; dy?: number; children: React.ReactNode}> = ({f, at, box, size = 84, rot = -4, red, dy = 0, children}) => {
  const k = ramp(f, at, 8); const c = red ? RED : GOLD;
  return <div style={{position: 'absolute', left: box.x, width: box.w, top: box.y + dy, textAlign: 'center', transform: `rotate(${rot}deg) scale(${lerp(1.5, 1, k)})`, opacity: k}}>
    <span style={{display: 'inline-block', border: `7px solid ${c}`, borderRadius: 16, padding: '6px 34px', fontFamily: D, fontSize: size, color: c, background: '#07102ae8'}}>{children}</span></div>;
};
const Year: React.FC<{f: number; at: number; box: Box; text: string | number; size?: number; color?: string; dy?: number}> = ({f, at, box, text, size = 300, color = GOLD, dy = 0}) => {
  const k = ramp(f, at, 10);
  return <div style={{position: 'absolute', left: box.x, width: box.w, top: box.y + dy, textAlign: 'center', fontFamily: D, fontSize: size, lineHeight: 1, color, textShadow: '0 18px 50px #000a', opacity: k, transform: `scale(${lerp(.85, 1, k)})`}}>{text}</div>;
};
const Tick: React.FC<{size: number; on: boolean}> = ({size, on}) => <div style={{width: size, height: size, borderRadius: size / 4, border: `3px solid ${GOLD}`, background: on ? GOLD : 'transparent', color: '#1a1200', fontWeight: 900, fontSize: size * .66, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{on ? '✓' : ''}</div>;

/** A row of ticks/labels, each landing on a word. */
const Checks: React.FC<{f: number; x: number; y: number; items: [string, number][]; size?: number; gap?: number}> = ({f, x, y, items, size = 31, gap = 70}) =>
  <>{items.map(([l, at], k) => <div key={l} style={{position: 'absolute', left: x, top: y + k * gap, display: 'flex', alignItems: 'center', gap: 18, ...appear(ramp(f, at, 9), 12)}}>
    <Tick size={size + 12} on />
    <div style={{fontWeight: 900, letterSpacing: 2.5, fontSize: size, color: INK}}>{l}</div>
  </div>)}</>;

// --- icons ---
const Trophy: React.FC<{w: number; id: string; glow?: number; dim?: boolean}> = ({w, id, glow = 0, dim}) => <svg width={w} height={w * 1.35} viewBox="0 0 200 270" style={{opacity: dim ? .35 : 1, filter: glow ? `drop-shadow(0 0 ${24 * glow}px ${GOLD})` : undefined}}>
  <defs><linearGradient id={`tr-${id}`} x1="0" x2="1"><stop offset="0" stopColor="#8a6410" /><stop offset=".35" stopColor="#ffe08a" /><stop offset=".6" stopColor="#e2b23a" /><stop offset="1" stopColor="#7a560c" /></linearGradient></defs>
  <g fill={`url(#tr-${id})`} stroke="#5a3f08" strokeWidth={3}>
    <path d="M 40 14 L 160 14 C 160 100, 130 140, 112 158 L 112 196 L 88 196 L 88 158 C 70 140, 40 100, 40 14 Z" />
    <path d="M 40 32 C 0 32, 0 100, 52 110" fill="none" strokeWidth={10} stroke="#c9961f" /><path d="M 160 32 C 200 32, 200 100, 148 110" fill="none" strokeWidth={10} stroke="#c9961f" />
    <rect x="62" y="196" width="76" height="20" rx="4" /><rect x="46" y="216" width="108" height="44" rx="6" fill="#2a2a30" stroke="#c9961f" />
  </g>
</svg>;
const Arch: React.FC<{w: number; glow?: number}> = ({w, glow = 0}) => <svg width={w} height={w * .5} viewBox="0 0 600 300" style={{filter: glow ? `drop-shadow(0 0 ${22 * glow}px #fff)` : undefined}}>
  <path d="M 40 270 Q 300 -90 560 270" fill="none" stroke="#f5f4ef" strokeWidth={16} strokeLinecap="round" />
  {[110, 170, 230, 300, 370, 430, 490].map((x) => <path key={x} d={`M ${x} ${270 - (300 - Math.abs(x - 300)) * .02} L ${x} ${Math.max(20, 130 - (300 - Math.abs(x - 300)) * .18)}`} stroke="#f5f4ef" strokeWidth={2} opacity=".5" />)}
  <path d="M 0 270 H 600 L 570 296 H 30 Z" fill="#cfd8e6" opacity=".85" />
</svg>;
const Flag: React.FC<{w: number}> = ({w}) => <div style={{width: w, height: w * .66, borderRadius: 10, overflow: 'hidden', boxShadow: '0 12px 34px #0008'}}>
  {['#ae1c28', '#ffffff', '#21468b'].map((c) => <div key={c} style={{height: '33.34%', background: c}} />)}</div>;
const Ball: React.FC<{size: number}> = ({size}) => <svg width={size} height={size} viewBox="-50 -50 100 100">
  <circle r="46" fill="#f7f5ef" stroke="#111" strokeWidth="4" /><path d="M0 -17 L16 -5 L10 14 L-10 14 L-16 -5 Z" fill="#111" />
  {[0, 72, 144, 216, 288].map((a) => <g key={a} transform={`rotate(${a})`}><path d="M0 -17 L0 -32" stroke="#111" strokeWidth="4" /><path d="M-12 -44 L0 -32 L12 -44 A46 46 0 0 0 -12 -44 Z" fill="#111" /></g>)}
</svg>;
const Shirt: React.FC<{w: number; color: string; trim?: string}> = ({w, color, trim = '#fff'}) => <svg width={w} height={w * 1.05} viewBox="0 0 200 210">
  <path d="M62 8C70 22 130 22 138 8L192 34 172 86 150 76V204H50V76L28 86 8 34Z" fill={color} stroke="#0006" strokeWidth={3} />
  <path d="M62 8C70 22 130 22 138 8" fill="none" stroke={trim} strokeWidth={6} />
</svg>;
/** Colour tile for a club; names only (no club crests). */
const ClubTile: React.FC<{f: number; at: number; x: number; y: number; name: string; sub?: string; a: string; b: string; w?: number}> = ({f, at, x, y, name, sub, a, b, w = 300}) =>
  <div style={{position: 'absolute', left: x, top: y, width: w, ...appear(ramp(f, at, 10)), borderRadius: 18, overflow: 'hidden', boxShadow: '0 16px 40px #000a', border: '1px solid #ffffff30'}}>
    <div style={{height: 22, background: `repeating-linear-gradient(90deg, ${a} 0 22px, ${b} 22px 44px)`}} />
    <div style={{background: '#0a1430f2', padding: '16px 20px', textAlign: 'center'}}>
      <div style={{fontFamily: D, fontSize: 46, lineHeight: 1.05, color: INK, letterSpacing: 1}}>{name}</div>
      {sub && <div style={{fontWeight: 800, fontSize: 19, letterSpacing: 3, color: MUTED, marginTop: 4}}>{sub}</div>}
    </div>
  </div>;
const Person: React.FC<{f: number; at: number; x: number; y: number; name: string; sub?: string; color?: string; hero?: boolean; w?: number}> = ({f, at, x, y, name, sub, color = '#3d6fd8', hero, w = 260}) => {
  const k = ramp(f, at, 10);
  return <div style={{position: 'absolute', left: x, top: y, width: w, textAlign: 'center', opacity: k, transform: `translateY(${(1 - k) * 26}px) scale(${lerp(.9, 1, k)})`}}>
    <div style={{display: 'inline-block'}}><Shirt w={hero ? 150 : 120} color={color} trim={hero ? GOLD : '#fff'} /></div>
    <div style={{fontFamily: D, fontSize: hero ? 50 : 42, lineHeight: 1.04, color: hero ? GOLD : INK, marginTop: 4}}>{name}</div>
    {sub && <div style={{fontWeight: 800, fontSize: 19, letterSpacing: 3, color: MUTED, marginTop: 3}}>{sub}</div>}
  </div>;
};
const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; p: number; color?: string; w?: number; dash?: string}> = ({x1, y1, x2, y2, p, color = GOLD, w = 6, dash}) => {
  const a = Math.atan2(y2 - y1, x2 - x1); const xe = lerp(x1, x2, p); const ye = lerp(y1, y2, p);
  return <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
    <line x1={x1} y1={y1} x2={xe} y2={ye} stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash} />
    {p > 0.95 && <path d={`M${x2} ${y2} l${-24 * Math.cos(a - 0.45)} ${-24 * Math.sin(a - 0.45)} M${x2} ${y2} l${-24 * Math.cos(a + 0.45)} ${-24 * Math.sin(a + 0.45)}`} stroke={color} strokeWidth={w} strokeLinecap="round" fill="none" />}
  </svg>;
};

/** Full pitch (105 x 68 m, attacking right) in decimetres; `at` is the frame box it is placed in. Children use pitch units. */
const Pitch: React.FC<{box: Box; p: number; label?: string; children?: React.ReactNode}> = ({box, p, label = 'SCHEMATIC · NOT TRACKING DATA', children}) => {
  const line = 'rgba(255,255,255,.62)'; const sw = 4; const w = box.w; const h = w * 720 / 1100;
  return <div style={{position: 'absolute', left: box.x, top: box.y, width: w, height: h, opacity: p}}>
    <svg width={w} height={h} viewBox="-30 -20 1100 720" style={{overflow: 'visible'}}>
      <rect x={-30} y={-20} width={1100} height={720} rx={22} fill="#0f3a2c" opacity=".92" />
      {Array.from({length: 10}, (_, k) => <rect key={k} x={k * 105} y={0} width={52.5} height={680} fill="#ffffff" opacity=".035" />)}
      <g fill="none" stroke={line} strokeWidth={sw}>
        <rect x={0} y={0} width={1050} height={680} /><line x1={525} y1={0} x2={525} y2={680} /><circle cx={525} cy={340} r={91.5} />
        <rect x={0} y={138.5} width={165} height={403} /><rect x={885} y={138.5} width={165} height={403} />
        <rect x={0} y={248.5} width={55} height={183} /><rect x={995} y={248.5} width={55} height={183} />
        <rect x={-14} y={303.5} width={14} height={73} /><rect x={1050} y={303.5} width={14} height={73} />
        <path d="M 165 266 A 91.5 91.5 0 0 1 165 414" /><path d="M 885 266 A 91.5 91.5 0 0 0 885 414" />
      </g>
      {children}
    </svg>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: -34, textAlign: 'center', fontWeight: 700, fontSize: 18, letterSpacing: 3, color: '#8da0bd'}}>{label}</div>
  </div>;
};
const Dot: React.FC<{x: number; y: number; r?: number; fill?: string; label?: string; p: number; ring?: string}> = ({x, y, r = 20, fill = '#3d6fd8', label, p, ring = '#fff'}) =>
  <g transform={`translate(${x} ${y}) scale(${p})`} opacity={Math.min(1, p * 2)}>
    <circle r={r} fill={fill} stroke={ring} strokeWidth={5} />
    {label && <text y={-r - 14} textAnchor="middle" fontFamily={D} fontSize={36} fill="#fff" letterSpacing={2} stroke="#000a" strokeWidth={5} paintOrder="stroke">{label}</text>}
  </g>;
const Line: React.FC<{x1: number; y1: number; x2: number; y2: number; p: number; color?: string; w?: number; dash?: string; head?: boolean}> = ({x1, y1, x2, y2, p, color = GOLD, w = 7, dash, head = true}) => {
  const a = Math.atan2(y2 - y1, x2 - x1); const xe = lerp(x1, x2, p); const ye = lerp(y1, y2, p);
  return <g opacity={p > 0 ? 1 : 0}>
    <line x1={x1} y1={y1} x2={xe} y2={ye} stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash} />
    {head && p > .97 && <path d={`M${x2} ${y2} l${-30 * Math.cos(a - .45)} ${-30 * Math.sin(a - .45)} M${x2} ${y2} l${-30 * Math.cos(a + .45)} ${-30 * Math.sin(a + .45)}`} stroke={color} strokeWidth={w} strokeLinecap="round" fill="none" />}
  </g>;
};

// ---------------- beats ----------------
type Beat = {a: number; layout: Layout; sfx?: string; draw: (f: number) => React.ReactNode};
const colX = S.x + 20; const colW = 440; const col2 = S.x + 500;
const PBOX = (extra: Partial<Box> = {}): Box => ({x: S.x + 70, y: S.y + 20, w: 820, h: 0, ...extra});
const FP: Box = {x: F.x + 60, y: F.y + 10, w: 830, h: 0}; // pitch in a full-width beat; chips go in the right column
const RC = {x: F.x + 940, w: 470};

const BEATS: Beat[] = [
  // ================= COLD OPEN =================
  {a: 0, layout: 'split', draw: (f) => {
    const k = ramp(f, 2.2, 14);
    return <>
      <Head f={f} at={0} layout="split" kicker="BARÇA LEGENDS" title="GOALS PREVENTED?" />
      <At x={S.x + 300} y={S.y + 20} style={{...appear(ramp(f, .3)), opacity: ramp(f, .3) * (1 - .15 * k)}}>
        <svg width={360} height={420} viewBox="0 0 120 140"><path d="M60 6 L112 26 V70 C112 104 86 126 60 136 C34 126 8 104 8 70 V26 Z" fill="#12306a" stroke={GOLD} strokeWidth={5} />
          <path d="M36 70 L54 88 L88 48" fill="none" stroke={GOLD} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" /></svg>
      </At>
      <Chip f={f} at={2.5} x={S.x + 250} y={S.y + 470} w={460} big gold>GOALS PREVENTED</Chip>
    </>;
  }},
  {a: 3.62, layout: 'split', sfx: 'whoosh', draw: (f) => {
    const sc = ramp(f, 7.0, 10);
    return <>
      <Head f={f} at={3.62} layout="split" kicker="BUT RONALD KOEMAN…" title="GOALS SCORED" />
      <Big f={f} at={3.76} box={{x: S.x, y: S.y + 10, w: S.w, h: 0}} size={150} color={GOLD}>KOEMAN</Big>
      <At x={S.x + 120} y={S.y + 220} style={{...appear(ramp(f, .1)), opacity: lerp(.6, .18, sc)}}>
        <svg width={170} height={200} viewBox="0 0 120 140"><path d="M60 6 L112 26 V70 C112 104 86 126 60 136 C34 126 8 104 8 70 V26 Z" fill="#12306a" stroke="#ffffff66" strokeWidth={5} /></svg>
      </At>
      <At x={S.x + 360} y={S.y + 250} style={{...appear(sc), transform: `scale(${lerp(.4, 1, sc)})`}}><Ball size={240} /></At>
      {[0, 1, 2].map((k) => <div key={k} style={{position: 'absolute', left: S.x + 620 + k * 100, top: S.y + 410 + (k % 2) * 40, ...appear(ramp(f, 7.1 + k * .18, 8)), transform: `scale(${ramp(f, 7.1 + k * .18, 8)})`}}><Ball size={86} /></div>)}
      <Chip f={f} at={7.06} x={S.x + 250} y={S.y + 520} w={460} big gold>THE GOALS HE SCORED</Chip>
    </>;
  }},
  {a: 8.24, layout: 'split', sfx: 'riser', draw: (f) => <>
    <Head f={f} at={8.24} layout="split" kicker="ONE OF THOSE GOALS" title="CHANGED HISTORY FOREVER" />
    <At x={S.x + 250} y={S.y + 30} style={{...appear(ramp(f, 8.4)), filter: `drop-shadow(0 0 ${30 * ramp(f, 9.3)}px ${GOLD}aa)`}}><Crest width={460} id="k-b2" /></At>
    <Stamp f={f} at={9.3} box={{x: S.x, y: S.y, w: S.w, h: 0}} dy={430} size={78}>BARÇA'S HISTORY</Stamp>
  </>},
  {a: 12.36, layout: 'split', draw: (f) => {
    const p1 = slide(f, 13.2, 14.9), p2 = slide(f, 15.0, 16.4);
    return <>
      <Head f={f} at={12.36} layout="split" kicker="THIS IS THE STORY OF A…" title="THREE POSITIONS, ONE PLAYER" />
      <Pitch box={PBOX({y: S.y + 10, w: 700, x: S.x + 20})} p={ramp(f, 12.6)} label="SCHEMATIC · ROLES ON THE PITCH">
        <Line x1={150} y1={340} x2={880} y2={340} p={ramp(f, 13, 40)} color="#ffffff33" w={4} head={false} />
        <Dot x={lerp(lerp(150, 520, p1), 880, p2)} y={340} r={30} fill={GOLD} ring="#fff" p={ramp(f, 13, 8)} />
      </Pitch>
      <Chip f={f} at={13.44} x={S.x + 20} y={S.y + 500} w={210} gold>DEFENDER</Chip>
      <Chip f={f} at={14.72} x={S.x + 250} y={S.y + 500} w={230}>MIDFIELDER</Chip>
      <Chip f={f} at={16.22} x={S.x + 500} y={S.y + 500} w={190} gold>STRIKER</Chip>
    </>;
  }},
  {a: 21.0, layout: 'full', sfx: 'whoosh', draw: (f) => {
    const p = slide(f, 22.9, 24.9);
    return <>
      <Head f={f} at={21.0} layout="full" kicker="THE JOURNEY" title="FROM A FOOTBALL FAMILY TO WEMBLEY" />
      <At x={F.x + 120} y={F.y + 130} style={appear(ramp(f, 21.5))}><Flag w={240} /></At>
      <Big f={f} at={22.5} box={{x: F.x + 20, y: F.y + 330, w: 440, h: 0}} size={46} color={INK}>THE NETHERLANDS</Big>
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
        <path d={`M ${F.x + 400} ${F.y + 220} Q ${F.x + 700} ${F.y + 20} ${lerp(F.x + 400, F.x + 1000, p)} ${lerp(F.y + 220, F.y + 220, p)}`} fill="none" stroke="none" />
        <line x1={F.x + 440} y1={F.y + 215} x2={lerp(F.x + 440, F.x + 940, p)} y2={F.y + 215} stroke={GOLD} strokeWidth={8} strokeDasharray="4 18" strokeLinecap="round" />
      </svg>
      <At x={F.x + 960} y={F.y + 60} style={{...appear(ramp(f, 24.0)), filter: `drop-shadow(0 0 ${20 * ramp(f, 24.9)}px #fff8)`}}><Arch w={430} /></At>
      <Big f={f} at={24.7} box={{x: F.x + 930, y: F.y + 330, w: 500, h: 0}} size={46} color={GOLD}>WEMBLEY</Big>
    </>;
  }},
  {a: 25.78, layout: 'full', sfx: 'riser', draw: (f) => <>
    <div style={{position: 'absolute', left: F.x, top: F.y - 20, width: F.w, height: 640, background: `radial-gradient(ellipse at 50% 55%, ${GOLD}33 0%, transparent 60%)`, opacity: ramp(f, 25.9, 20)}} />
    <Big f={f} at={26.0} box={{x: F.x, y: F.y + 40, w: F.w, h: 0}} size={190} color={GOLD}>RONALD KOEMAN</Big>
    <Big f={f} at={26.6} box={{x: F.x, y: F.y + 290, w: F.w, h: 0}} size={54} color={INK}>THE DEFENDER WHO SCORED LIKE A STRIKER</Big>
  </>},
  // ================= 01 · FAMILY =================
  {a: 27.44, layout: 'split', sfx: 'whoosh', draw: (f) => <>
    <Head f={f} at={27.44} layout="split" kicker="01 · A FOOTBALLING FAMILY" title="IN HIS BLOOD" />
    <At x={S.x + 340} y={S.y + 40} style={{...appear(ramp(f, 28.0)), transform: `scale(${lerp(.8, 1.02, ramp(f, 29.6, 20))})`}}>
      <svg width={280} height={260} viewBox="0 0 120 112"><path d="M60 104 C20 74 6 52 6 34 C6 16 20 6 34 6 C46 6 55 13 60 22 C65 13 74 6 86 6 C100 6 114 16 114 34 C114 52 100 74 60 104 Z" fill="#c0233b" stroke="#fff" strokeWidth={4} /></svg>
    </At>
    <Stamp f={f} at={29.6} box={{x: S.x, y: S.y, w: S.w, h: 0}} dy={380} size={90}>KOEMAN'S BLOOD</Stamp>
  </>},
  {a: 30.62, layout: 'split', draw: (f) => <>
    <Head f={f} at={30.62} layout="split" kicker="01 · A FOOTBALLING FAMILY" title="THE KOEMANS" />
    <Person f={f} at={30.76} x={S.x + 40} y={S.y + 40} name="FATHER" sub="DUTCH INTERNATIONAL" color="#8a96b0" />
    <Person f={f} at={33.98} x={S.x + 360} y={S.y + 40} name="ERWIN" sub="OLDER BROTHER · PRO FOOTBALLER" color="#3d6fd8" w={290} />
    <Person f={f} at={26.7} x={S.x + 680} y={S.y + 30} name="RONALD" sub="THE LEGEND" color={CREST.garnet} hero />
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
      <path d={`M ${S.x + 170} ${S.y + 290} V ${S.y + 340} H ${S.x + 810} V ${S.y + 300}`} fill="none" stroke={GOLD} strokeWidth={4} strokeDasharray="1000" strokeDashoffset={1000 * (1 - ramp(f, 31.9, 30))} />
      <path d={`M ${S.x + 505} ${S.y + 340} V ${S.y + 300}`} fill="none" stroke={GOLD} strokeWidth={4} opacity={ramp(f, 34.4)} />
    </svg>
    <Chip f={f} at={32.0} x={S.x + 40} y={S.y + 420} w={420}>PLAYED FOR THE DUTCH NATIONAL TEAM</Chip>
    <Chip f={f} at={36.0} x={S.x + 500} y={S.y + 420} w={430}>A PROFESSIONAL FOOTBALLER TOO</Chip>
  </>},
  {a: 37.46, layout: 'split', sfx: 'riser', draw: (f) => <>
    <Head f={f} at={37.46} layout="split" kicker="01 · A FOOTBALLING FAMILY" title="CALLED UP TOGETHER" />
    <Year f={f} at={37.56} box={{x: S.x, y: S.y, w: S.w, h: 0}} text="1983" size={320} />
    <At x={S.x + 40} y={S.y + 400} style={appear(ramp(f, 38.9))}><Flag w={150} /></At>
    <Chip f={f} at={39.02} x={S.x + 220} y={S.y + 400} w={300} big>BOTH BROTHERS</Chip>
    <Chip f={f} at={40.58} x={S.x + 220} y={S.y + 490} w={560} gold>CALLED UP · THE NETHERLANDS</Chip>
  </>},
  {a: 41.96, layout: 'split', draw: (f) => {
    const p = slide(f, 43.9, 45.0);
    return <>
      <Head f={f} at={41.96} layout="split" kicker="1983 · THE MOVE" title="GRONINGEN → AJAX" />
      <ClubTile f={f} at={43.12} x={S.x + 20} y={S.y + 60} name="GRONINGEN" sub="WHERE IT STARTED" a="#2e8b57" b="#f5f4ef" w={330} />
      <Arrow x1={S.x + 380} y1={S.y + 150} x2={S.x + 560} y2={S.y + 150} p={p} />
      <ClubTile f={f} at={44.76} x={S.x + 590} y={S.y + 60} name="AJAX" sub="AMSTERDAM" a="#e0243a" b="#f5f4ef" w={330} />
      <Year f={f} at={42.4} box={{x: S.x, y: S.y, w: S.w, h: 0}} text="1983" size={160} dy={290} color={MUTED} />
    </>;
  }},
  {a: 46.02, layout: 'split', sfx: 'pop', draw: (f) => <>
    <Head f={f} at={46.02} layout="split" kicker="AT AJAX" title="DUTCH LEAGUE CHAMPION" />
    <At x={S.x + 40} y={S.y + 20} style={appear(ramp(f, 46.4))}><Trophy w={300} id="k-aj" glow={ramp(f, 47.1)} /></At>
    <Chip f={f} at={46.88} x={col2 - 80} y={S.y + 80} w={500} big gold>DUTCH LEAGUE</Chip>
    <Chip f={f} at={47.82} x={col2 - 80} y={S.y + 200} w={500} big>HIS SECOND SEASON</Chip>
  </>},
  {a: 48.84, layout: 'split', draw: (f) => <>
    <Head f={f} at={48.84} layout="split" kicker="EVEN BACK THEN" title="SOMETHING DIFFERENT" />
    <Big f={f} at={49.96} box={{x: S.x, y: S.y + 30, w: S.w, h: 0}} size={120} color={INK}>THERE WAS</Big>
    <Stamp f={f} at={50.62} box={{x: S.x, y: S.y, w: S.w, h: 0}} dy={230} size={118}>SOMETHING DIFFERENT</Stamp>
    <Note f={f} at={51.1} x={S.x + 40} y={S.y + 500} w={880}>ABOUT HIM</Note>
  </>},
  {a: 52.0, layout: 'split', draw: (f) => {
    const cross = ramp(f, 55.66, 10);
    return <>
      <Head f={f} at={52.0} layout="split" kicker="NOT THAT KIND OF DEFENDER" title="NOT JUST CLEARING IT AWAY" />
      <Chip f={f} at={53.84} x={S.x + 40} y={S.y + 40} w={420} big>WIN THE BALL</Chip>
      <Note f={f} at={52.18} x={S.x + 40} y={S.y + 150} w={880}>HE WASN'T THE KIND OF DEFENDER WHO SIMPLY…</Note>
      <Arrow x1={S.x + 480} y1={S.y + 80} x2={S.x + 580} y2={S.y + 80} p={ramp(f, 54.9, 14)} color={MUTED} />
      <Chip f={f} at={55.38} x={S.x + 600} y={S.y + 40} w={330} big>CLEAR IT AWAY</Chip>
      <div style={{position: 'absolute', left: S.x + 590, top: S.y + 80, width: 350 * cross, height: 8, background: RED, borderRadius: 4, transform: 'rotate(-2deg)', transformOrigin: '0 50%'}} />
      <Stamp f={f} at={55.8} box={{x: S.x, y: S.y, w: S.w, h: 0}} dy={330} red size={96} rot={-3}>NOT HIS STYLE</Stamp>
    </>;
  }},
  {a: 56.24, layout: 'split', draw: (f) => {
    const nodes: [number, number][] = [[110, 340], [300, 130], [330, 520], [560, 330], [820, 180], [830, 500]];
    return <>
      <Head f={f} at={56.24} layout="split" kicker="HE WANTED THE BALL" title="POSSESSION AND ATTACKS" />
      <svg style={{position: 'absolute', left: S.x + 10, top: S.y + 10, overflow: 'visible'}} width={940} height={600}>
        {[[0, 1], [1, 3], [0, 2], [2, 3], [3, 4], [3, 5]].map(([a, b], k) => <Line key={k} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} p={ramp(f, 58.9 + k * .22, 14)} color="#ffffff55" w={5} head={false} />)}
        {nodes.map(([x, y], k) => <Dot key={k} x={x} y={y} r={k === 0 ? 30 : 22} fill={k === 0 ? GOLD : '#3d6fd8'} p={ramp(f, 57.0 + k * .2, 9)} />)}
      </svg>
      <Chip f={f} at={56.88} x={S.x + 40} y={S.y + 500} w={330} big gold>POSSESSION</Chip>
      <Chip f={f} at={59.08} x={S.x + 400} y={S.y + 500} w={380} big>BUILD ATTACKS</Chip>
    </>;
  }},
  {a: 60.72, layout: 'split', draw: (f) => <>
    <Head f={f} at={60.72} layout="split" kicker="SET PIECES" title="HE WANTED TO TAKE THEM" />
    <At x={S.x + 60} y={S.y + 60} style={{...appear(ramp(f, 62.0)), transform: `scale(${lerp(.6, 1, ramp(f, 62.0))})`}}><Ball size={250} /></At>
    <Chip f={f} at={62.16} x={col2 - 120} y={S.y + 90} w={560} big gold>FREE KICK</Chip>
    <Chip f={f} at={63.3} x={col2 - 120} y={S.y + 210} w={560} big>HE WANTED TO BE THE ONE</Chip>
    <Chip f={f} at={63.94} x={col2 - 120} y={S.y + 330} w={560} gold>TAKING IT</Chip>
  </>},
  // ================= 02 · PSV =================
  {a: 64.84, layout: 'split', sfx: 'whoosh', draw: (f) => {
    const p = slide(f, 65.4, 66.4);
    return <>
      <Head f={f} at={64.84} layout="split" kicker="02 · THE PSV SUPERSTAR" title="THE MOVE TO EINDHOVEN" />
      <ClubTile f={f} at={64.9} x={S.x + 20} y={S.y + 60} name="AJAX" sub="AMSTERDAM" a="#e0243a" b="#f5f4ef" w={330} />
      <Arrow x1={S.x + 380} y1={S.y + 150} x2={S.x + 560} y2={S.y + 150} p={p} />
      <ClubTile f={f} at={66.24} x={S.x + 590} y={S.y + 60} name="PSV" sub="EINDHOVEN" a="#d1202f" b="#f5f4ef" w={330} />
      <Note f={f} at={66.7} x={S.x + 590} y={S.y + 330} w={330}>PSV EINDHOVEN</Note>
    </>;
  }},
  {a: 67.7, layout: 'split', sfx: 'riser', draw: (f) => {
    const k = ramp(f, 70.08, 10);
    return <>
      <Head f={f} at={67.7} layout="split" kicker="AT PSV" title="HE BECAME A SUPERSTAR" />
      <svg style={{position: 'absolute', left: S.x + 330, top: S.y + 30, opacity: k}} width={300} height={300} viewBox="-50 -50 100 100">
        {Array.from({length: 12}, (_, i) => <path key={i} d="M 0 -48 L 5 -28 L -5 -28 Z" fill={GOLD} transform={`rotate(${i * 30})`} />)}
        <path d="M0 -26 L7 -8 L26 -8 L11 4 L17 23 L0 12 L-17 23 L-11 4 L-26 -8 L-7 -8 Z" fill={GOLD} stroke="#5a4100" strokeWidth={2} />
      </svg>
      <Big f={f} at={68.7} box={{x: S.x, y: S.y + 30, w: S.w, h: 0}} size={110} color={INK} align="center">KOEMAN</Big>
      <Stamp f={f} at={69.72} box={{x: S.x, y: S.y, w: S.w, h: 0}} dy={380} size={110}>SUPERSTAR</Stamp>
    </>;
  }},
  {a: 71.04, layout: 'split', draw: (f) => {
    const m = interpolate(f, [sec(73.6), sec(75.2)], [0, 1], clamp); const s = interpolate(f, [sec(76.0), sec(77.8)], [0, 1], clamp);
    const Bar: React.FC<{y: number; label: string; k: number; at: number; c: string}> = ({y, label, k, at, c}) => <>
      <div style={{position: 'absolute', left: S.x + 20, top: y, width: 900, ...appear(ramp(f, at - 1.0, 10)), fontWeight: 900, fontSize: 28, letterSpacing: 3, color: INK}}>{label}</div>
      <div style={{position: 'absolute', left: S.x + 20, top: y + 50, width: 900, height: 46, borderRadius: 23, background: '#ffffff18', opacity: ramp(f, at - 1.0, 10)}}>
        <div style={{width: `${k * 96}%`, height: 46, borderRadius: 23, background: `linear-gradient(90deg, #3d6fd8, ${c})`, boxShadow: `0 0 28px ${c}88`}} /></div></>;
    return <>
      <Head f={f} at={71.04} layout="split" kicker="IMAGINE A CENTRE-BACK…" title="A MIDFIELDER'S PASSING, A STRIKER'S SHOT" />
      <Bar y={S.y + 40} label="DISTRIBUTES LIKE A WORLD-CLASS MIDFIELDER" k={m} at={72.54} c={GOLD} />
      <Bar y={S.y + 220} label="STRIKES WITH THE POWER OF A TOP STRIKER" k={s} at={75.54} c={ORANGE} />
      <Note f={f} at={77.4} x={S.x + 20} y={S.y + 420} w={900}>ILLUSTRATIVE · NOT A STATISTIC</Note>
    </>;
  }},
  {a: 78.4, layout: 'split', sfx: 'pop', draw: (f) => <>
    <Head f={f} at={78.4} layout="split" kicker="IT DIDN'T MATTER HOW" title="FREE KICKS, PENALTIES, LONG SHOTS" />
    {[['FREE KICKS', 78.68, 'free'], ['PENALTIES', 79.28, 'pen'], ['LONG-RANGE SHOTS', 80.18, 'long']].map(([t, at, k], i) => <div key={t as string} style={{position: 'absolute', left: S.x + 20 + i * 320, top: S.y + 40, width: 290, height: 360, borderRadius: 22, background: '#0a1430ee', border: `2px solid ${GOLD}66`, ...appear(ramp(f, at as number, 10), 30), textAlign: 'center', boxShadow: '0 18px 40px #0008'}}>
      <div style={{marginTop: 34}}><Ball size={130} /></div>
      <div style={{fontFamily: D, fontSize: 54, color: GOLD, marginTop: 26, lineHeight: 1.05, padding: '0 12px'}}>{t}</div>
      <div style={{fontSize: 80, color: '#fff', fontFamily: D}}>{i + 1}</div></div>)}
    <Note f={f} at={81.54} x={S.x + 20} y={S.y + 450} w={900}>IT DIDN'T REALLY MATTER</Note>
  </>},
  {a: 82.66, layout: 'split', draw: (f) => {
    const shot = slide(f, 84.46, 85.4);
    return <>
      <Head f={f} at={82.66} layout="split" kicker="GIVE KOEMAN A CHANCE" title="THE KEEPER WAS IN TROUBLE" />
      <div style={{position: 'absolute', left: S.x + 160, top: S.y + 20, width: 640, height: 360, ...appear(ramp(f, 82.9)), border: '16px solid #f5f4ef', borderBottom: 'none', borderRadius: '10px 10px 0 0', backgroundImage: 'repeating-linear-gradient(45deg,#ffffff22 0 2px,transparent 2px 28px),repeating-linear-gradient(-45deg,#ffffff22 0 2px,transparent 2px 28px)'}} />
      <At x={lerp(S.x + 380, S.x + 640, shot)} y={lerp(S.y + 520, S.y + 120, shot)} style={{opacity: ramp(f, 83.5), transform: `scale(${lerp(1.4, .5, shot)})`}}><Ball size={150} /></At>
      <Chip f={f} at={85.34} x={S.x + 250} y={S.y + 440} w={470} big red>GOALKEEPER IN TROUBLE</Chip>
    </>;
  }},
  {a: 87.2, layout: 'split', sfx: 'riser', draw: (f) => <>
    <Head f={f} at={87.2} layout="split" kicker="02 · THE PSV SUPERSTAR" title="SOMETHING EXTRAORDINARY" />
    <Year f={f} at={87.3} box={{x: S.x, y: S.y, w: S.w, h: 0}} text="1988" size={330} />
    <ClubTile f={f} at={88.56} x={S.x + 320} y={S.y + 400} name="PSV" sub="EINDHOVEN" a="#d1202f" b="#f5f4ef" w={320} />
  </>},
  {a: 90.92, layout: 'split', sfx: 'pop', draw: (f) => {
    const items: [string, number][] = [['DUTCH LEAGUE', 91.74], ['DUTCH CUP', 92.74], ['EUROPEAN CUP', 94.04]];
    return <>
      <Head f={f} at={90.92} layout="split" kicker="1988 · PSV" title="A HISTORIC TREBLE" />
      {items.map(([t, at], i) => <div key={t} style={{position: 'absolute', left: S.x + 20 + i * 318, top: S.y + 30, width: 300, textAlign: 'center', ...appear(ramp(f, at - .2, 10), 30)}}>
        <Trophy w={170} id={`k-tr${i}`} glow={ramp(f, at + .2)} />
        <div style={{fontFamily: D, fontSize: 40, color: INK, marginTop: 8}}>{t}</div>
        <div style={{display: 'inline-block', marginTop: 8}}><Tick size={44} on={ramp(f, at + .1) > .5} /></div></div>)}
      <Stamp f={f} at={96.0} box={{x: S.x, y: S.y, w: S.w, h: 0}} dy={440} size={110}>THE TREBLE</Stamp>
    </>;
  }},
  {a: 96.94, layout: 'split', draw: (f) => {
    const dots = [1, 1, 1, 1, 1, 0];
    return <>
      <Head f={f} at={96.94} layout="split" kicker="THE EUROPEAN CUP FINAL" title="ALL THE WAY TO PENALTIES" />
      <ClubTile f={f} at={97.8} x={S.x + 20} y={S.y + 40} name="PSV" sub="1988" a="#d1202f" b="#f5f4ef" w={330} />
      <Big f={f} at={98.1} box={{x: S.x + 350, y: S.y + 70, w: 260, h: 0}} size={72} color={MUTED}>V</Big>
      <ClubTile f={f} at={98.5} x={S.x + 610} y={S.y + 40} name="BENFICA" sub="LISBON" a="#c8102e" b="#f5f4ef" w={330} />
      <Stamp f={f} at={100.74} box={{x: S.x, y: S.y, w: S.w, h: 0}} dy={290} size={100}>PENALTIES</Stamp>
      <div style={{position: 'absolute', left: S.x + 220, top: S.y + 470, display: 'flex', gap: 22}}>{dots.map((d, i) => <div key={i} style={{width: 60, height: 60, borderRadius: 30, background: i < 5 ? GOLD : '#ffffff22', border: '4px solid #fff', ...appear(ramp(f, 100.9 + i * .18, 8), 8)}} />)}</div>
    </>;
  }},
  {a: 102.04, layout: 'split', sfx: 'pop', draw: (f) => {
    const score = ramp(f, 104.12, 8);
    return <>
      <Head f={f} at={102.04} layout="split" kicker="AND OF COURSE…" title="KOEMAN STEPS UP" />
      <At x={S.x + 340} y={S.y + 40} style={{...appear(ramp(f, 102.4)), transform: `scale(${lerp(1, 1.18, ramp(f, 103.0, 50))})`}}><Ball size={200} /></At>
      <Person f={f} at={102.9} x={S.x + 60} y={S.y + 40} name="KOEMAN" color={RED} hero />
      <Stamp f={f} at={104.12} box={{x: S.x, y: S.y, w: S.w, h: 0}} dy={340} size={104}>HE SCORES</Stamp>
      <div style={{position: 'absolute', left: S.x + 700, top: S.y + 70, opacity: score, transform: `scale(${lerp(.4, 1, score)})`}}><Tick size={150} on /></div>
    </>;
  }},
  {a: 105.06, layout: 'split', sfx: 'riser', draw: (f) => <>
    <Head f={f} at={105.06} layout="split" kicker="CHAMPIONS OF EUROPE" title="PSV'S FIRST EUROPEAN CUP" />
    <At x={S.x + 30} y={S.y + 10} style={appear(ramp(f, 105.4))}><Trophy w={290} id="k-ec" glow={ramp(f, 106.4)} /></At>
    <Chip f={f} at={106.98} x={col2 - 100} y={S.y + 40} w={540} big gold>FIRST TIME IN THEIR HISTORY</Chip>
    <Chip f={f} at={110.36} x={col2 - 100} y={S.y + 200} w={540} big>ONE OF EUROPE'S MOST SOUGHT-AFTER DEFENDERS</Chip>
  </>},
  // ================= 03 · EURO 88 =================
  {a: 112.94, layout: 'split', sfx: 'whoosh', draw: (f) => <>
    <Head f={f} at={112.94} layout="split" kicker="03 · EURO 88" title="THAT SUMMER, A EUROPEAN CHAMPION" />
    <Year f={f} at={113.1} box={{x: S.x, y: S.y - 10, w: S.w, h: 0}} text="1988" size={190} color={ORANGE} />
    <At x={S.x + 40} y={S.y + 270} style={appear(ramp(f, 116.4))}><Flag w={220} /></At>
    <Chip f={f} at={117.58} x={S.x + 300} y={S.y + 270} w={520} big gold>THE NETHERLANDS</Chip>
    <Chip f={f} at={118.64} x={S.x + 300} y={S.y + 370} w={520}>EUROPEAN CHAMPIONSHIP</Chip>
    <Chip f={f} at={120.0} x={S.x + 300} y={S.y + 450} w={520}>WEST GERMANY</Chip>
  </>},
  {a: 120.94, layout: 'split', draw: (f) => <>
    <Head f={f} at={120.94} layout="split" kicker="LOOK AT THE PLAYERS AROUND HIM" title="AN ORANGE GENERATION" />
    <Person f={f} at={123.48} x={S.x + 10} y={S.y + 60} name="GULLIT" sub="RUUD" color={ORANGE} w={300} />
    <Person f={f} at={124.36} x={S.x + 330} y={S.y + 60} name="VAN BASTEN" sub="MARCO" color={ORANGE} w={300} />
    <Person f={f} at={125.7} x={S.x + 650} y={S.y + 60} name="RIJKAARD" sub="FRANK" color={ORANGE} w={300} />
    <Chip f={f} at={126.98} x={S.x + 280} y={S.y + 400} w={400} big gold style={{textAlign: 'center'}}>+ KOEMAN</Chip>
  </>},
  {a: 126.76, layout: 'split', draw: (f) => <>
    <Head f={f} at={126.76} layout="split" kicker="03 · EURO 88" title="AN INCREDIBLE GENERATION" />
    {[['GULLIT', 10], ['VAN BASTEN', 250], ['RIJKAARD', 520], ['KOEMAN', 740]].map(([n, x], i) => <div key={n as string} style={{position: 'absolute', left: S.x + (x as number), top: S.y + 60, width: 220, textAlign: 'center', ...appear(ramp(f, 126.9 + i * .2, 9))}}>
      <Shirt w={150} color={n === 'KOEMAN' ? CREST.garnet : ORANGE} trim={n === 'KOEMAN' ? GOLD : '#fff'} />
      <div style={{fontFamily: D, fontSize: n === 'VAN BASTEN' ? 34 : 40, color: n === 'KOEMAN' ? GOLD : INK, whiteSpace: 'nowrap'}}>{n}</div></div>)}
    <Stamp f={f} at={128.14} box={{x: S.x, y: S.y, w: S.w, h: 0}} dy={400} size={86}>DUTCH FOOTBALLERS</Stamp>
  </>},
  {a: 129.52, layout: 'split', draw: (f) => <>
    <Head f={f} at={129.52} layout="split" kicker="THE MAN LEADING THEM" title="THE COACH" />
    <Person f={f} at={131.06} x={S.x + 330} y={S.y + 30} name="RINUS MICHELS" sub="THE LEGENDARY COACH" color="#3d6fd8" hero w={300} />
    <At x={S.x + 40} y={S.y + 350} style={appear(ramp(f, 130.1))}><Flag w={120} /></At>
    <Chip f={f} at={130.3} x={S.x + 190} y={S.y + 370} w={560} big>HEAD COACH · THE NETHERLANDS</Chip>
  </>},
  {a: 132.1, layout: 'split', sfx: 'whoosh', draw: (f) => <>
    <Head f={f} at={132.1} layout="split" kicker="HIS CONNECTION TO BARÇA" title="MICHELS BROUGHT CRUYFF" />
    <Person f={f} at={132.2} x={S.x + 10} y={S.y + 40} name="MICHELS" sub="COACH" w={260} />
    <Arrow x1={S.x + 250} y1={S.y + 160} x2={S.x + 400} y2={S.y + 160} p={ramp(f, 133.4, 14)} />
    <Person f={f} at={133.66} x={S.x + 400} y={S.y + 40} name="JOHAN CRUYFF" color={ORANGE} w={300} />
    <Arrow x1={S.x + 700} y1={S.y + 160} x2={S.x + 790} y2={S.y + 160} p={ramp(f, 134.4, 12)} />
    <At x={S.x + 780} y={S.y + 60} style={appear(ramp(f, 134.62))}><Crest width={170} id="k-m28" /></At>
    <Chip f={f} at={135.08} x={S.x + 240} y={S.y + 400} w={500} big gold>YEARS EARLIER</Chip>
  </>},
  {a: 136.68, layout: 'split', draw: (f) => <>
    <Head f={f} at={136.68} layout="split" kicker="03 · EURO 88" title="A CONNECTION THAT MATTERED" />
    <Person f={f} at={136.9} x={S.x + 10} y={S.y + 40} name="MICHELS" w={240} />
    <Person f={f} at={137.2} x={S.x + 340} y={S.y + 40} name="CRUYFF" color={ORANGE} w={240} />
    <Person f={f} at={140.6} x={S.x + 680} y={S.y + 30} name="KOEMAN" color={CREST.garnet} hero w={260} />
    <Arrow x1={S.x + 230} y1={S.y + 150} x2={S.x + 350} y2={S.y + 150} p={ramp(f, 138.0, 14)} />
    <Arrow x1={S.x + 560} y1={S.y + 150} x2={S.x + 690} y2={S.y + 150} p={ramp(f, 139.3, 18)} color={GOLD} />
    <Chip f={f} at={138.56} x={S.x + 220} y={S.y + 400} w={520} big gold>THAT CONNECTION</Chip>
    <Chip f={f} at={141.28} x={S.x + 220} y={S.y + 490} w={520}>PART OF KOEMAN'S OWN HISTORY</Chip>
  </>},
  // ================= 04 · CRUYFF =================
  {a: 142.94, layout: 'split', sfx: 'riser', draw: (f) => <>
    <Head f={f} at={142.94} layout="split" kicker="04 · CRUYFF'S PERFECT DEFENDER" title="BARCELONA CAME CALLING" />
    <Year f={f} at={143.1} box={{x: S.x, y: S.y, w: S.w, h: 0}} text="1989" size={310} />
    <At x={S.x + 380} y={S.y + 400} style={appear(ramp(f, 144.44))}><Crest width={200} id="k-1989" /></At>
  </>},
  {a: 145.88, layout: 'split', draw: (f) => <>
    <Head f={f} at={145.88} layout="split" kicker="NOT JUST ANY TRANSFER" title="CRUYFF WANTED HIM" />
    <Stamp f={f} at={146.4} box={{x: S.x, y: S.y, w: S.w, h: 0}} dy={10} size={70} rot={-3}>NOT JUST ANY TRANSFER</Stamp>
    <Person f={f} at={148.32} x={S.x + 120} y={S.y + 190} name="JOHAN CRUYFF" color={ORANGE} w={300} />
    <Person f={f} at={149.9} x={S.x + 540} y={S.y + 190} name="KOEMAN" color={CREST.garnet} hero w={300} />
    <Arrow x1={S.x + 430} y1={S.y + 310} x2={S.x + 530} y2={S.y + 310} p={ramp(f, 149.2, 12)} />
    <Chip f={f} at={152.46} x={S.x + 250} y={S.y + 500} w={460} big gold style={{textAlign: 'center'}}>A VERY GOOD REASON</Chip>
  </>},
  {a: 153.88, layout: 'split', sfx: 'whoosh', draw: (f) => <>
    <Head f={f} at={153.88} layout="split" kicker="CRUYFF BELIEVED…" title="BUILT FROM THE BACK" />
    <Pitch box={PBOX({y: S.y + 30})} p={ramp(f, 154.0)}>
      <Dot x={90} y={340} r={26} fill="#8a96b0" label="GK" p={ramp(f, 154.4, 8)} />
      <Dot x={250} y={200} fill="#3d6fd8" p={ramp(f, 154.8, 8)} /><Dot x={250} y={480} fill="#3d6fd8" p={ramp(f, 154.8, 8)} />
      <Dot x={500} y={340} fill="#3d6fd8" p={ramp(f, 155.1, 8)} /><Dot x={780} y={190} fill={GOLD} p={ramp(f, 155.3, 8)} /><Dot x={780} y={490} fill={GOLD} p={ramp(f, 155.3, 8)} />
      <Line x1={115} y1={330} x2={228} y2={218} p={ramp(f, 155.2, 10)} /><Line x1={270} y1={215} x2={480} y2={325} p={ramp(f, 155.6, 10)} /><Line x1={525} y1={320} x2={760} y2={205} p={ramp(f, 156.0, 10)} />
    </Pitch>
  </>},
  {a: 156.6, layout: 'split', draw: (f) => {
    const x = ramp(f, 158.5, 8);
    return <>
      <Head f={f} at={156.6} layout="split" kicker="WHAT CRUYFF WANTED" title="MORE THAN A DEFENDER" />
      <Chip f={f} at={157.0} x={colX} y={S.y + 40} w={300} red style={{textDecoration: x > .5 ? 'line-through' : undefined}}>SIMPLY DEFENDED</Chip>
      <Checks f={f} x={col2 - 40} y={S.y + 30} items={[['CONTROL THE GAME', 161.44], ['CREATE SPACE', 162.72], ['LAUNCH ATTACKS', 163.94]]} size={34} gap={92} />
      <Note f={f} at={159.52} x={colX} y={S.y + 440} w={880}>DEFENDERS WHO COULD CONTROL THE GAME, CREATE SPACE AND LAUNCH ATTACKS</Note>
    </>;
  }},
  {a: 164.84, layout: 'split', draw: (f) => <>
    <Head f={f} at={164.84} layout="split" kicker="04 · CRUYFF'S PERFECT DEFENDER" title="EXACTLY THAT KIND OF PLAYER" />
    <Person f={f} at={165.58} x={S.x + 30} y={S.y + 40} name="KOEMAN" color={CREST.garnet} hero w={300} />
    <Checks f={f} x={col2 - 40} y={S.y + 60} items={[['CONTROLS THE GAME', 166.4], ['CREATES SPACE', 166.74], ['LAUNCHES ATTACKS', 167.22]]} size={32} gap={86} />
  </>},
  {a: 168.36, layout: 'split', draw: (f) => {
    const p = slide(f, 171.5, 173.1);
    return <>
      <Head f={f} at={168.36} layout="split" kicker="IN CRUYFF'S SYSTEM" title="THE FIRST PLAYMAKER" />
      <Pitch box={PBOX({y: S.y + 20, w: 760, x: S.x + 100})} p={ramp(f, 168.5)}>
        <Dot x={lerp(210, 470, p)} y={340} r={30} fill={GOLD} p={ramp(f, 169.4, 8)} label="KOEMAN" />
        <Line x1={210} y1={420} x2={470} y2={420} p={ramp(f, 171.5, 30)} color="#ffffff55" w={5} head={false} />
      </Pitch>
      <Chip f={f} at={170.76} x={S.x + 40} y={S.y + 560} w={330}>CENTRE-BACK</Chip>
      <Arrow x1={S.x + 390} y1={S.y + 592} x2={S.x + 490} y2={S.y + 592} p={ramp(f, 172.0, 12)} />
      <Chip f={f} at={173.08} x={S.x + 510} y={S.y + 560} w={400} gold big>FIRST PLAYMAKER</Chip>
    </>;
  }},
  {a: 174.28, layout: 'full', sfx: 'whoosh', draw: (f) => {
    const p = slide(f, 178.2, 179.5);
    return <>
      <Head f={f} at={174.28} layout="full" kicker="HE COULD PICK UP THE BALL DEEP, LOOK UP…" title="A 40-METRE PASS" />
      <Pitch box={FP} p={ramp(f, 174.4)} label="SCHEMATIC · ILLUSTRATES THE PASS, NOT A REAL MATCH">
        <Dot x={240} y={360} r={26} fill={GOLD} label="KOEMAN" p={ramp(f, 175.3, 8)} />
        <Dot x={650} y={240} r={22} fill={ORANGE} label="LAUDRUP" p={ramp(f, 180.74, 8)} />
        <Dot x={650} y={500} r={22} fill={ORANGE} label="STOICHKOV" p={ramp(f, 182.02, 8)} />
        <Line x1={270} y1={350} x2={620} y2={252} p={p} /><Line x1={270} y1={372} x2={620} y2={488} p={ramp(f, 181.0, 20)} color="#ffffff88" dash="2 14" />
      </Pitch>
      <div style={{position: 'absolute', left: F.x + 400, top: F.y + 150, ...appear(ramp(f, 178.88))}}><span style={{fontFamily: D, fontSize: 84, color: GOLD, background: '#07102ae0', padding: '0 24px', borderRadius: 14, border: `5px solid ${GOLD}`}}>40 M</span></div>
      <Chip f={f} at={175.32} x={RC.x} y={F.y + 40} w={RC.w} big>DEEP IN HIS OWN HALF</Chip>
      <Chip f={f} at={177.4} x={RC.x} y={F.y + 140} w={RC.w} big>LOOK UP</Chip>
      <Chip f={f} at={178.88} x={RC.x} y={F.y + 240} w={RC.w} big gold>A 40-METRE PASS</Chip>
    </>;
  }},
  {a: 183.6, layout: 'full', draw: (f) => {
    const who = ramp(f, 188.9, 10);
    return <>
      <Head f={f} at={183.6} layout="full" kicker="A FREE KICK NEAR THE PENALTY AREA" title="EVERYONE KNEW WHO WAS TAKING IT" />
      <Pitch box={FP} p={ramp(f, 183.7)}>
        <rect x={885} y={138.5} width={165} height={403} fill={GOLD} opacity={.1 * ramp(f, 186.2)} />
        <g transform={`translate(740 250) scale(${ramp(f, 185.14, 8)})`}><circle r={20} fill="#f7f5ef" stroke="#111" strokeWidth={5} /></g>
        <Dot x={690} y={290} r={26} fill={GOLD} label="KOEMAN" p={who} />
      </Pitch>
      <Chip f={f} at={185.14} x={RC.x} y={F.y + 40} w={RC.w} big>A FREE KICK</Chip>
      <Chip f={f} at={186.26} x={RC.x} y={F.y + 140} w={RC.w} big>NEAR THE PENALTY AREA</Chip>
      <Chip f={f} at={188.9} x={RC.x} y={F.y + 240} w={RC.w} big gold>KOEMAN TAKES IT</Chip>
    </>;
  }},
  {a: 190.34, layout: 'split', draw: (f) => {
    const blocks = ['LAUDRUP', 'STOICHKOV', 'KOEMAN'];
    return <>
      <Head f={f} at={190.34} layout="split" kicker="CRUYFF'S LEGENDARY TEAM" title="ONE OF THE FOUNDATIONS" />
      <div style={{position: 'absolute', left: S.x + 160, top: S.y + 40, width: 640, textAlign: 'center', fontFamily: D, fontSize: 56, color: MUTED, ...appear(ramp(f, 193.46))}}>CRUYFF'S TEAM</div>
      <div style={{position: 'absolute', left: S.x + 160, top: S.y + 120, width: 640, height: 130, borderRadius: 14, background: 'linear-gradient(90deg,#0c3a8f,#7a0a37)', border: `4px solid ${GOLD}`, ...appear(ramp(f, 193.0), 40), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D, fontSize: 62, color: '#fff'}}>THE TEAM</div>
      <div style={{position: 'absolute', left: S.x + 280, top: S.y + 280, width: 400, height: 110, borderRadius: 14, background: GOLD, color: '#1a1200', fontFamily: D, fontSize: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', ...appear(ramp(f, 192.06), -30), boxShadow: '0 0 40px #f2c23088'}}>KOEMAN</div>
      <Note f={f} at={192.6} x={S.x + 160} y={S.y + 420} w={640}>{blocks.length > 0 ? 'A FOUNDATION OF THE TEAM' : ''}</Note>
    </>;
  }},
  {a: 194.88, layout: 'split', sfx: 'pop', draw: (f) => {
    const t = [196.24, 196.6, 197.0, 197.42];
    return <>
      <Head f={f} at={194.88} layout="split" kicker="TOGETHER" title="FOUR LA LIGA TITLES IN A ROW" />
      {t.map((at, i) => <div key={i} style={{position: 'absolute', left: S.x + 20 + i * 235, top: S.y + 60, width: 215, textAlign: 'center', ...appear(ramp(f, at, 9), 26)}}>
        <Trophy w={140} id={`k-ll${i}`} glow={ramp(f, at + .2)} />
        <div style={{fontFamily: D, fontSize: 70, color: GOLD, lineHeight: 1}}>{i + 1}</div></div>)}
      <Chip f={f} at={196.24} x={S.x + 150} y={S.y + 400} w={660} big gold style={{textAlign: 'center'}}>FOUR CONSECUTIVE LA LIGA TITLES</Chip>
    </>;
  }},
  // ================= 05 · WEMBLEY =================
  {a: 198.4, layout: 'split', sfx: 'riser', draw: (f) => <>
    <Head f={f} at={198.4} layout="split" kicker="05 · WEMBLEY 1992" title="HIS GREATEST MOMENT" />
    <Year f={f} at={201.12} box={{x: S.x, y: S.y, w: S.w, h: 0}} text="1992" size={330} />
    <Chip f={f} at={198.74} x={S.x + 140} y={S.y + 470} w={680} big gold style={{textAlign: 'center'}}>IN A BARCELONA SHIRT</Chip>
  </>},
  {a: 202.2, layout: 'split', sfx: 'whoosh', draw: (f) => <>
    <Head f={f} at={202.2} layout="split" kicker="THE EUROPEAN CUP FINAL" title="WEMBLEY STADIUM" />
    <At x={S.x + 240} y={S.y + 20} style={{...appear(ramp(f, 202.4)), filter: `drop-shadow(0 0 ${24 * ramp(f, 202.9)}px #fff8)`}}><Arch w={480} /></At>
    <div style={{position: 'absolute', left: S.x + 40, top: S.y + 300, display: 'flex', alignItems: 'center', gap: 30}}>
      <div style={appear(ramp(f, 202.82)) as React.CSSProperties}><Crest width={150} id="k-w1" /></div>
      <Big f={f} at={202.9} box={{x: S.x + 200, y: S.y + 300, w: 300, h: 0}} size={64}>BARCELONA</Big>
    </div>
    <Big f={f} at={203.4} box={{x: S.x + 440, y: S.y + 315, w: 80, h: 0}} size={46} color={MUTED}>V</Big>
    <ClubTile f={f} at={203.84} x={S.x + 560} y={S.y + 300} name="SAMPDORIA" sub="GENOA" a="#2257c4" b="#f5f4ef" w={360} />
    <Chip f={f} at={204.76} x={S.x + 250} y={S.y + 500} w={470} big gold style={{textAlign: 'center'}}>EUROPEAN CUP FINAL</Chip>
  </>},
  {a: 206.32, layout: 'split', draw: (f) => {
    const et = ramp(f, 208.72, 10);
    return <>
      <Head f={f} at={206.32} layout="split" kicker="THE MATCH" title="STILL GOALLESS" />
      <div style={{position: 'absolute', left: S.x + 60, top: S.y + 30, width: 840, height: 300, borderRadius: 30, background: '#07102aee', border: `4px solid #ffffff33`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 50, fontFamily: D, ...appear(ramp(f, 206.4))}}>
        <div style={{fontSize: 70, color: INK, width: 250, textAlign: 'right'}}>BARÇA</div>
        <div style={{fontSize: 250, color: GOLD, lineHeight: 1, opacity: ramp(f, 207.56)}}>0–0</div>
        <div style={{fontSize: 70, color: INK, width: 250}}>SAMP.</div>
      </div>
      <div style={{position: 'absolute', left: S.x + 60, top: S.y + 380, width: 840, height: 16, borderRadius: 8, background: '#ffffff1f'}}>
        <div style={{width: `${75 * 1}%`, height: 16, borderRadius: 8, background: '#3d6fd8'}} />
        <div style={{position: 'absolute', left: '75%', top: 0, width: `${25 * et}%`, height: 16, borderRadius: 8, background: `linear-gradient(90deg, ${GOLD}, ${ORANGE})`}} />
      </div>
      <Chip f={f} at={208.72} x={S.x + 520} y={S.y + 420} w={380} big gold>EXTRA TIME</Chip>
    </>;
  }},
  {a: 210.24, layout: 'full', draw: (f) => <>
    <Head f={f} at={210.24} layout="full" kicker="EXTRA TIME" title="A FREE KICK JUST OUTSIDE THE AREA" />
    <Pitch box={FP} p={ramp(f, 210.3)}>
      <rect x={885} y={138.5} width={165} height={403} fill={GOLD} opacity={.12 * ramp(f, 212.4)} />
      <g transform={`translate(770 250) scale(${ramp(f, 211.78, 8)})`}><circle r={22} fill="#f7f5ef" stroke="#111" strokeWidth={5} /></g>
      <Line x1={770} y1={250} x2={885} y2={250} p={ramp(f, 212.4, 14)} color="#ffffff66" w={4} dash="2 12" head={false} />
    </Pitch>
    <Chip f={f} at={209.0} x={RC.x} y={F.y + 40} w={RC.w} big>EXTRA TIME</Chip>
    <Chip f={f} at={211.78} x={RC.x} y={F.y + 140} w={RC.w} big gold>A FREE KICK</Chip>
    <Chip f={f} at={212.0} x={RC.x} y={F.y + 240} w={RC.w} big>JUST OUTSIDE THE PENALTY AREA</Chip>
  </>},
  {a: 214.58, layout: 'full', sfx: 'riser', draw: (f) => {
    const go = interpolate(f, [sec(221.2), sec(222.5)], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
    const bx = (1 - go) * (1 - go) * 770 + 2 * (1 - go) * go * 940 + go * go * 1066; const by = (1 - go) * (1 - go) * 250 + 2 * (1 - go) * go * 130 + go * go * 330;
    const run = slide(f, 214.7, 216.3); const net = interpolate(f, [sec(222.54), sec(222.54) + 16], [0, 1], clamp);
    return <>
      <Pitch box={FP} p={1} label="SCHEMATIC · NOT THE ACTUAL ANGLE OF THE KICK">
        <rect x={885} y={138.5} width={165} height={403} fill={GOLD} opacity=".1" />
        <Dot x={lerp(560, 705, run)} y={lerp(380, 285, run)} r={26} fill={GOLD} label="KOEMAN" p={ramp(f, 214.6, 8)} />
        <Line x1={560} y1={380} x2={700} y2={290} p={ramp(f, 215.4, 20)} color="#ffffff55" w={4} dash="2 12" head={false} />
        <path d="M 770 250 Q 940 130 1066 330" fill="none" stroke="#fff" strokeWidth={5} strokeDasharray="1000" strokeDashoffset={1000 * (1 - ramp(f, 221.2, 40))} opacity=".7" />
        <g transform={`translate(${f < sec(221.2) ? 770 : bx} ${f < sec(221.2) ? 250 : by})`}><circle r={22} fill="#f7f5ef" stroke="#111" strokeWidth={5} /></g>
        <circle cx={1050} cy={340} r={90 * net} fill="none" stroke="#fff" strokeWidth={6} opacity={1 - net} />
      </Pitch>
      <Chip f={f} at={214.58} x={RC.x} y={F.y + 20} w={RC.w} big>KOEMAN STEPS FORWARD</Chip>
      <Chip f={f} at={218.2} x={RC.x} y={F.y + 130} w={RC.w} big>ONE DEVASTATING STRIKE</Chip>
      <Chip f={f} at={220.08} x={RC.x} y={F.y + 240} w={RC.w} big gold>RIGHT FOOT</Chip>
      <Chip f={f} at={222.0} x={RC.x} y={F.y + 330} w={RC.w} big gold>INTO THE NET</Chip>
    </>;
  }},
  {a: 222.74, layout: 'split', sfx: 'whistle', draw: (f) => <>
    <Head f={f} at={222.74} layout="split" kicker="WEMBLEY · 1992" title="EUROPEAN CHAMPIONS" />
    <div style={{position: 'absolute', left: S.x + 60, top: S.y + 10, width: 840, height: 190, borderRadius: 26, background: '#07102aee', border: `4px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 36, fontFamily: D, ...appear(ramp(f, 222.8))}}>
      <div style={{fontSize: 60, color: INK}}>BARÇA</div><div style={{fontSize: 150, color: GOLD, lineHeight: 1}}>1–0</div><div style={{fontSize: 60, color: INK}}>SAMP.</div></div>
    <At x={S.x + 30} y={S.y + 240} style={appear(ramp(f, 224.0))}><Trophy w={230} id="k-w46" glow={ramp(f, 224.4)} /></At>
    <Chip f={f} at={224.28} x={S.x + 320} y={S.y + 280} w={600} big gold>EUROPEAN CHAMPIONS</Chip>
    <Chip f={f} at={225.84} x={S.x + 320} y={S.y + 400} w={600} big>FOR THE VERY FIRST TIME</Chip>
  </>},
  {a: 227.14, layout: 'full', draw: (f) => {
    const x0 = F.x + 120, x1 = F.x + F.w - 120; const yr = (y: number) => lerp(x0, x1, (y - 1955) / (1995 - 1955)); const y = F.y + 290;
    return <>
      <Head f={f} at={227.14} layout="full" kicker="THINK ABOUT WHAT THAT MEANT" title="HEARTBREAK IN TWO FINALS" />
      <div style={{position: 'absolute', left: x0, top: y, width: x1 - x0, height: 5, background: '#ffffff33'}} />
      {[[1961, 233.0, 'FINAL'], [1986, 234.3, 'FINAL']].map(([yv, at, l]) => <div key={yv as number} style={{position: 'absolute', left: yr(yv as number) - 90, top: y - 130, width: 180, textAlign: 'center', ...appear(ramp(f, (at as number) - .2, 9), 20)}}>
        <div style={{fontFamily: D, fontSize: 70, color: RED}}>{yv}</div>
        <div style={{width: 40, height: 40, borderRadius: 20, background: RED, margin: '10px auto 0', border: '4px solid #fff'}} /></div>)}
      <Chip f={f} at={230.0} x={F.x + 500} y={F.y + 410} w={440} big red style={{textAlign: 'center'}}>HEARTBREAK</Chip>
      <Note f={f} at={231.0} x={F.x + 300} y={F.y + 500} w={830}>TWO EUROPEAN CUP FINALS</Note>
    </>;
  }},
  {a: 235.68, layout: 'full', draw: (f) => {
    const x0 = F.x + 120, x1 = F.x + F.w - 120; const yr = (y: number) => lerp(x0, x1, (y - 1955) / (1995 - 1955)); const y = F.y + 290;
    const gap = ramp(f, 236.16, 40);
    return <>
      <Head f={f} at={235.68} layout="full" kicker="FOR DECADES" title="OUT OF REACH" />
      <div style={{position: 'absolute', left: x0, top: y, width: x1 - x0, height: 5, background: '#ffffff33'}} />
      {[1961, 1986].map((yv) => <div key={yv} style={{position: 'absolute', left: yr(yv) - 90, top: y - 130, width: 180, textAlign: 'center'}}>
        <div style={{fontFamily: D, fontSize: 70, color: RED}}>{yv}</div><div style={{width: 40, height: 40, borderRadius: 20, background: RED, margin: '10px auto 0', border: '4px solid #fff'}} /></div>)}
      <div style={{position: 'absolute', left: yr(1961), top: y + 30, width: (yr(1992) - yr(1961)) * gap, height: 30, borderRadius: 8, background: 'repeating-linear-gradient(90deg,#ffffff22 0 18px,transparent 18px 36px)', border: '2px solid #ffffff44'}} />
      <div style={{position: 'absolute', left: yr(1961), top: y + 90, width: yr(1992) - yr(1961), textAlign: 'center', fontFamily: D, fontSize: 64, color: MUTED, opacity: ramp(f, 236.16)}}>DECADES</div>
      <At x={x1 - 150} y={y - 190} style={{...appear(ramp(f, 237.26)), opacity: ramp(f, 237.26) * .45}}><Trophy w={150} id="k-oor" dim /></At>
      <Chip f={f} at={238.72} x={F.x + 480} y={F.y + 470} w={470} big style={{textAlign: 'center'}}>OUT OF REACH</Chip>
    </>;
  }},
  {a: 239.9, layout: 'full', sfx: 'riser', draw: (f) => {
    const x0 = F.x + 120, x1 = F.x + F.w - 120; const yr = (y: number) => lerp(x0, x1, (y - 1955) / (1995 - 1955)); const y = F.y + 290;
    const burst = ramp(f, 240.58, 10);
    return <>
      <Head f={f} at={239.9} layout="full" kicker="ONE POWERFUL SHOT" title="KOEMAN CHANGED EVERYTHING" />
      <div style={{position: 'absolute', left: x0, top: y, width: x1 - x0, height: 5, background: '#ffffff33'}} />
      {[1961, 1986].map((yv) => <div key={yv} style={{position: 'absolute', left: yr(yv) - 70, top: y - 110, fontFamily: D, fontSize: 56, color: RED, opacity: .6}}>{yv}</div>)}
      <svg style={{position: 'absolute', left: yr(1992) - 160, top: y - 170, opacity: burst}} width={320} height={320} viewBox="-50 -50 100 100">
        {Array.from({length: 16}, (_, i) => <path key={i} d="M 0 -48 L 4 -26 L -4 -26 Z" fill={GOLD} transform={`rotate(${i * 22.5})`} />)}</svg>
      <div style={{position: 'absolute', left: yr(1992) - 90, top: y - 120, width: 180, textAlign: 'center', fontFamily: D, fontSize: 80, color: GOLD, opacity: burst}}>1992</div>
      <At x={yr(1992) - 70} y={y + 60} style={appear(burst)}><Trophy w={140} id="k-92" glow={burst} /></At>
      <Chip f={f} at={242.2} x={F.x + 360} y={F.y + 470} w={720} big gold style={{textAlign: 'center'}}>IT CHANGED EVERYTHING</Chip>
    </>;
  }},
  {a: 243.8, layout: 'split', draw: (f) => {
    const cut = ramp(f, 244.6, 8);
    return <>
      <Head f={f} at={243.8} layout="split" kicker="05 · WEMBLEY 1992" title="NOT JUST A GOAL" />
      <div style={{position: 'absolute', left: S.x + 60, top: S.y + 40, width: 840, textAlign: 'center', fontFamily: D, fontSize: 120, color: MUTED, ...appear(ramp(f, 243.92))}}>
        <span style={{position: 'relative'}}>A GOAL<div style={{position: 'absolute', left: -10, top: '52%', width: `${(cut) * 110}%`, height: 9, background: RED, borderRadius: 4}} /></span></div>
      <At x={S.x + 330} y={S.y + 190} style={appear(ramp(f, 245.2))}><Crest width={290} id="k-tr" /></At>
      <Stamp f={f} at={246.5} box={{x: S.x, y: S.y, w: S.w, h: 0}} dy={480} size={60} rot={-2}>A MOMENT THAT TRANSFORMED BARCELONA</Stamp>
    </>;
  }},
  // ================= 06 · LEGACY =================
  {a: 248.92, layout: 'split', sfx: 'whoosh', draw: (f) => <>
    <Head f={f} at={248.92} layout="split" kicker="06 · A LEGACY THAT LIVES ON" title="YEARS LATER" />
    <At x={S.x + 40} y={S.y + 30} style={appear(ramp(f, 250.3))}><Crest width={290} id="k-lg" /></At>
    <Chip f={f} at={250.3} x={col2 - 40} y={S.y + 70} w={460} big>KOEMAN RETURNED</Chip>
    <Chip f={f} at={252.48} x={col2 - 40} y={S.y + 190} w={460} big gold>THIS TIME AS MANAGER</Chip>
  </>},
  {a: 253.82, layout: 'split', draw: (f) => <>
    <Head f={f} at={253.82} layout="split" kicker="HE TOOK CHARGE" title="A DIFFICULT PERIOD" />
    <Big f={f} at={254.74} box={{x: S.x, y: S.y + 40, w: S.w, h: 0}} size={96} color={INK}>ONE OF THE MOST DIFFICULT</Big>
    <Big f={f} at={255.9} box={{x: S.x, y: S.y + 160, w: S.w, h: 0}} size={96} color={GOLD}>PERIODS IN THE CLUB'S</Big>
    <Big f={f} at={257.0} box={{x: S.x, y: S.y + 280, w: S.w, h: 0}} size={96} color={INK}>MODERN HISTORY</Big>
  </>},
  {a: 258.02, layout: 'split', sfx: 'pop', draw: (f) => <>
    <Head f={f} at={258.02} layout="split" kicker="DESPITE ALL THE CHALLENGES" title="COPA DEL REY CHAMPIONS" />
    <At x={S.x + 30} y={S.y + 10} style={appear(ramp(f, 260.0))}><Trophy w={280} id="k-cdr" glow={ramp(f, 261.3)} /></At>
    <Chip f={f} at={261.3} x={col2 - 60} y={S.y + 60} w={500} big gold>COPA DEL REY</Chip>
    <Year f={f} at={262.64} box={{x: col2 - 60, y: S.y + 160, w: 500, h: 0}} text="2021" size={200} />
  </>},
  {a: 264.3, layout: 'split', draw: (f) => <>
    <Head f={f} at={264.3} layout="split" kicker="WHEN BARÇA FANS THINK OF KOEMAN" title="ONE IMAGE" />
    <div style={{position: 'absolute', left: S.x + 220, top: S.y + 20, width: 520, height: 520, borderRadius: 24, border: `8px solid #ffffff55`, background: 'linear-gradient(160deg,#10224f,#07102a)', ...appear(ramp(f, 265.7)), boxShadow: '0 30px 80px #000a'}}>
      <div style={{textAlign: 'center', marginTop: 190, fontFamily: D, fontSize: 200, color: GOLD, opacity: ramp(f, 267.24) }}>?</div></div>
    <Stamp f={f} at={267.24} box={{x: S.x, y: S.y, w: S.w, h: 0}} dy={540} size={64}>ALWAYS COMES TO MIND</Stamp>
  </>},
  {a: 269.3, layout: 'full', sfx: 'riser', draw: (f) => {
    const arc = ramp(f, 274.0, 60);
    return <>
      <div style={{position: 'absolute', left: F.x, top: F.y - 20, width: F.w, height: 640, background: `radial-gradient(ellipse at 50% 55%, ${GOLD}33 0%, transparent 60%)`, opacity: ramp(f, 269.5, 30)}} />
      <At x={F.x + 330} y={F.y - 20} style={{...appear(ramp(f, 270.6)), filter: 'drop-shadow(0 0 30px #fff6)'}}><Arch w={780} /></At>
      <At x={F.x + 650} y={F.y + 330} style={{...appear(ramp(f, 271.74)), transform: `scale(${lerp(.7, 1, ramp(f, 271.74))})`}}><Ball size={110} /></At>
      <svg style={{position: 'absolute', left: F.x + 500, top: F.y + 120, overflow: 'visible'}} width={600} height={300}><path d="M 150 220 Q 330 -40 520 150" fill="none" stroke={GOLD} strokeWidth={7} strokeDasharray="6 16" strokeLinecap="round" opacity={arc} /></svg>
      <Big f={f} at={269.72} box={{x: F.x, y: F.y + 450, w: F.w, h: 0}} size={64} color={INK}>THAT POWERFUL DUTCH DEFENDER</Big>
      <Big f={f} at={274.5} box={{x: F.x, y: F.y + 530, w: F.w, h: 0}} size={64} color={GOLD}>THAT INCREDIBLE RIGHT FOOT</Big>
    </>;
  }},
];

const TICKS = [91.74, 92.74, 94.04, 196.24, 196.6, 197.0, 197.42];

const beatIndex = (t: number) => { let i = 0; while (i + 1 < BEATS.length && BEATS[i + 1].a <= t) i++; return i; };
const box = (a: Box, b: Box, k: number): Box => ({x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), w: lerp(a.w, b.w, k), h: lerp(a.h, b.h, k)});

export const KoemanLong: React.FC<SourceEpisodeProps> = ({spec, words, pages}) => {
  const f = useCurrentFrame(); const t = f / FPS; const main = shortFrames(spec); const total = longFrames(spec);
  const i = beatIndex(t); const beat = BEATS[i]; const prev = BEATS[Math.max(0, i - 1)];
  const k = i === 0 ? 1 : interpolate(f, [sec(beat.a), sec(beat.a) + 16], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const pres = box(PRESENTER[prev.layout], PRESENTER[beat.layout], k); const stage = box(STAGE[prev.layout], STAGE[beat.layout], k);
  const ci = spec.chapters.reduce((n, c, j) => c.at <= t ? j : n, 0); const chapter = spec.chapters[ci];
  const chapterIn = interpolate(f, [sec(chapter.at), sec(chapter.at) + 12], [0, 1], clamp);
  const fadeIn = interpolate(f, [sec(beat.a), sec(beat.a) + 10], [0, 1], clamp); const fadeOut = 1 - interpolate(f, [sec(beat.a), sec(beat.a) + 8], [0, 1], clamp);
  const presenterOut = interpolate(f, [sec(OUTRO), main], [1, 0], clamp);
  const musicVol = (fr: number) => fr < main ? .16 * interpolate(fr, [0, 60], [0, 1], clamp) * (fr > sec(OUTRO) ? 2.2 : 1) : interpolate(fr, [main, main + 20, total - 45, total], [.4, .5, .5, 0], clamp);
  return <AbsoluteFill style={{background: '#07102a', color: INK, fontFamily: LOCAL_FONTS.body}}>
    {f < main ? <>
      <RadarBg tint={ci % 2 ? BLAU : GRANA} />
      <div style={{position: 'absolute', left: stage.x, top: stage.y, width: stage.w, height: stage.h, borderRadius: 28, background: 'linear-gradient(150deg, #0d1a3cf2, #060d22f5)', border: '1px solid #ffffff1c', boxShadow: '0 30px 80px #0009'}} />
      <div style={{position: 'absolute', top: 44, left: 70, display: 'flex', alignItems: 'baseline', gap: 22}}>
        <span style={{fontFamily: D, fontSize: 40, letterSpacing: 2}}>BARÇA <span style={{color: GOLD}}>RADAR</span></span>
        <span style={{fontSize: 20, fontWeight: 700, letterSpacing: 3, color: '#b0bfd3'}}>{spec.label}</span>
      </div>
      {ci > 0 && <div style={{position: 'absolute', top: 46, right: 150, opacity: chapterIn, transform: `translateY(${(1 - chapterIn) * -16}px)`, display: 'flex', alignItems: 'center', gap: 14, background: '#050914d9', border: '1px solid #ffffff1f', borderRadius: 12, padding: '8px 18px'}}>
        <span style={{fontFamily: D, fontSize: 26, color: GOLD}}>{String(ci).padStart(2, '0')}/{String(spec.chapters.length - 1).padStart(2, '0')}</span>
        <span style={{fontWeight: 800, fontSize: 20, letterSpacing: 2.5}}>{chapter.title.toUpperCase()}</span>
      </div>}
      {i > 0 && fadeOut > 0 && <AbsoluteFill style={{opacity: fadeOut}}>{prev.draw(f)}</AbsoluteFill>}
      <AbsoluteFill style={{opacity: fadeIn}}>{beat.draw(f)}</AbsoluteFill>
      <div style={{opacity: presenterOut}}>
        <Presenter spec={spec} t={t} style={{left: pres.x, top: pres.y, width: pres.w, height: pres.h, borderRadius: lerp(26, 22, k), ...(beat.layout === 'full' ? {border: `3px solid ${GOLD}`} : {})}} />
      </div>
      {t < 6 && <div style={{position: 'absolute', left: 104, top: 770, opacity: interpolate(f, [24, 38, 5.2 * FPS, 5.6 * FPS], [0, 1, 1, 0], clamp), display: 'flex', alignItems: 'center', gap: 16, background: '#050914e6', padding: '12px 26px 12px 14px', borderRadius: 16, borderLeft: `8px solid ${GOLD}`}}>
        <Mark size={70} brand="radar" />
        <div><div style={{fontFamily: D, fontSize: 46, lineHeight: 1}}>{spec.presenter}</div><div style={{fontWeight: 900, fontSize: 22, color: GOLD, letterSpacing: 4}}>BARÇA RADAR</div></div>
      </div>}
      <ReviewedCaptions pages={pages} words={words} top={958} width={1500} frameWidth={1920} maxFontSize={50} emphasis={emphasisFor(spec)} />
      <div style={{position: 'absolute', bottom: 22, left: 70, width: 1780, height: 4, background: '#ffffff1a'}}>
        <div style={{height: 4, width: `${f / main * 100}%`, background: GOLD}} />
        {spec.chapters.slice(1).map((c) => <div key={c.at} style={{position: 'absolute', top: -4, left: `${c.at / spec.duration * 100}%`, width: 3, height: 12, background: c.at <= t ? GOLD : '#ffffff55'}} />)}
      </div>
    </> : <EndScreen spec={spec} f={f - main} />}
    <div style={{position: 'absolute', right: 36, top: 30, opacity: .9}}><Mark size={74} brand="radar" /></div>
    <Audio src={media(spec, 'voice.wav')} />
    <Audio src={media(spec, 'score-long.wav')} volume={musicVol} />
    {BEATS.filter((b) => b.sfx).map((b) => <Sequence key={b.a} from={Math.max(0, sec(b.a) - 4)} durationInFrames={40}><Audio src={staticFile(`sfx/${b.sfx}.wav`)} volume={.09} /></Sequence>)}
    {TICKS.map((at) => <Sequence key={at} from={sec(at)} durationInFrames={20}><Audio src={staticFile('sfx/tick.wav')} volume={.14} /></Sequence>)}
  </AbsoluteFill>;
};

/** 1280×720 thumbnail: the presenter, the Wembley arch and the headline. */
export const KoemanThumb: React.FC<SourceEpisodeProps> = ({spec}) => <AbsoluteFill style={{background: 'radial-gradient(ellipse at 28% 50%, #1b3a8a 0%, #0a1638 55%, #050a1c 100%)', fontFamily: LOCAL_FONTS.body}}>
  <AbsoluteFill style={{background: `radial-gradient(circle at 80% 60%, ${GOLD}40 0%, transparent 40%)`}} />
  <div style={{position: 'absolute', left: 40, top: 60, width: 580, height: 600, borderRadius: 34, overflow: 'hidden', border: `8px solid ${GOLD}`, transform: 'rotate(-3deg)', boxShadow: '0 30px 80px #000'}}>
    <Img src={media(spec, 'cover.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%', transform: 'scale(1.08)'}} />
  </div>
  <div style={{position: 'absolute', left: 660, top: 40, right: 30}}>
    <div style={{display: 'inline-block', background: GOLD, color: '#111', fontWeight: 900, fontSize: 30, letterSpacing: 2, padding: '6px 16px', borderRadius: 10}}>BARÇA LEGENDS</div>
    <div style={{fontFamily: D, fontSize: 168, lineHeight: .95, color: '#fff', marginTop: 14, textShadow: '0 8px 0 #0008'}}>KOEMAN</div>
    <div style={{fontFamily: D, fontSize: 70, lineHeight: 1, color: GOLD, marginTop: 8, textShadow: '0 6px 0 #0008'}}>SCORED LIKE<br />A STRIKER</div>
  </div>
  <div style={{position: 'absolute', right: 40, bottom: 70, opacity: .95}}><Arch w={360} glow={.6} /></div>
  <div style={{position: 'absolute', right: 30, bottom: 22}}><Mark size={96} brand="radar" /></div>
</AbsoluteFill>;
