import React from 'react';
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { BODY, C, DISPLAY } from './theme';
import { Crest as BarcaCrest } from '../production/source/CrestArt';
import { BlaugranaBg, Center, DarkBg, Kicker, SceneProps, clamp, cueAt, useDrift } from './kit';

// Hansi Flick's 100th win (6-1 v Alavés, 31 Oct 2026). Facts and sources: scripts/flick.json.
// Every reveal is keyed to the narrated word that names it (cueAt), so picture and voice land together.

const pop = (frame: number, at: number, damping = 13) => spring({ frame: frame - at, fps: 30, config: { damping, stiffness: 140 } });
const count = (frame: number, from: number, to: number, target: number) =>
  interpolate(frame, [from, to], [0, target], { ...clamp, easing: Easing.out(Easing.cubic) });

const Gold: React.FC<{ children: React.ReactNode; size: number; style?: React.CSSProperties }> = ({ children, size, style }) => (
  <div style={{
    fontFamily: DISPLAY, fontSize: size, lineHeight: 1, letterSpacing: 4,
    background: 'linear-gradient(180deg, #fff3c4 0%, #f2c230 45%, #a77a12 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text',
    color: 'transparent', filter: 'drop-shadow(0 10px 30px rgba(242,194,48,0.35))', ...style,
  }}>{children}</div>
);

const Sfx: React.FC<{ at: number; src: string; volume?: number }> = ({ at, src, volume = 0.3 }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={45} layout="none"><Audio src={staticFile(`sfx/${src}`)} volume={volume} /></Sequence>
);

const Ball: React.FC<{ size: number; dim?: boolean }> = ({ size, dim = false }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ opacity: dim ? 0.45 : 1 }}>
    <circle r="46" fill="#f7f5ef" stroke="#111" strokeWidth="4" />
    <path d="M0 -17 L16 -5 L10 14 L-10 14 L-16 -5 Z" fill="#111" />
    {[0, 72, 144, 216, 288].map((a) => (
      <g key={a} transform={`rotate(${a})`}>
        <path d="M0 -17 L0 -32" stroke="#111" strokeWidth="4" />
        <path d="M-12 -44 L0 -32 L12 -44 A46 46 0 0 0 -12 -44 Z" fill="#111" />
      </g>
    ))}
  </svg>
);

const Pill: React.FC<{ children: React.ReactNode; s: number; gold?: boolean; size?: number; style?: React.CSSProperties }> = ({ children, s, gold = false, size = 50, style }) => (
  <div style={{
    padding: '14px 34px', borderRadius: 999, border: `4px solid ${C.gold}`, background: gold ? C.gold : 'rgba(10,14,30,0.72)',
    fontFamily: DISPLAY, fontSize: size, letterSpacing: 3, color: gold ? C.ink : C.gold, whiteSpace: 'nowrap',
    opacity: s, transform: `scale(${0.6 + 0.4 * s})`, ...style,
  }}>{children}</div>
);

// ---------- 1. hook: only one coach was faster ----------

