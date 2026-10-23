// S03 — TIME MACHINE: Cruyff's first season, 1973–74. Archive photos (CC0, Anefo) with film look,
// calendar stamps and headline slams. Every photo carries its real place/date.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, DISPLAY, BODY} from '../lib';
import {ShortShell, ShortData, Ctx, Slam, Score, Center, Flash, Counter, ramp, fade, pop, wordAt} from './kit';

const SEPIA = '#e9c98f';
const BURN = '#ff7a1a';
const SERIF = 'Georgia, "Times New Roman", serif';

const Photo: React.FC<{src: string; f: number; a: number; b: number; cap: string; origin?: string}> = ({src, f, a, b, cap, origin = '50% 40%'}) => {
  const z = ramp(f, a, b, 1.04, 1.18, (t) => t);
  const flick = 0.92 + 0.08 * Math.sin(f * 1.7) * Math.sin(f * 0.37);
  return (
    <div style={{position: 'absolute', left: 70, top: 300, width: 940, height: 760, overflow: 'hidden', borderRadius: 10, border: `10px solid ${SEPIA}`, boxShadow: '0 40px 90px #000', transform: `rotate(${-1.2 + Math.sin(a) * 1.5}deg)`}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`, transformOrigin: origin, filter: `sepia(0.65) contrast(1.15) brightness(${flick})`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, #000a 100%)'}} />
      <div style={{position: 'absolute', left: 18, bottom: 14, fontFamily: BODY, fontWeight: 700, fontSize: 24, color: '#fff', background: '#000a', padding: '4px 12px', borderRadius: 6}}>{cap}</div>
    </div>
  );
};

const Stamp: React.FC<{f: number; at: number; text: string; color?: string; x?: number; y?: number; rot?: number}> = ({f, at, text, color = C.grana, x = 90, y = 250, rot = -6}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`}}>
    <Slam f={f} at={at}><div style={{fontFamily: DISPLAY, fontSize: 84, color: '#fff', background: color, padding: '0 26px', borderRadius: 8, boxShadow: '0 10px 30px #0009'}}>{text}</div></Slam>
  </div>
);

const Table: React.FC<{c: Ctx}> = ({c}) => {
  const rows = ['', '', '', '', '', '', ''];
  const sink = ramp(c.f, c.word(2, 8), c.word(2, 8) + 30, 1, 5.6);
  return (
    <div style={{position: 'absolute', left: 120, top: 330, width: 840, height: 700, background: '#f3e7cf', borderRadius: 8, boxShadow: '0 30px 80px #000', padding: 30, transform: 'rotate(1deg)'}}>
      <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 44, color: '#222', borderBottom: '4px double #222', paddingBottom: 8}}>LA LIGA · AUTUMN 1973</div>
      {rows.map((_, k) => <div key={k} style={{height: 70, borderBottom: '2px solid #2223', display: 'flex', alignItems: 'center', fontFamily: SERIF, fontSize: 30, color: '#2228'}}><span style={{width: 60}}>{k + 1}.</span><span style={{flex: 1, height: 14, background: '#2221', borderRadius: 7}} /></div>)}
      <div style={{position: 'absolute', left: 20, right: 20, top: 100 + sink * 70, height: 66, background: `linear-gradient(90deg, ${C.blau}, ${C.grana})`, borderRadius: 8, display: 'flex', alignItems: 'center', paddingLeft: 30, fontFamily: DISPLAY, fontSize: 46, color: '#fff', boxShadow: '0 10px 30px #0008'}}>
        BARCELONA <span style={{marginLeft: 'auto', marginRight: 26, fontSize: 60, color: '#ff4d4d'}}>↓</span>
      </div>
      <div style={{position: 'absolute', right: 30, bottom: 20, fontFamily: BODY, fontSize: 20, color: '#222a'}}>ILLUSTRATION</div>
    </div>
  );
};

