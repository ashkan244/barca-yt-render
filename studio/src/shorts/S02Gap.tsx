// S02 — X-RAY TACTICS: the false-nine gap of the 2–6 (2 May 2009), on a neon half-pitch.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, DISPLAY, BODY} from '../lib';
import {ShortShell, ShortData, Ctx, Slam, Score, Center, Flash, ramp, fade, pop, wordAt} from './kit';

const CY = '#36e2ff';
const PX = 90, PY = 300, PW = 900, PH = 840; // pitch box on screen

type P = [number, number];
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

const Pitch: React.FC = () => (
  <svg width={PW} height={PH} style={{position: 'absolute', left: PX, top: PY}}>
    <defs><filter id="glow"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
    <g stroke={CY} strokeWidth={4} fill="none" opacity={0.75} filter="url(#glow)">
      <rect x={10} y={10} width={PW - 20} height={PH - 20} rx={8} />
      <rect x={PW / 2 - 200} y={10} width={400} height={150} />
      <rect x={PW / 2 - 90} y={10} width={180} height={55} />
      <line x1={10} y1={PH - 10} x2={PW - 10} y2={PH - 10} />
      <path d={`M ${PW / 2 - 110} ${PH - 10} A 110 110 0 0 1 ${PW / 2 + 110} ${PH - 10}`} />
    </g>
  </svg>
);