export const FHook: React.FC<SceneProps> = ({ frames, cues }) => {
  const frame = useCurrentFrame();
  const s = pop(frame, 0, 11);
  const drift = useDrift(frames, 1.06);
  const rays = interpolate(frame, [0, frames], [0, 22]);
  const faster = cueAt(cues, 'faster', 55);
  const hansi = cueAt(cues, 'Hansi', 90);
  const crest = interpolate(frame, [6, 20], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <BlaugranaBg />
      <Center y={780}>
        <svg width={1500} height={1500} viewBox="-750 -750 1500 1500" style={{ position: 'absolute', opacity: 0.2 * s }}>
          {Array.from({ length: 24 }, (_, i) => (
            <path key={i} d="M 0 0 L 42 -750 L -42 -750 Z" fill={C.gold} transform={`rotate(${i * 15 + rays})`} />
          ))}
        </svg>
      </Center>
      <Center y={315}>
        <div style={{ opacity: crest, transform: `translateY(${(1 - crest) * -40}px)` }}><BarcaCrest width={205} id="fh" /></div>
      </Center>
      <Center y={770}>
        <div style={{ transform: `scale(${(0.45 + 0.55 * s) * drift})`, textAlign: 'center' }}>
          <Gold size={410}>100</Gold>
          <div style={{ fontFamily: DISPLAY, fontSize: 104, color: '#fff', letterSpacing: 22, marginTop: -6 }}>WINS</div>
        </div>
      </Center>
      <Center y={1170}>
        <Pill s={pop(frame, faster - 3)}>ONLY ONE COACH GOT THERE FASTER</Pill>
      </Center>
      <Center y={1290}>
        <div style={{
          fontFamily: DISPLAY, fontSize: 96, letterSpacing: 8, color: '#fff', opacity: pop(frame, hansi - 2),
          transform: `translateY(${(1 - pop(frame, hansi - 2)) * 40}px)`, textShadow: '0 6px 24px rgba(0,0,0,0.6)',
        }}>HANSI FLICK</div>
      </Center>
      <Sfx at={faster - 3} src="pop.wav" volume={0.25} />
    </AbsoluteFill>
  );
};

// ---------- 2. race to 100: Luis Enrique 126, Flick 131 ----------

const Podium: React.FC<{ x: number; w: number; h: number; rank: string; name: string; games: number; at: number; hero?: boolean }> = ({ x, w, h, rank, name, games, at, hero = false }) => {
  const frame = useCurrentFrame();
  const s = pop(frame, at, 15);
  const n = Math.round(count(frame, at, at + 26, games));
  const base = 1270;
  return (
    <>
      <div style={{
        position: 'absolute', left: x, width: w, top: base - h * s, height: h * s, borderRadius: '18px 18px 0 0', overflow: 'hidden',
        background: hero ? 'linear-gradient(90deg, #0c3a8f 0%, #0c3a8f 50%, #6b0b30 50%, #6b0b30 100%)' : 'linear-gradient(180deg, #3a4560, #1c2236)',
        border: `5px solid ${hero ? C.gold : 'rgba(255,255,255,0.35)'}`, borderBottom: 'none', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', opacity: Math.min(1, s * 3),
      }}>
        <div style={{ textAlign: 'center', marginTop: 26, fontFamily: DISPLAY, fontSize: 130, color: hero ? C.gold : '#fff', lineHeight: 1 }}>{rank}</div>
        <div style={{ textAlign: 'center', marginTop: 10, fontFamily: DISPLAY, fontSize: 58, letterSpacing: 3, color: '#fff' }}>{name}</div>
      </div>
      <div style={{ position: 'absolute', left: x, width: w, top: base - h * s - 210, textAlign: 'center', opacity: s }}>
        {hero ? <Gold size={170}>{n}</Gold> : <div style={{ fontFamily: DISPLAY, fontSize: 170, lineHeight: 1, color: '#fff' }}>{n}</div>}
        <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 38, letterSpacing: 6, color: 'rgba(255,255,255,0.75)' }}>GAMES</div>
      </div>
    </>
  );
};

export const FRace: React.FC<SceneProps> = ({ cues }) => {
  const lucho = cueAt(cues, 'Luis', 4);
  const flick = cueAt(cues, 'Flick', 70);
  return (
    <AbsoluteFill>
      <DarkBg glow="#1c2c58" />
      <Kicker text="Fastest to 100 Barça wins" y={240} />
      <Podium x={110} w={410} h={430} rank="1ST" name="LUIS ENRIQUE" games={126} at={lucho} />
      <Podium x={560} w={410} h={330} rank="2ND" name="HANSI FLICK" games={131} at={flick} hero />
      <Sfx at={lucho + 24} src="hit.wav" volume={0.25} />
      <Sfx at={flick + 24} src="hit.wav" volume={0.3} />
    </AbsoluteFill>
  );
};

// ---------- 3. win rate: 76.33%, a club record ----------

