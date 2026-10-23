// Two vertical Shorts cut from HK-TM (morti's take): RADAR CUT (the 18 minutes) and STAT DROP (the season in numbers).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {DISPLAY} from '../lib';
import edit from './HK.edit.json';
import type {Edit} from './RadarStory';
import {FPS} from './RadarStory';
import {makeCut, cutT, VShell, H, S, NAVY, GOLD, GRANA, BLAU, RED, GREEN, ramp, popIn, fadeIn, Chip, Card, Count, Ball, Trophy} from './RadarShorts';

const ed = edit as Edit;
const SRC = 'host/HK/HK-edit.mp4';

// ================= RADAR CUT · "the 18 minutes" =================
const cA = makeCut(ed, [{from: 'L03', to: 'L03'}, {from: 'L18', to: 'L26'}]);
const A = cutT(cA);
export const HK_RS1_FRAMES = Math.round(cA.dur * FPS) + 12;

const ScoreBug: React.FC<{f: number}> = ({f}) => {
  const g1 = A.w('L19', 14), g2 = A.w('L21', 5), ft = f >= A.w('L25', 3);
  const sc = `${(f >= g1 ? 1 : 0) + (f >= g2 ? 1 : 0)}–0`;
  const k = f >= g2 && f < g2 + 12 ? popIn(f, g2) : f >= g1 && f < g1 + 12 ? popIn(f, g1) : 1;
  return (
    <div style={{display: 'flex', borderRadius: 18, overflow: 'hidden', boxShadow: '0 20px 50px #000a', width: '100%'}}>
      <div style={{flex: 1, background: `linear-gradient(135deg, ${BLAU}, ${GRANA})`, fontFamily: DISPLAY, fontSize: 70, color: '#fff', textAlign: 'center', padding: '14px 0'}}>BARÇA</div>
      <div style={{background: '#fff', fontFamily: DISPLAY, fontSize: 84, color: NAVY, padding: '6px 34px', transform: `scale(${k})`}}>{sc}</div>
      <div style={{flex: 1, background: '#e9ecf3', fontFamily: DISPLAY, fontSize: 62, color: NAVY, textAlign: 'center', padding: '18px 0'}}>REAL MADRID</div>
      <div style={{background: ft ? GOLD : '#050914', fontFamily: DISPLAY, fontSize: 56, color: ft ? '#000' : GOLD, padding: '18px 20px'}}>{ft ? 'FT' : 'LIVE'}</div>
    </div>
  );
};

