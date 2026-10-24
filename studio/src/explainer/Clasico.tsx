// "Why is it called El Clásico?" — vertical Explainer Short (1080×1920) for Barça Radar.
// Look: dark charcoal vignette, one flat illustration per narration beat (kits, shields, ticket card, crown, trophy,
// archive photo), phrase captions under the visual; the picture changes every 2–4 s, keyed to the narrator's words.
// Timeline: src/explainer/clasico.timing.json (scripts/gen-explainer.mjs) — placeholder voice or the final ElevenLabs take.
// No club crests: generic shields in club colours. Photos: CC0 / public domain only (public/photos/*/licenses.tsv).
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {loadFont as loadMontserrat} from '@remotion/google-fonts/Montserrat';
import {loadFont as loadPlayfair} from '@remotion/google-fonts/PlayfairDisplay';
import {DISPLAY, Grain, clamp} from '../lib';
import {Mark} from '../Branding';
import {pop, ramp, fade} from '../shorts/kit';
import T from './clasico.timing.json';

const {fontFamily: SANS} = loadMontserrat('normal', {weights: ['600', '800', '900'], subsets: ['latin', 'latin-ext']});
const {fontFamily: SERIF} = loadPlayfair('normal', {weights: ['700', '900'], subsets: ['latin', 'latin-ext']});

const FPS = 30;
const K = {bg: '#141414', ink: '#f4f1ea', dim: '#8d8a84', gold: '#d9b25f', blau: '#1d3f9a', grana: '#a3123a', paper: '#e8dcc0', paperInk: '#3a2f22', red: '#b8322a', line: '#2c2c2c'};
const CX = 540, CY = 740; // centre of the visual stage; captions sit below it

type Word = {w: string; beat: string; s: number; e: number};
type Beat = {id: string; v: string; text: string; s: number; e: number};
const beats = T.beats as Beat[];
const words = T.words as Word[];
export const CLASICO_FRAMES = Math.ceil(T.duration * FPS);

const norm = (x: string) => x.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const startF = (b: Beat) => Math.round(b.s * FPS) - 3;
const windows = beats.map((b, i) => ({b, from: startF(b), to: i < beats.length - 1 ? startF(beats[i + 1]) + 6 : CLASICO_FRAMES})); // 6-frame overlap = crossfade into the next beat

/** Props every beat visual gets: local frame, beat length, and the local frame where its n-th word (or a given word) starts. */
type V = {f: number; dur: number; w: (n: number | string) => number};

// ───────────────────────── drawing primitives ─────────────────────────
const SHIRT = 'M62 22 L86 12 Q100 30 114 12 L138 22 L186 52 L166 90 L146 76 L146 188 L54 188 L54 76 L34 90 L14 52 Z';
const Shirt: React.FC<{kind: 'barca' | 'madrid'; size: number; num?: string; name?: string}> = ({kind, size, num, name}) => {
  const id = `sh${kind}${num ?? ''}`;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{filter: 'drop-shadow(0 18px 30px rgba(0,0,0,.55))'}}>
      <defs><clipPath id={id}><path d={SHIRT} /></clipPath></defs>
      {kind === 'barca' ? (
        <g clipPath={`url(#${id})`}>
          <rect width="200" height="200" fill={K.blau} />
          {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={30 + k * 32} y="0" width="16" height="200" fill={K.grana} />)}
          <path d="M62 22 L86 12 Q100 30 114 12 L138 22" stroke={K.gold} strokeWidth="6" fill="none" />
        </g>
      ) : (
        <g clipPath={`url(#${id})`}>
          <rect width="200" height="200" fill="#f2f0ea" />
          <rect y="180" width="200" height="10" fill="#d8d4ca" />
          <path d="M62 22 L86 12 Q100 30 114 12 L138 22" stroke={K.gold} strokeWidth="5" fill="none" />
        </g>
      )}
      {name && <text x="100" y="78" textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize="15" letterSpacing="2" fill={kind === 'barca' ? K.gold : '#22305a'}>{name}</text>}
      {num && <text x="100" y="150" textAnchor="middle" fontFamily={DISPLAY} fontSize="72" fill={kind === 'barca' ? K.gold : '#22305a'}>{num}</text>}
    </svg>
  );
};

