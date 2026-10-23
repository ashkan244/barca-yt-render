// S04 — STAT ATTACK: Raphinha's back-to-back hat-tricks (16 & 19 Sep 2026) and his 12-goal start.
// Broadcast-style yellow/black graphics; no player photo (no free-licence image), pure typography + icons.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, DISPLAY, BODY} from '../lib';
import {ShortShell, ShortData, Ctx, Slam, Score, Center, Flash, Counter, ramp, fade, pop, wordAt, Ball} from './kit';

const Y = '#ffd400';

const Bg: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: '#08080a'}}>
    <AbsoluteFill style={{background: `repeating-linear-gradient(-35deg, transparent 0 60px, #ffd4000c 60px 120px)`, transform: `translateX(${(f * 3) % 140}px)`}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, transparent 30%, #000 85%)'}} />
  </AbsoluteFill>
);

const Cal: React.FC<{day: string; mon: string; s: number}> = ({day, mon, s}) => (
  <div style={{width: 230, borderRadius: 22, overflow: 'hidden', transform: `scale(${s}) rotate(-4deg)`, boxShadow: '0 20px 50px #000'}}>
    <div style={{background: C.grana, color: '#fff', fontFamily: BODY, fontWeight: 900, fontSize: 38, textAlign: 'center', letterSpacing: 4, padding: '6px 0'}}>{mon}</div>
    <div style={{background: '#fff', color: '#111', fontFamily: DISPLAY, fontSize: 150, textAlign: 'center', lineHeight: 1.1}}>{day}</div>
  </div>
);

const Balls: React.FC<{f: number; at: number[]; size?: number}> = ({f, at, size = 110}) => (
  <div style={{display: 'flex', gap: 24, justifyContent: 'center'}}>
    {at.map((t, k) => <div key={k} style={{transform: `scale(${f >= t ? pop(f, t) : 0}) rotate(${(f - t) * 6}deg)`}}><Ball size={size} /></div>)}
  </div>
);