export const HKShortCut: React.FC = () => (
  <VShell c={cA} src={SRC} tag="RADAR CUT · 10 MAY 2026" music="music/km/crusade.mp3"
    title={<div />}
    sched={[{at: 0, m: 'full'}, {at: A.w('L19', 7), m: 'bubble'}, {at: A.s('L20'), m: 'full'}, {at: A.s('L22'), m: 'bubble'}, {at: A.s('L23'), m: 'full'}, {at: A.s('L26') - 3, m: 'bubble'}]}
    sfx={[{at: 0, src: 'impact', vol: 0.4}, {at: A.s('L18'), src: 'whoosh'}, {at: A.w('L19', 14), src: 'crowd', vol: 0.5}, {at: A.w('L19', 14), src: 'hit', vol: 0.4},
      {at: A.w('L21', 5), src: 'crowd', vol: 0.5}, {at: A.w('L21', 5), src: 'hit', vol: 0.4}, {at: A.w('L25', 3), src: 'whistle', vol: 0.35}, {at: A.s('L26'), src: 'crowd', vol: 0.55}, {at: A.s('L26'), src: 'impact', vol: 0.45}]}
    band={(f) => {
      if (f < A.s('L18') - 4) return (
        <div style={{width: '100%'}}>
          <div style={{transform: `scale(${popIn(f, 2)})`, transformOrigin: 'left'}}><Chip size={46}>FIRST TIME IN CLUB HISTORY</Chip></div>
          <div style={{marginTop: 10, opacity: fadeIn(f, A.w('L03', 10))}}>{H('TITLE CLINCHED BY BEATING MADRID', 64)}</div>
        </div>
      );
      if (f < A.s('L26') - 3) return <ScoreBug f={f} />;
      return <div style={{transform: `scale(${popIn(f, A.s('L26') - 3)})`, transformOrigin: 'left'}}>{H('CHAMPIONS OF SPAIN', 104, GOLD)}<S color="#fff">2ND SEASON IN A ROW · 29TH LEAGUE TITLE</S></div>;
    }}
    graph={(f) => {
      if (f >= A.w('L19', 7) - 4 && f < A.s('L20') + 8) {
        const fk = ramp(f, A.w('L19', 11), A.w('L19', 14), 0, 1, (x) => x);
        const bx = 120 + fk * 700, by = 620 - Math.sin(fk * Math.PI) * 300 - fk * 170;
        return (
          <svg width={1000} height={1000}>
            <rect x={40} y={260} width={920} height={600} rx={18} fill="#0d3b25" />
            {Array.from({length: 7}).map((_, k) => <rect key={k} x={40 + k * 920 / 7} y={260} width={920 / 7} height={600} fill={k % 2 ? '#0f4429' : 'transparent'} />)}
            <g stroke="#ffffffb0" strokeWidth={5} fill="none"><rect x={48} y={268} width={904} height={584} rx={12} /><rect x={772} y={410} width={180} height={300} /><rect x={890} y={490} width={62} height={140} /></g>
            <rect x={944} y={510} width={22} height={100} fill="#fff" />
            {[0, 1, 2, 3].map((k) => <circle key={k} cx={640} cy={470 + k * 38} r={17} fill="#e9ecf3" stroke={NAVY} strokeWidth={3} />)}
            <path d="M 120 620 Q 560 150 950 530" fill="none" stroke={GOLD} strokeWidth={7} strokeDasharray="18 12" opacity={0.9} />
            <circle cx={bx} cy={by} r={22} fill="#fff" stroke="#111" strokeWidth={4} />
            <text x={60} y={200} fontFamily={DISPLAY} fontSize={70} fill="#fff">RASHFORD</text>
            <text x={60} y={940} fontFamily={DISPLAY} fontSize={56} fill={GOLD}>DIRECT FREE-KICK</text>
          </svg>
        );
      }
      if (f >= A.s('L22') - 4 && f < A.s('L23') + 8) return (
        <div style={{padding: '120px 60px'}}>
          <S color={GOLD} size={36}>BOTH GOALS</S>{H('INSIDE 18 MINUTES', 104)}
          <div style={{position: 'relative', height: 160, marginTop: 70}}>
            <div style={{position: 'absolute', left: 0, right: 0, top: 70, height: 22, background: '#ffffff20', borderRadius: 11}} />
            <div style={{position: 'absolute', left: 0, width: `${20 * ramp(f, A.s('L22'), A.s('L22') + 16)}%`, top: 70, height: 22, background: GOLD, borderRadius: 11}} />
            {[0, 1].map((k) => <div key={k} style={{position: 'absolute', left: `${3 + k * 9}%`, top: 44, transform: `scale(${popIn(f, A.s('L22') + 6 + k * 6)})`}}><Ball size={74} /></div>)}
            {['0′', '18′', '90′'].map((m, k) => <div key={m} style={{position: 'absolute', left: `${[0, 20, 100][k]}%`, top: 108, transform: 'translateX(-50%)', fontFamily: DISPLAY, fontSize: 50, color: k === 1 ? GOLD : '#ffffff80'}}>{m}</div>)}
          </div>
        </div>
      );
      if (f >= A.s('L26') - 6) return (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          {Array.from({length: 46}).map((_, k) => { const d = f - A.s('L26'); const x = 500 + Math.cos(k * 2.4) * d * (5 + (k % 5)); const y = 560 + Math.sin(k * 2.4) * d * (4 + (k % 4)) + d * d * 0.05;
            return <div key={k} style={{position: 'absolute', left: x, top: y, width: 16, height: 26, background: [GOLD, GRANA, BLAU, '#fff'][k % 4], transform: `rotate(${k * 37 + d * 9}deg)`, opacity: Math.max(0, 1 - d / 110)}} />; })}
          <div style={{transform: `scale(${popIn(f, A.s('L26'))})`}}><Trophy size={420} /></div>
        </AbsoluteFill>
      );
      return null;
    }} />
);

// ================= STAT DROP · "the season in 4 numbers" =================
const cB = makeCut(ed, [{from: 'L32', to: 'L37'}, {from: 'L45', to: 'L46'}]);
const B = cutT(cB);
export const HK_RS2_FRAMES = Math.round(cB.dur * FPS) + 12;