const SHIELD = 'M22 18 H178 V98 Q178 160 100 194 Q22 160 22 98 Z';
const Shield: React.FC<{kind: 'barca' | 'madrid' | 'grey' | 'mfc'; size: number; crown?: number}> = ({kind, size, crown = 1}) => {
  const id = `sd${kind}`;
  return (
    <svg width={size} height={size * 1.12} viewBox="0 -24 200 224" style={{filter: 'drop-shadow(0 14px 24px rgba(0,0,0,.5))'}}>
      <defs><clipPath id={id}><path d={SHIELD} /></clipPath></defs>
      {kind === 'barca' && (
        <g clipPath={`url(#${id})`}>
          <rect y="0" width="200" height="200" fill={K.blau} />
          {[0, 1, 2].map((k) => <rect key={k} x={44 + k * 44} y="70" width="22" height="140" fill={K.grana} />)}
          <rect width="200" height="70" fill={K.gold} />
          <text x="100" y="54" textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize="40" letterSpacing="6" fill={K.blau}>FCB</text>
        </g>
      )}
      {kind === 'madrid' && (
        <g clipPath={`url(#${id})`}>
          <rect width="200" height="200" fill="#f4f2ec" />
          <path d="M22 150 L178 60 L178 92 L22 182 Z" fill="#2b3f8f" />
          <text x="100" y="108" textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize="58" fill={K.gold}>RM</text>
        </g>
      )}
      {kind === 'mfc' && (
        <g clipPath={`url(#${id})`}>
          <rect width="200" height="200" fill="#f4f2ec" />
          <text x="100" y="118" textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize="56" fill="#2b3f8f">MFC</text>
        </g>
      )}
      {kind === 'grey' && <path d={SHIELD} fill="#3a3a3a" />}
      <path d={SHIELD} fill="none" stroke={kind === 'barca' ? K.gold : kind === 'grey' ? '#555' : K.gold} strokeWidth="7" />
      {kind === 'madrid' && crown > 0 && <g transform={`translate(100 0) scale(${crown}) translate(-100 0)`} opacity={Math.min(1, crown * 1.5)}><Crown x={60} y={-22} s={0.4} /></g>}
    </svg>
  );
};

const Crown: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M10 90 L0 20 L50 55 L100 0 L150 55 L200 20 L190 90 Z" fill={K.gold} stroke="#8c6a26" strokeWidth="4" />
    <rect x="10" y="90" width="180" height="22" rx="4" fill={K.gold} stroke="#8c6a26" strokeWidth="4" />
    {[0, 50, 100, 150, 200].map((cx, k) => <circle key={k} cx={cx} cy={k % 2 ? 55 : k === 2 ? 0 : 20} r="11" fill="#f6e2a6" stroke="#8c6a26" strokeWidth="3" />)}
    {[50, 100, 150].map((cx) => <circle key={cx} cx={cx} cy="101" r="6" fill={K.grana} />)}
  </g>
);
const CrownSvg: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size * 0.6} viewBox="-14 -14 228 140" style={{filter: 'drop-shadow(0 16px 30px rgba(217,178,95,.25))'}}><Crown x={0} y={0} s={1} /></svg>
);

const Cup: React.FC<{size: number; color?: string}> = ({size, color = K.gold}) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{filter: 'drop-shadow(0 14px 26px rgba(0,0,0,.5))'}}>
    <path d="M55 20 H145 V70 Q145 120 100 128 Q55 120 55 70 Z" fill={color} stroke="#8c6a26" strokeWidth="4" />
    <path d="M55 36 Q18 36 22 66 Q26 96 62 98" fill="none" stroke={color} strokeWidth="12" />
    <path d="M145 36 Q182 36 178 66 Q174 96 138 98" fill="none" stroke={color} strokeWidth="12" />
    <rect x="90" y="126" width="20" height="30" fill={color} />
    <rect x="62" y="154" width="76" height="26" rx="4" fill={color} stroke="#8c6a26" strokeWidth="4" />
    <path d="M78 34 Q76 80 98 112" stroke="#fff6d8" strokeWidth="7" fill="none" opacity=".55" strokeLinecap="round" />
  </svg>
);

const Star: React.FC<{size: number; color?: string}> = ({size, color = K.gold}) => (
  <svg width={size} height={size} viewBox="0 0 100 100"><path d="M50 4 L62 38 L98 38 L69 59 L80 94 L50 73 L20 94 L31 59 L2 38 L38 38 Z" fill={color} /></svg>
);

/** Springy entrance: scale + fade from the frame `at`. */
const In: React.FC<{f: number; at: number; children: React.ReactNode; from?: number; dy?: number; style?: React.CSSProperties}> = ({f, at, children, from = 0.55, dy = 0, style}) => {
  const k = pop(f, at, FPS, 12);
  return <div style={{opacity: Math.min(1, k * 1.6), transform: `translateY(${(1 - k) * dy}px) scale(${from + (1 - from) * k})`, ...style}}>{children}</div>;
};
const Abs: React.FC<{x: number; y: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, children, style}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...style}}>{children}</div>
);
const Label: React.FC<{children: React.ReactNode; size?: number; color?: string; ls?: number; style?: React.CSSProperties}> = ({children, size = 38, color = K.gold, ls = 3, style}) => (
  <div style={{fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: ls, color, whiteSpace: 'nowrap', textTransform: 'uppercase', ...style}}>{children}</div>
);
const Big: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 190, color = K.gold, style}) => (
  <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: size, color, lineHeight: 1, whiteSpace: 'nowrap', textShadow: '0 10px 40px rgba(0,0,0,.6)', ...style}}>{children}</div>
);
const Rule: React.FC<{f: number; at: number; w: number; color?: string}> = ({f, at, w, color = '#3a3a3a'}) => (
  <div style={{width: w * ramp(f, at, at + 14, 0, 1), height: 3, background: color}} />
);
const countTo = (f: number, a: number, b: number, from: number, to: number) => Math.round(ramp(f, a, b, from, to));

