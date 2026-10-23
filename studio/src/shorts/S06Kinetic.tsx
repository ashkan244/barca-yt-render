// S06 — KINETIC TYPE: Lamine Yamal, Barça's youngest-ever captain (9 Sep 2026, 19y 58d, v Feyenoord).
// Sources: Reuters via The Star / Khaleej Times (10 Sep 2026); World Soccer Talk (Messi 21y 33d, Bojan at 20).
// Everything moves: letters fly in on seeded vectors, shapes orbit, paths draw themselves.
import React from 'react';
import {AbsoluteFill, useCurrentFrame, random} from 'remotion';
import {C, DISPLAY, BODY} from '../lib';
import {ShortShell, ShortData, Ctx, Slam, Center, Flash, Counter, ramp, fade, pop, wordAt} from './kit';

const GOLD = '#ffcc33';

/** Letters converge from random vectors, staggered; optional scatter-out. */
const Fly: React.FC<{text: string; f: number; at: number; size: number; color?: string; seed?: string; out?: number; gap?: number}> = ({text, f, at, size, color = '#fff', seed = 'k', out, gap = 2}) => (
  <div style={{display: 'flex', justifyContent: 'center', fontFamily: DISPLAY, fontSize: size, color, lineHeight: 1, whiteSpace: 'pre'}}>
    {[...text].map((ch, k) => {
      const t0 = at + k * gap;
      const kin = ramp(f, t0, t0 + 12, 0, 1);
      const ko = out !== undefined ? ramp(f, out + k, out + k + 10, 0, 1) : 0;
      const ang = random(`${seed}${k}`) * Math.PI * 2, dist = 700 + random(`${seed}d${k}`) * 500;
      const vx = Math.cos(ang) * dist * (1 - kin) + Math.cos(ang + 1) * 900 * ko, vy = Math.sin(ang) * dist * (1 - kin) - 900 * ko;
      const rot = (random(`${seed}r${k}`) - 0.5) * 360 * (1 - kin + ko);
      return <span key={k} style={{display: 'inline-block', transform: `translate(${vx}px, ${vy}px) rotate(${rot}deg) scale(${0.4 + 0.6 * kin})`, opacity: Math.min(kin * 1.5, 1 - ko)}}>{ch}</span>;
    })}
  </div>
);

const Shapes: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% ${40 + 6 * Math.sin(f / 50)}%, #2a0f3d 0%, #0d0b2a 55%, #04030c 100%)`}}>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <g transform={`translate(540 760) rotate(${f * 0.6})`} opacity={0.35}>
          <circle r={430} fill="none" stroke={C.grana} strokeWidth={3} strokeDasharray="4 22" />
          <circle r={330} fill="none" stroke={C.blau} strokeWidth={2} strokeDasharray="60 30" transform={`rotate(${-f * 1.4})`} />
        </g>
        {[0, 1, 2, 3, 4, 5].map((k) => {
          const a = f / 60 + k * 1.05, r = 520 + 60 * Math.sin(f / 40 + k);
          const x = 540 + Math.cos(a) * r, y = 760 + Math.sin(a) * r * 0.9;
          return <polygon key={k} points="0,-26 22,13 -22,13" fill="none" stroke={k % 2 ? GOLD : '#ffffff'} strokeWidth={3} opacity={0.35} transform={`translate(${x} ${y}) rotate(${f * 3 + k * 40})`} />;
        })}
        {[0, 1, 2].map((k) => <line key={'l' + k} x1={-200 + ((f * (6 + k * 3) + k * 400) % 1500)} y1={300 + k * 380} x2={-20 + ((f * (6 + k * 3) + k * 400) % 1500)} y2={300 + k * 380} stroke="#ffffff" strokeWidth={3} opacity={0.18} />)}
      </svg>
    </AbsoluteFill>
  );
};

