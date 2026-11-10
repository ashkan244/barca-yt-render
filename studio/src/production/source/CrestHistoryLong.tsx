// CREST-HISTORY-LONG: a dedicated long-form layout. The presenter sits beside a graphics stage whose beats are
// timed to the spoken words; a few beats take the whole frame (presenter in a corner). Every heraldic drawing
// comes from CrestArt, so the crest is the club's real shape throughout.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {fitText} from '@remotion/layout-utils';
import {LOCAL_FONTS} from '../fonts';
import {ReviewedCaptions} from '../Captions';
import {RadarBg, GRANA, BLAU} from '../../radar/RadarStory';
import {Mark} from '../../Branding';
import {EndScreen, FPS, Presenter, emphasisFor, longFrames, media, shortFrames, type SourceEpisodeProps} from './SourceEpisode';
import {BarsSeal, BarsShield, CREST, CityArms, CrossField, Crest, EnglandFlag, Senyera, type CrestPart} from './CrestArt';

const GOLD = '#f2c230';
const INK = '#f5f4ef';
const MUTED = '#aab7ca';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const sec = (s: number) => Math.round(s * FPS);
const ramp = (f: number, at: number, d = 12) => interpolate(f, [sec(at), sec(at) + d], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
const appear = (p: number, dy = 18): React.CSSProperties => ({opacity: p, transform: `translateY(${(1 - p) * dy}px)`});
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

type Box = {x: number; y: number; w: number; h: number};
type Layout = 'split' | 'full';
const PRESENTER: Record<Layout, Box> = {split: {x: 70, y: 150, w: 760, h: 760}, full: {x: 70, y: 606, w: 300, h: 300}};
const STAGE: Record<Layout, Box> = {split: {x: 870, y: 122, w: 980, h: 812}, full: {x: 70, y: 122, w: 1780, h: 812}};
/** Art area below the stage heading. */
const ART: Record<Layout, Box> = {split: {x: 880, y: 300, w: 960, h: 620}, full: {x: 410, y: 300, w: 1430, h: 620}};
const OUTRO = 219.85; // the take ends on black frames; graphics carry the last seconds

// ---------------- building blocks ----------------
const Head: React.FC<{f: number; at: number; kicker: string; title: string; layout: Layout}> = ({f, at, kicker, title, layout}) => {
  const p = ramp(f, at, 10); const x = layout === 'split' ? 920 : 410; const w = 1810 - x;
  const size = Math.min(layout === 'full' ? 80 : 68, Math.floor(fitText({text: title, withinWidth: w, fontFamily: LOCAL_FONTS.display}).fontSize));
  return <div style={{position: 'absolute', left: x, top: 150, width: w, ...appear(p, 14)}}>
    <div style={{color: GOLD, fontWeight: 800, fontSize: 23, letterSpacing: 4}}>{kicker}</div>
    <div style={{fontFamily: LOCAL_FONTS.display, fontSize: size, lineHeight: 1.04, color: INK, marginTop: 6, whiteSpace: 'nowrap'}}>{title}</div>
  </div>;
};

const Chip: React.FC<{f: number; at: number; x: number; y: number; w?: number; big?: boolean; gold?: boolean; children: React.ReactNode}> = ({f, at, x, y, w, big, gold, children}) =>
  <div style={{position: 'absolute', left: x, top: y, width: w, ...appear(ramp(f, at, 10)), background: '#081127ee', borderLeft: `6px solid ${gold ? GOLD : '#3d6fd8'}`,
    borderRadius: 12, padding: big ? '16px 22px' : '11px 18px', boxShadow: '0 14px 34px #0007', fontWeight: 800, letterSpacing: 2, fontSize: big ? 30 : 22, color: gold ? GOLD : INK, lineHeight: 1.25}}>{children}</div>;

const Note: React.FC<{f: number; at: number; x: number; y: number; w: number; children: React.ReactNode}> = ({f, at, x, y, w, children}) =>
  <div style={{position: 'absolute', left: x, top: y, width: w, ...appear(ramp(f, at, 10), 10), fontSize: 20, fontWeight: 700, letterSpacing: 2.5, lineHeight: 1.35, color: MUTED}}>{children}</div>;

const At: React.FC<{x: number; y: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, children, style}) =>
  <div style={{position: 'absolute', left: x, top: y, ...style}}>{children}</div>;

/** Crest centred on a point of the stage, optionally zooming into one quadrant. */
export const CrestAt: React.FC<{id: string; cx: number; cy: number; width: number; zoom?: number; focus?: [number, number]; clip?: Box} & Omit<React.ComponentProps<typeof Crest>, 'width' | 'id'>> =
  ({id, cx, cy, width, zoom = 0, focus = [500, 505], clip, ...rest}) => {
    const w = lerp(width, width * 2.35, zoom); const k = w / 1000;
    // at zoom 0 the crest's centre sits on (cx, cy); at zoom 1 the focus point does
    const px = lerp(500, focus[0], zoom) * k; const py = lerp(505, focus[1], zoom) * k;
    const art = <div style={{position: 'absolute', left: cx - px, top: cy - py}}><Crest width={w} id={id} {...rest} /></div>;
    return clip ? <div style={{position: 'absolute', left: clip.x, top: clip.y, width: clip.w, height: clip.h, overflow: 'hidden', borderRadius: 22}}>
      <div style={{position: 'absolute', left: -clip.x, top: -clip.y}}>{art}</div></div> : art;
  };

export const allDim = (except: CrestPart[], v: number): Partial<Record<CrestPart, number>> =>
  Object.fromEntries((['cross', 'senyera', 'initials', 'colours', 'ball'] as CrestPart[]).filter((p) => !except.includes(p)).map((p) => [p, v]));

export const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; p: number; color?: string}> = ({x1, y1, x2, y2, p, color = GOLD}) => {
  const a = Math.atan2(y2 - y1, x2 - x1); const xe = lerp(x1, x2, p); const ye = lerp(y1, y2, p);
  return <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
    <line x1={x1} y1={y1} x2={xe} y2={ye} stroke={color} strokeWidth={6} strokeLinecap="round" />
    {p > 0.95 && <path d={`M${x2} ${y2} l${-24 * Math.cos(a - 0.45)} ${-24 * Math.sin(a - 0.45)} M${x2} ${y2} l${-24 * Math.cos(a + 0.45)} ${-24 * Math.sin(a + 0.45)}`} stroke={color} strokeWidth={6} strokeLinecap="round" fill="none" />}
  </svg>;
};