const Bars: React.FC<{f: number; at: number; rows: {n: string; v: number; c: string}[]; max: number; unit: string}> = ({f, at, rows, max, unit}) => {
  const k = ramp(f, at, at + 20);
  return (
    <div style={{padding: '170px 50px 0'}}>
      {rows.map((r, i) => (
        <div key={r.n} style={{marginBottom: 46, opacity: i ? fadeIn(f, at + 8 + i * 6) : 1}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>{H(r.n, 64)}<span style={{fontFamily: DISPLAY, fontSize: 96, color: r.c}}><Count f={f} a={at} b={at + 20} to={r.v} /> <span style={{fontSize: 40}}>{unit}</span></span></div>
          <div style={{width: `${(r.v / max) * 100 * k}%`, height: 64, background: r.c, borderRadius: 14, opacity: i ? 0.6 : 1}} />
        </div>
      ))}
    </div>
  );
};

export const HKShortStats: React.FC = () => (
  <VShell c={cB} src={SRC} tag="STAT DROP · 2025–26" music="music/km/investigations.mp3"
    title={<div />}
    sched={[{at: 0, m: 'bubble'}, {at: B.s('L35') - 3, m: 'full'}, {at: B.s('L36') - 3, m: 'bubble'}, {at: B.s('L37') - 3, m: 'full'}]}
    sfx={[{at: 0, src: 'impact', vol: 0.4}, {at: B.w('L32', 10), src: 'pop'}, {at: B.s('L33'), src: 'whoosh'}, {at: B.s('L34'), src: 'pop'}, {at: B.s('L35'), src: 'whoosh'},
      {at: B.w('L35', 16), src: 'pop'}, {at: B.s('L36'), src: 'whoosh'}, {at: B.w('L36', 9), src: 'pop'}, {at: B.s('L45'), src: 'riser', vol: 0.25}, {at: B.s('L46'), src: 'hit', vol: 0.35}]}
    band={(f) => {
      const n = f >= B.s('L36') - 3 ? 4 : f >= B.s('L35') - 3 ? 3 : f >= B.s('L33') - 3 ? 2 : 1;
      if (f >= B.s('L35') - 3 && f < B.s('L36') - 3) return (
        <div style={{display: 'flex', alignItems: 'center', gap: 22, width: '100%'}}>
          <div style={{fontFamily: DISPLAY, fontSize: 150, color: GOLD, lineHeight: 1}}><Count f={f} a={B.w('L35', 7)} b={B.w('L35', 10)} to={24} /></div>
          <div>{H('LAMINE YAMAL · GOALS', 58)}{f >= B.w('L35', 16) && <div style={{transform: `scale(${popIn(f, B.w('L35', 16))})`, transformOrigin: 'left', marginTop: 8}}><Chip size={40}>LA LIGA PLAYER OF THE SEASON</Chip></div>}</div>
        </div>
      );
      if (f < B.s('L37') - 3) return (
        <div style={{display: 'flex', alignItems: 'center', gap: 26, width: '100%'}}>
          <div style={{fontFamily: DISPLAY, fontSize: 130, color: GOLD, lineHeight: 1, transform: `scale(${popIn(f, [0, B.s('L33'), B.s('L35'), B.s('L36')][n - 1] - 3)})`}}>{n}/4</div>
          <div>{H('THE 2025–26 SEASON', 70)}<S>IN FOUR NUMBERS</S></div>
        </div>
      );
      if (f < B.s('L45') - 3) return (
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 14}}>
          {['RAPHINHA', 'FERRAN TORRES', 'FERMÍN LÓPEZ'].map((t, k) => <span key={t} style={{transform: `scale(${popIn(f, B.w('L37', [0, 1, 3][k]))})`}}><Chip bg={[GOLD, '#fff', BLAU][k]} color={k === 2 ? '#fff' : '#000'} size={56}>{t}</Chip></span>)}
        </div>
      );
      if (f < B.s('L46') - 3) return <div style={{opacity: fadeIn(f, B.s('L45') - 3)}}>{H('CAN THE NEW BARÇA', 76)}{H('GO ALL THE WAY IN EUROPE?', 76, GOLD)}</div>;
      return <div style={{transform: `scale(${popIn(f, B.s('L46') - 3)})`, transformOrigin: 'left'}}>{H('YES OR NO?', 110, GOLD)}<S color="#fff">TELL ME IN THE COMMENTS ↓</S></div>;
    }}
    graph={(f) => {
      if (f < B.s('L33') - 3) return <>
        <Bars f={f} at={B.w('L32', 6)} rows={[{n: 'BARÇA', v: 94, c: GOLD}, {n: 'REAL MADRID', v: 86, c: '#e9ecf3'}]} max={94} unit="PTS" />
        {f >= B.w('L32', 10) && <div style={{position: 'absolute', left: 50, top: 720, transform: `scale(${popIn(f, B.w('L32', 10))})`, transformOrigin: 'left'}}><Chip size={84}>+8 POINTS</Chip></div>}
      </>;
      if (f < B.s('L35') - 3) {
        const n = Math.round(ramp(f, B.w('L33', 5), B.s('L34') + 18, 0, 19, (x) => x));
        return (
          <div style={{padding: '150px 50px 0'}}>
            <S color={GOLD} size={34}>HOME LEAGUE GAMES</S>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginTop: 20}}>
              {Array.from({length: 19}).map((_, k) => <div key={k} style={{height: 110, borderRadius: 14, background: k < n ? GREEN : '#ffffff10', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 60, color: '#04140c'}}>{k < n ? 'W' : ''}</div>)}
            </div>
            {f >= B.s('L34') && <div style={{marginTop: 26, transform: `scale(${popIn(f, B.s('L34'))})`, transformOrigin: 'left'}}>{H('19 OUT OF 19', 120, GOLD)}</div>}
          </div>
        );
      }
      if (f >= B.s('L36') - 3 && f < B.s('L37') - 3) return <>
        <Bars f={f} at={B.w('L36', 3)} rows={[{n: 'BARÇA', v: 95, c: GOLD}, {n: 'REAL MADRID', v: 77, c: '#e9ecf3'}, {n: 'VILLARREAL', v: 72, c: '#ffd34d'}]} max={95} unit="GOALS" />
        {f >= B.w('L36', 9) && <div style={{position: 'absolute', left: 50, top: 860, transform: `scale(${popIn(f, B.w('L36', 9))})`, transformOrigin: 'left'}}><Chip size={70}>MOST IN SPAIN</Chip></div>}
      </>;
      return null;
    }}
  />
);