const Armband: React.FC<{f: number; at: number; w?: number}> = ({f, at, w = 520}) => {
  const t = ramp(f, at, at + 22, 0, 1);
  return (
    <svg width={w} height={w * 0.38} viewBox="0 0 520 200">
      <rect x={10} y={30} width={500} height={140} rx={40} fill="none" stroke={GOLD} strokeWidth={14} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
      <rect x={10} y={30} width={500} height={140} rx={40} fill={GOLD} opacity={ramp(f, at + 18, at + 26, 0, 0.95)} />
      <text x={260} y={142} textAnchor="middle" fontFamily={DISPLAY} fontSize={120} fill="#1a0b2b" opacity={fade(f, at + 22, at + 28)}>C</text>
    </svg>
  );
};

const Medal: React.FC<{f: number; at: number; top: string; big: string; col: string}> = ({f, at, top, big, col}) => {
  const k = pop(f, at, 30, 9);
  return (
    <div style={{width: 380, height: 380, borderRadius: 380, border: `10px solid ${col}`, background: '#ffffff08', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      transform: `scale(${k}) rotate(${(1 - k) * -200}deg)`, boxShadow: `0 0 70px ${col}66`}}>
      <div style={{fontSize: 70}}>★</div>
      <div style={{fontFamily: DISPLAY, fontSize: 64, color: '#fff', lineHeight: 1}}>{big}</div>
      <div style={{fontFamily: BODY, fontWeight: 900, fontSize: 30, color: col, letterSpacing: 3}}>{top}</div>
    </div>
  );
};