export const S03Season: React.FC<{d: ShortData}> = ({d}) => {
  const L = d.lines;
  const fives = [3, 4, 5, 6, 7].map((n) => wordAt(d, 5, n));
  return (
    <ShortShell d={d} accent={SEPIA} tag="TIME MACHINE · 1973–74"
      bg={<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #3a2a17 0%, #160f08 60%, #050302 100%)'}} />}
      shake={[...fives, L[6].from]}
      sfx={[{at: L[0].from, src: 'tick', vol: 0.5}, {at: L[0].from + 40, src: 'whoosh'}, ...L.slice(1).map((l) => ({at: l.from - 4, src: 'shutter' as const, vol: 0.45})),
        {at: L[2].from + 30, src: 'whoosh'}, ...fives.map((t) => ({at: t, src: 'hit' as const, vol: 0.5})), {at: L[6].from, src: 'crowd', vol: 0.5}, {at: L[6].from, src: 'impact', vol: 0.6}]}
      render={(c) => {
        const {f, i} = c;
        const a = c.at(i), b = c.end(i) + 8;
        if (i === 0) {
          const plane = fade(f, c.word(0, 7), c.word(0, 7) + 10);
          return (
            <>
              <Center y={360} style={{opacity: 1 - plane}}>
                <div style={{textAlign: 'center'}}>
                  <Counter f={f} a={a + 2} b={c.word(0, 2)} to={13} style={{fontFamily: DISPLAY, fontSize: 330, color: SEPIA, lineHeight: 1}} />
                  <div style={{fontFamily: DISPLAY, fontSize: 80, color: '#fff'}}>YEARS</div>
                  <div style={{fontFamily: BODY, fontWeight: 900, fontSize: 36, color: '#ffffffaa', letterSpacing: 4, marginTop: 10}}>NO LEAGUE TITLE · 1960 → 1973</div>
                </div>
              </Center>
              {plane > 0 && <div style={{opacity: plane}}><Photo src="photos/cruyff/cruyff-flight-barcelona-1973.jpg" f={f} a={c.word(0, 7)} b={b + 20} cap="Cruyff and his wife Danny, flight to Barcelona, 1973" origin="45% 45%" /></div>}
            </>
          );
        }
        if (i === 1) return (
          <>
            <Photo src="photos/cruyff/cruyff-01.jpg" f={f} a={a} b={b} cap="Schiphol airport, leaving for Barcelona, 1973" origin="30% 40%" />
            <Stamp f={f} at={a + 2} text="AUG 1973" />
            <div style={{position: 'absolute', left: 60, right: 60, top: 1000}}>
              <Slam f={f} at={c.word(1, 5)}><div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 52, color: '#111', background: '#f3e7cf', padding: '10px 24px', textAlign: 'center', boxShadow: '0 20px 40px #000'}}>MOST EXPENSIVE PLAYER IN THE WORLD</div></Slam>
            </div>
          </>
        );
        if (i === 2) return <><Table c={c} /><Stamp f={f} at={c.word(2, 2)} text="NO PAPERWORK" color="#7a1f1f" x={480} y={250} rot={5} /></>;
        if (i === 3) return (
          <>
            <Photo src="photos/cruyff/cruyff-02.jpg" f={f} a={a} b={b} cap="Cruyff in Barça colours, Rotterdam, 1974" origin="55% 30%" />
            <Stamp f={f} at={a + 2} text="OCT 1973" />
            <div style={{position: 'absolute', right: 70, top: 920}}><Slam f={f} at={c.word(3, 9)}><div style={{fontFamily: DISPLAY, fontSize: 120, color: '#fff', background: C.blau, padding: '0 30px', borderRadius: 12}}>2 GOALS</div></Slam></div>
          </>
        );
        if (i === 4) {
          const t = ramp(f, c.word(4, 2), c.word(4, 2) + 26, 0, 1);
          return (
            <>
              <Stamp f={f} at={a + 2} text="DEC 1973" />
              <svg width={1080} height={900} style={{position: 'absolute', left: 0, top: 300}}>
                <g stroke="#f3e7cf" strokeWidth={10} fill="none" opacity={0.9}><path d="M 640 560 L 640 300 L 1000 300 L 1000 560" /></g>
                <g stroke="#f3e7cf" strokeWidth={2} opacity={0.35}>{Array.from({length: 9}).map((_, k) => <line key={k} x1={640 + k * 45} y1={300} x2={640 + k * 45} y2={560} />)}{Array.from({length: 6}).map((_, k) => <line key={'h' + k} x1={640} y1={300 + k * 52} x2={1000} y2={300 + k * 52} />)}</g>
                <path d="M 120 120 Q 600 -40 760 420" fill="none" stroke={SEPIA} strokeWidth={10} strokeDasharray="22 16" opacity={0.75} />
                <circle cx={120 + t * 640} cy={120 + (t * t) * 300 - Math.sin(t * Math.PI) * 140} r={34} fill="#fff" stroke="#111" strokeWidth={5} />
                {[0, 1, 2, 3, 4].map((k) => <line key={k} x1={700 + k * 30} y1={600 - k * 10} x2={820 + k * 30} y2={560 - k * 10} stroke={SEPIA} strokeWidth={6} opacity={t > 0.85 ? 0.8 : 0} />)}
              </svg>
              <Center y={890}><Slam f={f} at={c.word(4, 8)}><div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, fontSize: 104, color: '#fff', textAlign: 'center', lineHeight: 1}}>“the impossible<br />goal”</div></Slam></Center>
              <Center y={1130} style={{opacity: fade(f, c.word(4, 8), c.word(4, 8) + 8)}}><div style={{fontFamily: BODY, fontWeight: 800, fontSize: 30, color: '#ffffffaa', letterSpacing: 3}}>v ATLÉTICO MADRID · ILLUSTRATION</div></Center>
            </>
          );
        }
        if (i === 5) {
          const n = fives.filter((t) => f >= t).length;
          return (
            <>
              <Stamp f={f} at={a + 2} text="17 FEB 1974" />
              <Center y={470}><div style={{transform: `scale(${0.9 + 0.1 * pop(f, fives[Math.max(0, n - 1)])})`}}><Score home="R. MADRID" away="BARÇA" hs={0} as={n} hot="a" label="SANTIAGO BERNABÉU" accent={SEPIA} w={940} /></div></Center>
              <Center y={760}><div style={{display: 'flex', gap: 14}}>{[0, 1, 2, 3, 4].map((k) => <div key={k} style={{width: 120, height: 120, borderRadius: 60, background: k < n ? SEPIA : '#ffffff14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 64, color: '#000', transform: `scale(${k < n ? pop(f, fives[k]) : 1})`}}>{k < n ? k + 1 : ''}</div>)}</div></Center>
            </>
          );
        }
        if (i === 6) return (
          <Center y={380}>
            <div style={{textAlign: 'center'}}>
              <Slam f={f} at={a}><div style={{fontSize: 230, lineHeight: 1}}>🏆</div></Slam>
              <Slam f={f} at={c.word(6, 4)}><div style={{fontFamily: DISPLAY, fontSize: 150, color: SEPIA, lineHeight: 1}}>CHAMPIONS</div></Slam>
              <div style={{fontFamily: BODY, fontWeight: 900, fontSize: 40, color: '#fff', letterSpacing: 6, marginTop: 16, opacity: fade(f, c.word(6, 5), c.word(6, 5) + 8)}}>LA LIGA · 1973–74</div>
            </div>
          </Center>
        );
        return (
          <>
            <Photo src="photos/cruyff/cruyff-flight-barcelona-1973.jpg" f={f} a={a} b={b + 14} cap="Cruyff and his wife Danny, flight to Barcelona, 1973" origin="62% 55%" />
            <div style={{position: 'absolute', left: 60, right: 60, top: 980, display: 'flex', gap: 16, justifyContent: 'center'}}>
              {['1 DUTCHMAN', '1 SEASON'].map((t, k) => <Slam key={k} f={f} at={c.word(7, k * 2)}><div style={{fontFamily: DISPLAY, fontSize: 70, color: '#000', background: SEPIA, padding: '0 22px', borderRadius: 10}}>{t}</div></Slam>)}
            </div>
          </>
        );
      }}
      overlay={(c) => <>
        <Flash f={c.f} at={c.d.lines.slice(1).map((l) => l.from)} color={BURN} dur={7} />
        <Flash f={c.f} at={[c.at(6)]} color="#fff" />
      </>}
    />
  );
};
