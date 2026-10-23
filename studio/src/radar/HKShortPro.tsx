// RADAR PRO — premium vertical Short: AI-matted presenter over a living background, giant words BEHIND him
// (depth), emphasis punch-ins, whip-transition graphic inserts, kinetic captions with an active-word box.
// Source: public/host/HK/HK-RS3.mp4 (cut, audio) + HK-RS3-matte.webm (VP9 alpha), both made in the render workflow.
import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, random, Easing} from 'remotion';
import {DISPLAY, BODY, Grain, clamp} from '../lib';
import {Mark} from '../Branding';
import edit from './HK.edit.json';
import {Edit, FPS, NAVY, GOLD, GRANA, BLAU, RED, ramp, popIn, fadeIn} from './RadarStory';
import {makeCut, cutT} from './RadarShorts';

const ed = edit as Edit;
const c = makeCut(ed, [{from: 'L01', to: 'L03'}, {from: 'L41', to: 'L46'}]);
const T = cutT(c);
export const HK_RS3_FRAMES = Math.round(c.dur * FPS) + 12;

// ---------- background: gradient + light beams + bokeh ----------
const Bg: React.FC<{f: number; hue: string}> = ({f, hue}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 38%, ${hue} 0%, #0b0a2a 52%, #030311 100%)`}}>
    {[0, 1, 2].map((k) => <div key={k} style={{position: 'absolute', left: 540, top: -200, width: 2200, height: 2600, marginLeft: -1100,
      background: `conic-gradient(from ${200 + k * 50 + Math.sin(f / 70 + k) * 18}deg at 50% 0%, transparent 0deg, #ffffff12 7deg, transparent 15deg)`, mixBlendMode: 'screen'}} />)}
    {Array.from({length: 26}).map((_, k) => {
      const x = random(`bx${k}`) * 1080, y0 = random(`by${k}`) * 1920, r = 6 + random(`br${k}`) * 26, sp = 0.3 + random(`bs${k}`) * 0.9;
      const y = ((y0 - f * sp * 2) % 1920 + 1920) % 1920;
      return <div key={k} style={{position: 'absolute', left: x, top: y, width: r * 2, height: r * 2, borderRadius: r, background: k % 3 ? '#ffffff' : GOLD, opacity: 0.06 + random(`bo${k}`) * 0.12, filter: 'blur(4px)'}} />;
    })}
    <svg width={1080} height={1920} style={{position: 'absolute', opacity: 0.22}}>
      <g transform="translate(540 760)">{[220, 380, 540, 700].map((r) => <circle key={r} r={r} fill="none" stroke="#ffffff" strokeWidth={2} strokeDasharray="6 18" transform={`rotate(${f * (r % 3 ? 0.2 : -0.15)})`} />)}</g>
    </svg>
  </AbsoluteFill>
);

// ---------- giant words behind the presenter ----------
type BW = {at: number; text: string; color?: string; outline?: boolean; size?: number};
const BackWord: React.FC<{f: number; words: BW[]}> = ({f, words}) => {
  const i = words.filter((w) => w.at <= f).length - 1;
  if (i < 0) return null;
  const w = words[i];
  const k = ramp(f, w.at, w.at + 10, 0, 1, Easing.out(Easing.back(1.4)));
  const size = w.size ?? 330;
  return (
    <div style={{position: 'absolute', left: -40, right: -40, top: 360, textAlign: 'center', fontFamily: DISPLAY, fontSize: size, lineHeight: 0.86,
      color: w.outline ? 'transparent' : (w.color ?? '#fff'), WebkitTextStroke: w.outline ? `6px ${w.color ?? GOLD}` : undefined,
      transform: `scale(${1.25 - 0.25 * k}) translateY(${Math.sin(f / 40) * 6}px)`, opacity: Math.min(1, k * 1.4), filter: `blur(${(1 - k) * 12}px)`,
      textShadow: w.outline ? 'none' : '0 20px 60px #0008', whiteSpace: 'pre-line'}}>{w.text}</div>
  );
};