export const FRate: React.FC<SceneProps> = ({ frames, cues }) => {
  const frame = useCurrentFrame();
  const land = cueAt(cues, 'seventy-six', Math.round(frames * 0.65));
  const ever = cueAt(cues, 'ever', 30);
  const p = count(frame, 4, land + 4, 76.33);
  const r = 290, len = 2 * Math.PI * r;
  const label = pop(frame, ever - 2);
  return (
    <AbsoluteFill>
      <DarkBg glow="#4a3a10" />
      <Kicker text="Club record" y={240} />
      <Center y={720}>
        <svg width={720} height={720} viewBox="-360 -360 720 720" style={{ position: 'absolute' }}>
          <circle r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={50} />
          <circle r={r} fill="none" stroke={C.gold} strokeWidth={50} strokeLinecap="round" transform="rotate(-90)"
            strokeDasharray={`${(len * p) / 100} ${len}`} style={{ filter: 'drop-shadow(0 0 18px rgba(242,194,48,0.5))' }} />
        </svg>
        <div style={{ textAlign: 'center' }}>
          <Gold size={148}>{p.toFixed(2)}%</Gold>
          <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 40, letterSpacing: 6, color: 'rgba(255,255,255,0.8)', marginTop: 10 }}>WIN RATE</div>
        </div>
      </Center>
      <Center y={1200}>
        <div style={{ textAlign: 'center', opacity: label, transform: `translateY(${(1 - label) * 30}px)` }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 78, letterSpacing: 4, color: '#fff', lineHeight: 1.05 }}>HIGHEST OF ANY</div>
          <div style={{ fontFamily: DISPLAY, fontSize: 78, letterSpacing: 4, color: C.gold, lineHeight: 1.05 }}>BARÇA MANAGER</div>
        </div>
      </Center>
      <Sfx at={land} src="impact.wav" volume={0.22} />
    </AbsoluteFill>
  );
};

// ---------- 4. before it: defeats to PSG and Real Madrid ----------

const ResultRow: React.FC<{ y: number; at: number; tile: string; title: string; sub: string; win?: boolean }> = ({ y, at, tile, title, sub, win = false }) => {
  const frame = useCurrentFrame();
  const s = pop(frame, at, 14);
  const pulse = win ? 0.75 + 0.25 * Math.sin((frame - at) / 5) : 1;
  return (
    <div style={{ position: 'absolute', top: y, left: 110, right: 90, display: 'flex', alignItems: 'center', gap: 44, opacity: s, transform: `translateX(${(1 - s) * -120}px)` }}>
      <div style={{
        width: 210, height: 210, borderRadius: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        background: win ? 'rgba(242,194,48,0.12)' : '#b3132e', border: win ? `6px dashed ${C.gold}` : '6px solid #ff5a6e',
        fontFamily: DISPLAY, fontSize: 150, color: win ? C.gold : '#fff', opacity: pulse,
      }}>{tile}</div>
      <div>
        <div style={{ fontFamily: DISPLAY, fontSize: 76, color: win ? C.gold : '#fff', letterSpacing: 2, lineHeight: 1.02 }}>{title}</div>
        <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 38, letterSpacing: 5, color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>{sub}</div>
      </div>
    </div>
  );
};

export const FSlump: React.FC<SceneProps> = ({ frames, cues }) => {
  const psg = cueAt(cues, 'PSG', Math.round(frames * 0.6));
  const madrid = cueAt(cues, 'Real', Math.round(frames * 0.75));
  return (
    <AbsoluteFill>
      <DarkBg glow="#4a0c18" />
      <Kicker text="The week before" y={240} />
      <ResultRow y={420} at={psg - 3} tile="L" title="PSG" sub="DEFEAT" />
      <ResultRow y={700} at={madrid - 3} tile="L" title="REAL MADRID" sub="DEFEAT · CLÁSICO" />
      <ResultRow y={980} at={6} tile="W" title="WIN Nº 100?" sub="NEXT UP: ALAVÉS" win />
      <Sfx at={psg - 3} src="hit.wav" volume={0.22} />
      <Sfx at={madrid - 3} src="hit.wav" volume={0.22} />
    </AbsoluteFill>
  );
};