const Crown: React.FC<{width: number}> = ({width}) => <svg width={width} height={width * .62} viewBox="0 0 100 62">
  <path d="M8 50 14 14 32 32 50 4 68 32 86 14 92 50Z" fill={GOLD} stroke="#5a4100" strokeWidth={2.5} strokeLinejoin="round" />
  <rect x={8} y={48} width={84} height={12} rx={3} fill={GOLD} stroke="#5a4100" strokeWidth={2.5} />
  {[[14, 14], [50, 4], [86, 14]].map(([x, y]) => <circle key={x} cx={x} cy={y} r={5} fill={GOLD} stroke="#5a4100" strokeWidth={2} />)}
  {[30, 50, 70].map((x, k) => <circle key={x} cx={x} cy={54} r={3.4} fill={k === 1 ? CREST.red : CREST.blue} />)}
</svg>;

const Shirt: React.FC<{width: number; id: string}> = ({width, id}) => <svg width={width} height={width * 1.05} viewBox="0 0 200 210">
  <defs><clipPath id={`${id}-shirt`}><path d="M62 8C70 22 130 22 138 8L192 34 172 86 150 76V204H50V76L28 86 8 34Z" /></clipPath></defs>
  <g clipPath={`url(#${id}-shirt)`}>
    <rect width={200} height={210} fill={CREST.blue} />{[0, 1, 2, 3].map((k) => <rect key={k} x={22 + k * 44} y={0} width={22} height={210} fill={CREST.garnet} />)}
    <rect width={200} height={210} fill="url(#shirt-shade)" />
  </g>
  <defs><linearGradient id="shirt-shade" x1="0" x2="1"><stop offset="0" stopColor="#000" stopOpacity=".28" /><stop offset=".5" stopColor="#fff" stopOpacity=".06" /><stop offset="1" stopColor="#000" stopOpacity=".3" /></linearGradient></defs>
  <path d="M62 8C70 22 130 22 138 8" fill="none" stroke={GOLD} strokeWidth={5} />
</svg>;

// ---------------- beats ----------------
type Beat = {a: number; layout: Layout; sfx?: string; draw: (f: number) => React.ReactNode};
const S = ART.split; const F = ART.full;
const left = (w: number) => S.x + 20 + w / 2; // crest centre when it shares the stage with a text column
const col = S.x + 560; const colW = 380;

