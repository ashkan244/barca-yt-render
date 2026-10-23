// S05 — FORM GUIDE: 11 straight wins (Aug–Oct 2026), the 9/9 record start, then PSG 4–2 Barça (20 Oct 2026).
// Sources: 2026–27 FC Barcelona season page (Wikipedia), World Soccer Talk (21 Oct 2026).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, DISPLAY, BODY} from '../lib';
import {ShortShell, ShortData, Ctx, Slam, Score, Center, Flash, Counter, ramp, fade, pop, wordAt} from './kit';

const G = '#19c37d', R = '#ff2d55';
const TILES: {o: string; s: string; ucl?: boolean}[] = [
  {o: 'ELC', s: '5–0'}, {o: 'ATH', s: '2–0'}, {o: 'RAY', s: '5–2'}, {o: 'VAL', s: '5–0'}, {o: 'FEY', s: '5–1', ucl: true}, {o: 'LEV', s: '4–2'},
  {o: 'RAC', s: '7–2'}, {o: 'SEV', s: '3–1'}, {o: 'GET', s: '3–0'}, {o: 'GAL', s: '4–1', ucl: true}, {o: 'BET', s: '5–2'},
];
const TW = 216, TH = 190, GAP = 14, GX = (1080 - (4 * TW + 3 * GAP)) / 2, GY = 330;
const pos = (k: number) => ({left: GX + (k % 4) * (TW + GAP), top: GY + Math.floor(k / 4) * (TH + GAP)});

