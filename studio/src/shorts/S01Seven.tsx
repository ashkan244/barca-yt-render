// S01 — COUNTDOWN: the 6–1 v PSG told by the stadium clock and the aggregate meter.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, DISPLAY, BODY} from '../lib';
import {ShortShell, ShortData, Ctx, Slam, Score, Center, Flash, ramp, pop, fade, Ball, wordAt} from './kit';

const RED = '#ff2d55';
const MIN = [88, 88, 88, 91, 92, 95, 95, 95];
const goalsOf = (d: ShortData) => [wordAt(d, 2, 3) + 18, wordAt(d, 3, 3), d.lines[6].from];
const home = (c: Ctx) => 3 + goalsOf(c.d).filter((t) => c.f >= t).length;

const Bg: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 30%, #13204a 0%, #070b1d 55%, #010208 100%)'}}>
    {[18, 82].map((x) => <div key={x} style={{position: 'absolute', left: `${x}%`, top: -200, width: 900, height: 1400, marginLeft: -450,
      background: 'conic-gradient(from 160deg at 50% 0%, transparent 0deg, #ffffff10 12deg, transparent 24deg)', transform: `rotate(${x < 50 ? -18 : 18}deg)`}} />)}
  </AbsoluteFill>
);

const Clock: React.FC<{c: Ctx}> = ({c}) => {
  const {f, i, lf, d} = c;
  void lf; void MIN;
  const last = d.lines.length - 1, e = c.end(last);
  const run = (a: number, b: number, s0: number, s1: number) => Math.round(ramp(f, a, b, s0, s1, (t) => t));
  let secs = i <= 2 ? run(c.at(0), c.end(2), 88 * 60, 88 * 60 + 59) : i <= 4 ? run(c.at(3), c.end(4), 91 * 60, 92 * 60 + 50) : run(c.at(5), c.end(6), 95 * 60, 95 * 60 + 20);
  if (i === last) secs = f < e - 26 ? 95 * 60 + 20 : Math.round(ramp(f, e - 26, e, 95 * 60 + 20, 88 * 60));
  const mm = Math.floor(secs / 60), ss = secs % 60;
  const hot = i === 5 || i === 6;
  const pulse = hot ? 0.6 + 0.4 * Math.abs(Math.sin(f / 5)) : 1;
  return (
    <Center y={260}>
      <div style={{padding: '6px 40px', borderRadius: 22, background: '#05060c', border: `4px solid ${hot ? RED : '#ffffff30'}`, boxShadow: `0 0 ${hot ? 80 : 30}px ${RED}${hot ? '99' : '44'}`}}>
        <span style={{fontFamily: DISPLAY, fontSize: 170, color: RED, opacity: pulse, letterSpacing: 6, textShadow: `0 0 30px ${RED}`}}>
          {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
        </span>
      </div>
    </Center>
  );
};

const Agg: React.FC<{c: Ctx}> = ({c}) => {
  const {i, f} = c;
  const b = home(c); // Barça aggregate = home goals (first leg 0–4)
  const through = i >= 6;
  const k = fade(f, c.at(0) + 6, c.at(0) + 16);
  return (
    <div style={{position: 'absolute', left: 90, right: 90, top: 730, opacity: k}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: BODY, fontWeight: 900, fontSize: 30, color: '#fff', letterSpacing: 3}}>
        <span>AGGREGATE</span><span style={{color: through ? C.gold : i === 4 ? RED : '#ffffffaa'}}>{through ? 'BARÇA THROUGH' : i === 4 ? 'AWAY GOALS: PSG' : 'PSG GOING THROUGH'}</span>
      </div>
      <div style={{display: 'flex', height: 64, marginTop: 10, borderRadius: 14, overflow: 'hidden', background: '#ffffff12'}}>
        <div style={{width: `${(b / 11) * 100}%`, background: `linear-gradient(90deg, ${C.blau}, ${C.grana})`, transition: 'none', display: 'flex', alignItems: 'center', paddingLeft: 20, fontFamily: DISPLAY, fontSize: 46, color: '#fff'}}>BARÇA {b}</div>
        <div style={{flex: 1}} />
        <div style={{width: `${(5 / 11) * 100}%`, background: '#1b2a5c', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 20, fontFamily: DISPLAY, fontSize: 46, color: '#fff'}}>5 PSG</div>
      </div>
    </div>
  );
};

