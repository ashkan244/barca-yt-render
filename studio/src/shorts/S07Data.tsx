// S07 — DATA MOTION: goals for vs goals against, all 12 games of 2026–27 to 20 Oct (La Liga + UCL).
// Source: 2026–27 FC Barcelona season results (Wikipedia, as of 21 Oct 2026). Charts draw, morph and annotate themselves.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, DISPLAY, BODY} from '../lib';
import {ShortShell, ShortData, Ctx, Slam, Center, Flash, Counter, ramp, fade, pop, wordAt} from './kit';

const GF = [5, 2, 5, 5, 5, 4, 7, 3, 3, 4, 5, 2];
const GA = [0, 0, 2, 0, 1, 2, 2, 1, 0, 1, 2, 4];
const OPP = ['ELC', 'ATH', 'RAY', 'VAL', 'FEY', 'LEV', 'RAC', 'SEV', 'GET', 'GAL', 'BET', 'PSG'];
const GOLD = '#ffc83d', RED = '#ff3b5c', INK = '#0a0e1a';
const X0 = 120, X1 = 990, Y0 = 1060, Y1 = 420; // chart box (screen px); y grows down
const x = (k: number) => X0 + (k / 11) * (X1 - X0);
const y = (v: number) => Y0 - (v / 8) * (Y0 - Y1);
const path = (arr: number[]) => arr.map((v, k) => `${k ? 'L' : 'M'} ${x(k)} ${y(v)}`).join(' ');

const Grid: React.FC<{o: number}> = ({o}) => (
  <g opacity={o}>
    {[0, 2, 4, 6, 8].map((v) => <g key={v}><line x1={X0} x2={X1} y1={y(v)} y2={y(v)} stroke="#ffffff18" strokeWidth={2} /><text x={X0 - 24} y={y(v) + 12} textAnchor="end" fontFamily={DISPLAY} fontSize={36} fill="#ffffff66">{v}</text></g>)}
    {OPP.map((o2, k) => <text key={o2} x={x(k)} y={Y0 + 50} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={22} fill="#ffffff88">{o2}</text>)}
  </g>
);

const Line: React.FC<{arr: number[]; t: number; col: string; w?: number; glow?: number; area?: boolean; dim?: number}> = ({arr, t, col, w = 9, glow = 0, area, dim = 1}) => (
  <g opacity={dim}>
    {area && <path d={`${path(arr)} L ${x(11)} ${Y0} L ${x(0)} ${Y0} Z`} fill={col} opacity={0.16 * t} />}
    <path d={path(arr)} fill="none" stroke={col} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t}
      style={{filter: glow ? `drop-shadow(0 0 ${glow}px ${col})` : undefined}} />
  </g>
);

const Dot: React.FC<{k: number; v: number; s: number; col: string; r?: number; ring?: number}> = ({k, v, s, col, r = 13, ring = 0}) => (
  <g transform={`translate(${x(k)} ${y(v)})`}>
    {ring > 0 && <circle r={r + ring * 40} fill="none" stroke={col} strokeWidth={4} opacity={1 - ring} />}
    <circle r={r * s} fill={col} stroke={INK} strokeWidth={4} />
  </g>
);

const Bg: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #0b1124 0%, #060812 100%)'}}>
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(#ffffff14 2px, transparent 2px)', backgroundSize: '44px 44px', backgroundPosition: `${f % 44}px ${(f * 0.5) % 44}px`}} />
    </AbsoluteFill>
  );
};