const BEATS: Beat[] = [
  // ---- cold open ----
  {a: 0, layout: 'split', draw: (f) => <>
    <Head f={f} at={0} layout="split" kicker="BARÇA HISTORY" title="WHY DOES THE CREST LOOK LIKE THIS?" />
    <CrestAt id="b0" cx={S.x + S.w / 2} cy={S.y + 318} width={560} draw={interpolate(f, [sec(.2), sec(2.4)], [0, 1], clamp)} />
  </>},
  {a: 4.16, layout: 'split', draw: (f) => <>
    <Head f={f} at={4.16} layout="split" kicker="QUESTION 1" title="THE RED AND YELLOW STRIPES" />
    <CrestAt id="b1" cx={left(500)} cy={S.y + 310} width={500} dim={allDim(['senyera'], ramp(f, 4.4, 14))} glow="senyera" glowAmount={ramp(f, 5.2)} />
    <Chip f={f} at={6.44} x={col} y={S.y + 150} w={colW} big gold>CATALONIA</Chip>
    <Note f={f} at={6.8} x={col} y={S.y + 250} w={colW}>WHY ARE THEY ON A FOOTBALL CREST?</Note>
  </>},
  {a: 7.9, layout: 'split', draw: (f) => <>
    <Head f={f} at={7.9} layout="split" kicker="QUESTION 2" title="A CROSS LIKE ENGLAND'S FLAG?" />
    <CrestAt id="b2" cx={left(500)} cy={S.y + 310} width={500} dim={allDim(['cross'], ramp(f, 8.4, 14))} glow="cross" glowAmount={ramp(f, 9.04)} />
    <At x={col} y={S.y + 110} style={appear(ramp(f, 12.18))}><EnglandFlag width={colW} /></At>
    <Chip f={f} at={12.48} x={col} y={S.y + 360} w={colW}>ENGLAND · NATIONAL FLAG</Chip>
  </>},
  {a: 13.1, layout: 'split', draw: (f) => <>
    <Head f={f} at={13.1} layout="split" kicker="QUESTION 3" title="WHAT HAS ARAGON GOT TO DO WITH IT?" />
    <At x={S.x + 70} y={S.y + 40} style={appear(ramp(f, 13.9))}><BarsShield width={300} /></At>
    <Chip f={f} at={15.16} x={S.x + 40} y={S.y + 420} w={360} gold>KINGDOM OF ARAGON</Chip>
    <Arrow x1={S.x + 420} y1={S.y + 210} x2={S.x + 560} y2={S.y + 210} p={ramp(f, 16.4, 16)} />
    <CrestAt id="b3" cx={S.x + 760} cy={S.y + 230} width={360} glow="senyera" glowAmount={ramp(f, 17.3)} />
    <Note f={f} at={18.38} x={S.x + 590} y={S.y + 470} w={360}>ONE OF FOOTBALL'S MOST RECOGNISABLE SYMBOLS</Note>
  </>},
  {a: 20.48, layout: 'full', sfx: 'whoosh', draw: (f) => {
    const x0 = F.x + 40; const x1 = F.x + F.w - 40; const yr = (y: number) => lerp(x0, x1, (y - 1100) / (2026 - 1100)); const y = F.y + 330;
    const symbols = ramp(f, 21.6, 60); const foot = ramp(f, 25.0, 16);
    return <>
      <Head f={f} at={20.48} layout="full" kicker="THE STORY BEHIND THE BADGE" title="OLDER THAN FOOTBALL ITSELF" />
      <div style={{position: 'absolute', left: x0, top: y, width: x1 - x0, height: 4, background: '#ffffff30'}} />
      {/* the symbols' story, drawn back in time from today */}
      <div style={{position: 'absolute', left: lerp(x1, yr(1150), symbols), top: y - 52, width: x1 - lerp(x1, yr(1150), symbols), height: 34, borderRadius: 8, background: `linear-gradient(90deg, ${CREST.red}, ${GOLD})`}} />
      <div style={{position: 'absolute', left: yr(1150), top: y - 100, fontWeight: 900, letterSpacing: 3, fontSize: 24, color: GOLD, opacity: symbols}}>THE SYMBOLS</div>
      <div style={{position: 'absolute', left: yr(1899), top: y + 18, width: x1 - yr(1899), height: 34, borderRadius: 8, background: `repeating-linear-gradient(90deg, ${CREST.blue} 0 14px, ${CREST.garnet} 14px 28px)`, opacity: foot}} />
      <div style={{position: 'absolute', left: yr(1899) - 250, top: y + 70, width: 480, textAlign: 'right', fontWeight: 900, letterSpacing: 3, fontSize: 24, color: INK, opacity: foot}}>FC BARCELONA ↗</div>
      {[[1150, 'c. 1150'], [1899, '1899'], [2026, 'TODAY']].map(([yv, l]) => <div key={l} style={{position: 'absolute', left: yr(yv as number) - 60, top: y + 120, width: 120, textAlign: 'center', fontFamily: LOCAL_FONTS.display, fontSize: 44, color: INK, opacity: yv === 1150 ? symbols : yv === 1899 ? foot : 1}}>{l}</div>)}
    </>;
  }},
  // ---- 01 · the four bars ----
  {a: 26.22, layout: 'split', sfx: 'whoosh', draw: (f) => {
    const z = interpolate(f, [sec(26.6), sec(29.0)], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
    return <>
      <Head f={f} at={26.22} layout="split" kicker="01 · THE FOUR BARS" title="TOP RIGHT OF THE CREST" />
      <CrestAt id="b5" cx={S.x + S.w / 2} cy={S.y + 310} width={520} zoom={z} focus={[680, 255]} clip={S} dim={allDim(['senyera'], z)} />
    </>;
  }},
  {a: 30.0, layout: 'split', draw: (f) => <>
    <Head f={f} at={30.0} layout="split" kicker="01 · THE FOUR BARS" title="THE SENYERA" />
    <At x={S.x + 150} y={S.y + 30} style={appear(ramp(f, 30.4))}><Senyera width={660} f={f} /></At>
    <Chip f={f} at={32.62} x={S.x + 150} y={S.y + 500} w={300} gold big>LA SENYERA</Chip>
    <Chip f={f} at={34.0} x={S.x + 480} y={S.y + 510} w={330}>FLAG OF CATALONIA</Chip>
  </>},
  {a: 35.38, layout: 'split', draw: (f) => {
    const h = 600 * 2 / 3;
    return <>
      <Head f={f} at={35.38} layout="split" kicker="01 · THE FOUR BARS" title="FOUR RED STRIPES ON GOLD" />
      <At x={S.x + 240} y={S.y + 20}><Senyera width={600} f={f} wave={.35} /></At>
      {[0, 1, 2, 3].map((k) => <div key={k} style={{position: 'absolute', left: S.x + 160, top: S.y + 20 + (2 * k + 1.5) * h / 9 - 30, width: 60, height: 60, borderRadius: 30, background: GOLD, color: '#1a1200',
        fontFamily: LOCAL_FONTS.display, fontSize: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${ramp(f, 36.42 + k * .16, 8)})`}}>{k + 1}</div>)}
      <Chip f={f} at={38.08} x={S.x + 240} y={S.y + 455} w={300} gold>GOLDEN BACKGROUND</Chip>
      <Note f={f} at={39.92} x={S.x + 240} y={S.y + 540} w={640}>ONE OF THE OLDEST SYMBOLS OF CATALAN IDENTITY</Note>
    </>;
  }},
  {a: 44.64, layout: 'full', sfx: 'riser', draw: (f) => {
    const y = Math.round(interpolate(f, [sec(45.0), sec(47.0)], [2026, 1150], {...clamp, easing: Easing.inOut(Easing.cubic)}));
    return <>
      <Head f={f} at={44.64} layout="full" kicker="BUT ITS HISTORY" title="GOES EVEN FURTHER BACK" />
      <div style={{position: 'absolute', left: F.x, width: F.w, top: F.y + 60, textAlign: 'center', fontFamily: LOCAL_FONTS.display, fontSize: 300, lineHeight: 1, color: y === 1150 ? GOLD : INK,
        textShadow: '0 18px 50px #000a', fontVariantNumeric: 'tabular-nums'}}>{y}</div>
      <div style={{position: 'absolute', left: F.x, width: F.w, top: F.y + 410, textAlign: 'center', fontWeight: 800, letterSpacing: 4, fontSize: 24, color: MUTED, opacity: ramp(f, 46.6)}}>THE MIDDLE AGES</div>
    </>;
  }},
  {a: 47.4, layout: 'split', sfx: 'whoosh', draw: (f) => <>
    <Head f={f} at={47.4} layout="split" kicker="01 · THE FOUR BARS" title="A ROYAL SIGN" />
    <At x={S.x + 40} y={S.y + 50} style={appear(ramp(f, 47.6))}><BarsShield width={300} /></At>
    <Chip f={f} at={50.28} x={S.x + 400} y={S.y + 30} w={520} big>HOUSE OF BARCELONA</Chip>
    <Chip f={f} at={52.0} x={S.x + 400} y={S.y + 150} w={520} big gold>CROWN OF ARAGON</Chip>
    <Chip f={f} at={53.74} x={S.x + 400} y={S.y + 270} w={520}>A MEDIEVAL POLITICAL UNION</Chip>
    <Chip f={f} at={56.7} x={S.x + 400} y={S.y + 360} w={520}>A POWER IN THE WESTERN MEDITERRANEAN</Chip>
    <Note f={f} at={48.2} x={S.x + 40} y={S.y + 440} w={330}>OR, FOUR PALLETS GULES</Note>
  </>},
  {a: 59.16, layout: 'split', draw: (f) => {
    const tiles: [string, number][] = [['ARAGON', 66.12], ['CATALONIA', 66.92], ['VALENCIA', 67.6], ['OTHER MEDITERRANEAN LANDS', 69.92]];
    return <>
      <Head f={f} at={59.16} layout="split" kicker="THE CROWN OF ARAGON" title="NOT JUST TODAY'S ARAGON" />
      <div style={{position: 'absolute', left: S.x + 40, top: S.y + 10, ...appear(ramp(f, 60.88)), opacity: ramp(f, 60.88) * (1 - .55 * ramp(f, 63.4))}}>
        <div style={{fontWeight: 800, letterSpacing: 2.5, fontSize: 26, color: INK}}>THE MODERN REGION OF ARAGON</div>
        <div style={{height: 5, marginTop: -21, width: 460 * ramp(f, 62.0, 10), background: CREST.red}} />
      </div>
      <At x={S.x + 370} y={S.y + 70} style={appear(ramp(f, 63.64))}><Crown width={220} /></At>
      <div style={{position: 'absolute', left: S.x + 240, top: S.y + 220, fontFamily: LOCAL_FONTS.display, fontSize: 52, color: GOLD, opacity: ramp(f, 63.9)}}>A COMPOSITE MONARCHY</div>
      {tiles.map(([n, at], k) => <div key={n} style={{position: 'absolute', left: S.x + 30 + k * 232, top: S.y + 330, width: 214, height: 220, borderRadius: 16, background: '#0a1430ee', border: '1px solid #ffffff22',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, ...appear(ramp(f, at, 9))}}>
        {k < 3 ? <BarsShield width={78} /> : <div style={{fontFamily: LOCAL_FONTS.display, fontSize: 66, color: GOLD, lineHeight: 1}}>+</div>}
        <div style={{fontWeight: 900, letterSpacing: 2, fontSize: k < 3 ? 22 : 17, color: INK, textAlign: 'center', padding: '0 10px'}}>{n}</div>
      </div>)}
      <Note f={f} at={70.4} x={S.x + 30} y={S.y + 575} w={900}>AT DIFFERENT PERIODS · SCHEMATIC, NOT A MAP</Note>
    </>;
  }},
  {a: 71.22, layout: 'split', draw: (f) => {
    const tiles: [string, number, React.ReactNode][] = [
      ['FLAG', 72.32, <Senyera key="s" width={170} f={f} wave={.4} />], ['SHIELD', 73.18, <BarsShield key="b" width={120} />],
      ['SEAL · c.1150', 73.94, <BarsSeal key="c" size={150} />], ['CREST', 75.06, <div key="d" style={{width: 150, height: 150, overflow: 'hidden', borderRadius: 10}}><div style={{marginLeft: -210, marginTop: -30}}><Crest width={420} id="b11" shadow={false} /></div></div>]];
    return <>
      <Head f={f} at={71.22} layout="split" kicker="01 · THE FOUR BARS" title="ONE DESIGN, MANY SYMBOLS" />
      {tiles.map(([n, at, art], k) => <div key={n} style={{position: 'absolute', left: S.x + 20 + k * 236, top: S.y + 60, width: 218, height: 330, borderRadius: 18, background: '#0a1430ee', border: '1px solid #ffffff22',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, ...appear(ramp(f, at, 9))}}>{art}
        <div style={{fontWeight: 900, letterSpacing: 3, fontSize: 21, color: k === 3 ? GOLD : INK}}>{n}</div></div>)}
      <Note f={f} at={75.6} x={S.x + 20} y={S.y + 430} w={920}>THE SAME FOUR-STRIPE HERALDIC DESIGN ACROSS THE REGION · OLDEST KNOWN USE: A SEAL OF RAMON BERENGUER IV, 1150</Note>
    </>;
  }},
  {a: 77.9, layout: 'split', draw: (f) => <>
    <Head f={f} at={77.9} layout="split" kicker="01 · THE FOUR BARS" title="NOT JUST CLUB COLOURS" />
    <CrestAt id="b12" cx={left(470)} cy={S.y + 300} width={470} dim={allDim(['senyera'], .9)} glow="senyera" glowAmount={ramp(f, 79.6)} />
    <div style={{position: 'absolute', left: col, top: S.y + 90, ...appear(ramp(f, 82.36))}}>
      <div style={{fontFamily: LOCAL_FONTS.display, fontSize: 56, color: MUTED}}>CLUB COLOURS</div>
      <div style={{height: 7, marginTop: -44, width: 330 * ramp(f, 83.3, 8), background: CREST.red}} />
    </div>
    <div style={{position: 'absolute', left: col, top: S.y + 230, width: colW, ...appear(ramp(f, 85.4))}}>
      <div style={{fontFamily: LOCAL_FONTS.display, fontSize: 58, lineHeight: 1.05, color: GOLD}}>CENTURIES OF REGIONAL HISTORY</div>
    </div>
  </>},
  // ---- 02 · the cross ----
  {a: 88.02, layout: 'split', sfx: 'whoosh', draw: (f) => {
    const z = interpolate(f, [sec(89.4), sec(91.6)], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
    return <>
      <Head f={f} at={88.02} layout="split" kicker="02 · THE CROSS" title="TOP LEFT OF THE CREST" />
      <CrestAt id="b13" cx={S.x + S.w / 2} cy={S.y + 310} width={520} zoom={z} focus={[320, 255]} clip={S} dim={allDim(['cross'], z)} />
      <Chip f={f} at={92.5} x={S.x + 40} y={S.y + 520} w={420} gold>RED CROSS ON WHITE</Chip>
    </>;
  }},
  {a: 94.92, layout: 'split', draw: (f) => <>
    <Head f={f} at={94.92} layout="split" kicker="02 · THE CROSS" title="THE CROSS OF ST GEORGE" />
    <At x={S.x + 40} y={S.y + 40}><CrossField size={380} draw={ramp(f, 95.0, 22)} /></At>
    <Chip f={f} at={95.76} x={col} y={S.y + 60} w={colW} big>ST GEORGE</Chip>
    <Note f={f} at={96.68} x={col} y={S.y + 180} w={colW}>KNOWN IN CATALONIA AS</Note>
    <div style={{position: 'absolute', left: col, top: S.y + 220, fontFamily: LOCAL_FONTS.display, fontSize: 92, color: GOLD, ...appear(ramp(f, 97.94))}}>SANT JORDI</div>
  </>},
  {a: 99.54, layout: 'split', draw: (f) => <>
    <Head f={f} at={99.54} layout="split" kicker="02 · THE CROSS" title="A SAINT AT THE HEART OF CATALONIA" />
    <At x={S.x + 50} y={S.y + 40} style={appear(ramp(f, 99.8))}>
      <div style={{width: 300, height: 300, borderRadius: 150, background: '#fff', border: `10px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 60px #0008'}}><CrossField size={200} /></div>
    </At>
    <Chip f={f} at={101.72} x={col - 20} y={S.y + 40} w={colW + 20}>CATALAN HISTORY</Chip>
    <Chip f={f} at={102.92} x={col - 20} y={S.y + 120} w={colW + 20}>CULTURAL IDENTITY</Chip>
    <div style={{position: 'absolute', left: S.x + 50, top: S.y + 420, width: 880, ...appear(ramp(f, 105.5))}}>
      <div style={{fontWeight: 800, letterSpacing: 4, fontSize: 24, color: MUTED}}>CONSIDERED THE</div>
      <div style={{fontFamily: LOCAL_FONTS.display, fontSize: 84, color: GOLD, lineHeight: 1.05}}>PATRON SAINT OF CATALONIA</div>
    </div>
  </>},
  {a: 107.54, layout: 'split', draw: (f) => <>
    <Head f={f} at={107.54} layout="split" kicker="02 · THE CROSS" title="ALSO ON THE CITY'S ARMS" />
    <At x={S.x + 60} y={S.y - 10} style={appear(ramp(f, 109.4))}><CityArms width={360} /></At>
    <Chip f={f} at={110.66} x={col} y={S.y + 90} w={colW} big gold>CITY OF BARCELONA</Chip>
    <Note f={f} at={111.0} x={col} y={S.y + 200} w={colW}>COAT OF ARMS · CROSS IN TWO QUARTERS, THE FOUR BARS IN THE OTHER TWO</Note>
    <Note f={f} at={111.0} x={col} y={S.y + 520} w={colW}>ILLUSTRATION</Note>
  </>},
  {a: 112.7, layout: 'split', draw: (f) => <>
    <Head f={f} at={112.7} layout="split" kicker="02 · THE CROSS" title="INTERESTINGLY…" />
    <At x={S.x + 40} y={S.y + 70} style={appear(ramp(f, 113.2))}><CrossField size={300} /></At>
    <Chip f={f} at={113.6} x={S.x + 40} y={S.y + 400} w={300}>BARÇA CREST</Chip>
    <At x={S.x + 450} y={S.y + 100} style={appear(ramp(f, 117.22))}><EnglandFlag width={420} /></At>
    <Chip f={f} at={117.7} x={S.x + 450} y={S.y + 400} w={420} gold>ENGLAND · NATIONAL FLAG</Chip>
  </>},
  {a: 119.42, layout: 'split', draw: (f) => {
    const stamp = ramp(f, 123.62, 8);
    return <>
      <Head f={f} at={119.42} layout="split" kicker="02 · THE CROSS" title="A RESEMBLANCE, NOT A LOAN" />
      <At x={S.x + 60} y={S.y + 80}><CrossField size={250} /></At>
      <At x={S.x + 600} y={S.y + 110}><EnglandFlag width={300} /></At>
      <div style={{position: 'absolute', left: S.x + 360, top: S.y + 120, width: 200, textAlign: 'center', fontFamily: LOCAL_FONTS.display, fontSize: 130, color: GOLD, lineHeight: 1, opacity: ramp(f, 121.16) * (1 - stamp)}}>=</div>
      <Arrow x1={S.x + 590} y1={S.y + 400} x2={S.x + 330} y2={S.y + 400} p={ramp(f, 123.3, 10)} color={MUTED} />
      <div style={{position: 'absolute', left: S.x + 290, top: S.y + 330, width: 340, textAlign: 'center', transform: `rotate(-7deg) scale(${lerp(1.6, 1, stamp)})`, opacity: stamp,
        border: `6px solid ${CREST.red}`, borderRadius: 14, padding: '8px 0', color: CREST.red, fontFamily: LOCAL_FONTS.display, fontSize: 54, background: '#07102acc'}}>NOT BORROWED</div>
      <Chip f={f} at={119.9} x={S.x + 60} y={S.y + 480} w={250}>BARCELONA</Chip>
      <Chip f={f} at={119.9} x={S.x + 600} y={S.y + 480} w={300}>ENGLAND</Chip>
    </>;
  }},
  {a: 126.68, layout: 'split', draw: (f) => {
    const p = ramp(f, 127.4, 20);
    return <>
      <Head f={f} at={126.68} layout="split" kicker="02 · THE CROSS" title="TWO TRADITIONS, ONE SAINT" />
      <div style={{position: 'absolute', left: S.x + 280, top: S.y + 10, width: 400, textAlign: 'center', ...appear(ramp(f, 126.8))}}>
        <div style={{margin: '0 auto', width: 130, height: 130, borderRadius: 65, background: '#fff', border: `7px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><CrossField size={84} /></div>
        <div style={{fontFamily: LOCAL_FONTS.display, fontSize: 46, color: GOLD, marginTop: 12}}>ST GEORGE</div>
        <div style={{fontWeight: 800, letterSpacing: 2.5, fontSize: 19, color: MUTED, opacity: ramp(f, 130.16)}}>VENERATED ACROSS EUROPE FOR CENTURIES</div>
      </div>
      <Arrow x1={S.x + 420} y1={S.y + 290} x2={S.x + 200} y2={S.y + 400} p={p} />
      <Arrow x1={S.x + 540} y1={S.y + 290} x2={S.x + 760} y2={S.y + 400} p={p} />
      <Chip f={f} at={128.4} x={S.x + 30} y={S.y + 430} w={380} big>CATALONIA · SANT JORDI</Chip>
      <Chip f={f} at={128.4} x={S.x + 560} y={S.y + 430} w={360} big>ENGLAND · ST GEORGE</Chip>
    </>;
  }},
  // ---- 03 · from city to club ----
  {a: 131.94, layout: 'full', sfx: 'whoosh', draw: (f) => <>
    <div style={{position: 'absolute', left: F.x, top: F.y + 20, width: 820, ...appear(ramp(f, 132.0))}}>
      <div style={{color: GOLD, fontWeight: 800, fontSize: 26, letterSpacing: 4}}>03 · FROM CITY TO CLUB</div>
      <div style={{fontFamily: LOCAL_FONTS.display, fontSize: 108, lineHeight: 1.02, color: INK, marginTop: 10}}>HOW DID THESE SYMBOLS BECOME <span style={{color: GOLD}}>FC BARCELONA'S?</span></div>
    </div>
    <CrestAt id="b20" cx={1440} cy={F.y + 280} width={500} draw={interpolate(f, [sec(132.2), sec(134.6)], [0, .74], clamp)} shadow={false} />
  </>},
  {a: 135.8, layout: 'split', sfx: 'whoosh', draw: (f) => <>
    <Head f={f} at={135.8} layout="split" kicker="03 · FROM CITY TO CLUB" title="THE FIRST BADGE" />
    <div style={{position: 'absolute', left: S.x + 30, top: S.y - 10, fontFamily: LOCAL_FONTS.display, fontSize: 200, color: GOLD, lineHeight: 1, ...appear(ramp(f, 137.94))}}>1899</div>
    <Chip f={f} at={136.34} x={S.x + 30} y={S.y + 230} w={460}>JOAN GAMPER FOUNDS THE CLUB</Chip>
    <At x={S.x + 590} y={S.y - 20} style={appear(ramp(f, 140.6))}><CityArms width={300} /></At>
    <Chip f={f} at={141.62} x={S.x + 30} y={S.y + 330} w={460} gold big>THE CITY'S COAT OF ARMS</Chip>
    <Note f={f} at={143.1} x={S.x + 30} y={S.y + 450} w={460}>USED AS THE CLUB'S OFFICIAL BADGE</Note>
  </>},
  {a: 144.3, layout: 'split', draw: (f) => {
    const p = interpolate(f, [sec(144.46), sec(145.6)], [0, 1], clamp);
    return <>
      <Head f={f} at={144.3} layout="split" kicker="03 · FROM CITY TO CLUB" title="1899 → 1910" />
      <div style={{position: 'absolute', left: S.x + 60, top: S.y + 70, width: 820, height: 10, borderRadius: 5, background: '#ffffff26'}}>
        <div style={{width: `${p * 100}%`, height: 10, borderRadius: 5, background: GOLD}} />
      </div>
      {[['1899', 0], ['1910', 1]].map(([l, k]) => <div key={l} style={{position: 'absolute', left: S.x + 60 + (k as number) * 820 - 70, top: S.y + 100, width: 140, textAlign: 'center', fontFamily: LOCAL_FONTS.display, fontSize: 58, color: k ? GOLD : INK, opacity: k ? ramp(f, 145.44) : 1}}>{l}</div>)}
      <Chip f={f} at={146.84} x={S.x + 60} y={S.y + 230} w={400}>ITS OWN IDENTITY</Chip>
      <Chip f={f} at={151.1} x={S.x + 480} y={S.y + 230} w={400} gold>A DISTINCTIVE EMBLEM</Chip>
      <div style={{position: 'absolute', left: S.x + 210, top: S.y + 360, width: 560, textAlign: 'center', transform: `rotate(-4deg) scale(${lerp(1.5, 1, ramp(f, 152.72, 8))})`, opacity: ramp(f, 152.72, 8),
        border: `6px solid ${GOLD}`, borderRadius: 16, padding: '14px 0', fontFamily: LOCAL_FONTS.display, fontSize: 64, color: GOLD, background: '#07102acc'}}>DESIGN COMPETITION</div>
    </>;
  }},
  {a: 155.24, layout: 'full', sfx: 'riser', draw: (f) => {
    const items: [CrestPart, string, number][] = [['cross', 'CROSS OF ST GEORGE', 162.8], ['senyera', 'FOUR RED STRIPES', 164.34], ['initials', "THE CLUB'S INITIALS", 166.74], ['colours', 'BLUE AND GARNET', 168.6], ['ball', 'A FOOTBALL', 170.56]];
    const show = Object.fromEntries(items.map(([p, , at]) => [p, ramp(f, at, 12)])) as Record<CrestPart, number>;
    return <>
      <div style={{position: 'absolute', left: F.x, top: F.y + 20, width: 760, ...appear(ramp(f, 155.3))}}>
        <div style={{color: GOLD, fontWeight: 800, fontSize: 24, letterSpacing: 4}}>THE WINNING DESIGN</div>
        <div style={{fontFamily: LOCAL_FONTS.display, fontSize: 76, lineHeight: 1.04, color: INK, marginTop: 6, opacity: ramp(f, 156.8)}}>THE CREST WE STILL RECOGNISE</div>
      </div>
      {items.map(([p, l, at], k) => <div key={p} style={{position: 'absolute', left: F.x, top: F.y + 250 + k * 66, display: 'flex', alignItems: 'center', gap: 18, opacity: lerp(.28, 1, ramp(f, at, 8))}}>
        <div style={{width: 42, height: 42, borderRadius: 10, border: `3px solid ${GOLD}`, background: ramp(f, at, 8) > .5 ? GOLD : 'transparent', color: '#1a1200', fontWeight: 900, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{ramp(f, at, 8) > .5 ? '✓' : ''}</div>
        <div style={{fontWeight: 900, letterSpacing: 2.5, fontSize: 28, color: INK}}>{l}</div>
      </div>)}
      <CrestAt id="b23" cx={1400} cy={F.y + 270} width={590} draw={interpolate(f, [sec(155.4), sec(159.6)], [0, 1], clamp)} show={show}
        bars={interpolate(f, [sec(164.34), sec(165.74)], [0, 4], clamp)} />
    </>;
  }},
  {a: 172.0, layout: 'split', sfx: 'whoosh', draw: (f) => {
    const top = ramp(f, 176.74), bottom = ramp(f, 179.34);
    return <>
      <Head f={f} at={172.0} layout="split" kicker="03 · FROM CITY TO CLUB" title="TWO SIDES OF THE CLUB" />
      <CrestAt id="b24" cx={left(470)} cy={S.y + 300} width={470} dim={{cross: bottom * .85, senyera: bottom * .85, initials: top * (1 - bottom) * .85, colours: top * (1 - bottom) * .85, ball: top * (1 - bottom) * .85}} />
      <div style={{position: 'absolute', left: col, top: S.y + 70, width: colW, ...appear(top), opacity: lerp(1, .35, bottom) * top}}>
        <div style={{fontWeight: 800, letterSpacing: 3, fontSize: 21, color: MUTED}}>TOP · CROSS AND BARS</div>
        <div style={{fontFamily: LOCAL_FONTS.display, fontSize: 56, lineHeight: 1.05, color: GOLD}}>BARCELONA AND CATALONIA</div>
      </div>
      <div style={{position: 'absolute', left: col, top: S.y + 330, width: colW, ...appear(bottom)}}>
        <div style={{fontWeight: 800, letterSpacing: 3, fontSize: 21, color: MUTED}}>BOTTOM · COLOURS AND BALL</div>
        <div style={{fontFamily: LOCAL_FONTS.display, fontSize: 56, lineHeight: 1.05, color: GOLD}}>A FOOTBALL INSTITUTION</div>
      </div>
    </>;
  }},
  {a: 182.08, layout: 'split', draw: (f) => <>
    <Head f={f} at={182.08} layout="split" kicker="1910 → TODAY" title="REDESIGNED, NEVER REPLACED" />
    <CrestAt id="b25" cx={left(430)} cy={S.y + 290} width={430} />
    <Note f={f} at={183.86} x={col} y={S.y + 20} w={colW}>SEVERAL VISUAL MODIFICATIONS · THE ESSENTIALS REMAINED</Note>
    {['CROSS OF ST GEORGE', 'FOUR RED STRIPES', 'FCB INITIALS', 'BLAUGRANA', 'THE BALL'].map((l, k) => <div key={l} style={{position: 'absolute', left: col, top: S.y + 120 + k * 72, display: 'flex', alignItems: 'center', gap: 16, ...appear(ramp(f, 186.14 + k * .32, 8))}}>
      <div style={{width: 40, height: 40, borderRadius: 20, background: GOLD, color: '#1a1200', fontWeight: 900, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>✓</div>
      <div style={{fontWeight: 900, letterSpacing: 2, fontSize: 25, color: INK}}>{l}</div>
    </div>)}
  </>},
  // ---- 04 · més que un club ----
  {a: 189.06, layout: 'split', sfx: 'whoosh', draw: (f) => <>
    <Head f={f} at={189.06} layout="split" kicker="04 · MÉS QUE UN CLUB" title="WHY IT MATTERS" />
    <CrestAt id="b26" cx={S.x + S.w / 2} cy={S.y + 300} width={interpolate(f, [sec(189.06), sec(197)], [500, 540], clamp)} />
    <div style={{position: 'absolute', left: S.x, width: S.w, top: S.y + 250, textAlign: 'center', transform: `rotate(-5deg) scale(${lerp(1.5, 1, ramp(f, 193.86, 8))})`, opacity: ramp(f, 193.86, 8)}}>
      <span style={{display: 'inline-block', border: `7px solid ${GOLD}`, borderRadius: 16, padding: '6px 34px', fontFamily: LOCAL_FONTS.display, fontSize: 84, color: GOLD, background: '#07102ae6'}}>NOT JUST A LOGO</span>
    </div>
  </>},
  {a: 197.18, layout: 'split', draw: (f) => {
    const words: [string, number, number, number][] = [['HISTORY', 198.44, 40, 30], ['CULTURE', 199.42, 640, 30], ['REGIONAL IDENTITY', 200.48, 40, 520], ['SPORTING TRADITION', 201.9, 560, 520]];
    return <>
      <CrestAt id="b27" cx={S.x + S.w / 2} cy={S.y + 280} width={400} />
      {words.map(([w, at, x, y]) => <div key={w} style={{position: 'absolute', left: S.x + x, top: S.y + y - 150, width: 360, textAlign: x < 300 ? 'left' : 'right', fontFamily: LOCAL_FONTS.display, fontSize: 58, lineHeight: 1.02, color: GOLD, ...appear(ramp(f, at, 9))}}>{w}</div>)}
    </>;
  }},
  {a: 203.5, layout: 'split', draw: (f) => <>
    <Head f={f} at={203.5} layout="split" kicker="04 · MÉS QUE UN CLUB" title="WORN ON EVERY SHIRT" />
    <At x={S.x + 30} y={S.y - 10} style={appear(ramp(f, 203.7))}><div style={{position: 'relative'}}>
      <Shirt width={430} id="b28" />
      <div style={{position: 'absolute', left: 250, top: 110}}><Crest width={86} id="b28c" shadow={false} /></div>
    </div></At>
    <div style={{position: 'absolute', left: col, top: S.y + 40, width: colW, ...appear(ramp(f, 207.74))}}>
      <div style={{fontWeight: 800, letterSpacing: 3, fontSize: 21, color: MUTED}}>THE SYMBOLS</div>
      <div style={{fontFamily: LOCAL_FONTS.display, fontSize: 96, color: GOLD, lineHeight: 1}}>c. 1150</div>
    </div>
    <div style={{position: 'absolute', left: col, top: S.y + 250, width: colW, ...appear(ramp(f, 209.56))}}>
      <div style={{fontWeight: 800, letterSpacing: 3, fontSize: 21, color: MUTED}}>THE CLUB</div>
      <div style={{fontFamily: LOCAL_FONTS.display, fontSize: 96, color: INK, lineHeight: 1}}>1899</div>
    </div>
  </>},
  {a: 211.14, layout: 'full', sfx: 'riser', draw: (f) => <>
    <div style={{position: 'absolute', left: 0, right: 0, top: 120, bottom: 120, background: `radial-gradient(ellipse at 50% 46%, ${GOLD}2e 0%, transparent 55%)`, opacity: ramp(f, 211.4, 30)}} />
    <CrestAt id="b29" cx={960} cy={470} width={interpolate(f, [sec(211.14), sec(225)], [470, 520], clamp)} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 742, textAlign: 'center', fontWeight: 800, letterSpacing: 6, fontSize: 28, color: MUTED, opacity: ramp(f, 215.86)}}>SOMETHING BIGGER THAN FOOTBALL</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 772, textAlign: 'center', fontFamily: LOCAL_FONTS.display, fontSize: 124, color: GOLD, letterSpacing: 4,
      transform: `scale(${lerp(1.25, 1, ramp(f, 218.48, 10))})`, opacity: ramp(f, 218.48, 10), textShadow: '0 16px 50px #000b'}}>MÉS QUE UN CLUB</div>
  </>},
];
// Word-timed ticks under the 1910 assembly.
const TICKS = [162.8, 164.34, 166.74, 168.6, 170.56];

const beatIndex = (t: number) => { let i = 0; while (i + 1 < BEATS.length && BEATS[i + 1].a <= t) i++; return i; };
const box = (a: Box, b: Box, k: number): Box => ({x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), w: lerp(a.w, b.w, k), h: lerp(a.h, b.h, k)});

export const CrestHistoryLong: React.FC<SourceEpisodeProps> = ({spec, words, pages}) => {
  const f = useCurrentFrame(); const t = f / FPS; const main = shortFrames(spec); const total = longFrames(spec);
  const i = beatIndex(t); const beat = BEATS[i]; const prev = BEATS[Math.max(0, i - 1)];
  const k = i === 0 ? 1 : interpolate(f, [sec(beat.a), sec(beat.a) + 16], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const pres = box(PRESENTER[prev.layout], PRESENTER[beat.layout], k); const stage = box(STAGE[prev.layout], STAGE[beat.layout], k);
  const ci = spec.chapters.reduce((n, c, j) => c.at <= t ? j : n, 0); const chapter = spec.chapters[ci];
  const chapterIn = interpolate(f, [sec(chapter.at), sec(chapter.at) + 12], [0, 1], clamp);
  const fadeIn = interpolate(f, [sec(beat.a), sec(beat.a) + 10], [0, 1], clamp); const fadeOut = 1 - interpolate(f, [sec(beat.a), sec(beat.a) + 8], [0, 1], clamp);
  const presenterOut = interpolate(f, [sec(OUTRO) - 6, sec(OUTRO) + 4], [1, 0], clamp);
  const musicVol = (fr: number) => fr < main ? .16 * interpolate(fr, [0, 60], [0, 1], clamp) * (fr > sec(OUTRO) ? 2.4 : 1) : interpolate(fr, [main, main + 20, total - 45, total], [.4, .5, .5, 0], clamp);
  return <AbsoluteFill style={{background: '#07102a', color: INK, fontFamily: LOCAL_FONTS.body}}>
    {f < main ? <>
      <RadarBg tint={ci % 2 ? BLAU : GRANA} />
      <div style={{position: 'absolute', left: stage.x, top: stage.y, width: stage.w, height: stage.h, borderRadius: 28, background: 'linear-gradient(150deg, #0d1a3cf2, #060d22f5)', border: '1px solid #ffffff1c', boxShadow: '0 30px 80px #0009'}} />
      <div style={{position: 'absolute', top: 44, left: 70, display: 'flex', alignItems: 'baseline', gap: 22}}>
        <span style={{fontFamily: LOCAL_FONTS.display, fontSize: 40, letterSpacing: 2}}>BARÇA <span style={{color: GOLD}}>RADAR</span></span>
        <span style={{fontSize: 20, fontWeight: 700, letterSpacing: 3, color: '#b0bfd3'}}>{spec.label}</span>
      </div>
      {ci > 0 && <div style={{position: 'absolute', top: 46, right: 150, opacity: chapterIn, transform: `translateY(${(1 - chapterIn) * -16}px)`, display: 'flex', alignItems: 'center', gap: 14, background: '#050914d9', border: '1px solid #ffffff1f', borderRadius: 12, padding: '8px 18px'}}>
        <span style={{fontFamily: LOCAL_FONTS.display, fontSize: 26, color: GOLD}}>{String(ci).padStart(2, '0')}/{String(spec.chapters.length - 1).padStart(2, '0')}</span>
        <span style={{fontWeight: 800, fontSize: 20, letterSpacing: 2.5}}>{chapter.title.toUpperCase()}</span>
      </div>}
      {i > 0 && fadeOut > 0 && <AbsoluteFill style={{opacity: fadeOut}}>{prev.draw(f)}</AbsoluteFill>}
      <AbsoluteFill style={{opacity: fadeIn}}>{beat.draw(f)}</AbsoluteFill>
      <div style={{opacity: presenterOut}}>
        <Presenter spec={spec} t={t} style={{left: pres.x, top: pres.y, width: pres.w, height: pres.h, borderRadius: lerp(26, 22, k), ...(beat.layout === 'full' ? {border: `3px solid ${GOLD}`} : {})}} />
      </div>
      {t < 6 && <div style={{position: 'absolute', left: 104, top: 770, opacity: interpolate(f, [24, 38, 5.2 * FPS, 5.6 * FPS], [0, 1, 1, 0], clamp), display: 'flex', alignItems: 'center', gap: 16, background: '#050914e6', padding: '12px 26px 12px 14px', borderRadius: 16, borderLeft: `8px solid ${GOLD}`}}>
        <Mark size={70} brand="radar" />
        <div><div style={{fontFamily: LOCAL_FONTS.display, fontSize: 46, lineHeight: 1}}>{spec.presenter}</div><div style={{fontWeight: 900, fontSize: 22, color: GOLD, letterSpacing: 4}}>BARÇA RADAR</div></div>
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

/** 1280×720 thumbnail: the real crest, big, beside the title and the presenter. */
export const CrestHistoryThumb: React.FC<SourceEpisodeProps> = ({spec}) => <AbsoluteFill style={{background: 'radial-gradient(ellipse at 30% 50%, #1b3a8a 0%, #0a1638 55%, #050a1c 100%)', fontFamily: LOCAL_FONTS.body}}>
  <AbsoluteFill style={{background: `radial-gradient(circle at 27% 50%, ${GOLD}55 0%, transparent 32%)`}} />
  <div style={{position: 'absolute', left: 36, top: 46, transform: 'rotate(-6deg)'}}><Crest width={470} id="thumb" /></div>
  <div style={{position: 'absolute', left: 560, top: 70, right: 40}}>
    <div style={{display: 'inline-block', background: GOLD, color: '#111', fontWeight: 900, fontSize: 30, letterSpacing: 2, padding: '6px 16px', borderRadius: 10}}>BARÇA HISTORY</div>
    <div style={{fontFamily: LOCAL_FONTS.display, fontSize: 118, lineHeight: .98, color: '#fff', marginTop: 18, textShadow: '0 8px 0 #0008'}}>WHY IT<br />LOOKS<br /><span style={{color: GOLD}}>LIKE THIS</span></div>
  </div>
  <div style={{position: 'absolute', right: 30, bottom: 26, width: 250, height: 250, borderRadius: 125, overflow: 'hidden', border: `7px solid ${GOLD}`, boxShadow: '0 16px 40px #000a'}}>
    <Img src={media(spec, 'cover.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%'}} />
  </div>
</AbsoluteFill>;