// ---------- 5. the answer: 6-1 ----------

export const FScore: React.FC<SceneProps> = ({ frames, cues }) => {
  const frame = useCurrentFrame();
  const slam = cueAt(cues, 'six-one', Math.round(frames * 0.45));
  const panel = pop(frame, 0, 15);
  const six = pop(frame, slam - 2, 9);
  const one = pop(frame, slam + 4, 9);
  const shake = frame >= slam && frame < slam + 8 ? Math.sin(frame * 3.1) * (slam + 8 - frame) * 1.6 : 0;
  return (
    <AbsoluteFill>
      <BlaugranaBg />
      <Kicker text="Win Nº 100 · Spotify Camp Nou" y={240} />
      <Center y={760} style={{ transform: `translateX(${shake}px)` }}>
        <div style={{
          width: 960, height: 640, borderRadius: 40, background: 'rgba(8,12,28,0.78)', border: `5px solid ${C.gold}`,
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)', opacity: panel, transform: `scale(${0.85 + 0.15 * panel})`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 50px', boxSizing: 'border-box',
        }}>
          <div style={{ textAlign: 'center', width: 230 }}>
            <BarcaCrest width={200} id="fs" />
            <div style={{ fontFamily: DISPLAY, fontSize: 60, color: '#fff', letterSpacing: 3, marginTop: 14 }}>BARÇA</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, fontFamily: DISPLAY, lineHeight: 1 }}>
            <div style={{ fontSize: 280, color: C.gold, transform: `scale(${six})`, opacity: Math.min(1, six * 2) }}>6</div>
            <div style={{ fontSize: 140, color: 'rgba(255,255,255,0.6)' }}>–</div>
            <div style={{ fontSize: 280, color: '#fff', transform: `scale(${one})`, opacity: Math.min(1, one * 2) }}>1</div>
          </div>
          <div style={{ textAlign: 'center', width: 230 }}>
            <div style={{
              width: 190, height: 190, margin: '0 auto', borderRadius: '50%', background: 'linear-gradient(90deg, #1f4fa8 0 50%, #f7f5ef 50% 100%)',
              border: '6px solid rgba(255,255,255,0.85)',
            }} />
            <div style={{ fontFamily: DISPLAY, fontSize: 60, color: '#fff', letterSpacing: 3, marginTop: 24 }}>ALAVÉS</div>
          </div>
        </div>
      </Center>
      <Center y={1180}>
        <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 42, letterSpacing: 5, color: 'rgba(255,255,255,0.85)', opacity: one }}>31 OCT 2026 · 53,523 FANS</div>
      </Center>
      <Sfx at={slam - 2} src="impact.wav" volume={0.3} />
      <Sfx at={slam} src="crowd.wav" volume={0.22} />
    </AbsoluteFill>
  );
};

// ---------- 6. the opener: 15 passes, 9 players ----------

// schematic half pitch, attacking upwards; only the last move the club describes is plotted
// (Pedri's outside-of-the-boot pass, Fermín down the left, square ball, Raphinha scores)
const MOVE = [
  { x: 450, y: 610, name: 'PEDRI' },
  { x: 150, y: 330, name: 'FERMÍN' },
  { x: 470, y: 175, name: 'RAPHINHA' },
  { x: 450, y: 6, name: '' },
];