export const S04Raphinha: React.FC<{d: ShortData}> = ({d}) => {
  const L = d.lines;
  const trio = [0, 2, 4].map((n) => wordAt(d, 0, n));
  const hat1 = [0, 1, 2].map((k) => wordAt(d, 1, 6) + k * 7);
  const hat2 = [0, 1, 2].map((k) => wordAt(d, 2, 6) + k * 7);
  return (
    <ShortShell d={d} accent={Y} tag="FORM WATCH · SEPT–OCT 2026"
      bg={<BgWrap />}
      shake={[...trio, L[3].from]}
      sfx={[...trio.map((t) => ({at: t, src: 'hit' as const, vol: 0.55})), ...hat1.map((t) => ({at: t, src: 'pop' as const, vol: 0.6})), {at: L[2].from, src: 'whoosh'},
        ...hat2.map((t) => ({at: t, src: 'pop' as const, vol: 0.6})), {at: L[3].from, src: 'impact', vol: 0.7}, {at: L[3].from, src: 'crowd', vol: 0.4},
        {at: L[4].from + 6, src: 'riser', vol: 0.35}, {at: L[6].from, src: 'whoosh'}, {at: L[7].from, src: 'hit', vol: 0.5}]}
      render={(c: Ctx) => {
        const {f, i} = c;
        const name = (
          <Center y={235}><div style={{fontFamily: DISPLAY, fontSize: 64, color: '#000', background: Y, padding: '0 28px', letterSpacing: 6, transform: 'skewX(-10deg)'}}>RAPHINHA</div></Center>
        );
        if (i === 0) return (
          <>
            {name}
            {[['6', 'GOALS'], ['3', 'DAYS'], ['1', 'PLAYER']].map(([n, l], k) => (
              <div key={k} style={{position: 'absolute', left: 0, right: 0, top: 360 + k * 270, display: 'flex', justifyContent: 'center'}}>
                <Slam f={f} at={trio[k]}><div style={{display: 'flex', alignItems: 'baseline', gap: 24}}>
                  <span style={{fontFamily: DISPLAY, fontSize: 230, color: Y, lineHeight: 1}}>{n}</span>
                  <span style={{fontFamily: DISPLAY, fontSize: 110, color: '#fff'}}>{l}</span>
                </div></Slam>
              </div>
            ))}
          </>
        );
        if (i === 1 || i === 2) {
          const one = i === 1;
          return (
            <>
              {name}
              <Center y={360}><Cal day={one ? '16' : '19'} mon="SEP" s={pop(f, c.at(i))} /></Center>
              {!one && <Center y={640}><div style={{fontFamily: DISPLAY, fontSize: 90, color: '#fff'}}>+<Counter f={f} a={c.at(2)} b={c.word(2, 2)} to={72} /> HOURS</div></Center>}
              <Center y={one ? 690 : 790}><Slam f={f} at={c.word(i, one ? 3 : 4)}>{one
                ? <Score home="BARÇA" away="RACING" hs={7} as={2} hot="h" label="LA LIGA · CAMP NOU" accent={Y} w={900} />
                : <Score home="SEVILLA" away="BARÇA" hs={1} as={3} hot="a" label="LA LIGA · SÁNCHEZ-PIZJUÁN" accent={Y} w={900} />}</Slam></Center>
              <div style={{position: 'absolute', left: 0, right: 0, top: one ? 980 : 1060}}><Balls f={f} at={one ? hat1 : hat2} size={one ? 120 : 96} /></div>
            </>
          );
        }
        if (i === 3) return (
          <>
            {name}
            <Center y={380}><Slam f={f} at={c.at(3)}><div style={{fontFamily: DISPLAY, fontSize: 170, color: '#fff', textAlign: 'center', lineHeight: 0.95}}>BACK-TO-BACK<br /><span style={{color: Y}}>HAT-TRICKS</span></div></Slam></Center>
            <div style={{position: 'absolute', left: 0, right: 0, top: 800}}><Balls f={f} at={[0, 1, 2].map((k) => c.at(3) + 4 + k * 4)} size={100} /></div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 930}}><Balls f={f} at={[0, 1, 2].map((k) => c.at(3) + 16 + k * 4)} size={100} /></div>
          </>
        );
        if (i === 4) return (
          <>
            {name}
            <div style={{position: 'absolute', left: 60, right: 60, top: 380, display: 'flex', gap: 30, justifyContent: 'center'}}>
              {[{n: 12, l: 'LA LIGA', at: c.word(4, 6)}, {n: 14, l: 'ALL COMPS', at: c.word(4, 8)}].map((x, k) => (
                <div key={k} style={{flex: 1, textAlign: 'center', background: '#ffffff0d', border: `4px solid ${k ? '#ffffff40' : Y}`, borderRadius: 28, padding: '20px 0', opacity: fade(f, x.at - 6, x.at)}}>
                  <Counter f={f} a={x.at - 6} b={x.at + 14} to={x.n} style={{fontFamily: DISPLAY, fontSize: 260, color: k ? '#fff' : Y, lineHeight: 1}} />
                  <div style={{fontFamily: BODY, fontWeight: 900, fontSize: 40, color: '#fff', letterSpacing: 4}}>{x.l}</div>
                  <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 26, color: '#ffffff99', letterSpacing: 2}}>GOALS</div>
                </div>
              ))}
            </div>
            <Center y={860} style={{opacity: fade(f, c.word(4, 2), c.word(4, 2) + 8)}}><div style={{fontFamily: BODY, fontWeight: 900, fontSize: 40, color: '#ffffffcc', letterSpacing: 4}}>AFTER 9 LEAGUE GAMES</div></Center>
          </>
        );
        if (i === 5) return (
          <>
            {name}
            <Center y={360}><Slam f={f} at={c.word(5, 1)}><div style={{fontFamily: DISPLAY, fontSize: 120, color: '#000', background: Y, padding: '6px 40px', borderRadius: 16}}>LA LIGA TOP SCORER</div></Slam></Center>
            <div style={{position: 'absolute', left: 90, right: 90, top: 640, display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: 10}}>
              {Array.from({length: 9}).map((_, k) => { const t = c.word(5, 7) + k * 3; return (
                <div key={k} style={{height: 120, borderRadius: 14, background: f >= t ? '#19c37d' : '#ffffff10', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 64, color: '#fff', transform: `scale(${f >= t ? pop(f, t) : 1})`}}>{f >= t ? 'W' : ''}</div>); })}
            </div>
            <Center y={790} style={{opacity: fade(f, c.word(5, 9), c.word(5, 9) + 8)}}><div style={{fontFamily: BODY, fontWeight: 900, fontSize: 40, color: '#fff', letterSpacing: 4}}>BARÇA · 9 / 9 WINS</div></Center>
          </>
        );
        if (i === 6) return (
          <>
            {name}
            <Center y={380}><Slam f={f} at={c.at(6)}><div style={{textAlign: 'center', background: `linear-gradient(135deg, ${C.blau}, ${C.grana})`, borderRadius: 30, padding: '30px 60px', boxShadow: '0 30px 80px #000'}}>
              <div style={{fontFamily: BODY, fontWeight: 900, fontSize: 40, color: Y, letterSpacing: 6}}>LA LIGA 2026–27</div>
              <div style={{fontFamily: DISPLAY, fontSize: 150, color: '#fff', lineHeight: 1.05}}>9 / 38</div>
              <div style={{width: 640, height: 26, borderRadius: 13, background: '#ffffff30', margin: '16px auto 6px', overflow: 'hidden'}}><div style={{width: `${(9 / 38) * 100 * ramp(f, c.at(6) + 4, c.at(6) + 24, 0, 1)}%`, height: '100%', background: Y}} /></div>
              <div style={{fontFamily: DISPLAY, fontSize: 60, color: '#fff'}}>GAMES PLAYED</div>
            </div></Slam></Center>
          </>
        );
        return (
          <>
            {name}
            <Center y={330}><Slam f={f} at={c.at(7)}><div style={{fontFamily: DISPLAY, fontSize: 520, color: Y, lineHeight: 1, textShadow: '0 20px 0 #0008'}}>?</div></Slam></Center>
            <Center y={900} style={{opacity: fade(f, c.word(7, 4), c.word(7, 4) + 8)}}><div style={{fontFamily: BODY, fontWeight: 900, fontSize: 40, color: '#fff', letterSpacing: 4}}>TELL US IN THE COMMENTS</div></Center>
          </>
        );
      }}
      overlay={(c) => <Flash f={c.f} at={[...trio, c.at(3)]} color={Y} dur={6} />}
    />
  );
};

const BgWrap: React.FC = () => <Bg f={useCurrentFrame()} />;
