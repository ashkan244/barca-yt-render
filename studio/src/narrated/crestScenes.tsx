import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame } from 'remotion';
import { BODY, C, DISPLAY } from './theme';
import { Crest, CREST_OUTLINE, Part } from './Crest';
import { EnglandArt, SenyeraArt, WavingFlag } from './Flag';
import { BlaugranaBg, Center, DarkBg, Kicker, Parchment, SceneProps, clamp, useIn } from './kit';

// ---------- crest focus scenes ----------

const ALL: Part[] = ['tl', 'tr', 'band', 'bottom', 'ball', 'frame'];

const FocusCrest: React.FC<SceneProps & { focus: Part[]; zoom: { x: number; y: number; s: number }; kicker: string }> = ({ frames, focus, zoom, kicker }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [4, 18], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const z = interpolate(frame, [0, frames], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const off: Partial<Record<Part, number>> = {};
  for (const p of ALL) off[p] = focus.includes(p) ? 0 : fade;
  const s = 1 + (zoom.s - 1) * z;
  return (
    <AbsoluteFill>
      <DarkBg />
      <Center>
        <div style={{ transform: `translate(${zoom.x * z}px, ${zoom.y * z}px) scale(${s})` }}>
          <Crest size={660} off={off} id={`fc-${focus.join('')}`} />
        </div>
      </Center>
      <Kicker text={kicker} y={200} />
    </AbsoluteFill>
  );
};

export const CrestTL: React.FC<SceneProps> = ({ frames }) => (
  <FocusCrest frames={frames} focus={['tl']} zoom={{ x: 170, y: 190, s: 1.28 }} kicker="01 · Top left" />
);
export const CrestTR: React.FC<SceneProps> = ({ frames }) => (
  <FocusCrest frames={frames} focus={['tr']} zoom={{ x: -170, y: 190, s: 1.28 }} kicker="02 · Top right" />
);
export const CrestBottom: React.FC<SceneProps> = ({ frames }) => (
  <FocusCrest frames={frames} focus={['bottom']} zoom={{ x: 0, y: -160, s: 1.22 }} kicker="03 · The bottom" />
);

// ---------- hook ----------

export const Hook: React.FC<SceneProps> = ({ frames }) => {
  const frame = useCurrentFrame();
  const s = useIn(0);
  const drift = interpolate(frame, [0, frames], [1, 1.07], clamp);
  return (
    <AbsoluteFill>
      <BlaugranaBg />
      <Center>
        <div style={{ transform: `scale(${(0.6 + 0.4 * s) * drift}) rotate(${(1 - s) * -8}deg)`, opacity: s }}>
          <Crest size={680} id="hook" />
        </div>
      </Center>
      <Kicker text="The crest, decoded" y={230} />
    </AbsoluteFill>
  );
};

// ---------- England? ----------

export const England: React.FC<SceneProps> = ({ frames }) => {
  const frame = useCurrentFrame();
  const flagIn = useIn(3);
  const stampAt = Math.round(frames * 0.66);
  const stamp = spring({ frame: frame - stampAt, fps: 30, config: { damping: 11, stiffness: 180 } });
  return (
    <AbsoluteFill>
      <DarkBg />
      <Center y={760}>
        <div style={{ opacity: 0.35 }}>
          <Crest size={640} off={{ tl: 0, tr: 1, band: 1, bottom: 1, ball: 1, frame: 1 }} id="eng-bg" />
        </div>
      </Center>
      <Center y={900}>
        <div style={{ transform: `translateY(${(1 - flagIn) * 120}px) scale(${0.8 + 0.2 * flagIn})`, opacity: flagIn, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))' }}>
          <WavingFlag w={560} h={360} id="eng">
            <EnglandArt w={560} h={360} />
          </WavingFlag>
        </div>
      </Center>
      {frame >= stampAt ? (
        <Center y={900}>
          <div style={{
            width: 300, height: 300, borderRadius: 150, border: `18px solid ${C.red}`, display: 'flex',
            alignItems: 'center', justifyContent: 'center', transform: `scale(${2.2 - 1.2 * stamp}) rotate(-12deg)`,
            opacity: Math.min(1, stamp * 1.4), background: 'rgba(10,10,12,0.55)',
          }}>
            <svg width={170} height={170} viewBox="0 0 10 10">
              <path d="M2 2 L8 8 M8 2 L2 8" stroke={C.red} strokeWidth={1.6} strokeLinecap="round" />
            </svg>
          </div>
        </Center>
      ) : null}
      <Kicker text="England’s flag?" y={230} />
    </AbsoluteFill>
  );
};

// ---------- Sant Jordi ----------

const SHIELD = 'M 0 0 L 300 0 L 300 170 C 300 290, 210 350, 150 380 C 90 350, 0 290, 0 170 Z';

export const StJordi: React.FC<SceneProps> = ({ frames }) => {
  const frame = useCurrentFrame();
  const s = useIn(2);
  const halo = interpolate(frame, [0, frames], [0, 40], clamp);
  return (
    <AbsoluteFill>
      <Parchment />
      <Center y={830}>
        <svg width={760} height={900} viewBox="-230 -260 760 900" style={{ transform: `scale(${0.85 + 0.15 * s})`, opacity: s }}>
          <circle cx={150} cy={170} r={300} fill="none" stroke="#b8860b" strokeWidth={10} opacity={0.55} transform={`rotate(${halo} 150 170)`} strokeDasharray="30 18" />
          <circle cx={150} cy={170} r={265} fill="#f6e7b8" opacity={0.55} />
          {/* sword behind the shield */}
          <g transform="rotate(-28 150 170)">
            <rect x={140} y={-220} width={20} height={560} rx={4} fill="#cfd3d8" stroke="#55585e" strokeWidth={3} />
            <rect x={70} y={300} width={160} height={22} rx={8} fill="#8a6b2d" />
            <rect x={142} y={322} width={16} height={70} fill="#5a3d16" />
            <circle cx={150} cy={402} r={16} fill="#8a6b2d" />
          </g>
          <g filter="drop-shadow(0 16px 20px rgba(60,30,0,0.45))">
            <path d={SHIELD} fill={C.white} stroke="#6b4a12" strokeWidth={10} />
            <clipPath id="jordi-clip"><path d={SHIELD} /></clipPath>
            <g clipPath="url(#jordi-clip)">
              <rect x={122} y={0} width={56} height={400} fill={C.red} />
              <rect x={0} y={120} width={300} height={56} fill={C.red} />
            </g>
          </g>
        </svg>
      </Center>
      <div style={{ position: 'absolute', top: 220, left: 0, right: 0, textAlign: 'center', fontFamily: DISPLAY, fontSize: 120, letterSpacing: 12, color: '#5a1a0e', opacity: s }}>
        SANT JORDI
      </div>
      <div style={{ position: 'absolute', top: 370, left: 0, right: 0, textAlign: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 44, letterSpacing: 3, color: '#6b4a12', opacity: interpolate(frame, [12, 24], [0, 1], clamp) }}>
        PATRON SAINT OF CATALONIA
      </div>
    </AbsoluteFill>
  );
};

// ---------- roses and books ----------

const Rose: React.FC<{ r?: number }> = ({ r = 40 }) => (
  <g>
    <path d={`M ${-r * 0.2} ${r * 0.6} Q ${-r * 1.4} ${r * 1.2} ${-r * 1.5} ${r * 0.3} Q ${-r * 0.8} ${r * 0.3} ${-r * 0.2} ${r * 0.6} Z`} fill="#2f7d32" />
    <circle r={r} fill="#c1121f" />
    <path d={`M ${-r * 0.55} 0 A ${r * 0.55} ${r * 0.55} 0 1 1 ${r * 0.2} ${r * 0.5}`} stroke="#7a0a12" strokeWidth={r * 0.12} fill="none" strokeLinecap="round" />
    <path d={`M ${-r * 0.2} ${-r * 0.1} A ${r * 0.25} ${r * 0.25} 0 1 1 ${r * 0.15} ${r * 0.2}`} stroke="#7a0a12" strokeWidth={r * 0.1} fill="none" strokeLinecap="round" />
    <circle r={r} fill="url(#roseShade)" />
  </g>
);

const BOOKS = [
  { w: 520, h: 86, c: '#1f4e79', tilt: -2 },
  { w: 480, h: 74, c: '#7a1f2b', tilt: 3 },
  { w: 500, h: 80, c: '#2f5d3a', tilt: -1 },
];

export const Roses: React.FC<SceneProps> = ({ frames }) => {
  const frame = useCurrentFrame();
  const falling = Array.from({ length: 14 }, (_, i) => {
    const x = ((i * 397) % 1000) + 40;
    const speed = 5 + (i % 5) * 1.6;
    const y = -120 + ((frame * speed + i * 260) % 2200);
    const rot = frame * (i % 2 ? 1.5 : -1.2) + i * 40;
    const r = 22 + (i % 4) * 8;
    return { x, y, rot, r, i };
  });
  const card = useIn(2);
  return (
    <AbsoluteFill>
      <DarkBg glow="#4a1218" />
      <svg width={1080} height={1920} style={{ position: 'absolute' }}>
        <defs>
          <radialGradient id="roseShade" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#fff" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#000" stopOpacity={0.35} />
          </radialGradient>
        </defs>
        {falling.map((f) => (
          <g key={f.i} transform={`translate(${f.x} ${f.y}) rotate(${f.rot})`} opacity={0.75}>
            <Rose r={f.r} />
          </g>
        ))}
        <g transform="translate(540 1060)">
          {BOOKS.map((b, i) => {
            const s = spring({ frame: frame - 6 - i * 5, fps: 30, config: { damping: 14 } });
            const y = -i * 84 - (1 - s) * 500;
            return (
              <g key={i} transform={`translate(0 ${y}) rotate(${b.tilt})`} opacity={s}>
                <rect x={-b.w / 2} y={-b.h} width={b.w} height={b.h} rx={8} fill={b.c} />
                <rect x={-b.w / 2 + 14} y={-b.h + 8} width={b.w - 28} height={b.h - 16} rx={4} fill="none" stroke="#e8d28a" strokeWidth={3} />
                <rect x={b.w / 2 - 40} y={-b.h} width={22} height={b.h} fill="#f1e6c8" opacity={0.85} />
              </g>
            );
          })}
          <g transform={`translate(30 ${-290 - (1 - spring({ frame: frame - 22, fps: 30, config: { damping: 12 } })) * 600}) rotate(-18)`}>
            <rect x={-6} y={0} width={12} height={180} fill="#2f7d32" transform="rotate(70)" />
            <Rose r={78} />
          </g>
        </g>
      </svg>
      <div style={{
        position: 'absolute', top: 190, left: 340, width: 400, height: 270, borderRadius: 26, overflow: 'hidden',
        background: '#fbf7ee', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', transform: `scale(${card}) rotate(${(1 - card) * 10 - 3}deg)`,
        fontFamily: DISPLAY, textAlign: 'center',
      }}>
        <div style={{ background: C.red, color: '#fff', fontSize: 54, padding: '6px 0', letterSpacing: 6 }}>APRIL</div>
        <div style={{ color: '#1b1b1f', fontSize: 170, lineHeight: '200px' }}>23</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Senyera ----------

const Crown: React.FC = () => (
  <svg width={260} height={170} viewBox="0 0 260 170">
    <path d="M 20 140 L 10 40 L 70 90 L 130 20 L 190 90 L 250 40 L 240 140 Z" fill={C.gold} stroke="#7a5a10" strokeWidth={8} strokeLinejoin="round" />
    <rect x={20} y={130} width={220} height={30} rx={6} fill={C.goldDeep} stroke="#7a5a10" strokeWidth={6} />
    {[10, 130, 250].map((x, i) => <circle key={i} cx={x} cy={i === 1 ? 20 : 40} r={14} fill={C.red} stroke="#7a5a10" strokeWidth={5} />)}
  </svg>
);

export const Senyera: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const s = useIn(0);
  const crown = useIn(10);
  return (
    <AbsoluteFill>
      <DarkBg glow="#4a3a10" />
      <Center y={430}>
        <div style={{ transform: `translateY(${(1 - crown) * -80}px)`, opacity: crown }}><Crown /></div>
      </Center>
      <Center y={850}>
        <div style={{ display: 'flex', alignItems: 'flex-start', transform: `translateX(${(1 - s) * -700}px)` }}>
          <div style={{ width: 22, height: 760, marginTop: -40, borderRadius: 11, background: 'linear-gradient(90deg,#6b5a3a,#cdb98a,#6b5a3a)' }} />
          <WavingFlag w={720} h={480} id="sen" amp={0.05}>
            <SenyeraArt w={720} h={480} />
          </WavingFlag>
        </div>
      </Center>
      <div style={{ position: 'absolute', top: 1170, left: 0, right: 0, textAlign: 'center', fontFamily: DISPLAY, fontSize: 64, letterSpacing: 14, color: 'rgba(255,255,255,0.8)', opacity: interpolate(frame, [15, 28], [0, 1], clamp) }}>
        SENYERA
      </div>
    </AbsoluteFill>
  );
};

// ---------- captain's armband ----------

export const Armband: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const s = useIn(2);
  const crowd = Array.from({ length: 7 }, (_, i) => i);
  return (
    <AbsoluteFill>
      <BlaugranaBg />
      <Center y={760}>
        <div style={{ transform: `scale(${0.7 + 0.3 * s}) rotate(${-6 + Math.sin(frame / 25) * 2}deg)`, opacity: s }}>
          <svg width={820} height={360} viewBox="0 0 820 360">
            <defs>
              <clipPath id="band-clip"><rect x={10} y={40} width={800} height={280} rx={60} /></clipPath>
              <linearGradient id="band-shade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fff" stopOpacity={0.35} />
                <stop offset="0.45" stopColor="#fff" stopOpacity={0} />
                <stop offset="1" stopColor="#000" stopOpacity={0.45} />
              </linearGradient>
            </defs>
            <g clipPath="url(#band-clip)">
              <SenyeraArt w={820} h={360} />
              <rect width={820} height={360} fill="url(#band-shade)" />
            </g>
            <rect x={10} y={40} width={800} height={280} rx={60} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth={6} />
            <circle cx={410} cy={180} r={112} fill="#fff" stroke={C.ink} strokeWidth={8} />
            <text x={410} y={240} textAnchor="middle" fontFamily={DISPLAY} fontSize={170} fill={C.ink}>C</text>
          </svg>
        </div>
      </Center>
      {crowd.map((i) => {
        const x = -60 + i * 170;
        const bob = Math.sin(frame / 9 + i) * 18;
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: 1130 + (i % 2) * 60 + bob, transform: `rotate(${(i % 2 ? 6 : -5)}deg)`, opacity: 0.85 }}>
            <WavingFlag w={240} h={160} id={`crowd${i}`} speed={0.16}>
              <SenyeraArt w={240} h={160} />
            </WavingFlag>
          </div>
        );
      })}
      <Kicker text="The captain’s armband" y={230} />
    </AbsoluteFill>
  );
};