const Pitch: React.FC<{ reveal: number }> = ({ reveal }) => {
  const frame = useCurrentFrame();
  const legs = MOVE.slice(1).map((b, i) => ({ a: MOVE[i], b, p: interpolate(reveal, [i / 3, (i + 1) / 3], [0, 1], clamp) }));
  return (
    <svg width={900} height={740} viewBox="0 0 900 740">
      <defs>
        <clipPath id="fm-pitch"><rect x="0" y="0" width="900" height="740" rx="18" /></clipPath>
      </defs>
      <g clipPath="url(#fm-pitch)">
        {Array.from({ length: 8 }, (_, i) => <rect key={i} x="0" y={i * 92.5} width="900" height="92.5" fill={i % 2 ? '#1f6b34' : '#237a3b'} />)}
        <rect width="900" height="740" fill="rgba(0,0,0,0.28)" />
      </g>
      <g fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="5">
        <rect x="3" y="3" width="894" height="734" rx="16" />
        <rect x="180" y="3" width="540" height="250" />
        <rect x="330" y="3" width="240" height="85" />
        <path d="M 360 253 A 120 120 0 0 0 540 253" />
        <path d="M 330 737 A 120 120 0 0 1 570 737" />
        <rect x="390" y="3" width="120" height="16" stroke={C.gold} fill="rgba(242,194,48,0.25)" />
      </g>
      {legs.map(({ a, b, p }, i) => p > 0 ? (
        <g key={i}>
          <line x1={a.x} y1={a.y} x2={a.x + (b.x - a.x) * p} y2={a.y + (b.y - a.y) * p} stroke={i === 2 ? C.gold : '#fff'} strokeWidth={i === 2 ? 9 : 7}
            strokeDasharray={i === 2 ? undefined : '18 12'} strokeLinecap="round" />
        </g>
      ) : null)}
      {MOVE.slice(0, 3).map((m, i) => {
        const on = interpolate(reveal, [i / 3 - 0.08, i / 3], [0, 1], clamp);
        return (
          <g key={m.name} opacity={on} transform={`translate(${m.x} ${m.y}) scale(${0.6 + 0.4 * on})`}>
            <circle r="30" fill="#0c3a8f" stroke={C.gold} strokeWidth="6" />
            <text x={i === 0 ? 0 : 46} y={i === 0 ? 76 : 16} textAnchor={i === 0 ? 'middle' : 'start'} fontFamily={DISPLAY} fontSize="46" fill="#fff" letterSpacing="2">{m.name}</text>
          </g>
        );
      })}
      {reveal >= 1 ? <circle cx={450} cy={14} r={20 + ((frame % 20) / 20) * 50} fill="none" stroke={C.gold} strokeWidth="5" opacity={1 - (frame % 20) / 20} /> : null}
    </svg>
  );
};

export const FMove: React.FC<SceneProps> = ({ frames, cues }) => {
  const frame = useCurrentFrame();
  const passesAt = cueAt(cues, 'passes', Math.round(frames * 0.4));
  const playersAt = cueAt(cues, 'players', Math.round(frames * 0.75));
  const passes = Math.round(count(frame, 2, passesAt + 4, 15));
  const lit = Math.round(count(frame, 2, playersAt + 2, 9));
  const reveal = interpolate(frame, [Math.round(frames * 0.45), frames - 8], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkBg glow="#123a24" />
      <Kicker text="The opener · 8'" y={220} />
      <Center y={680}><Pitch reveal={reveal} /></Center>
      <div style={{ position: 'absolute', top: 1080, left: 90, right: 90, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
          <Gold size={190}>{passes}</Gold>
          <div style={{ fontFamily: DISPLAY, fontSize: 70, color: '#fff', letterSpacing: 4 }}>PASSES</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 56px)', gap: 12 }}>
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} style={{ width: 56, height: 56, borderRadius: '50%', border: `5px solid ${C.gold}`, background: i < lit ? C.gold : 'transparent', boxSizing: 'border-box' }} />
            ))}
          </div>
          <div style={{ fontFamily: DISPLAY, fontSize: 48, color: '#fff', letterSpacing: 3, marginTop: 10 }}>{lit} PLAYERS</div>
        </div>
      </div>
      <Sfx at={frames - 12} src="crowd.wav" volume={0.18} />
    </AbsoluteFill>
  );
};

// ---------- 7. four by half-time, two after ----------

