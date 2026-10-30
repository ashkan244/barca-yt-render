import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame } from 'remotion';
import { BODY, C, DISPLAY } from './theme';
import { Crest } from './Crest';
import { SenyeraArt, WavingFlag } from './Flag';
import { BlaugranaBg, Center, Cup, DarkBg, Kicker, SceneProps, clamp, useDrift, useIn } from './kit';

const Gold: React.FC<{ children: React.ReactNode; size: number; style?: React.CSSProperties }> = ({ children, size, style }) => (
  <div style={{
    fontFamily: DISPLAY, fontSize: size, lineHeight: 1, letterSpacing: 4,
    background: 'linear-gradient(180deg, #fff3c4 0%, #f2c230 45%, #a77a12 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text',
    color: 'transparent', filter: 'drop-shadow(0 10px 30px rgba(242,194,48,0.35))', ...style,
  }}>{children}</div>
);

// ---------- hook: 19 ----------

export const LHook: React.FC<SceneProps> = ({ frames }) => {
  const frame = useCurrentFrame();
  const s = useIn(0, 11);
  const drift = useDrift(frames, 1.08);
  const rays = interpolate(frame, [0, frames], [0, 25]);
  return (
    <AbsoluteFill>
      <DarkBg glow="#4a3a10" />
      <Center y={860}>
        <svg width={1400} height={1400} viewBox="-700 -700 1400 1400" style={{ position: 'absolute', opacity: 0.22 * s }}>
          {Array.from({ length: 24 }, (_, i) => (
            <path key={i} d="M 0 0 L 40 -700 L -40 -700 Z" fill={C.gold} transform={`rotate(${i * 15 + rays})`} />
          ))}
        </svg>
        <div style={{ transform: `scale(${(0.5 + 0.5 * s) * drift})`, textAlign: 'center' }}>
          <Gold size={560}>19</Gold>
          <div style={{ fontFamily: DISPLAY, fontSize: 90, color: '#fff', letterSpacing: 18, marginTop: -10 }}>YEARS OLD</div>
        </div>
      </Center>
      <Center y={330}>
        <div style={{ opacity: interpolate(frame, [10, 22], [0, 1], clamp) }}><Crest size={170} id="lh" /></div>
      </Center>
    </AbsoluteFill>
  );
};

// ---------- Kopa x3 ----------