const Feature: React.FC<{c: Ctx}> = ({c}) => {
  const {i, f} = c;
  const y = 900;
  if (i === 0) return <Center y={y}><Slam f={f} at={c.word(0, 3)}><div style={{fontFamily: DISPLAY, fontSize: 150, color: '#fff'}}>NEED <span style={{color: RED}}>3</span> GOALS</div></Slam></Center>;
  if (i === 1) return (
    <>
      <Center y={y}><Slam f={f} at={c.word(1, 2)}><div style={{fontFamily: DISPLAY, fontSize: 110, color: '#fff', border: `8px solid ${RED}`, padding: '0 34px', transform: 'rotate(-4deg)', borderRadius: 12}}>PARIS · 4–0</div></Slam></Center>
      <Center y={y + 190} style={{opacity: fade(f, c.word(1, 7), c.word(1, 7) + 8)}}>
        <div style={{fontFamily: BODY, fontWeight: 900, fontSize: 40, color: '#ffffffcc', letterSpacing: 2}}>COMEBACKS FROM 4–0 DOWN: <span style={{color: RED, fontFamily: DISPLAY, fontSize: 64}}>0</span></div>
      </Center>
    </>
  );
  if (i === 2) {
    // free-kick curling into the top corner
    const s = c.word(2, 3), t = ramp(f, s, s + 18, 0, 1);
    const x = 140 + t * 640, yy = 300 - Math.sin(t * Math.PI) * 120 - t * 120;
    return (
      <div style={{position: 'absolute', left: 90, top: y, width: 900, height: 360}}>
        <svg width={900} height={360} style={{position: 'absolute'}}>
          <rect x={500} y={70} width={360} height={200} fill="none" stroke="#fff" strokeWidth={10} />
          <path d={`M140 300 Q 470 ${-40} 840 80`} fill="none" stroke={C.gold} strokeWidth={6} strokeDasharray="14 12" opacity={t > 0 ? 0.8 : 0} pathLength={1} />
        </svg>
        <div style={{position: 'absolute', left: x - 35, top: yy - 35}}><Ball /></div>
        <div style={{position: 'absolute', right: 10, top: -10, opacity: fade(f, s + 16, s + 20)}}><span style={{fontFamily: DISPLAY, fontSize: 90, color: C.gold}}>TOP CORNER</span></div>
      </div>
    );
  }
  if (i === 3) return (
    <Center y={y + 30}>
      <div style={{display: 'flex', alignItems: 'center', gap: 40}}>
        <div style={{width: 40, height: 40, borderRadius: 40, background: '#fff', boxShadow: '0 0 30px #fff'}} />
        <Slam f={f} at={c.word(3, 1)}><div style={{fontFamily: DISPLAY, fontSize: 140, color: '#fff'}}>PENALTY</div></Slam>
      </div>
    </Center>
  );
  if (i === 4) return (
    <>
      <Center y={y}><Slam f={f} at={c.at(4)}><div style={{fontFamily: DISPLAY, fontSize: 170, color: '#fff'}}>5–5</div></Slam></Center>
      <Center y={y + 210}><Slam f={f} at={c.word(4, 11)}><div style={{fontFamily: DISPLAY, fontSize: 96, color: '#fff', background: RED, padding: '0 30px', borderRadius: 12}}>STILL OUT</div></Slam></Center>
    </>
  );
  if (i === 5) {
    const s = c.word(5, 5), t = ramp(f, s, s + 22, 0, 1);
    return (
      <div style={{position: 'absolute', left: 90, top: y, width: 900, height: 360}}>
        <svg width={900} height={360} style={{position: 'absolute'}}>
          <path d="M120 320 Q 450 -60 780 260" fill="none" stroke="#fff" strokeWidth={5} strokeDasharray="12 14" opacity={0.5} />
        </svg>
        <div style={{position: 'absolute', left: 120 + t * 660 - 35, top: 320 - Math.sin(t * Math.PI) * 300 - t * 60 - 35}}><Ball /></div>
        <div style={{position: 'absolute', left: 0, top: -10, fontFamily: DISPLAY, fontSize: 80, color: '#fff', opacity: fade(f, c.at(5), c.at(5) + 6)}}>LAST ATTACK</div>
      </div>
    );
  }
  if (i === 6) return null;
  // i === 7
  return (
    <Center y={y + 10}>
      <div style={{display: 'flex', gap: 30}}>
        {[['3', 'GOALS'], ['7', 'MINUTES']].map(([n, l], k) => (
          <Slam key={k} f={f} at={c.word(7, k === 0 ? 1 : 4)}>
            <div style={{textAlign: 'center', background: '#ffffff10', border: '3px solid #ffffff30', borderRadius: 24, padding: '10px 40px'}}>
              <div style={{fontFamily: DISPLAY, fontSize: 150, color: C.gold, lineHeight: 1}}>{n}</div>
              <div style={{fontFamily: BODY, fontWeight: 900, fontSize: 34, color: '#fff', letterSpacing: 4}}>{l}</div>
            </div>
          </Slam>
        ))}
      </div>
    </Center>
  );
};