type Goal = { min: string; name: string; score: string; away?: boolean };
const FIRST: Goal[] = [
  { min: "8'", name: 'RAPHINHA', score: '1–0' },
  { min: "23'", name: 'FERMÍN', score: '2–0' },
  { min: "41'", name: 'RAPHINHA', score: '3–0' },
  { min: "45+'", name: 'LAMINE YAMAL', score: '4–0' },
];
const SECOND: Goal[] = [
  { min: "65'", name: 'LAMINE YAMAL', score: '5–0' },
  { min: "81'", name: 'GORDON', score: '6–0' },
  { min: "84'", name: 'MARIANO · ALAVÉS', score: '6–1', away: true },
];

const GoalRow: React.FC<{ g: Goal; y: number; at: number }> = ({ g, y, at }) => {
  const frame = useCurrentFrame();
  const s = pop(frame, at, 14);
  const col = g.away ? 'rgba(255,255,255,0.5)' : '#fff';
  return (
    <div style={{ position: 'absolute', top: y, left: 90, right: 90, height: 100, display: 'flex', alignItems: 'center', gap: 26, opacity: s, transform: `translateX(${(1 - s) * 140}px)` }}>
      <div style={{
        width: 150, height: 86, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        background: g.away ? 'rgba(255,255,255,0.12)' : C.gold, fontFamily: DISPLAY, fontSize: 58, color: g.away ? col : C.ink,
      }}>{g.min}</div>
      <Ball size={g.away ? 52 : 64} dim={g.away} />
      <div style={{ flex: 1, fontFamily: DISPLAY, fontSize: g.away ? 50 : 66, letterSpacing: 2, color: col, whiteSpace: 'nowrap' }}>{g.name}</div>
      <div style={{ fontFamily: DISPLAY, fontSize: 52, color: g.away ? col : 'rgba(255,255,255,0.7)' }}>{g.score}</div>
    </div>
  );
};

export const FGoals: React.FC<SceneProps> = ({ frames, cues }) => {
  const frame = useCurrentFrame();
  const four = cueAt(cues, 'Four', 2);
  const ht = cueAt(cues, 'half-time', Math.round(frames * 0.35));
  const two = cueAt(cues, 'Two', Math.round(frames * 0.55));
  const brk = cueAt(cues, 'break', Math.round(frames * 0.85));
  const firstAt = FIRST.map((_, i) => Math.round(interpolate(i, [0, 3], [four - 3, ht - 2])));
  const secondAt = [two - 3, two + Math.max(5, Math.round((brk - two) * 0.5)), brk + 4];
  const line = interpolate(frame, [ht, ht + 12], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkBg glow="#1c2c58" />
      <Kicker text="Barça 6–1 Alavés" y={220} />
      {FIRST.map((g, i) => <GoalRow key={i} g={g} y={330 + i * 112} at={firstAt[i]} />)}
      <div style={{ position: 'absolute', top: 790, left: 90, right: 90, display: 'flex', alignItems: 'center', gap: 20, opacity: line }}>
        <div style={{ flex: 1, height: 4, background: C.gold, transform: `scaleX(${line})`, transformOrigin: 'left' }} />
        <div style={{ fontFamily: DISPLAY, fontSize: 46, letterSpacing: 6, color: C.gold }}>HALF-TIME</div>
        <div style={{ flex: 1, height: 4, background: C.gold, transform: `scaleX(${line})`, transformOrigin: 'right' }} />
      </div>
      {SECOND.map((g, i) => <GoalRow key={i} g={g} y={880 + i * 112} at={secondAt[i]} />)}
      {[...firstAt, secondAt[0], secondAt[1]].map((a, i) => <Sfx key={i} at={a} src="pop.wav" volume={0.22} />)}
    </AbsoluteFill>
  );
};

// ---------- 8. Raphinha: 15 league goals in 11 games ----------