const Photo: React.FC<{src: string; w: number; h: number; f: number; pos?: string; tilt?: number; bw?: boolean}> = ({src, w, h, f, pos = 'center', tilt = 0, bw = true}) => (
  <div style={{width: w, height: h, overflow: 'hidden', borderRadius: 6, transform: `rotate(${tilt}deg)`, boxShadow: '0 24px 60px rgba(0,0,0,.6)', border: '10px solid #efeae0'}}>
    <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${1.04 + f * 0.0012})`, filter: bw ? 'grayscale(1) contrast(1.08)' : undefined}} />
  </div>
);

const Ticket: React.FC<{lines: React.ReactNode; tilt?: number; w?: number}> = ({lines, tilt = -3, w = 640}) => (
  <div style={{width: w, padding: '46px 40px', background: K.paper, color: K.paperInk, transform: `rotate(${tilt}deg)`, boxShadow: '0 30px 70px rgba(0,0,0,.6)',
    backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,.35), transparent 60%), radial-gradient(circle at 80% 90%, rgba(120,90,40,.18), transparent 50%)',
    outline: '3px dashed rgba(58,47,34,.35)', outlineOffset: -18, textAlign: 'center'}}>{lines}</div>
);

const Pitch: React.FC<{f: number}> = ({f}) => (
  <svg width="1000" height="400" viewBox="0 0 1000 520" preserveAspectRatio="none" style={{position: 'absolute', left: CX - 500, top: CY - 110, opacity: fade(f, 0, 10)}}>
    <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1f3a2a" stopOpacity="0" /><stop offset=".35" stopColor="#1f3a2a" /><stop offset="1" stopColor="#152a1e" /></linearGradient></defs>
    <path d="M230 40 H770 L990 520 H10 Z" fill="url(#pg)" />
    <path d="M230 40 H770 L990 520 H10 Z M120 280 H880" fill="none" stroke="#3f6b50" strokeWidth="3" opacity=".8" />
    <ellipse cx="500" cy="280" rx="190" ry="58" fill="none" stroke="#3f6b50" strokeWidth="3" opacity=".8" />
  </svg>
);

const Globe: React.FC<{f: number; size: number}> = ({f, size}) => {
  const r = 200, rot = (f * 1.6) % 60;
  const dots = [[-90, -60], [40, -110], [120, 20], [-30, 70], [70, 120], [-140, 10], [10, -10], [150, -70], [-100, 130], [100, -150]];
  return (
    <svg width={size} height={size} viewBox="-230 -230 460 460">
      <circle r={r} fill="#16233f" stroke={K.gold} strokeWidth="4" />
      {[-60, -30, 0, 30, 60].map((lat) => <ellipse key={lat} cy={r * Math.sin((lat * Math.PI) / 180)} rx={r * Math.cos((lat * Math.PI) / 180)} ry={r * Math.cos((lat * Math.PI) / 180) * 0.18} fill="none" stroke="#33508a" strokeWidth="2" />)}
      {[0, 1, 2].map((k) => { const a = ((rot + k * 60) * Math.PI) / 180; return <ellipse key={k} rx={Math.abs(r * Math.cos(a))} ry={r} fill="none" stroke="#33508a" strokeWidth="2" />; })}
      {dots.map(([x, y], k) => { const o = fade(f, 8 + k * 4, 14 + k * 4); return <g key={k} opacity={o}><circle cx={x} cy={y} r={10 + 14 * (1 - o)} fill="none" stroke={K.gold} strokeWidth="2" opacity={1 - o * 0.6} /><circle cx={x} cy={y} r="7" fill={K.gold} /></g>; })}
    </svg>
  );
};

const Building: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 400 320">
    <path d="M200 20 Q260 20 270 80 H130 Q140 20 200 20 Z" fill="#cfc8b8" />
    <rect x="196" y="0" width="8" height="24" fill="#cfc8b8" />
    <path d="M40 110 L200 70 L360 110 Z" fill="#d9d2c2" />
    <rect x="50" y="110" width="300" height="20" fill="#bfb7a5" />
    {[0, 1, 2, 3, 4, 5].map((k) => <rect key={k} x={70 + k * 50} y="130" width="22" height="150" fill="#e4ddcc" />)}
    <rect x="30" y="280" width="340" height="18" fill="#bfb7a5" />
    <rect x="10" y="298" width="380" height="18" fill="#a9a190" />
  </svg>
);

const Senyera: React.FC<{f: number; w: number}> = ({f, w}) => {
  const h = w * 0.62, seg = 24;
  const path = (y0: number, y1: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= seg; i++) { const x = (i / seg) * w; pts.push(`${x},${y0 + 10 * Math.sin(i / 3 + f / 6)}`); }
    for (let i = seg; i >= 0; i--) { const x = (i / seg) * w; pts.push(`${x},${y1 + 10 * Math.sin(i / 3 + f / 6)}`); }
    return `M${pts.join(' L')} Z`;
  };
  return (
    <svg width={w} height={h + 30} viewBox={`0 -15 ${w} ${h + 30}`} style={{filter: 'drop-shadow(0 18px 30px rgba(0,0,0,.5))'}}>
      <path d={path(0, h)} fill="#f2c230" />
      {[0, 1, 2, 3].map((k) => <path key={k} d={path(((2 * k + 1) * h) / 9, ((2 * k + 2) * h) / 9)} fill="#d22f27" />)}
    </svg>
  );
};

// ───────────────────────── beat visuals ─────────────────────────
const VIS: Record<string, React.FC<V>> = {
  kits: ({f, w}) => (
    <>
      <Pitch f={f} />
      <Abs x={CX - 190} y={CY - 70}><In f={f} at={2} dy={60}><Shirt kind="barca" size={330} /></In></Abs>
      <Abs x={CX + 190} y={CY - 70}><In f={f} at={8} dy={60}><Shirt kind="madrid" size={330} /></In></Abs>
      <Abs x={CX} y={CY + 170}><In f={f} at={w('El')}><svg width="90" height="90" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#f4f1ea" /><path d="M50 26 L68 40 L61 62 H39 L32 40 Z" fill="#141414" /></svg></In></Abs>
      <Abs x={CX} y={CY + 290}><In f={f} at={w('El')} dy={20}><Label size={46}>El Clásico</Label></In></Abs>
    </>
  ),
  ball: ({f, w}) => {
    const k = ramp(f, 4, 30, 0, 1);
    return (
      <>
        <Abs x={CX - 260 + 40 * k} y={CY}><In f={f} at={0}><Shield kind="barca" size={250} /></In></Abs>
        <Abs x={CX + 260 - 40 * k} y={CY}><In f={f} at={4}><Shield kind="madrid" size={250} /></In></Abs>
        <Abs x={CX} y={CY}><In f={f} at={w('rivalry')}><div style={{width: 130, height: 130, borderRadius: 99, border: `4px solid ${K.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 ${30 + 20 * Math.sin(f / 5)}px ${K.gold}55`}}><Big size={96} style={{fontFamily: SANS}}>?</Big></div></In></Abs>
        <Abs x={CX} y={CY + 250}><In f={f} at={w('begin')} dy={20}><Label size={40} color={K.dim}>where it began</Label></In></Abs>
      </>
    );
  },
  name: ({f, w}) => (
    <>
      <Abs x={CX - 150} y={CY - 150}><In f={f} at={0}><Shield kind="grey" size={180} /></In></Abs>
      <Abs x={CX + 150} y={CY - 150}><In f={f} at={3}><Shield kind="grey" size={180} /></In></Abs>
      <Abs x={CX} y={CY + 30}><Rule f={f} at={4} w={420} /></Abs>
      <Abs x={CX} y={CY + 110}><In f={f} at={2} dy={20}><Big size={110} style={{fontFamily: SANS, fontWeight: 900}}>EL CLÁSICO</Big></In></Abs>
      <Abs x={CX} y={CY + 230}><In f={f} at={w('means')} dy={16}><Label size={44} color={K.ink} ls={1} style={{textTransform: 'none', fontWeight: 600}}>= “the classic”</Label></In></Abs>
    </>
  ),
  ticket: ({f, w}) => (
    <Abs x={CX} y={CY}>
      <In f={f} at={0} from={0.8} dy={80}>
        <Ticket lines={<>
          <Label size={34} color={K.paperInk} ls={4}>Barcelona</Label>
          <Label size={22} color={K.paperInk} ls={4} style={{opacity: .6, margin: '6px 0'}}>vs</Label>
          <Label size={34} color={K.paperInk} ls={4}>Madrid F.C.</Label>
          <div style={{height: 2, background: 'rgba(58,47,34,.3)', margin: '26px 30px'}} />
          <In f={f} at={w('May')}><Big size={84} color={K.paperInk} style={{textShadow: 'none'}}>13 May</Big></In>
          <In f={f} at={w('nineteen-oh-two,')} from={1.6}><Big size={150} color={K.red} style={{textShadow: 'none', marginTop: 8}}>1902</Big></In>
        </>} />
      </In>
    </Abs>
  ),
  crown: ({f, w}) => (
    <>
      <Abs x={CX} y={CY - 110}><In f={f} at={w('coronation')} dy={-80}><CrownSvg size={420} /></In></Abs>
      <Abs x={CX} y={CY + 120}><In f={f} at={w('cup')} dy={20}><Label size={40}>Copa de la Coronación</Label></In></Abs>
      <Abs x={CX} y={CY + 190}><Rule f={f} at={w('cup') + 4} w={360} /></Abs>
      <Abs x={CX} y={CY + 260}><In f={f} at={w('Alfonso')} dy={16}><Label size={36} color={K.ink}>King Alfonso XIII</Label></In></Abs>
    </>
  ),
  score: ({f, w}) => (
    <>
      <Abs x={CX - 230} y={CY - 150}><In f={f} at={0}><Label size={44} color={K.ink}>Barça</Label></In></Abs>
      <Abs x={CX + 230} y={CY - 150}><In f={f} at={2}><Label size={44} color={K.ink}>Madrid F.C.</Label></In></Abs>
      <Abs x={CX - 230} y={CY + 30}><In f={f} at={w('three')} from={1.8}><Big size={260}>3</Big></In></Abs>
      <Abs x={CX} y={CY + 30}><Rule f={f} at={w('three')} w={90} color={K.dim} /></Abs>
      <Abs x={CX + 230} y={CY + 30}><In f={f} at={w('one.')} from={1.8}><Big size={260} color={K.dim}>1</Big></In></Abs>
    </>
  ),
  mystery: ({f, w}) => {
    const strike = ramp(f, w("wasn't"), w("wasn't") + 8, 0, 1);
    return (
      <>
        <Abs x={CX} y={CY - 90}><In f={f} at={0}><Shield kind="madrid" size={300} crown={0} /></In></Abs>
        <Abs x={CX} y={CY - 70}><In f={f} at={w('fun')} from={2}><Big size={230} color={K.ink} style={{fontFamily: SANS, textShadow: '0 0 40px #000, 0 0 80px #000'}}>?</Big></In></Abs>
        <Abs x={CX} y={CY + 200}>
          <In f={f} at={w('Real')} dy={16}><div style={{position: 'relative'}}>
            <Label size={66} color={K.ink}>Real Madrid</Label>
            <div style={{position: 'absolute', left: -10, top: '50%', height: 8, width: `${strike * 104}%`, background: K.red, transform: 'rotate(-4deg)'}} />
          </div></In>
        </Abs>
      </>
    );
  },
  madridfc: ({f, w}) => (
    <>
      <Abs x={CX} y={CY - 70}>
        <In f={f} at={0} from={0.6}>
          <div style={{width: 380, height: 380, borderRadius: 999, background: '#e9e0c9', border: `10px solid ${K.paper}`, boxShadow: '0 26px 60px rgba(0,0,0,.6), inset 0 0 0 6px #2b3f8f', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: '#2b3f8f', letterSpacing: -10, transform: `rotate(${ramp(f, 0, 20, -12, 0)}deg)`}}>MFC</div>
          </div>
        </In>
      </Abs>
      <Abs x={CX} y={CY + 230}><In f={f} at={w('Madrid')} dy={18}><Label size={58} color={K.ink}>Madrid F.C.</Label></In></Abs>
    </>
  ),
  royal: ({f, w}) => {
    const c = ramp(f, w('royal,'), w('royal,') + 10, 0, 1, Easing.out(Easing.back(1.8)));
    return (
      <>
        <Abs x={CX} y={CY - 340}><In f={f} at={w('nineteen-twenty,')} dy={-20}><Big size={120}>1920</Big></In></Abs>
        <Abs x={CX} y={CY - 20}><In f={f} at={0}><Shield kind="mfc" size={280} /></In></Abs>
        <Abs x={CX} y={CY - 200 + (1 - c) * -160}><div style={{opacity: Math.min(1, c * 2)}}><CrownSvg size={200} /></div></Abs>
        <Abs x={CX} y={CY + 230}><In f={f} at={w('Real,"')} dy={16}><div style={{display: 'flex', gap: 22, alignItems: 'baseline'}}>
          <Label size={64} color={K.ink}>Real</Label><Label size={44} color={K.dim}>=</Label><In f={f} at={w('royal,')}><Label size={64}>Royal</Label></In>
        </div></In></Abs>
      </>
    );
  },
  liga: ({f, w}) => (
    <>
      <Abs x={CX} y={CY - 250}><In f={f} at={w('nineteen')} dy={-20}><Big size={150}>{countTo(f, w('nineteen'), w('nineteen') + 16, 1902, 1929)}</Big></In></Abs>
      <Abs x={CX - 220} y={CY + 30}><In f={f} at={0}><Shield kind="barca" size={190} /></In></Abs>
      <Abs x={CX + 220} y={CY + 30}><In f={f} at={3}><Shield kind="madrid" size={190} /></In></Abs>
      <Abs x={CX} y={CY + 30}><svg width="180" height="60" viewBox="0 0 180 60"><path d={`M10 30 H${10 + 150 * ramp(f, 6, 24, 0, 1)}`} stroke={K.dim} strokeWidth="4" /><path d="M150 15 L170 30 L150 45" fill="none" stroke={K.dim} strokeWidth="4" opacity={fade(f, 22, 26)} /></svg></Abs>
      <Abs x={CX} y={CY + 260}><In f={f} at={w('Liga')} dy={18}><Label size={58} color={K.ink}>La Liga</Label></In></Abs>
    </>
  ),
  trophy: ({f, w}) => {
    const n = [0, 1, 2, 3, 4, 5].filter((k) => f > 4 + k * 5).length;
    return (
      <>
        <Abs x={CX} y={CY - 360}><div style={{display: 'flex', gap: 14}}>{[0, 1, 2, 3, 4, 5].map((k) => <div key={k} style={{width: 46, height: 46, borderRadius: 8, border: `3px solid ${k < n ? K.gold : '#333'}`, background: k < n ? `${K.gold}22` : 'transparent'}} />)}</div></Abs>
        <Abs x={CX} y={CY - 300}><In f={f} at={2}><Label size={26} color={K.dim}>every season</Label></In></Abs>
        <Abs x={CX} y={CY - 20}><In f={f} at={w('Barça')} from={0.4} dy={60}><div style={{filter: `drop-shadow(0 0 ${20 + 14 * Math.sin(f / 4)}px ${K.gold}66)`}}><Cup size={360} /></div></In></Abs>
        <Abs x={CX} y={CY + 230}><In f={f} at={w('first')} dy={16}><div style={{background: K.grana, padding: '14px 34px', borderRadius: 6, borderBottom: `6px solid ${K.blau}`}}><Label size={42} color={K.ink}>1929 · Champions</Label></div></In></Abs>
      </>
    );
  },
  fifties: ({f, w}) => (
    <>
      <Abs x={CX} y={CY - 280}><In f={f} at={w('fifties,')} dy={-20}><Big size={150}>1950s</Big></In></Abs>
      <Abs x={CX - 240} y={CY + 10}><In f={f} at={0}><Shield kind="barca" size={180} /></In></Abs>
      <Abs x={CX + 240} y={CY + 10}><In f={f} at={3}><Shield kind="madrid" size={180} /></In></Abs>
      <Abs x={CX} y={CY + 10}><In f={f} at={w('fight')}><div style={{transform: `rotate(${f * 2}deg)`}}><Star size={120} /></div></In></Abs>
      <Abs x={CX} y={CY + 220}><In f={f} at={w('off')} dy={16}><Label size={44} color={K.ink}>Off the pitch</Label></In></Abs>
    </>
  ),
  distefano: ({f, w}) => {
    const tug = Math.sin(f / 5) * 12;
    return (
      <>
        <Abs x={CX - 300 + tug} y={CY - 40}><In f={f} at={w('Both')}><Shield kind="barca" size={140} /></In></Abs>
        <Abs x={CX + 300 + tug} y={CY - 40}><In f={f} at={w('Both') + 3}><Shield kind="madrid" size={140} /></In></Abs>
        <Abs x={CX} y={CY - 40}><div style={{width: 620, borderTop: `3px dashed ${K.dim}`, opacity: fade(f, w('same'), w('same') + 8)}} /></Abs>
        <Abs x={CX} y={CY - 50}><In f={f} at={w('superstar:')} from={0.75}><Photo src="photos/distefano/distefano-1959.jpg" w={380} h={480} f={f} pos="50% 22%" /></In></Abs>
        <Abs x={CX} y={CY + 290}><In f={f} at={w('Alfredo')} dy={16}><Label size={46}>Alfredo Di Stéfano</Label></In></Abs>
      </>
    );
  },
  cups: ({f, w}) => (
    <>
      <Abs x={CX} y={CY - 250}><In f={f} at={0}><div style={{opacity: 0.55}}><Photo src="photos/distefano/real-madrid-amsterdam-1959.jpg" w={640} h={330} f={f} /></div></In></Abs>
      <Abs x={CX} y={CY + 90}><div style={{display: 'flex', gap: 6}}>
        {[1956, 1957, 1958, 1959, 1960].map((y, k) => (
          <In key={y} f={f} at={w('five') + k * 4} dy={40}><div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}><Cup size={170} color="#d8d4ca" /><Label size={24} color={K.dim} ls={1}>{y}</Label></div></In>
        ))}
      </div></Abs>
      <Abs x={CX} y={CY + 290}><In f={f} at={w('row.')} dy={16}><Label size={44} color={K.ink}>5 European Cups in a row</Label></In></Abs>
    </>
  ),
  catalonia: ({f, w}) => (
    <>
      <Abs x={CX} y={CY - 140}><In f={f} at={0}><Shield kind="barca" size={300} /></In></Abs>
      <Abs x={CX} y={CY + 120}><In f={f} at={w('symbol')} dy={80} from={0.9}><Senyera f={f} w={460} /></In></Abs>
      <Abs x={CX} y={CY + 340}><In f={f} at={w('Catalan')} dy={16}><Label size={44} color={K.ink}>Catalan culture</Label></In></Abs>
    </>
  ),
  capital: ({f, w}) => (
    <>
      <Abs x={CX} y={CY - 60}><In f={f} at={0} dy={40} from={0.9}><div style={{opacity: 0.9}}><Building size={620} /></div></In></Abs>
      <Abs x={CX + 170} y={CY + 80}><In f={f} at={w('club')}><Shield kind="madrid" size={170} /></In></Abs>
      <Abs x={CX} y={CY + 290}><In f={f} at={w('capital.')} dy={16}><Label size={44} color={K.ink}>The capital's club</Label></In></Abs>
    </>
  ),
  split: ({f, w}) => {
    const k = ramp(f, 0, 12, 0, 1);
    return (
      <>
        <div style={{position: 'absolute', left: CX - 460, top: CY - 300, width: 460 * k, height: 600, background: K.grana, overflow: 'hidden'}} />
        <div style={{position: 'absolute', left: CX + 460 - 460 * k, top: CY - 300, width: 460 * k, height: 600, background: '#d9d4c8'}} />
        <Abs x={CX - 230} y={CY - 40}><In f={f} at={6}><Shield kind="barca" size={220} /></In></Abs>
        <Abs x={CX + 230} y={CY - 40}><In f={f} at={9}><Shield kind="madrid" size={220} /></In></Abs>
        <Abs x={CX} y={CY + 200}><In f={f} at={w('more')} from={1.4}><div style={{background: K.bg, padding: '18px 34px', border: `3px solid ${K.gold}`}}><Label size={50}>More than football</Label></div></In></Abs>
      </>
    );
  },
  eras: ({f, w}) => {
    const decades = ['1970s', '1980s', '1990s', '2000s', '2010s'];
    return (
      <>
        <Abs x={CX} y={CY + 40}><Rule f={f} at={0} w={700} color="#444" /></Abs>
        {decades.map((d, k) => (
          <Abs key={d} x={CX - 300 + k * 150} y={CY + 40}>
            <In f={f} at={4 + k * 5}><div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, transform: 'translateY(-60px)'}}>
              <Star size={k === 4 ? 96 : 70} color={k % 2 ? K.ink : K.gold} />
              <div style={{width: 14, height: 14, borderRadius: 9, background: K.gold, marginTop: 30}} />
              <Label size={28} color={K.dim} ls={1}>{d}</Label>
            </div></In>
          </Abs>
        ))}
        <Abs x={CX} y={CY - 240}><In f={f} at={w('generations')} dy={-16}><Label size={50} color={K.ink}>New generations</Label></In></Abs>
      </>
    );
  },
  legends: ({f, w}) => (
    <>
      <Abs x={CX - 190} y={CY - 40}><In f={f} at={0} from={0.7}><Photo src="photos/cruyff/cruyff-02.jpg" w={360} h={460} f={f} tilt={-3} /></In></Abs>
      <Abs x={CX - 190} y={CY + 250}><In f={f} at={1} dy={14}><Label size={40}>Cruyff</Label></In></Abs>
      <Abs x={CX + 200} y={CY - 40}><In f={f} at={w('Ronaldinho.')} from={0.6} dy={40}><Shirt kind="barca" size={380} num="10" name="RONALDINHO" /></In></Abs>
      <Abs x={CX + 200} y={CY + 250}><In f={f} at={w('Ronaldinho.')} dy={14}><Label size={40}>Ronaldinho</Label></In></Abs>
    </>
  ),
  faceoff: ({f, w}) => (
    <>
      <Abs x={CX} y={CY - 330}><In f={f} at={w('decade,')} dy={-16}><Label size={40} color={K.dim}>2009 – 2018</Label></In></Abs>
      <Abs x={CX - 220} y={CY - 40}><In f={f} at={w('Messi')} from={0.5} dy={50}><Shirt kind="barca" size={400} num="10" name="MESSI" /></In></Abs>
      <Abs x={CX + 220} y={CY - 40}><In f={f} at={w('Cristiano')} from={0.5} dy={50}><Shirt kind="madrid" size={400} num="7" name="RONALDO" /></In></Abs>
      <Abs x={CX} y={CY + 10}><In f={f} at={w('Cristiano') + 6} from={2.2}><Big size={110} style={{fontFamily: DISPLAY, fontWeight: 400}}>VS</Big></In></Abs>
      <Abs x={CX - 220} y={CY + 230}><In f={f} at={w('Messi')} dy={14}><Label size={40} color={K.ink}>Messi</Label></In></Abs>
      <Abs x={CX + 220} y={CY + 230}><In f={f} at={w('Cristiano')} dy={14}><Label size={40} color={K.ink}>Ronaldo</Label></In></Abs>
    </>
  ),
  globe: ({f, w}) => (
    <>
      <Abs x={CX} y={CY - 40}><In f={f} at={0} from={0.7}><Globe f={f} size={540} /></In></Abs>
      <Abs x={CX} y={CY + 290}><In f={f} at={w('Millions')} dy={16}><Label size={54} color={K.ink}>Millions watching</Label></In></Abs>
    </>
  ),
  nextticket: ({f, w}) => (
    <Abs x={CX} y={CY - 10}>
      <In f={f} at={0} from={0.8} dy={80}>
        <Ticket tilt={2} lines={<>
          <Label size={30} color={K.paperInk} ls={4}>FC Barcelona</Label>
          <Label size={20} color={K.paperInk} ls={4} style={{opacity: .6, margin: '6px 0'}}>vs</Label>
          <Label size={30} color={K.paperInk} ls={4}>Real Madrid</Label>
          <div style={{height: 2, background: 'rgba(58,47,34,.3)', margin: '24px 30px'}} />
          <In f={f} at={w('Sunday,')}><Big size={78} color={K.paperInk} style={{textShadow: 'none'}}>Sun 25 Oct</Big></In>
          <In f={f} at={w('Sunday,') + 4} from={1.6}><Big size={130} color={K.red} style={{textShadow: 'none', marginTop: 6}}>2026</Big></In>
          <In f={f} at={w('Camp')}><Label size={30} color={K.paperInk} ls={6} style={{marginTop: 14}}>Camp Nou</Label></In>
        </>} />
      </In>
    </Abs>
  ),
  question: ({f, w}) => (
    <>
      <Abs x={CX - 250} y={CY - 60}><In f={f} at={0}><Shield kind="barca" size={190} /></In></Abs>
      <Abs x={CX + 250} y={CY - 60}><In f={f} at={3}><Shield kind="madrid" size={190} /></In></Abs>
      <Abs x={CX} y={CY - 70}><In f={f} at={2} from={2}><Big size={240} style={{fontFamily: SANS}}>?</Big></In></Abs>
      <Abs x={CX} y={CY + 180}><In f={f} at={w('Tell')} dy={20}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, background: '#222', border: `3px solid ${K.gold}`, borderRadius: 999, padding: '16px 36px'}}>
          <svg width="48" height="44" viewBox="0 0 48 44"><path d="M4 4 H44 V30 H20 L10 40 V30 H4 Z" fill={K.gold} /></svg>
          <Label size={40} color={K.ink}>Comment your score</Label>
        </div>
      </In></Abs>
    </>
  ),
};

// ───────────────────────── captions ─────────────────────────
const GOLD = /\d|barça|madrid|clásico|classic|real|royal|alfonso|di$|stéfano|cruyff|ronaldinho|messi|cristiano|ronaldo|liga|catalan|capital|camp|nou|five|three|one\.|nineteen|fifties|millions/i;
const chunks = (() => {
  const out: {from: number; ws: Word[]}[] = [];
  for (const b of beats) {
    const bw = words.filter((x) => x.beat === b.id); let cur: Word[] = []; let len = 0;
    for (const x of bw) {
      if (cur.length && (len + x.w.length > 24 || /[,.:!?]$/.test(cur[cur.length - 1].w) && len > 10)) { out.push({from: Math.round(cur[0].s * FPS) - 2, ws: cur}); cur = []; len = 0; }
      cur.push(x); len += x.w.length + 1;
    }
    if (cur.length) out.push({from: Math.round(cur[0].s * FPS) - 2, ws: cur});
  }
  return out;
})();

const Caption: React.FC<{f: number}> = ({f}) => {
  let i = -1; for (let k = 0; k < chunks.length; k++) if (chunks[k].from <= f) i = k;
  if (i < 0) return null;
  const c = chunks[i]; const lf = f - c.from;
  if (i === chunks.length - 1 && f > Math.round(c.ws[c.ws.length - 1].e * FPS) + 40) return null;
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 1200, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 58, lineHeight: 1.22, color: K.ink,
      opacity: fade(lf, 0, 4), transform: `translateY(${ramp(lf, 0, 6, 14, 0)}px)`, textShadow: '0 4px 18px rgba(0,0,0,.7)'}}>
      {c.ws.map((x, k) => <span key={k} style={{color: GOLD.test(x.w) ? K.gold : K.ink}}>{x.w}{k < c.ws.length - 1 ? ' ' : ''}</span>)}
    </div>
  );
};

// ───────────────────────── composition ─────────────────────────
const Background: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 75% 50% at 50% ${38 + Math.sin(f / 90) * 2}%, #262626 0%, ${K.bg} 60%, #0b0b0b 100%)`}} />
);