// ---------- presenter cut-out ----------
const Presenter: React.FC<{f: number; pulses: number[]; hidden: boolean}> = ({f, pulses, hidden}) => {
  const p = Math.max(0, ...pulses.map((t) => (f >= t && f < t + 26 ? interpolate(f, [t, t + 5, t + 26], [0, 1, 0], clamp) : 0)));
  const breathe = 1 + 0.012 * Math.sin(f / 50);
  const W = 1240;
  return (
    <div style={{position: 'absolute', left: (1080 - W) / 2, top: 600, width: W, height: W, transform: `scale(${(1 + 0.09 * p) * breathe})`, transformOrigin: '50% 30%',
      opacity: hidden ? 0 : 1, filter: 'drop-shadow(0 0 26px #f2c2304d) drop-shadow(0 30px 40px #000a) contrast(1.06) saturate(1.12) brightness(1.03)'}}>
      <OffthreadVideo src={staticFile('host/HK/HK-RS3-matte.webm')} transparent muted style={{width: '100%', height: '100%'}} />
    </div>
  );
};

// ---------- kinetic captions with active-word box ----------
const Captions: React.FC<{f: number}> = ({f}) => {
  const t = f / FPS;
  const li = c.lines.find((l) => t >= l.s - 0.1 && t <= l.e + 0.2);
  if (!li) return null;
  const ws = c.words.filter((w) => w.line === li.id);
  const chunks: typeof ws[] = []; let cur: typeof ws = [];
  for (const w of ws) { cur.push(w); if (cur.length >= 3 || /[.,:;?!—]$/.test(w.w)) { chunks.push(cur); cur = []; } }
  if (cur.length) chunks.push(cur);
  const ch = chunks.find((x) => t <= x[x.length - 1].e + 0.08) ?? chunks[chunks.length - 1];
  const k = popIn(f, Math.round(ch[0].s * FPS));
  return (
    <div style={{position: 'absolute', left: 30, right: 30, top: 1370, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '6px 16px', transform: `scale(${0.86 + 0.14 * k}) rotate(${(1 - k) * -3}deg)`}}>
      {ch.map((w, j) => {
        const on = t >= w.s - 0.03 && t <= w.e + 0.06;
        return <span key={j} style={{fontFamily: DISPLAY, fontSize: 104, lineHeight: 1.08, textTransform: 'uppercase', padding: '0 14px', borderRadius: 14,
          background: on ? GOLD : 'transparent', color: on ? '#000' : t > w.e ? '#fff' : '#ffffff88', WebkitTextStroke: on ? '0' : '3px #000', paintOrder: 'stroke fill',
          textShadow: on ? 'none' : '0 8px 0 #000b', transform: `scale(${on ? 1.06 : 1})`}}>{w.w.replace(/—/g, '')}</span>;
      })}
    </div>
  );
};

// ---------- whip insert (full screen graphic) ----------
const Insert: React.FC<{f: number; a: number; b: number; children: React.ReactNode; bg?: string}> = ({f, a, b, children, bg = NAVY}) => {
  if (f < a - 6 || f > b + 6) return null;
  const inK = ramp(f, a - 6, a + 4, 0, 1, Easing.out(Easing.cubic)), outK = ramp(f, b - 4, b + 6, 0, 1, Easing.in(Easing.cubic));
  const x = (1 - inK) * 1200 - outK * 1200;
  const blur = Math.abs(x) / 40;
  return (
    <AbsoluteFill style={{transform: `translateX(${x}px) skewX(${-x / 120}deg)`, filter: `blur(${blur}px)`}}>
      <AbsoluteFill style={{background: `linear-gradient(160deg, ${bg} 0%, #050514 100%)`}} />
      {children}
    </AbsoluteFill>
  );
};

const Chip: React.FC<{children: React.ReactNode; bg?: string; color?: string; size?: number}> = ({children, bg = GOLD, color = '#000', size = 52}) =>
  <span style={{fontFamily: DISPLAY, fontSize: size, color, background: bg, padding: '4px 26px', borderRadius: 14, display: 'inline-block'}}>{children}</span>;