export const FRaphinha: React.FC<SceneProps> = ({ frames, cues }) => {
  const frame = useCurrentFrame();
  const twice = cueAt(cues, 'twice', 12);
  const fifteen = cueAt(cues, 'fifteen', Math.round(frames * 0.25));
  const eleven = cueAt(cues, 'eleven', Math.round(frames * 0.45));
  const cesar = cueAt(cues, 'César', Math.round(frames * 0.7));
  const messi = cueAt(cues, 'Messi', Math.round(frames * 0.85));
  const goals = Math.round(count(frame, fifteen - 12, fifteen + 8, 15));
  const games = Math.round(count(frame, eleven - 4, eleven + 14, 11));
  const big = pop(frame, fifteen - 12, 12);
  return (
    <AbsoluteFill>
      <DarkBg glow="#1c2c58" />
      <Center y={300}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 116, color: '#fff', letterSpacing: 6 }}>RAPHINHA</div>
          {[0, 1].map((i) => <div key={i} style={{ transform: `scale(${pop(frame, twice - 4 + i * 6)})` }}><Ball size={84} /></div>)}
        </div>
      </Center>
      <Center y={620}>
        <div style={{ textAlign: 'center', opacity: big, transform: `scale(${0.7 + 0.3 * big})` }}>
          <Gold size={330}>{goals}</Gold>
          <div style={{ fontFamily: DISPLAY, fontSize: 72, color: '#fff', letterSpacing: 8, marginTop: -6 }}>LEAGUE GOALS</div>
        </div>
      </Center>
      <div style={{ position: 'absolute', top: 905, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 12 }}>
        {Array.from({ length: 11 }, (_, i) => (
          <div key={i} style={{ width: 64, height: 64, borderRadius: 12, border: `4px solid ${C.gold}`, background: i < games ? 'rgba(242,194,48,0.9)' : 'transparent', boxSizing: 'border-box' }} />
        ))}
      </div>
      <Center y={1030}>
        <div style={{ fontFamily: DISPLAY, fontSize: 60, color: games > 0 ? C.gold : 'transparent', letterSpacing: 6 }}>IN {games || 11} GAMES</div>
      </Center>
      <div style={{ position: 'absolute', top: 1130, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 22 }}>
        <Pill s={pop(frame, cesar - 3)} size={48}>= CÉSAR RODRÍGUEZ</Pill>
        <Pill s={pop(frame, messi - 3)} size={48}>= MESSI</Pill>
      </div>
      <Sfx at={fifteen + 8} src="impact.wav" volume={0.2} />
    </AbsoluteFill>
  );
};

// ---------- 9. Lamine Yamal's double, Fermín's goal and two assists ----------

const Assist: React.FC<{ size: number }> = ({ size }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%', background: '#0c3a8f', border: `5px solid ${C.gold}`, boxSizing: 'border-box',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: size * 0.5, color: C.gold,
  }}>A</div>
);

const PlayerCard: React.FC<{ y: number; at: number; name: string; stripe: string; note: string; items: { kind: 'goal' | 'assist'; at: number }[] }> = ({ y, at, name, stripe, note, items }) => {
  const frame = useCurrentFrame();
  const s = pop(frame, at, 15);
  return (
    <div style={{
      position: 'absolute', top: y, left: 80, right: 80, height: 400, borderRadius: 34, overflow: 'hidden', background: 'rgba(8,12,28,0.8)',
      border: '4px solid rgba(255,255,255,0.18)', boxShadow: '0 30px 70px rgba(0,0,0,0.55)', opacity: s, transform: `translateY(${(1 - s) * 80}px)`,
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 26, background: stripe }} />
      <div style={{ position: 'absolute', left: 70, top: 46, fontFamily: DISPLAY, fontSize: 104, color: '#fff', letterSpacing: 4, lineHeight: 1 }}>{name}</div>
      <div style={{ position: 'absolute', left: 70, top: 190, display: 'flex', gap: 26, alignItems: 'center' }}>
        {items.map((it, i) => {
          const p = pop(frame, it.at, 10);
          return <div key={i} style={{ transform: `scale(${p})` }}>{it.kind === 'goal' ? <Ball size={120} /> : <Assist size={120} />}</div>;
        })}
      </div>
      <div style={{ position: 'absolute', left: 70, bottom: 34, fontFamily: BODY, fontWeight: 800, fontSize: 36, letterSpacing: 3, color: 'rgba(255,255,255,0.72)' }}>{note}</div>
    </div>
  );
};