export const ClasicoExplainer: React.FC = () => {
  const frame = useCurrentFrame();
  const musicVol = (fr: number) => interpolate(fr, [0, 15, CLASICO_FRAMES - 45, CLASICO_FRAMES], [0, 0.11, 0.11, 0], clamp);
  return (
    <AbsoluteFill style={{background: K.bg, overflow: 'hidden'}}>
      <Background f={frame} />
      {windows.map(({b, from, to}) => {
        if (frame < from || frame >= to) return null;
        const f = frame - from, dur = to - from, Vis = VIS[b.v];
        const bw = words.filter((x) => x.beat === b.id);
        const w = (n: number | string) => {
          const x = typeof n === 'number' ? bw[Math.min(n, bw.length - 1)] : bw.find((y) => norm(y.w) === norm(n));
          if (!x) throw new Error(`${b.id}: no word ${n}`);
          return Math.round(x.s * FPS) - from;
        };
        const enter = ramp(f, 0, 7, 0, 1, Easing.out(Easing.cubic)), exit = fade(f, dur - 7, dur);
        return (
          <AbsoluteFill key={b.id} style={{opacity: enter * (1 - exit), transform: `scale(${1.24 * (0.94 + 0.06 * enter) * (1 + f * 0.0004)})`, transformOrigin: `${CX}px ${CY}px`}}>
            <Vis f={f} dur={dur} w={w} />
          </AbsoluteFill>
        );
      })}
      <Caption f={frame} />
      <div style={{position: 'absolute', left: 60, top: 150, display: 'flex', alignItems: 'center', gap: 14, opacity: 0.85}}>
        <Mark size={58} brand="radar" />
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 26, letterSpacing: 4, color: K.ink}}>BARÇA RADAR</div>
      </div>
      <Grain opacity={0.05} />
      <Audio src={staticFile('music/km/investigations.mp3')} volume={musicVol} />
      {T.audio.map((a, k) => <Sequence key={k} from={Math.round(a.at * FPS)}><Audio src={staticFile(a.src)} /></Sequence>)}
      {windows.slice(1).map(({from}, k) => <Sequence key={`wh${k}`} from={Math.max(0, from - 4)} durationInFrames={20}><Audio src={staticFile('sfx/whoosh.wav')} volume={0.13} /></Sequence>)}
    </AbsoluteFill>
  );
};