const Tok: React.FC<{p: P; n: string; team: 'b' | 'm'; glow?: boolean; s?: number}> = ({p, n, team, glow, s = 1}) => (
  <div style={{position: 'absolute', left: PX + p[0] - 38, top: PY + p[1] - 38, width: 76, height: 76, borderRadius: 76, transform: `scale(${s})`,
    background: team === 'b' ? (glow ? C.gold : `linear-gradient(135deg, ${C.blau} 50%, ${C.grana} 50%)`) : '#f4f4f4',
    border: `4px solid ${team === 'b' ? '#fff' : '#9aa3b5'}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: DISPLAY, fontSize: 36, color: team === 'b' ? (glow ? '#000' : '#fff') : '#111',
    boxShadow: glow ? `0 0 50px ${C.gold}, 0 0 100px ${C.gold}88` : '0 8px 20px #0008'}}>{n}</div>
);

const Arrow: React.FC<{a: P; b: P; t: number; color: string}> = ({a, b, t, color}) => {
  const e = lerp(a, b, t);
  return (
    <svg width={PW} height={PH} style={{position: 'absolute', left: PX, top: PY, overflow: 'visible'}}>
      <line x1={a[0]} y1={a[1]} x2={e[0]} y2={e[1]} stroke={color} strokeWidth={9} strokeDasharray="18 12" strokeLinecap="round" />
      {t > 0.95 && <circle cx={b[0]} cy={b[1]} r={14} fill={color} />}
    </svg>
  );
};

export const S02Gap: React.FC<{d: ShortData}> = ({d}) => {
  const L = d.lines;
  return (
    <ShortShell d={d} accent={CY} tag="TACTICS X-RAY · 2 MAY 2009"
      bg={<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #06263a 0%, #020a14 60%, #000 100%)'}} />}
      shake={[wordAt(d, 6, 7)]}
      sfx={[{at: L[0].from, src: 'impact', vol: 0.6}, {at: L[1].from, src: 'whoosh'}, {at: L[2].from + 10, src: 'riser', vol: 0.35}, {at: L[2].from + 40, src: 'pop', vol: 0.6},
        {at: L[4].from, src: 'whoosh'}, {at: L[5].from, src: 'whoosh'}, ...[4, 5, 6, 7].map((k) => ({at: wordAt(d, 6, k), src: 'hit' as const, vol: 0.45})), {at: L[7].from, src: 'impact', vol: 0.6}]}
      render={(c: Ctx) => {
        const {f, i} = c;
        if (i === 0) return (
          <>
            <Center y={430}><Slam f={f} at={c.at(0) + 2}><div style={{fontFamily: DISPLAY, fontSize: 190, color: '#fff', textShadow: `0 0 40px ${CY}`}}>ONE MOVE</div></Slam></Center>
            <Center y={720}><Slam f={f} at={c.word(0, 5)}><Score home="MADRID" away="BARÇA" hs={2} as={6} hot="a" label="SANTIAGO BERNABÉU · LA LIGA" accent={CY} /></Slam></Center>
          </>
        );
        // pitch phase (lines 1–5)
        if (i <= 5) {
          const midT = ramp(f, c.word(1, 5), c.word(1, 5) + 30, 0, 1);
          const mids: P[] = [180, 360, 540, 720].map((x) => [x, 380 + midT * 190] as P);
          const cbStep = i === 4 ? ramp(f, c.at(4) + 4, c.at(4) + 24, 0, 1) : 0;
          const defs: P[] = [[150, 190], [340, 170 + cbStep * 0], [560, 170], [750, 190]];
          defs[1] = lerp([340, 170], [430, 330], cbStep);
          const messiT = i >= 2 ? ramp(f, c.word(2, 6), c.word(2, 6) + 24, 0, 1) : 0;
          const messi = lerp([780, 600], [450, 360], messiT);
          const eto = lerp([450, 250], [770, 260], messiT);
          const gapOn = i >= 2 ? fade(f, c.at(2), c.at(2) + 10) : 0;
          return (
            <>
              <Pitch />
              {/* the gap */}
              <div style={{position: 'absolute', left: PX + 20, width: PW - 40, top: PY + 225, height: mids[0][1] - 225 - 40, opacity: gapOn * (0.55 + 0.25 * Math.sin(f / 6)),
                background: `repeating-linear-gradient(90deg, ${CY}22 0 20px, ${CY}44 20px 40px)`, border: `3px dashed ${CY}`, borderRadius: 18}} />
              {gapOn > 0 && <div style={{position: 'absolute', left: PX + 330, top: PY + 440, fontFamily: DISPLAY, fontSize: 52, color: CY, opacity: gapOn}}>THE GAP</div>}
              {i === 1 && <div style={{position: 'absolute', right: PX + 20, top: PY + mids[0][1] + 50, fontFamily: BODY, fontWeight: 900, fontSize: 30, color: '#fff', letterSpacing: 2, opacity: midT}}>MIDFIELD PUSHES UP ↓</div>}
              {i === 1 && <div style={{position: 'absolute', right: PX + 20, top: PY + 90, fontFamily: BODY, fontWeight: 900, fontSize: 30, color: '#fff', letterSpacing: 2, opacity: fade(f, c.word(1, 9), c.word(1, 9) + 8)}}>DEFENDERS STAY DEEP ↑</div>}
              {defs.map((p, k) => <Tok key={'d' + k} p={p} n="" team="m" />)}
              {mids.map((p, k) => <Tok key={'m' + k} p={p} n="" team="m" />)}
              <Tok p={[450, 50]} n="" team="m" s={0.85} />
              <Tok p={[170, 300]} n="14" team="b" />
              <Tok p={eto} n="9" team="b" />
              <Tok p={messi} n="10" team="b" glow={i >= 2} s={i >= 2 ? 1 + 0.1 * pop(f, c.word(2, 6) + 24) : 1} />
              {i === 4 && <><Arrow a={[170, 300]} b={[330, 70]} t={ramp(f, c.word(4, 3), c.word(4, 3) + 18, 0, 1)} color={CY} /><Arrow a={eto} b={[560, 60]} t={ramp(f, c.word(4, 5), c.word(4, 5) + 18, 0, 1)} color={CY} /></>}
              {i === 5 && <Arrow a={messi} b={[450, 140]} t={ramp(f, c.word(5, 3), c.word(5, 3) + 18, 0, 1)} color={C.gold} />}
              {(i === 4 || i === 5) && (
                <div style={{position: 'absolute', left: PX + 20, top: PY + PH - 150}}>
                  <Slam f={f} at={c.at(i)}><div style={{fontFamily: DISPLAY, fontSize: 92, color: '#fff', background: '#e0244dcc', padding: '0 28px', borderRadius: 12}}>{i === 4 ? 'FOLLOW ✗' : 'STAY ✗'}</div></Slam>
                </div>
              )}
              {i === 3 && <Center y={PY + PH - 170}><Slam f={f} at={c.word(3, 5)}><div style={{fontFamily: DISPLAY, fontSize: 96, color: '#fff'}}>FOLLOW <span style={{color: CY}}>or</span> STAY?</div></Slam></Center>}
            </>
          );
        }
        if (i === 6) {
          const ticks = ['1–1', '3–1', '5–2', '6–2'];
          const idx = f >= c.word(6, 7) ? 3 : f >= c.word(6, 6) ? 2 : f >= c.word(6, 5) ? 1 : 0;
          return (
            <>
              <Center y={380}><Slam f={f} at={c.at(6)}><div style={{fontFamily: DISPLAY, fontSize: 120, color: '#fff'}}>NO GOOD ANSWER</div></Slam></Center>
              <Center y={600}><div style={{transform: `scale(${0.9 + 0.1 * pop(f, c.word(6, 4 + idx))})`}}><Score home="BARÇA" away="MADRID" hs={ticks[idx].split('–')[0]} as={ticks[idx].split('–')[1]} hot="h" label="BARÇA GOALS" accent={CY} /></div></Center>
              <Center y={900}><div style={{display: 'flex', gap: 18}}>{ticks.map((t, n) => (
                <div key={n} style={{fontFamily: DISPLAY, fontSize: 62, padding: '6px 22px', borderRadius: 14, color: n <= idx && f >= c.word(6, 4) ? '#00131a' : '#ffffff55',
                  background: n <= idx && f >= c.word(6, 4) ? CY : '#ffffff10', transform: `scale(${n === idx ? 1.12 : 1})`}}>{t}</div>))}</div></Center>
            </>
          );
        }
        return (
          <>
            <Center y={360}><Slam f={f} at={c.word(7, 4)}><div style={{fontFamily: DISPLAY, fontSize: 260, color: '#fff', lineHeight: 0.9, textAlign: 'center', textShadow: `0 0 60px ${CY}`}}>FALSE<br /><span style={{color: C.gold}}>9</span></div></Slam></Center>
            <div style={{position: 'absolute', left: 0, right: 0, top: 300 + ((f * 14) % 820), height: 6, background: CY, boxShadow: `0 0 40px ${CY}`, opacity: 0.6}} />
          </>
        );
      }}
      overlay={(c) => <Flash f={c.f} at={[c.at(0) + 2, c.word(7, 4)]} color={CY} />}
    />
  );
};