export const FDuo: React.FC<SceneProps> = ({ frames, cues }) => {
  const lamine = cueAt(cues, 'Lamine', 2);
  const twice = cueAt(cues, 'twice', Math.round(frames * 0.25));
  const fermin = cueAt(cues, 'Fermín', Math.round(frames * 0.5));
  const goal = cueAt(cues, 'goal', Math.round(frames * 0.7));
  const assists = cueAt(cues, 'assists', Math.round(frames * 0.85));
  return (
    <AbsoluteFill>
      <BlaugranaBg />
      <PlayerCard y={250} at={lamine - 3} name="LAMINE YAMAL" stripe="#0c3a8f" note="45+' · 65' (VAR CONFIRMED)"
        items={[{ kind: 'goal', at: twice - 4 }, { kind: 'goal', at: twice + 3 }]} />
      <PlayerCard y={730} at={fermin - 3} name="FERMÍN LÓPEZ" stripe={C.garnet} note="23' · TWO ASSISTS FOR RAPHINHA"
        items={[{ kind: 'goal', at: goal - 3 }, { kind: 'assist', at: assists - 8 }, { kind: 'assist', at: assists - 2 }]} />
      <Sfx at={twice - 4} src="pop.wav" volume={0.22} />
      <Sfx at={goal - 3} src="pop.wav" volume={0.22} />
      <Sfx at={assists - 5} src="pop.wav" volume={0.22} />
    </AbsoluteFill>
  );
};

// ---------- 10. outro: where does Flick rank? ----------

export const FOutro: React.FC<SceneProps> = ({ frames, cues }) => {
  const frame = useCurrentFrame();
  const drift = useDrift(frames, 1.05);
  const tell = cueAt(cues, 'Tell', Math.round(frames * 0.5));
  const crest = pop(frame, 0, 14);
  const glow = 0.5 + 0.5 * Math.sin(frame / 12);
  const stats = ['100 WINS', '131 GAMES', '76.33%'];
  return (
    <AbsoluteFill>
      <BlaugranaBg />
      <Center y={480}>
        <div style={{ transform: `scale(${(0.7 + 0.3 * crest) * drift})`, opacity: crest, filter: `drop-shadow(0 0 ${30 + glow * 30}px rgba(242,194,48,0.45))` }}>
          <BarcaCrest width={330} id="fo" />
        </div>
      </Center>
      <div style={{ position: 'absolute', top: 760, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 18 }}>
        {stats.map((t, i) => <Pill key={t} s={pop(frame, 6 + i * 5)} size={52} gold={i === 2}>{t}</Pill>)}
      </div>
      <Center y={1000}>
        <div style={{ textAlign: 'center', opacity: pop(frame, 4), transform: `scale(${0.85 + 0.15 * pop(frame, 4)})` }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 100, color: '#fff', letterSpacing: 4, lineHeight: 1.04 }}>WHERE DOES FLICK</div>
          <div style={{ fontFamily: DISPLAY, fontSize: 100, color: C.gold, letterSpacing: 4, lineHeight: 1.04 }}>RANK FOR YOU?</div>
        </div>
      </Center>
      <Center y={1230}>
        <div style={{ fontFamily: BODY, fontWeight: 900, fontSize: 46, letterSpacing: 6, color: '#fff', opacity: pop(frame, tell - 3), transform: `translateY(${Math.sin(frame / 6) * 6}px)` }}>COMMENT BELOW ↓</div>
      </Center>
    </AbsoluteFill>
  );
};

export const FLICK_VISUALS: Record<string, React.FC<SceneProps>> = {
  'f-hook': FHook,
  'f-race': FRace,
  'f-rate': FRate,
  'f-slump': FSlump,
  'f-score': FScore,
  'f-move': FMove,
  'f-goals': FGoals,
  'f-raphinha': FRaphinha,
  'f-duo': FDuo,
  'f-outro': FOutro,
};