export const S05Eleven: React.FC<{d: ShortData}> = ({d}) => {
  const L = d.lines;
  const cascade = TILES.map((_, k) => Math.round(wordAt(d, 0, 2) + k * ((wordAt(d, 0, 4) - wordAt(d, 0, 2)) / 11)));
  const lossAt = wordAt(d, 0, 5);
  const crash = wordAt(d, 5, 7);
  return (
    <ShortShell d={d} accent={G} tag="FORM GUIDE · AUG–OCT 2026"
      bg={<AbsoluteFill style={{background: 'linear-gradient(180deg, #0b1020 0%, #05070d 100%)'}}>
        <AbsoluteFill style={{backgroundImage: 'linear-gradient(#ffffff08 2px, transparent 2px), linear-gradient(90deg, #ffffff08 2px, transparent 2px)', backgroundSize: '60px 60px'}} />
      </AbsoluteFill>}
      shake={[lossAt, crash]}
      sfx={[...cascade.map((t) => ({at: t, src: 'tick' as const, vol: 0.6})), {at: lossAt, src: 'impact', vol: 0.7}, {at: L[1].from, src: 'whoosh'},
        {at: wordAt(d, 2, 0), src: 'hit', vol: 0.5}, {at: wordAt(d, 3, 1), src: 'impact', vol: 0.55}, {at: wordAt(d, 4, 6), src: 'hit', vol: 0.5},
        {at: L[5].from - 10, src: 'riser', vol: 0.4}, {at: crash, src: 'impact', vol: 0.8}, {at: L[7].from, src: 'whoosh'}, {at: L[7].from, src: 'crowd', vol: 0.35}]}
      render={(c: Ctx) => {
        const {f, i} = c;
        const showGrid = i <= 1 || i === 4 || i === 2;
        const dim = i === 2 ? 0.25 : 1;
        const grid = showGrid && (
          <div style={{opacity: dim}}>
            {TILES.map((t, k) => {
              const on = f >= cascade[k];
              const hl = (i === 1 && !t.ucl) || (i === 4 && t.ucl) || i === 0;
              const lift = i === 4 && t.ucl ? pop(f, c.word(4, t.o === 'FEY' ? 1 : 3)) : 0;
              return (
                <div key={k} style={{position: 'absolute', ...pos(k), width: TW, height: TH, borderRadius: 20, background: on ? G : '#ffffff10',
                  opacity: hl ? 1 : 0.28, transform: `scale(${(on && i === 0 ? pop(f, cascade[k]) : 1) * (1 + 0.08 * lift)})`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: on ? `0 0 30px ${G}55` : 'none'}}>
                  <div style={{fontFamily: DISPLAY, fontSize: 84, color: '#04140c', lineHeight: 1}}>W</div>
                  <div style={{fontFamily: BODY, fontWeight: 900, fontSize: 30, color: '#04140c'}}>{t.o} {t.s}</div>
                  {t.ucl && <div style={{position: 'absolute', top: 8, right: 10, fontFamily: BODY, fontWeight: 900, fontSize: 20, color: '#04140c'}}>UCL ★</div>}
                </div>
              );
            })}
            {f >= lossAt && (
              <div style={{position: 'absolute', ...pos(11), width: TW, height: TH, borderRadius: 20, background: R, transform: `scale(${pop(f, lossAt)})`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 40px ${R}`}}>
                <div style={{fontFamily: DISPLAY, fontSize: 84, color: '#fff', lineHeight: 1}}>L</div>
                <div style={{fontFamily: BODY, fontWeight: 900, fontSize: 30, color: '#fff'}}>PSG 2–4</div>
              </div>
            )}
          </div>
        );
        if (i === 0) return grid;
        if (i === 1) return <>{grid}<Center y={GY + 3 * (TH + GAP) + 20}><Slam f={f} at={c.word(1, 7)}><div style={{fontFamily: DISPLAY, fontSize: 120, color: '#fff'}}>LA LIGA: <span style={{color: G}}>9 / 9</span></div></Slam></Center></>;
        if (i === 2) return (
          <>
            {grid}
            <div style={{position: 'absolute', left: 60, right: 60, top: 400, display: 'flex', gap: 30}}>
              {[{n: 39, l: 'SCORED', col: G, at: c.word(2, 0)}, {n: 9, l: 'CONCEDED', col: '#fff', at: c.word(2, 4)}].map((x, k) => (
                <div key={k} style={{flex: 1, textAlign: 'center', background: '#05070dee', border: `4px solid ${x.col}`, borderRadius: 28, padding: '24px 0', opacity: fade(f, x.at - 4, x.at + 2)}}>
                  <Counter f={f} a={x.at - 4} b={x.at + 16} to={x.n} style={{fontFamily: DISPLAY, fontSize: 250, color: x.col, lineHeight: 1}} />
                  <div style={{fontFamily: BODY, fontWeight: 900, fontSize: 40, color: '#fff', letterSpacing: 4}}>{x.l}</div>
                </div>
              ))}
            </div>
            <Center y={860} style={{opacity: fade(f, c.word(2, 4), c.word(2, 4) + 8)}}><div style={{fontFamily: BODY, fontWeight: 900, fontSize: 36, color: '#ffffffaa', letterSpacing: 4}}>9 LA LIGA GAMES</div></Center>
          </>
        );
        if (i === 3) return (
          <Center y={360}>
            <Slam f={f} at={c.word(3, 1)}>
              <div style={{textAlign: 'center', width: 900, borderRadius: 34, padding: '34px 30px', background: 'linear-gradient(160deg, #1a2238, #0b0f1c)', border: `5px solid ${C.gold}`, boxShadow: `0 0 80px ${C.gold}44`}}>
                <div style={{fontFamily: DISPLAY, fontSize: 210, color: C.gold, lineHeight: 1}}>= RECORD</div>
                <div style={{fontFamily: DISPLAY, fontSize: 70, color: '#fff', marginTop: 10}}>REAL MADRID · 1968–69</div>
                <div style={{fontFamily: BODY, fontWeight: 900, fontSize: 34, color: '#ffffffbb', letterSpacing: 3, marginTop: 14, opacity: fade(f, c.word(3, 10), c.word(3, 10) + 8)}}>BEST START IN LA LIGA HISTORY · 9 WINS FROM 9</div>
              </div>
            </Slam>
          </Center>
        );
        if (i === 4) return <>{grid}<Center y={GY + 3 * (TH + GAP) + 20}><Slam f={f} at={c.word(4, 6)}><div style={{fontFamily: DISPLAY, fontSize: 130, color: '#fff'}}><span style={{color: G}}>11</span> STRAIGHT</div></Slam></Center></>;
        if (i === 5) {
          const z = ramp(f, c.at(5), c.word(5, 6), 0.6, 1);
          return (
            <>
              <Center y={330} style={{opacity: fade(f, c.at(5), c.at(5) + 6)}}><div style={{fontFamily: BODY, fontWeight: 900, fontSize: 40, color: '#ffffffcc', letterSpacing: 5}}>TUE 20 OCT · PARC DES PRINCES</div></Center>
              <Center y={420}><div style={{transform: `scale(${z})`}}><Slam f={f} at={c.word(5, 6)}><Score home="PSG" away="BARÇA" hs={4} as={2} hot="h" label="CHAMPIONS LEAGUE" accent={R} /></Slam></div></Center>
              {f >= crash && <svg width={1080} height={500} style={{position: 'absolute', left: 0, top: 380}}><path d="M 300 0 L 380 120 L 330 200 L 460 330 L 420 500" stroke="#fff" strokeWidth={6} fill="none" opacity={0.75} /><path d="M 760 40 L 700 160 L 790 260 L 720 420" stroke="#fff" strokeWidth={5} fill="none" opacity={0.6} /></svg>}
              <Center y={760}><Slam f={f} at={c.word(5, 11)}><div style={{fontFamily: DISPLAY, fontSize: 130, color: '#fff', background: R, padding: '0 34px', borderRadius: 16}}>RUN OVER</div></Slam></Center>
            </>
          );
        }
        if (i === 6) return (
          <Center y={380}>
            <div style={{width: 920}}>
              <div style={{fontFamily: BODY, fontWeight: 900, fontSize: 36, color: '#ffffffaa', letterSpacing: 5, marginBottom: 14}}>LA LIGA · AFTER 9 GAMES</div>
              {[{p: '1', t: 'BARCELONA', pts: '27', me: true}, {p: '2', t: 'ATLÉTICO MADRID', pts: '22'}].map((r, k) => (
                <div key={k} style={{display: 'flex', alignItems: 'center', height: 130, marginBottom: 14, borderRadius: 18, padding: '0 30px', background: r.me ? `linear-gradient(90deg, ${C.blau}, ${C.grana})` : '#ffffff12',
                  transform: `translateX(${(1 - pop(f, c.at(6) + k * 6)) * 300}px)`, opacity: pop(f, c.at(6) + k * 6)}}>
                  <span style={{fontFamily: DISPLAY, fontSize: 70, color: '#fff', width: 80}}>{r.p}</span>
                  <span style={{fontFamily: DISPLAY, fontSize: 60, color: '#fff', flex: 1}}>{r.t}</span>
                  <span style={{fontFamily: DISPLAY, fontSize: 80, color: r.me ? C.gold : '#fff'}}>{r.pts}</span>
                </div>
              ))}
              <div style={{textAlign: 'right', marginTop: 10}}><Slam f={f} at={c.word(6, 1)}><span style={{fontFamily: DISPLAY, fontSize: 110, color: G}}>+5 PTS</span></Slam></div>
            </div>
          </Center>
        );
        return (
          <>
            <Center y={360}><Slam f={f} at={c.at(7)}><div style={{textAlign: 'center', background: `linear-gradient(135deg, ${C.blau}, ${C.grana})`, borderRadius: 30, padding: '30px 60px', boxShadow: '0 30px 80px #000'}}>
              <div style={{fontFamily: BODY, fontWeight: 900, fontSize: 40, color: C.gold, letterSpacing: 6}}>SUN 25 OCT · CAMP NOU</div>
              <div style={{fontFamily: DISPLAY, fontSize: 150, color: '#fff', lineHeight: 1.05}}>EL CLÁSICO</div>
            </div></Slam></Center>
            <Center y={780}><div style={{display: 'flex', gap: 20}}>
              {[{t: '11 W', col: G, at: c.word(7, 10)}, {t: '1 L', col: R, at: c.word(7, 12)}].map((x, k) => (
                <Slam key={k} f={f} at={x.at}><div style={{fontFamily: DISPLAY, fontSize: 110, color: '#fff', background: x.col, padding: '0 34px', borderRadius: 16}}>{x.t}</div></Slam>
              ))}
            </div></Center>
          </>
        );
      }}
      overlay={(c) => <Flash f={c.f} at={[lossAt, crash]} color={R} dur={8} />}
    />
  );
};