export const S07Data: React.FC<{d: ShortData}> = ({d}) => {
  const L = d.lines;
  return (
    <ShortShell d={d} accent={GOLD} tag="DATA · 12 GAMES · 2026–27"
      bg={<Bg />}
      shake={[wordAt(d, 4, 3)]}
      sfx={[{at: L[0].from, src: 'riser', vol: 0.3}, {at: wordAt(d, 0, 0), src: 'hit', vol: 0.5}, {at: wordAt(d, 1, 0), src: 'pop', vol: 0.6}, ...[0, 2, 3, 4, 10].map((k, n) => ({at: wordAt(d, 1, 5) + n * 4, src: 'tick' as const, vol: 0.6})),
        {at: L[2].from, src: 'whoosh'}, {at: wordAt(d, 3, 5), src: 'whoosh'}, {at: wordAt(d, 4, 3), src: 'impact', vol: 0.8}, {at: L[5].from, src: 'whoosh'}, {at: L[6].from, src: 'hit', vol: 0.5}, {at: L[7].from, src: 'impact', vol: 0.6}]}
      render={(c: Ctx) => {
        const {f, i} = c;
        const gfT = i === 0 ? ramp(f, c.word(0, 0), c.end(0), 0, 1, (t) => t) : 1;
        const gaT = i < 2 ? 0 : i === 2 ? ramp(f, c.word(2, 5), c.end(2) + 6, 0, 1, (t) => t) : 1;
        const morph = i === 5 ? ramp(f, c.at(5), c.at(5) + 16, 0, 1) : i === 6 ? 1 - ramp(f, c.at(6), c.at(6) + 12, 0, 1) : 0;
        const gfDim = i >= 2 && i !== 5 ? 0.25 : 1;
        const head = (txt: React.ReactNode) => <Center y={250}>{txt}</Center>;
        return (
          <>
            {i <= 1 && head(<div style={{display: 'flex', alignItems: 'baseline', gap: 18}}><Counter f={f} a={c.word(0, 0)} b={c.end(0)} to={50} style={{fontFamily: DISPLAY, fontSize: 170, color: GOLD, lineHeight: 1}} /><span style={{fontFamily: DISPLAY, fontSize: 70, color: '#fff'}}>GOALS · 12 GAMES</span></div>)}
            {(i >= 2 && i <= 4) && head(<div style={{display: 'flex', alignItems: 'baseline', gap: 18}}><span style={{fontFamily: DISPLAY, fontSize: 120, color: RED, lineHeight: 1.2}}>GOALS AGAINST</span></div>)}
            <svg width={1080} height={1200} style={{position: 'absolute', left: 0, top: 0, opacity: 1 - morph}}>
              <Grid o={fade(f, c.at(0), c.at(0) + 10)} />
              <Line arr={GF} t={gfT} col={GOLD} area glow={i <= 1 ? 14 : 0} dim={gfDim} />
              {GF.map((v, k) => f >= c.word(0, 0) + k * ((c.end(0) - c.word(0, 0)) / 12) && <Dot key={'f' + k} k={k} v={v} s={1} col={GOLD} r={i >= 2 ? 0 : 12} />)}
              {i === 1 && <>
                <Dot k={6} v={7} s={1 + 0.4 * pop(f, c.word(1, 0))} col={GOLD} r={20} ring={ramp(f, c.word(1, 0), c.word(1, 0) + 20, 0, 1)} />
                {[0, 2, 3, 4, 10].map((k, n) => { const t0 = c.word(1, 5) + n * 4; return f >= t0 && <Dot key={'5' + k} k={k} v={5} s={1 + 0.3 * pop(f, t0)} col="#fff" r={16} ring={ramp(f, t0, t0 + 18, 0, 1)} />; })}
                <path d={`M ${x(6) + 26} ${y(7) + 10} L ${x(7) + 30} ${y(7) + 70}`} fill="none" stroke="#fff" strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ramp(f, c.word(1, 1), c.word(1, 1) + 10, 0, 1)} />
              </>}
              {i >= 2 && <Line arr={GA} t={gaT} col={RED} w={11} glow={i === 7 ? 30 + 12 * Math.sin(f / 4) : 12} />}
              {i >= 2 && GA.map((v, k) => (gaT * 11 >= k) && <Dot key={'a' + k} k={k} v={v} s={1} col={v === 0 ? '#7dffb0' : RED} r={13} />)}
              {i === 3 && <>
                <rect x={x(0) - 30} y={y(0) - 40} width={x(1) - x(0) + 60} height={80} rx={20} fill="none" stroke="#7dffb0" strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ramp(f, c.at(3), c.at(3) + 12, 0, 1)} />
                <path d={`M ${x(2) - 20} ${y(5)} L ${x(2) - 20} ${y(5.5)} L ${x(11) + 20} ${y(5.5)} L ${x(11) + 20} ${y(5)}`} fill="none" stroke={RED} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ramp(f, c.word(3, 5), c.word(3, 5) + 14, 0, 1)} />
              </>}
              {i === 4 && <Dot k={11} v={4} s={1 + 0.8 * pop(f, c.word(4, 3))} col={RED} r={22} ring={ramp(f, c.word(4, 3), c.word(4, 3) + 20, 0, 1)} />}
            </svg>
            {i === 0 && <Center y={1160} style={{opacity: fade(f, c.word(0, 5), c.word(0, 5) + 8)}}><div style={{fontFamily: BODY, fontWeight: 900, fontSize: 34, color: '#ffffffaa', letterSpacing: 4}}>GOALS SCORED · LA LIGA + UCL</div></Center>}
            {i === 1 && <><div style={{position: 'absolute', left: x(7) + 30, top: y(7) + 60}}><Slam f={f} at={c.word(1, 1)}><div style={{fontFamily: DISPLAY, fontSize: 70, color: '#fff'}}>7 v RACING</div></Slam></div>
              <Center y={1110}><Slam f={f} at={c.word(1, 8)}><div style={{fontFamily: DISPLAY, fontSize: 90, color: INK, background: '#fff', padding: '0 26px', borderRadius: 12}}>5 GOALS × 5 GAMES</div></Slam></Center></>}
            {i === 3 && <>
              <div style={{position: 'absolute', left: x(0) - 20, top: y(0) + 70}}><Slam f={f} at={c.at(3) + 4}><div style={{fontFamily: DISPLAY, fontSize: 52, color: '#7dffb0'}}>CLEAN SHEETS</div></Slam></div>
              <div style={{position: 'absolute', left: x(5), top: y(5.5) - 130}}><Slam f={f} at={c.word(3, 11)}><div style={{fontFamily: DISPLAY, fontSize: 110, color: '#fff', background: RED, padding: '0 28px', borderRadius: 14}}>8 OF 10</div></Slam></div>
            </>}
            {i === 4 && <div style={{position: 'absolute', left: x(11) - 330, top: y(4) - 230}}><Slam f={f} at={c.word(4, 3)}><div style={{fontFamily: DISPLAY, fontSize: 150, color: RED, lineHeight: 1}}>PSG: 4</div></Slam></div>}
            {morph > 0 && (
              <div style={{position: 'absolute', left: 140, right: 140, top: 380, height: 700, display: 'flex', alignItems: 'flex-end', gap: 80, opacity: morph}}>
                {[{v: 50, col: GOLD, l: 'SCORED'}, {v: 15, col: RED, l: 'CONCEDED'}].map((b, k) => (
                  <div key={k} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Counter f={f} a={c.at(5) + 6} b={c.at(5) + 26} to={b.v} style={{fontFamily: DISPLAY, fontSize: 150, color: b.col, lineHeight: 1}} />
                    <div style={{width: '100%', height: (b.v / 50) * 480 * ramp(f, c.at(5) + 4, c.at(5) + 24, 0, 1), background: b.col, borderRadius: '18px 18px 0 0', boxShadow: `0 0 40px ${b.col}66`}} />
                    <div style={{fontFamily: BODY, fontWeight: 900, fontSize: 36, color: '#fff', letterSpacing: 4, marginTop: 14}}>{b.l}</div>
                  </div>
                ))}
              </div>
            )}
            {i === 6 && <Center y={280}><Slam f={f} at={c.word(6, 5)}><div style={{fontFamily: DISPLAY, fontSize: 120, color: '#fff'}}>NOT THE <span style={{color: GOLD, textDecoration: 'line-through', textDecorationColor: RED, textDecorationThickness: 12}}>ATTACK</span></div></Slam></Center>}
            {i === 7 && <Center y={260}><Slam f={f} at={c.word(7, 2)}><div style={{fontFamily: DISPLAY, fontSize: 150, color: RED, textShadow: `0 0 40px ${RED}`}}>THIS LINE ↓</div></Slam></Center>}
          </>
        );
      }}
      overlay={(c) => <Flash f={c.f} at={[wordAt(c.d, 4, 3)]} color={RED} dur={8} />}
    />
  );
};