export const LKopa: React.FC<SceneProps> = ({ frames }) => {
  const frame = useCurrentFrame();
  const cup = useIn(0, 13);
  const years = ['2024', '2025', '2026'];
  const step = Math.max(12, Math.round(frames * 0.16));
  return (
    <AbsoluteFill>
      <DarkBg glow="#3d3216" />
      <Kicker text="Kopa Trophy" y={230} />
      <Center y={720}>
        <div style={{ transform: `translateY(${(1 - cup) * 200}px) scale(${0.8 + 0.2 * cup})`, opacity: cup, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.7))' }}>
          <Cup w={380} />
          <div style={{ marginTop: 18, textAlign: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 40, letterSpacing: 4, color: 'rgba(255,255,255,0.8)' }}>BEST YOUNG PLAYER</div>
        </div>
      </Center>
      <div style={{ position: 'absolute', top: 1080, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 26 }}>
        {years.map((y, i) => {
          const p = spring({ frame: frame - 10 - i * step, fps: 30, config: { damping: 12 } });
          return (
            <div key={y} style={{
              width: 250, padding: '16px 0', borderRadius: 18, textAlign: 'center', transform: `scale(${p})`, opacity: p,
              background: i === 2 ? C.gold : 'rgba(255,255,255,0.1)', border: `3px solid ${C.gold}`,
              fontFamily: DISPLAY, fontSize: 76, color: i === 2 ? C.ink : C.gold, letterSpacing: 4,
            }}>{y}</div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', top: 1215, left: 0, right: 0, textAlign: 'center', opacity: interpolate(frame, [10 + 3 * step, 22 + 3 * step], [0, 1], clamp) }}>
        <Gold size={120}>×3 IN A ROW</Gold>
      </div>
    </AbsoluteFill>
  );
};

// ---------- previous winners ----------

const WINNERS: [string, string, number][] = [
  ['2018', 'Kylian Mbappé', 1], ['2019', 'Matthijs de Ligt', 1], ['2021', 'Pedri', 1],
  ['2022', 'Gavi', 1], ['2023', 'Jude Bellingham', 1], ['2024–26', 'Lamine Yamal', 3],
];

export const LWinners: React.FC<SceneProps> = ({ frames }) => {
  const frame = useCurrentFrame();
  const step = Math.max(6, Math.round((frames * 0.55) / WINNERS.length));
  return (
    <AbsoluteFill>
      <DarkBg glow="#2a3350" />
      <Kicker text="Every Kopa winner" y={230} />
      <div style={{ position: 'absolute', top: 400, left: 90, right: 90, display: 'flex', flexDirection: 'column', gap: 22 }}>
        {WINNERS.map(([y, name, n], i) => {
          const last = i === WINNERS.length - 1;
          const p = spring({ frame: frame - 4 - i * step, fps: 30, config: { damping: 15 } });
          return (
            <div key={y} style={{
              display: 'flex', alignItems: 'center', height: 118, padding: '0 34px', borderRadius: 22, gap: 28,
              background: last ? 'linear-gradient(90deg, #0d4ea6, #a50044)' : 'rgba(255,255,255,0.07)',
              border: last ? `4px solid ${C.gold}` : '2px solid rgba(255,255,255,0.12)',
              transform: `translateX(${(1 - p) * -900}px) scale(${last ? 1 + 0.04 * Math.sin(frame / 6) * p : 1})`, opacity: p,
            }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 54, color: last ? C.gold : 'rgba(255,255,255,0.55)', width: 230 }}>{y}</div>
              <div style={{ flex: 1, fontFamily: BODY, fontWeight: 800, fontSize: 50, color: '#fff' }}>{name}</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {Array.from({ length: n }, (_, k) => (
                  <svg key={k} width={44} height={44} viewBox="0 0 10 10"><circle cx={5} cy={5} r={4.4} fill={last ? C.gold : '#8a8a92'} /></svg>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Ballon d'Or podium ----------

const PODIUM = [
  { place: 2, name: 'MBAPPÉ', h: 300, x: 0 },
  { place: 1, name: 'KANE', h: 420, x: 1 },
  { place: 3, name: 'YAMAL', h: 190, x: 2 },
];

export const LBallon: React.FC<SceneProps> = ({ frames }) => {
  const frame = useCurrentFrame();
  const note = interpolate(frame, [frames * 0.72, frames * 0.72 + 10], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkBg glow="#3d3216" />
      <Kicker text="Ballon d’Or 2026 · London" y={230} />
      <Center y={560}>
        <svg width={230} height={230} viewBox="-110 -110 220 220" style={{ opacity: useIn(0), filter: 'drop-shadow(0 20px 30px rgba(242,194,48,0.35))' }}>
          <defs>
            <radialGradient id="lb-ball" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#fff3c4" /><stop offset="0.5" stopColor="#f2c230" /><stop offset="1" stopColor="#7a560c" /></radialGradient>
          </defs>
          <circle r={100} fill="url(#lb-ball)" />
          <g stroke="#8a6410" strokeWidth={4} fill="none" opacity={0.7}>
            <path d="M -96 -28 C -40 -12, 40 -12, 96 -28" /><path d="M -98 22 C -40 38, 40 38, 98 22" />
            <path d="M -30 -95 C -46 -30, -46 30, -30 95" /><path d="M 32 -94 C 48 -30, 48 30, 32 94" />
          </g>
        </svg>
      </Center>
      <div style={{ position: 'absolute', left: 90, right: 90, bottom: 560, height: 420, display: 'flex', alignItems: 'flex-end', gap: 20 }}>
        {PODIUM.map((p, i) => {
          const s = spring({ frame: frame - 4 - (p.place - 1) * 6, fps: 30, config: { damping: 14 } });
          const us = p.name === 'YAMAL';
          return (
            <div key={p.name} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontFamily: DISPLAY, fontSize: us ? 64 : 54, color: us ? C.gold : '#fff', marginBottom: 14, opacity: s, letterSpacing: 2 }}>{p.name}</div>
              <div style={{
                width: '100%', height: p.h * s, borderRadius: '16px 16px 0 0',
                background: us ? 'linear-gradient(180deg, #a50044, #0d4ea6)' : 'linear-gradient(180deg, #3a3a44, #1c1c22)',
                border: us ? `4px solid ${C.gold}` : '2px solid rgba(255,255,255,0.15)', display: 'flex', justifyContent: 'center', paddingTop: 18,
                fontFamily: DISPLAY, fontSize: 110, color: us ? C.gold : 'rgba(255,255,255,0.5)', overflow: 'hidden',
              }}>{p.place}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', top: 1385, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: note, transform: `translateY(${(1 - note) * 20}px)` }}>
        <div style={{ padding: '6px 26px', borderRadius: 30, background: 'rgba(0,0,0,0.6)', border: `2px solid ${C.gold}`, fontFamily: BODY, fontWeight: 800, fontSize: 38, color: C.gold }}>2025: RUNNER-UP</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- roots: flags + 304 ----------

const MoroccoArt: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const r = h * 0.24;
  const pts = Array.from({ length: 5 }, (_, i) => {
    const a = -Math.PI / 2 + (i * 4 * Math.PI) / 5;
    return `${w / 2 + r * Math.cos(a)},${h / 2 + r * Math.sin(a)}`;
  }).join(' ');
  return (
    <g>
      <rect width={w} height={h} fill="#c1272d" />
      <polygon points={pts} fill="none" stroke="#006233" strokeWidth={h * 0.045} strokeLinejoin="miter" />
    </g>
  );
};

// simplified: the coat of arms in the centre is left out
const EqGuineaArt: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <g>
    <rect width={w} height={h / 3} fill="#3e9a00" />
    <rect y={h / 3} width={w} height={h / 3} fill="#fff" />
    <rect y={(2 * h) / 3} width={w} height={h / 3} fill="#e32118" />
    <polygon points={`0,0 ${w * 0.28},${h / 2} 0,${h}`} fill="#0073ce" />
  </g>
);

export const LRoots: React.FC<SceneProps> = ({ frames }) => {
  const frame = useCurrentFrame();
  const flags = [
    { id: 'ma', label: 'MOROCCO', Art: MoroccoArt },
    { id: 'gq', label: 'EQUATORIAL GUINEA', Art: EqGuineaArt },
    { id: 'cat', label: 'MATARÓ, CATALONIA', Art: SenyeraArt },
  ];
  const switchAt = Math.round(frames * 0.62);
  const big = spring({ frame: frame - switchAt, fps: 30, config: { damping: 12 } });
  return (
    <AbsoluteFill>
      <DarkBg glow="#3a2a2a" />
      <Kicker text="Where he comes from" y={230} />
      <div style={{ position: 'absolute', top: 420, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34, opacity: 1 - big * 0.85 }}>
        {flags.map((f, i) => {
          const p = spring({ frame: frame - 4 - i * 9, fps: 30, config: { damping: 15 } });
          return (
            <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 40, width: 840, transform: `translateX(${(1 - p) * (i % 2 ? 900 : -900)}px)` }}>
              <div style={{ filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.5))' }}>
                <WavingFlag w={300} h={200} id={`lr-${f.id}`}><f.Art w={300} h={200} /></WavingFlag>
              </div>
              <div style={{ fontFamily: DISPLAY, fontSize: 58, color: '#fff', letterSpacing: 3 }}>{f.label}</div>
            </div>
          );
        })}
      </div>
      {frame >= switchAt ? (
        <Center y={820}>
          <div style={{ textAlign: 'center', transform: `scale(${0.6 + 0.4 * big})`, opacity: big }}>
            <Gold size={420}>304</Gold>
            <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 46, color: '#fff', letterSpacing: 4, marginTop: 10 }}>08304 · ROCAFONDA</div>
          </div>
        </Center>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- La Masia 2014 ----------

export const LMasia: React.FC<SceneProps> = ({ frames }) => {
  const frame = useCurrentFrame();
  const s = useIn(0);
  const drift = useDrift(frames, 1.07);
  const year = Math.round(interpolate(frame, [0, 26], [2007, 2014], { ...clamp, easing: Easing.out(Easing.cubic) }));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, #f3b46b 0%, #c9724a 45%, #3a2030 100%)' }} />
      <Center y={900}>
        <svg width={900} height={620} viewBox="0 0 900 620" style={{ transform: `scale(${drift}) translateY(${(1 - s) * 60}px)`, opacity: s }}>
          {/* stylised Catalan masia: stone farmhouse, gabled roof, arched windows */}
          <path d="M 120 250 L 450 90 L 780 250 Z" fill="#8a3b22" />
          <rect x={150} y={250} width={600} height={330} fill="#d8c3a0" />
          <rect x={150} y={250} width={600} height={330} fill="url(#lm-stone)" opacity={0.35} />
          {[230, 410, 590].map((x) => (
            <path key={x} d={`M ${x} 330 L ${x} 300 A 40 40 0 0 1 ${x + 80} 300 L ${x + 80} 330 Z`} fill="#3a2a22" />
          ))}
          <path d="M 400 580 L 400 470 A 50 50 0 0 1 500 470 L 500 580 Z" fill="#4a2c1a" />
          {[200, 330, 570, 700].map((x) => <rect key={x} x={x - 30} y={410} width={60} height={70} fill="#3a2a22" />)}
          <defs>
            <pattern id="lm-stone" width="60" height="30" patternUnits="userSpaceOnUse">
              <path d="M 0 30 L 60 30 M 30 0 L 30 30" stroke="#6b5a40" strokeWidth={2} />
            </pattern>
          </defs>
          <rect x={0} y={578} width={900} height={42} fill="#2f5d3a" />
        </svg>
      </Center>
      <div style={{ position: 'absolute', top: 230, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 130, color: '#fff', letterSpacing: 8, textShadow: '0 6px 24px rgba(0,0,0,0.4)' }}>LA MASIA</div>
        <div style={{ fontFamily: DISPLAY, fontSize: 160, color: '#5a1a0e', letterSpacing: 6, marginTop: 4, textShadow: '0 2px 0 rgba(255,255,255,0.35)' }}>{year}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- debut: 15y 9m 16d ----------

export const LDebut: React.FC<SceneProps> = ({ frames }) => {
  const frame = useCurrentFrame();
  const card = useIn(0);
  const parts = [['15', 'YEARS'], ['9', 'MONTHS'], ['16', 'DAYS']];
  const step = Math.max(8, Math.round(frames * 0.12));
  return (
    <AbsoluteFill>
      <BlaugranaBg />
      <Kicker text="First-team debut" y={230} />
      <Center y={560}>
        <div style={{
          padding: '24px 56px', borderRadius: 26, background: '#fbf7ee', boxShadow: '0 20px 40px rgba(0,0,0,0.45)', textAlign: 'center',
          transform: `rotate(${(1 - card) * 8 - 2}deg) scale(${card})`,
        }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 120, color: C.ink, letterSpacing: 4 }}>29.04.2023</div>
          <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 40, color: C.garnet, letterSpacing: 2 }}>BARÇA 4–0 REAL BETIS</div>
        </div>
      </Center>
      <div style={{ position: 'absolute', top: 820, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 30 }}>
        {parts.map(([n, u], i) => {
          const p = spring({ frame: frame - 10 - i * step, fps: 30, config: { damping: 12 } });
          return (
            <div key={u} style={{ width: 280, height: 300, borderRadius: 26, background: 'rgba(0,0,0,0.45)', border: `3px solid ${C.gold}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${p})`, opacity: p }}>
              <Gold size={180}>{n}</Gold>
              <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 40, color: '#fff', letterSpacing: 3 }}>{u}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Euro 2024 + World Cup 2026 ----------

const SpainArt: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <g>
    <rect width={w} height={h} fill="#aa151b" />
    <rect y={h / 4} width={w} height={h / 2} fill="#f1bf00" />
  </g>
);

export const LTrophies: React.FC<SceneProps> = ({ frames }) => {
  const frame = useCurrentFrame();
  const a = useIn(4, 13);
  const b = spring({ frame: frame - Math.round(frames * 0.35), fps: 30, config: { damping: 13 } });
  const badge = interpolate(frame, [frames * 0.7, frames * 0.7 + 10], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkBg glow="#4a1418" />
      <Center y={560}>
        <div style={{ opacity: 0.55 }}>
          <WavingFlag w={980} h={650} id="lt-es" amp={0.035}><SpainArt w={980} h={650} /></WavingFlag>
        </div>
      </Center>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 70%)' }} />
      <div style={{ position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 80, alignItems: 'flex-end' }}>
        <div style={{ textAlign: 'center', transform: `translateY(${(1 - a) * 300}px)`, opacity: a }}>
          <Cup w={300} tall />
          <div style={{ fontFamily: DISPLAY, fontSize: 80, color: '#fff', letterSpacing: 3 }}>EURO 2024</div>
        </div>
        <div style={{ textAlign: 'center', transform: `translateY(${(1 - b) * 300}px)`, opacity: b }}>
          <Cup w={300} tall />
          <div style={{ fontFamily: DISPLAY, fontSize: 80, color: '#fff', letterSpacing: 3 }}>WORLD CUP 2026</div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 1170, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: badge, transform: `scale(${0.8 + 0.2 * badge})` }}>
        <div style={{ padding: '12px 36px', borderRadius: 40, background: C.gold, fontFamily: DISPLAY, fontSize: 60, color: C.ink, letterSpacing: 3 }}>YOUNGEST TO WIN BOTH</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- the number 10 ----------

const SHIRT = 'M 150 40 L 250 40 C 260 70, 340 70, 350 40 L 450 40 L 560 150 L 480 250 L 440 215 L 440 640 L 60 640 L 60 215 L 20 250 L -60 150 Z';

export const LTen: React.FC<SceneProps> = ({ frames }) => {
  const frame = useCurrentFrame();
  const s = useIn(0, 14);
  const drift = useDrift(frames, 1.06);
  const turn = interpolate(frame, [0, 18], [70, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <DarkBg glow="#2a3350" />
      <Center y={860}>
        <svg width={760} height={800} viewBox="-80 0 660 680" style={{ transform: `perspective(1600px) rotateY(${turn}deg) scale(${(0.85 + 0.15 * s) * drift})`, opacity: s, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.6))' }}>
          <defs>
            <clipPath id="lt-shirt"><path d={SHIRT} /></clipPath>
            <linearGradient id="lt-fold" x1="0" x2="1"><stop offset="0" stopColor="#000" stopOpacity={0.35} /><stop offset="0.5" stopColor="#fff" stopOpacity={0.08} /><stop offset="1" stopColor="#000" stopOpacity={0.35} /></linearGradient>
          </defs>
          <g clipPath="url(#lt-shirt)">
            {Array.from({ length: 8 }, (_, i) => (
              <rect key={i} x={-60 + i * 80} y={0} width={81} height={680} fill={i % 2 ? C.garnet : C.blue} />
            ))}
            <rect x={-60} y={0} width={640} height={680} fill="url(#lt-fold)" />
          </g>
          <path d={SHIRT} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth={4} />
          <text x={250} y={230} textAnchor="middle" fontFamily={DISPLAY} fontSize={84} fill={C.gold} letterSpacing={8}>YAMAL</text>
          <text x={250} y={520} textAnchor="middle" fontFamily={DISPLAY} fontSize={300} fill={C.gold} stroke="#5a3f08" strokeWidth={4}>10</text>
        </svg>
      </Center>
      <Kicker text="The number 10" y={230} />
    </AbsoluteFill>
  );
};

// ---------- outro: quote + question ----------

export const LOutro: React.FC<SceneProps> = ({ frames }) => {
  const frame = useCurrentFrame();
  const q = useIn(4);
  const ask = spring({ frame: frame - Math.round(frames * 0.55), fps: 30, config: { damping: 10 } });
  return (
    <AbsoluteFill>
      <BlaugranaBg />
      <Center y={430}><div style={{ opacity: q }}><Crest size={220} id="lo" /></div></Center>
      <div style={{ position: 'absolute', top: 650, left: 90, right: 90, padding: '40px 46px', borderRadius: 30, background: 'rgba(8,10,18,0.72)', border: `3px solid ${C.gold}`, transform: `translateY(${(1 - q) * 60}px)`, opacity: q }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 150, color: C.gold, lineHeight: 0.6, height: 70 }}>“</div>
        <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 54, color: '#fff', lineHeight: 1.25 }}>I am convinced that Lamine will end up winning the Ballon d’Or.</div>
        <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 38, color: 'rgba(255,255,255,0.65)', marginTop: 20 }}>— Joan Laporta, Barça president</div>
      </div>
      <div style={{ position: 'absolute', top: 1170, left: 0, right: 0, textAlign: 'center', transform: `scale(${ask})`, opacity: ask }}>
        <Gold size={110}>YOUR TAKE?</Gold>
      </div>
    </AbsoluteFill>
  );
};

export const LAMINE_VISUALS: Record<string, React.FC<SceneProps>> = {
  'l-hook': LHook,
  'l-kopa': LKopa,
  'l-winners': LWinners,
  'l-ballon': LBallon,
  'l-roots': LRoots,
  'l-masia': LMasia,
  'l-debut': LDebut,
  'l-trophies': LTrophies,
  'l-ten': LTen,
  'l-outro': LOutro,
};