export const HKShortPro: React.FC = () => {
  const f = useCurrentFrame();
  const total = HK_RS3_FRAMES;
  const twistA = T.s('L41') - 6, twistB = T.s('L41') + 26;
  const rA = T.w('L43', 0) - 2, rB = T.w('L43', 6) - 4, fA = T.w('L43', 6) - 2, fB = T.e('L43') + 2;
  const back: BW[] = [
    {at: T.w('L01', 3), text: 'WIN\nTHE\nLEAGUE', size: 300},
    {at: T.w('L01', 13), text: 'REAL\nMADRID', color: '#ffffff', size: 330},
    {at: T.w('L02', 5), text: '10·05\n2026', color: GOLD, outline: true, size: 330},
    {at: T.w('L03', 3), text: 'FIRST\nTIME', color: '#fff', size: 360},
    {at: T.w('L03', 14), text: '2–0', color: GOLD, size: 560},
    {at: T.w('L42', 9), text: 'GONE', color: RED, size: 470},
    {at: T.s('L44'), text: 'THE\nQUESTION', color: '#fff', outline: true, size: 300},
    {at: T.w('L45', 10), text: 'EUROPE?', color: GOLD, size: 300},
    {at: T.s('L46'), text: 'YOU?', color: '#fff', outline: true, size: 460},
  ];
  const pulses = [T.w('L01', 15), T.w('L03', 3), T.w('L03', 14), T.w('L42', 10), T.w('L45', 10), T.w('L45', 4)];
  const hue = f < T.s('L41') ? '#3a1360' : f < T.s('L44') ? '#5a0b2e' : '#14306e';
  const inInsert = (f >= twistA && f <= twistB) || (f >= rA && f <= fB);
  return (
    <AbsoluteFill style={{background: '#030311', fontFamily: BODY, overflow: 'hidden'}}>
      <Bg f={f} hue={hue} />
      <BackWord f={f} words={back} />
      <Presenter f={f} pulses={pulses} hidden={false} />
      {/* front chips beside the head */}
      {f >= T.w('L02', 5) && f < T.s('L03') && <div style={{position: 'absolute', left: 60, top: 1180, transform: `scale(${popIn(f, T.w('L02', 7))}) rotate(-4deg)`}}><Chip bg="#fff">CAMP NOU</Chip></div>}
      {f >= T.w('L03', 3) && f < T.s('L41') - 8 && <div style={{position: 'absolute', right: 50, top: 1180, transform: `scale(${popIn(f, T.w('L03', 5))}) rotate(4deg)`}}><Chip bg={RED} color="#fff">FIRST TIME EVER</Chip></div>}
      {f >= T.s('L46') && <div style={{position: 'absolute', left: 0, right: 0, top: 1180, display: 'flex', justifyContent: 'center', gap: 26}}>
        {['YES', 'NO'].map((t, k) => <div key={t} style={{transform: `scale(${popIn(f, T.s('L46') + 6 + k * 6)})`}}><Chip bg={k ? '#fff' : GOLD} size={70}>{t}</Chip></div>)}
      </div>}
      {/* inserts */}
      <Insert f={f} a={twistA} b={twistB} bg="#2a0716">
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          {[0, 1, 2].map((k) => <div key={k} style={{position: 'absolute', fontFamily: DISPLAY, fontSize: 300, color: [RED, BLAU, '#fff'][k], opacity: k === 2 ? 1 : 0.7,
            transform: `translate(${k === 2 ? 0 : (k ? 1 : -1) * (6 + 6 * Math.sin(f * 1.3))}px, ${k === 2 ? 0 : (k ? -1 : 1) * 4}px)`, mixBlendMode: k === 2 ? 'normal' : 'screen'}}>TWIST</div>)}
          <div style={{position: 'absolute', top: 1170, fontFamily: BODY, fontWeight: 900, fontSize: 40, color: GOLD, letterSpacing: 10}}>AND HERE'S THE…</div>
        </AbsoluteFill>
      </Insert>
      <Insert f={f} a={rA} b={rB} bg="#111a3a">
        <div style={{position: 'absolute', left: 70, right: 70, top: 430}}>
          <div style={{fontFamily: BODY, fontWeight: 900, fontSize: 40, color: GOLD, letterSpacing: 6}}>SCORED ON 10 MAY · 1–0</div>
          <div style={{fontFamily: DISPLAY, fontSize: 210, color: '#fff', lineHeight: 0.95}}>RASHFORD</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 30}}><span style={{fontFamily: DISPLAY, fontSize: 140, color: GOLD}}>→</span><span style={{fontFamily: DISPLAY, fontSize: 120, color: '#fff'}}>ENGLAND</span></div>
          <div style={{marginTop: 30, transform: `rotate(-6deg) scale(${popIn(f, rA + 18)})`, display: 'inline-block'}}><Chip bg={RED} color="#fff" size={90}>GONE</Chip></div>
        </div>
      </Insert>
      <Insert f={f} a={fA} b={fB} bg="#2a0716">
        <div style={{position: 'absolute', left: 70, right: 70, top: 400}}>
          <div style={{fontFamily: BODY, fontWeight: 900, fontSize: 40, color: GOLD, letterSpacing: 6}}>SCORED ON 10 MAY · 2–0</div>
          <div style={{fontFamily: DISPLAY, fontSize: 190, color: '#fff', lineHeight: 0.95, whiteSpace: 'pre-line'}}>{'FERRAN\nTORRES'}</div>
          {f >= T.w('L43', 11) && <div style={{marginTop: 26, transform: `scale(${popIn(f, T.w('L43', 11))})`, transformOrigin: 'left', display: 'inline-block'}}><Chip size={56}>WORLD CUP FINAL WINNER</Chip></div>}
          {f >= T.w('L43', 17) && <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 26, opacity: fadeIn(f, T.w('L43', 17))}}><span style={{fontFamily: DISPLAY, fontSize: 140, color: GOLD}}>→</span><span style={{fontFamily: DISPLAY, fontSize: 130, color: '#fff'}}>PSG</span></div>}
        </div>
      </Insert>
      {!inInsert && <Captions f={f} />}
      {/* brand */}
      <div style={{position: 'absolute', left: 40, top: 60, display: 'flex', alignItems: 'center', gap: 16}}>
        <Mark size={84} brand="radar" />
        <div><div style={{fontFamily: DISPLAY, fontSize: 38, color: '#fff', lineHeight: 1}}>BARÇA RADAR</div><div style={{fontFamily: BODY, fontWeight: 900, fontSize: 22, color: GOLD, letterSpacing: 4}}>WITH MORTI</div></div>
      </div>
      <div style={{position: 'absolute', left: 0, top: 0, height: 10, width: `${(f / total) * 100}%`, background: GOLD}} />
      <Grain opacity={0.05} />
      <Audio src={staticFile('host/HK/HK-RS3.mp4')} />
      <Audio src={staticFile('music/km/hit-the-streets.mp3')} volume={(fr) => interpolate(fr, [0, 15, total - 20, total], [0, 0.07, 0.07, 0], clamp)} />
      {[{at: T.w('L01', 3), s: 'whoosh'}, {at: T.w('L01', 13), s: 'hit'}, {at: T.w('L02', 5), s: 'hit'}, {at: T.w('L03', 14), s: 'impact'}, {at: twistA, s: 'whoosh'}, {at: twistA + 6, s: 'impact'},
        {at: T.w('L42', 9), s: 'hit'}, {at: rA - 4, s: 'whoosh'}, {at: rA + 18, s: 'hit'}, {at: fA - 4, s: 'whoosh'}, {at: fB, s: 'whoosh'}, {at: T.w('L45', 9), s: 'impact'}, {at: T.s('L46') + 6, s: 'pop'}]
        .map((x, k) => <Sequence key={k} from={Math.max(0, x.at)}><Audio src={staticFile(`sfx/${x.s}.wav`)} volume={0.32} /></Sequence>)}
    </AbsoluteFill>
  );
};