export const S06Kinetic: React.FC<{d: ShortData}> = ({d}) => {
  const L = d.lines;
  return (
    <ShortShell d={d} accent={GOLD} tag="KINETIC · LAMINE YAMAL"
      bg={<Shapes />}
      shake={[wordAt(d, 0, 0), L[6].from]}
      sfx={[{at: L[0].from, src: 'whoosh'}, {at: wordAt(d, 0, 0) + 10, src: 'impact', vol: 0.6}, {at: wordAt(d, 1, 12), src: 'riser', vol: 0.3}, {at: wordAt(d, 1, 13) + 18, src: 'hit', vol: 0.5},
        {at: wordAt(d, 2, 9), src: 'whoosh'}, {at: wordAt(d, 3, 3), src: 'tick', vol: 0.6}, {at: wordAt(d, 3, 6), src: 'tick', vol: 0.6}, {at: wordAt(d, 4, 4), src: 'whoosh'},
        {at: wordAt(d, 5, 4), src: 'pop', vol: 0.6}, {at: wordAt(d, 5, 8), src: 'pop', vol: 0.6}, {at: L[6].from, src: 'impact', vol: 0.7}, {at: L[7].from, src: 'impact', vol: 0.5}, {at: wordAt(d, 7, 5), src: 'hit', vol: 0.6}]}
      render={(c: Ctx) => {
        const {f, i} = c;
        if (i === 0) return (
          <>
            <Center y={300}><Fly text="19" f={f} at={c.at(0)} size={420} color={GOLD} seed="n" gap={5} /></Center>
            <Center y={700}><Fly text="YEARS" f={f} at={c.word(0, 1)} size={120} seed="y" /></Center>
            <Center y={850}><div style={{display: 'flex', alignItems: 'baseline', gap: 20, transform: `translateX(${(1 - ramp(f, c.word(0, 3), c.word(0, 3) + 12, 0, 1)) * 900}px)`}}>
              <span style={{fontFamily: DISPLAY, fontSize: 180, color: '#fff'}}>+<Counter f={f} a={c.word(0, 3)} b={c.word(0, 4) + 6} to={58} /></span>
              <span style={{fontFamily: DISPLAY, fontSize: 110, color: GOLD}}>DAYS</span>
            </div></Center>
          </>
        );
        if (i === 1) return (
          <>
            <Center y={330}><Fly text="LAMINE" f={f} at={c.word(1, 4)} size={190} seed="a" /></Center>
            <Center y={520}><Fly text="YAMAL" f={f} at={c.word(1, 5)} size={190} color={GOLD} seed="b" /></Center>
            <Center y={770}><Armband f={f} at={c.word(1, 12)} /></Center>
            <Center y={1000} style={{opacity: fade(f, c.word(1, 13), c.word(1, 13) + 8)}}><div style={{fontFamily: BODY, fontWeight: 900, fontSize: 44, color: '#fff', letterSpacing: 8}}>FIRST ARMBAND</div></Center>
          </>
        );
        if (i === 2) {
          const t = ramp(f, c.word(2, 9), c.word(2, 12), 0, 1);
          const px = 230 + t * 620, py = 820 - Math.sin(t * Math.PI) * 260;
          return (
            <>
              <div style={{position: 'absolute', left: 0, top: 320, transform: `translateX(${(1 - ramp(f, c.at(2), c.at(2) + 10, 0, 1)) * -700}px)`}}>
                <div style={{fontFamily: DISPLAY, fontSize: 120, color: '#000', background: GOLD, padding: '0 40px 0 60px'}}>9 SEP 2026</div>
              </div>
              <div style={{position: 'absolute', right: 0, top: 470, transform: `translateX(${(1 - ramp(f, c.word(2, 2), c.word(2, 2) + 10, 0, 1)) * 700}px)`}}>
                <div style={{fontFamily: DISPLAY, fontSize: 90, color: '#fff', background: C.grana, padding: '0 60px 0 40px'}}>v FEYENOORD · UCL</div>
              </div>
              <svg width={1080} height={1200} style={{position: 'absolute', left: 0, top: 0}}>
                <path d="M 230 820 Q 540 300 850 820" fill="none" stroke="#ffffff" strokeWidth={6} strokeDasharray="16 14" opacity={fade(f, c.word(2, 3), c.word(2, 3) + 8) * 0.6} />
              </svg>
              <div style={{position: 'absolute', left: 90, top: 860, width: 280, textAlign: 'center', fontFamily: DISPLAY, fontSize: 70, color: '#ffffffaa', opacity: fade(f, c.word(2, 3), c.word(2, 3) + 6)}}>RAPHINHA<div style={{fontSize: 40, color: '#ff6b6b'}}>OFF ↓</div></div>
              <div style={{position: 'absolute', left: 710, top: 860, width: 280, textAlign: 'center', fontFamily: DISPLAY, fontSize: 70, color: GOLD, opacity: fade(f, c.word(2, 12), c.word(2, 12) + 6)}}>LAMINE<div style={{fontSize: 40, color: '#7dffb0'}}>CAPTAIN ★</div></div>
              <div style={{position: 'absolute', left: px - 110, top: py - 42, opacity: t > 0 ? 1 : 0}}><Armband f={f} at={c.word(2, 3)} w={220} /></div>
            </>
          );
        }
        if (i === 3) {
          const X = (age: number) => 120 + (age - 18.5) * 300; // ruler 18.5 → 21.5
          const marks = [{n: 'YAMAL', a: 19 + 58 / 365, col: GOLD, at: c.at(3)}, {n: 'BOJAN', a: 20, col: '#9fb4ff', at: c.word(3, 3)}, {n: 'MESSI', a: 21 + 33 / 365, col: '#ffffff', at: c.word(3, 6)}];
          return (
            <>
              <Center y={330}><Slam f={f} at={c.at(3)}><div style={{fontFamily: DISPLAY, fontSize: 110, color: '#fff'}}>FIRST ARMBAND · AGE</div></Slam></Center>
              <svg width={1080} height={700} style={{position: 'absolute', left: 0, top: 480}}>
                <line x1={90} y1={360} x2={990} y2={360} stroke="#fff" strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ramp(f, c.at(3), c.at(3) + 14, 0, 1)} />
                {[19, 20, 21].map((a) => <g key={a} opacity={fade(f, c.at(3) + 6, c.at(3) + 14)}><line x1={X(a)} y1={340} x2={X(a)} y2={380} stroke="#fff" strokeWidth={5} /><text x={X(a)} y={440} textAnchor="middle" fontFamily={DISPLAY} fontSize={56} fill="#ffffffaa">{a}</text></g>)}
                {marks.map((m, k) => {
                  const p = pop(f, m.at, 30, 10);
                  const y = 360 - (k === 0 ? 220 : 130) * p;
                  return f >= m.at && (
                    <g key={m.n}>
                      <line x1={X(m.a)} y1={360} x2={X(m.a)} y2={y + 40} stroke={m.col} strokeWidth={5} />
                      <circle cx={X(m.a)} cy={360} r={16} fill={m.col} />
                      <text x={X(m.a)} y={y + 20} textAnchor="middle" fontFamily={DISPLAY} fontSize={k === 0 ? 90 : 64} fill={m.col}>{m.n}</text>
                    </g>
                  );
                })}
              </svg>
            </>
          );
        }
        if (i === 4) {
          const t = ramp(f, c.word(4, 4), c.word(4, 5) + 8, 0, 1);
          return (
            <>
              <Center y={320}><Fly text="SAME NIGHT" f={f} at={c.at(4)} size={130} seed="s" /></Center>
              <svg width={1080} height={700} style={{position: 'absolute', left: 0, top: 460}}>
                <path d="M 120 560 C 360 80, 700 60, 900 300" fill="none" stroke={GOLD} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
                <rect x={820} y={200} width={200} height={160} fill="none" stroke="#fff" strokeWidth={8} opacity={0.8} />
              </svg>
              <div style={{position: 'absolute', left: 60, top: 980, display: 'flex', gap: 20}}>
                <Slam f={f} at={c.word(4, 5)}><div style={{fontFamily: DISPLAY, fontSize: 84, color: '#000', background: GOLD, padding: '0 26px', borderRadius: 12}}>FREE-KICK GOAL</div></Slam>
                <Slam f={f} at={c.word(4, 8)}><div style={{fontFamily: DISPLAY, fontSize: 84, color: '#fff', background: C.blau, padding: '0 26px', borderRadius: 12}}>+ ASSIST</div></Slam>
              </div>
            </>
          );
        }
        if (i === 5 || i === 6) {
          const merge = i === 6 ? ramp(f, c.at(6), c.at(6) + 14, 0, 1) : 0;
          return (
            <>
              <div style={{position: 'absolute', left: 60 + merge * 150, top: 330, transform: `scale(${1 - merge * 0.25})`}}><Medal f={f} at={c.word(5, 4)} top="CHAMPION" big="EURO 2024" col="#ffcc33" /></div>
              <div style={{position: 'absolute', right: 60 + merge * 150, top: 330 + (1 - merge) * 300, transform: `scale(${1 - merge * 0.25})`}}><Medal f={f} at={c.word(5, 8)} top="CHAMPION" big="WORLD CUP" col="#7dffb0" /></div>
              {i === 6 && <Center y={880}><Slam f={f} at={c.word(6, 1)}><div style={{fontFamily: DISPLAY, fontSize: 130, color: '#000', background: GOLD, padding: '0 36px', borderRadius: 16, transform: 'rotate(-3deg)'}}>YOUNGEST EVER</div></Slam></Center>}
            </>
          );
        }
        return (
          <>
            <Center y={300}><Fly text="19" f={f} at={c.at(7)} size={460} color={GOLD} seed="z" gap={4} /></Center>
            <Center y={800}><Fly text="CAPTAIN" f={f} at={c.word(7, 5)} size={150} seed="c" /></Center>
            <Center y={970} style={{opacity: fade(f, c.word(7, 7), c.word(7, 7) + 6)}}><div style={{fontFamily: BODY, fontWeight: 900, fontSize: 44, color: GOLD, letterSpacing: 8}}>FC BARCELONA</div></Center>
          </>
        );
      }}
      overlay={(c) => <Flash f={c.f} at={[c.word(0, 0) + 10, c.at(6)]} color={GOLD} dur={7} />}
    />
  );
};