export const S01Seven: React.FC<{d: ShortData}> = ({d}) => {
  const L = d.lines;
  const goals = goalsOf(d);
  return (
    <ShortShell d={d} bg={<Bg />} accent={C.gold} tag="7 MINUTES · 8 MARCH 2017"
      shake={goals}
      sfx={[{at: L[0].from, src: 'impact', vol: 0.6}, {at: L[1].from + 20, src: 'hit', vol: 0.5}, {at: goals[0], src: 'crowd', vol: 0.45}, {at: goals[0], src: 'hit', vol: 0.6},
        {at: goals[1], src: 'hit', vol: 0.6}, {at: goals[1], src: 'crowd', vol: 0.4}, {at: wordAt(d, 4, 11), src: 'impact', vol: 0.5}, {at: L[5].from - 6, src: 'riser', vol: 0.5},
        {at: goals[2], src: 'impact', vol: 0.8}, {at: goals[2], src: 'crowd', vol: 0.7}, {at: L[7].from + L[7].len - 26, src: 'whoosh', vol: 0.5}]}
      render={(c) => (
        <>
          <Clock c={c} />
          <Center y={470}><div style={{transform: `scale(${0.92 + 0.08 * (c.i === 2 || c.i === 3 || c.i === 6 ? pop(c.f, goalsOf(c.d)[c.i === 2 ? 0 : c.i === 3 ? 1 : 2]) : 1)})`}}>
            <Score home="BARÇA" away="PSG" hs={home(c)} as={1} w={900} hot={c.i === 2 || c.i === 3 || c.i >= 6 ? 'h' : undefined} label="CAMP NOU · UCL LAST 16" accent={C.gold} />
          </div></Center>
          <Agg c={c} />
          <Feature c={c} />
        </>
      )}
      overlay={(c) => (
        <>
          <Flash f={c.f} at={goals} />
          {c.i === 6 && (
            <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', background: `radial-gradient(circle, ${C.grana}ee 0%, ${C.blau}ee 70%)`, opacity: fade(c.f, c.at(6), c.at(6) + 3)}}>
              <Slam f={c.f} at={c.at(6)}><div style={{fontFamily: DISPLAY, fontSize: 210, color: '#fff', lineHeight: 0.92, textAlign: 'center', textShadow: '0 12px 0 #0006'}}>SERGI<br />ROBERTO</div></Slam>
              <div style={{fontFamily: DISPLAY, fontSize: 90, color: C.gold, marginTop: 20}}>95:00 · 6–1</div>
            </AbsoluteFill>
          )}
        </>
      )}
    />
  );
};