// ---------- Gamper, 1899 ----------

const Chip: React.FC<{ a: string; b: string; label: string }> = ({ a, b, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
    <div style={{ width: 230, height: 230, borderRadius: 34, overflow: 'hidden', display: 'flex', boxShadow: '0 16px 30px rgba(0,0,0,0.5)', border: '6px solid rgba(255,255,255,0.85)' }}>
      <div style={{ flex: 1, background: a }} />
      <div style={{ flex: 1, background: b }} />
    </div>
    <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 40, color: '#fff' }}>{label}</div>
  </div>
);

export const Gamper: React.FC<SceneProps> = ({ frames }) => {
  const frame = useCurrentFrame();
  const year = Math.round(interpolate(frame, [0, 30], [1870, 1899], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const name = useIn(8);
  const chipsAt = Math.round(frames * 0.45);
  const chips = spring({ frame: frame - chipsAt, fps: 30, config: { damping: 15 } });
  const arrow = interpolate(frame, [chipsAt + 10, chipsAt + 25], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkBg glow="#2a3350" />
      <div style={{ position: 'absolute', top: 230, left: 0, right: 0, textAlign: 'center', fontFamily: DISPLAY, fontSize: 260, color: C.gold, letterSpacing: 8, textShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
        {year}
      </div>
      <div style={{ position: 'absolute', top: 540, left: 0, right: 0, textAlign: 'center', opacity: name, transform: `translateY(${(1 - name) * 30}px)` }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 110, color: '#fff', letterSpacing: 4 }}>JOAN GAMPER</div>
        <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 40, color: 'rgba(255,255,255,0.65)', letterSpacing: 4 }}>FOUNDER · 1877–1930</div>
      </div>
      <div style={{ position: 'absolute', top: 830, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 50, opacity: chips, transform: `scale(${0.8 + 0.2 * chips})` }}>
        <Chip a={C.red} b="#1d3f9a" label="FC Basel" />
        <svg width={120} height={60} viewBox="0 0 120 60" style={{ opacity: arrow }}>
          <path d="M 8 30 L 100 30 M 76 8 L 104 30 L 76 52" stroke={C.gold} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ opacity: arrow }}><Chip a={C.blue} b={C.garnet} label="FC Barcelona" /></div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- the ball ----------

export const Ball: React.FC<SceneProps> = ({ frames }) => {
  const frame = useCurrentFrame();
  const s = useIn(0);
  const spin = interpolate(frame, [0, frames], [-25, 25]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 55% 35% at 50% 45%, #5a5a60 0%, #1a1a1e 60%, #070708 100%)' }} />
      <Center y={850}>
        <svg width={620} height={620} viewBox="-110 -110 220 220" style={{ transform: `scale(${0.6 + 0.4 * s}) translateY(${(1 - s) * -200}px)`, filter: 'drop-shadow(0 40px 40px rgba(0,0,0,0.7))' }}>
          <defs>
            <radialGradient id="leather" cx="38%" cy="32%" r="75%">
              <stop offset="0%" stopColor="#a8672e" />
              <stop offset="60%" stopColor="#6e3a14" />
              <stop offset="100%" stopColor="#2e1606" />
            </radialGradient>
          </defs>
          <g transform={`rotate(${spin})`}>
            <circle r={100} fill="url(#leather)" />
            <g stroke="#2a1305" strokeWidth={3.5} fill="none" opacity={0.8}>
              <path d="M -96 -28 C -40 -12, 40 -12, 96 -28" />
              <path d="M -98 22 C -40 38, 40 38, 98 22" />
              <path d="M -30 -95 C -46 -30, -46 30, -30 95" />
              <path d="M 32 -94 C 48 -30, 48 30, 32 94" />
            </g>
            <g stroke="#e9d9b5" strokeWidth={2.4} strokeLinecap="round">
              {[-14, -7, 0, 7, 14].map((y) => <line key={y} x1={-8} y1={y - 40} x2={8} y2={y - 40} />)}
            </g>
          </g>
          <circle r={100} fill="none" stroke="#000" strokeOpacity={0.4} strokeWidth={2} />
        </svg>
      </Center>
      <Center y={1240}>
        <div style={{ width: 420, height: 40, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,0.6), rgba(0,0,0,0))' }} />
      </Center>
      <Kicker text="04 · The centre" y={230} />
    </AbsoluteFill>
  );
};

// ---------- 1910, Comamala ----------

export const Comamala: React.FC<SceneProps> = ({ frames }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [0, frames * 0.6], [1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const fill = interpolate(frame, [frames * 0.6, frames * 0.85], [0, 1], clamp);
  const stamp = spring({ frame: frame - 8, fps: 30, config: { damping: 12 } });
  return (
    <AbsoluteFill>
      <Parchment />
      <Center y={860}>
        <div style={{ position: 'relative', width: 600, height: 720 }}>
          <div style={{ position: 'absolute', inset: 0, opacity: fill }}>
            <Crest size={600} id="coma" />
          </div>
          <svg width={600} height={720} viewBox="-10 -10 420 500" style={{ position: 'absolute', inset: 0, opacity: 1 - fill * 0.9 }}>
            <g fill="none" stroke="#3b2a12" strokeWidth={3.5} strokeLinecap="round" pathLength={1}>
              <path d={CREST_OUTLINE} pathLength={1} strokeDasharray="1" strokeDashoffset={draw} />
              <path d="M 200 22 L 200 185 M 0 185 L 400 185 M 0 247 L 400 247" pathLength={1} strokeDasharray="1" strokeDashoffset={draw} />
              <path d="M 110 10 L 110 185 M 10 108 L 200 108" pathLength={1} strokeDasharray="1" strokeDashoffset={draw} />
              <path d="M 244 20 L 244 185 M 289 22 L 289 185 M 333 22 L 333 185" pathLength={1} strokeDasharray="1" strokeDashoffset={draw} />
              <path d="M 57 247 L 57 400 M 114 247 L 114 440 M 171 247 L 171 465 M 229 247 L 229 465 M 286 247 L 286 440 M 343 247 L 343 400" pathLength={1} strokeDasharray="1" strokeDashoffset={draw} />
              <circle cx={200} cy={345} r={44} pathLength={1} strokeDasharray="1" strokeDashoffset={draw} />
            </g>
          </svg>
        </div>
      </Center>
      <div style={{
        position: 'absolute', top: 170, left: 0, right: 0, display: 'flex', justifyContent: 'center',
      }}>
        <div style={{
          fontFamily: DISPLAY, fontSize: 130, color: '#8b1a1a', border: '10px solid #8b1a1a', borderRadius: 20,
          padding: '0 40px', transform: `rotate(-6deg) scale(${2 - stamp})`, opacity: Math.min(1, stamp * 1.5),
        }}>1910</div>
      </div>
      <div style={{ position: 'absolute', top: 1250, left: 0, right: 0, textAlign: 'center', fontFamily: BODY, fontWeight: 700, fontSize: 52, color: '#3b2a12', fontStyle: 'italic', letterSpacing: 2, opacity: interpolate(frame, [20, 35], [0, 1], clamp) }}>
        Carles Comamala
      </div>
    </AbsoluteFill>
  );
};

// ---------- outro: the four meanings ----------

const LABELS: { text: string; x: number; y: number; lx: number; ly: number; at: number }[] = [
  { text: 'Sant Jordi', x: 60, y: 470, lx: 390, ly: 560, at: 0.12 },
  { text: 'Senyera', x: 760, y: 470, lx: 690, ly: 560, at: 0.27 },
  { text: 'Blaugrana', x: 50, y: 1110, lx: 380, ly: 1010, at: 0.42 },
  { text: 'The ball', x: 770, y: 1110, lx: 590, ly: 960, at: 0.57 },
];

export const Outro: React.FC<SceneProps> = ({ frames }) => {
  const frame = useCurrentFrame();
  const s = useIn(0);
  const visca = spring({ frame: frame - Math.round(frames * 0.78), fps: 30, config: { damping: 10 } });
  return (
    <AbsoluteFill>
      <BlaugranaBg />
      <Center y={800}>
        <div style={{ transform: `scale(${0.85 + 0.15 * s})` }}>
          <Crest size={560} id="outro" />
        </div>
      </Center>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {LABELS.map((l, i) => {
          const p = interpolate(frame, [frames * l.at, frames * l.at + 10], [0, 1], clamp);
          const ax = l.x + (l.x < 500 ? 230 : 20);
          return <line key={i} x1={ax} y1={l.y + 40} x2={ax + (l.lx - ax) * p} y2={l.y + 40 + (l.ly - l.y - 40) * p} stroke={C.gold} strokeWidth={5} strokeLinecap="round" />;
        })}
      </svg>
      {LABELS.map((l, i) => {
        const p = spring({ frame: frame - Math.round(frames * l.at), fps: 30, config: { damping: 13 } });
        return (
          <div key={i} style={{
            position: 'absolute', left: l.x, top: l.y, padding: '10px 26px', borderRadius: 40, background: 'rgba(10,10,14,0.75)',
            border: `3px solid ${C.gold}`, fontFamily: BODY, fontWeight: 800, fontSize: 44, color: '#fff',
            transform: `scale(${p})`, opacity: p,
          }}>{l.text}</div>
        );
      })}
      <div style={{
        position: 'absolute', top: 250, left: 0, right: 0, textAlign: 'center', fontFamily: DISPLAY, fontSize: 130,
        color: C.gold, letterSpacing: 6, transform: `scale(${visca})`, opacity: visca, textShadow: '0 8px 24px rgba(0,0,0,0.6)',
      }}>VISCA BARÇA</div>
    </AbsoluteFill>
  );
};

export const CREST_VISUALS: Record<string, React.FC<SceneProps>> = {
  hook: Hook,
  'crest-tl': CrestTL,
  england: England,
  stjordi: StJordi,
  roses: Roses,
  'crest-tr': CrestTR,
  senyera: Senyera,
  armband: Armband,
  'crest-bottom': CrestBottom,
  gamper: Gamper,
  ball: Ball,
  comamala: Comamala,
  outro: Outro,
};
