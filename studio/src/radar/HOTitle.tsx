// HO-TX · "Barça Found PSG's Weakness… Then Threw It Away" — Barça Radar tactical breakdown, presenter: morti.
// Match facts (NBC Sports live blog, Sempre Barça, Al Jazeera/AFP, 20–21 Oct 2026): PSG 4–2 Barça, UCL league phase,
// Tue 20 Oct 2026, Parc des Princes. Goals: Doué 38', Xavi Espart 55' (Fermín one-two, drove into the box), Lucas
// Hernández 72' (header from a corner), Yamal 79' (ran past Zaire-Emery), Vitinha 81' (from outside the box), Fabián Ruiz
// 86' (Hakimi in behind Barça's left side, square ball). Olmo started, off injured 26'. Barça had won 11 in a row.
// Full game: shots on target 14–5, Joan García 10 saves, xG 3.74–2.25 (Sempre Barça). The presenter's xGOT figures
// (4.7 / 1.2), Fermín's chip and Raphinha's near-miss are not in those reports → captions only / ILLUSTRATION boards.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {DISPLAY, BODY} from '../lib';
import {Mark} from '../Branding';
import edit from './HO.edit.json';
import {RadarShell, RadarBg, Edit, Mode, makeT, FPS, END_SECS, Chip, Card, In, Count, Ball, Sting, ramp, fadeIn, popIn,
  NAVY, GOLD, GRANA, BLAU, RED, GREEN} from './RadarStory';
import {Board, Tok} from './Tactics';

const POLL_SECS = 9;
const raw = edit as Edit;
const ed: Edit = {...raw, duration: raw.duration + POLL_SECS}; // presenter goes off; the recorded take has no outro question
const T = makeT(ed);
export const HO_FRAMES = Math.round(ed.duration * FPS) + END_SECS * FPS;
const POLL = Math.round(raw.duration * FPS);

const sched: {at: number; mode: Mode}[] = [
  {at: 0, mode: 'full'}, {at: T.s('L04') - 4, mode: 'split'},
  {at: T.s('L08') - 2, mode: 'off'}, {at: T.s('L08') + 40, mode: 'pip'}, {at: T.s('L10') - 4, mode: 'split'}, {at: T.s('L12') - 4, mode: 'pip'},
  {at: T.s('L15') - 4, mode: 'split'},
  {at: T.s('L16') - 2, mode: 'off'}, {at: T.s('L16') + 40, mode: 'split'}, {at: T.s('L17') - 4, mode: 'pip'},
  {at: T.s('L23') - 4, mode: 'split'}, {at: T.s('L29') - 4, mode: 'full'},
  {at: T.s('L33') - 2, mode: 'off'}, {at: T.s('L33') + 40, mode: 'pip'},
  {at: T.s('L39') - 4, mode: 'split'}, {at: T.s('L40') - 4, mode: 'pip'}, {at: T.s('L43') - 4, mode: 'split'}, {at: T.s('L44') - 4, mode: 'pip'},
  {at: T.s('L45') - 4, mode: 'split'}, {at: T.s('L46') - 4, mode: 'pip'}, {at: T.s('L49') - 4, mode: 'full'}, {at: POLL - 6, mode: 'off'},
];
const sec = (f: number) => { if (f >= POLL) return 'poll'; const t = f / FPS; return ed.lines.filter((l) => l.s - 0.15 <= t).pop()?.sec ?? 'open'; };
const inLines = (f: number, a: string, b: string) => f >= T.s(a) - 6 && f < (b === 'END' ? POLL : T.s(b) - 6);
const H = (txt: string, size = 92, color = '#fff') => <div style={{fontFamily: DISPLAY, fontSize: size, color, lineHeight: 1.02}}>{txt}</div>;
const Sub = ({children, color = '#ffffffb0', size = 30}: {children: React.ReactNode; color?: string; size?: number}) =>
  <div style={{fontFamily: BODY, fontWeight: 800, fontSize: size, color, letterSpacing: 3}}>{children}</div>;
const Pop: React.FC<{f: number; at: number; children: React.ReactNode; rot?: number; style?: React.CSSProperties}> = ({f, at, children, rot = 0, style}) =>
  f >= at ? <div style={{transform: `scale(${popIn(f, at)}) rotate(${rot}deg)`, transformOrigin: 'left center', ...style}}>{children}</div> : null;

// board placements
const PIP_B = {x: 110, y: 170, w: 1180};
const SPLIT_B = {x: 730, y: 230, w: 1120};

// ---------- 1 · cold open ----------
const GOALS = [{m: 38, n: 'DOUÉ', psg: true, row: 0}, {m: 55, n: 'XAVI ESPART', psg: false, row: 0}, {m: 72, n: 'L. HERNÁNDEZ', psg: true, row: 0},
  {m: 79, n: 'LAMINE YAMAL', psg: false, row: 0}, {m: 81, n: 'VITINHA', psg: true, row: 1}, {m: 86, n: 'FABIÁN RUIZ', psg: true, row: 2}];
const Open: React.FC<{f: number}> = ({f}) => {
  if (inLines(f, 'L01', 'L04')) {
    const X = 1060;
    const n = Math.round(ramp(f, T.w('L01', 5), T.w('L01', 7) + 14, 0, 11, (x) => x));
    return (
      <div style={{position: 'absolute', left: X, top: 110, width: 800}}>
        {inLines(f, 'L01', 'L03') && <>
          <In f={f} at={T.w('L01', 2)}><Sub color={GOLD}>BEFORE PARIS</Sub></In>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 24}}>
            <span style={{fontFamily: DISPLAY, fontSize: 260, color: GOLD, lineHeight: 1}}>{n}</span>{H('WINS IN A ROW', 72)}
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', gap: 8, width: 780, marginTop: 6}}>
            {Array.from({length: 11}).map((_, k) => <div key={k} style={{height: 64, borderRadius: 10, background: k < n ? GREEN : '#ffffff12', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 40, color: '#04140c'}}>{k < n ? 'W' : ''}</div>)}
          </div>
          {f >= T.w('L02', 10) && <Pop f={f} at={T.w('L02', 10)} rot={-2} style={{marginTop: 40}}><Chip size={84}>UNSTOPPABLE</Chip></Pop>}
        </>}
        {inLines(f, 'L03', 'L04') && <div style={{transform: `scale(${popIn(f, T.w('L03', 7))})`, transformOrigin: 'left center', marginTop: 40}}>
          <Card accent={GRANA} style={{display: 'inline-block', padding: '26px 44px'}}>
            <Sub color={GOLD}>CHAMPIONS LEAGUE · TUE 20 OCT 2026</Sub>
            {H('PSG v BARÇA', 130)}<Sub>PARC DES PRINCES · PARIS</Sub>
          </Card>
        </div>}
      </div>
    );
  }
  // split: the night in six goals → 4–2
  const X = 730, at0 = T.s('L04');
  const mins = ramp(f, at0 + 4, T.w('L04', 13), 0, 90, (x) => x);
  const psg = GOALS.filter((g) => g.psg && g.m <= mins).length, bar = GOALS.filter((g) => !g.psg && g.m <= mins).length;
  return (
    <div style={{position: 'absolute', left: X, top: 120, width: 1130}}>
      <div style={{display: 'flex', alignItems: 'stretch', borderRadius: 14, overflow: 'hidden', width: 'fit-content', boxShadow: '0 20px 60px #000a'}}>
        <div style={{background: '#0b2a6b', padding: '8px 30px', fontFamily: DISPLAY, fontSize: 60, color: '#fff', borderBottom: `6px solid #e30613`}}>PSG</div>
        <div style={{background: '#fff', padding: '8px 30px', fontFamily: DISPLAY, fontSize: 60, color: NAVY}}>{psg}–{bar}</div>
        <div style={{background: `linear-gradient(135deg, ${BLAU}, ${GRANA})`, padding: '8px 30px', fontFamily: DISPLAY, fontSize: 60, color: '#fff'}}>BARÇA</div>
        <div style={{background: mins >= 90 ? GOLD : '#050914', padding: '8px 24px', fontFamily: DISPLAY, fontSize: 54, color: mins >= 90 ? '#000' : GOLD}}>{mins >= 90 ? 'FT' : `${Math.floor(mins)}′`}</div>
      </div>
      <div style={{position: 'relative', height: 330, marginTop: 30}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 200, height: 14, background: '#ffffff1c', borderRadius: 7}} />
        <div style={{position: 'absolute', left: 0, width: `${(mins / 90) * 100}%`, top: 200, height: 14, background: `linear-gradient(90deg, ${GOLD}, ${RED})`, borderRadius: 7}} />
        {GOALS.map((g, k) => g.m <= mins && (() => {
          const pop = popIn(f, at0 + 4 + ((T.w('L04', 13) - at0 - 4) * g.m) / 90);
          const top = g.psg ? 200 - 74 - g.row * 64 : 232;
          return (
            <React.Fragment key={k}>
              <div style={{position: 'absolute', left: `${(g.m / 90) * 100}%`, top: 196, width: 22, height: 22, borderRadius: 11, background: g.psg ? '#e30613' : GOLD, border: '3px solid #fff', transform: `translateX(-50%) scale(${pop})`}} />
              <div style={{position: 'absolute', left: `${(g.m / 90) * 100}%`, top, transform: `translateX(${g.m >= 84 ? -82 : -50}%) scale(${pop})`, display: 'flex', alignItems: 'baseline', gap: 8, whiteSpace: 'nowrap',
                background: '#050914d0', padding: '4px 12px', borderRadius: 10, borderBottom: `4px solid ${g.psg ? '#e30613' : GOLD}`}}>
                <span style={{fontFamily: DISPLAY, fontSize: 36, color: g.psg ? '#ff8aa0' : GOLD}}>{g.m}′</span>
                <span style={{fontFamily: BODY, fontWeight: 900, fontSize: 20, color: '#fff', letterSpacing: 1}}>{g.n}</span>
              </div>
            </React.Fragment>
          );
        })())}
      </div>
      {inLines(f, 'L04', 'L05') && f >= T.w('L04', 13) && <Pop f={f} at={T.w('L04', 13)} rot={-2} style={{marginTop: 30}}><Chip bg={RED} color="#fff" size={84}>STREAK OVER · 4–2</Chip></Pop>}
      {inLines(f, 'L05', 'L06') && <div style={{marginTop: 30}}>
        <In f={f} at={T.w('L05', 12)}><div style={{position: 'relative', display: 'inline-block'}}>{H('OUTPLAYED?', 100, '#ffffffa0')}
          {f >= T.w('L05', 18) && <div style={{position: 'absolute', left: -10, right: -10, top: '48%', height: 10, background: RED, transform: `scaleX(${ramp(f, T.w('L05', 18), T.w('L05', 18) + 8)})`, transformOrigin: 'left'}} />}</div></In>
        <Pop f={f} at={T.w('L05', 20)} rot={-2} style={{marginTop: 16}}><Chip bg={RED} color="#fff" size={84}>SELF-DESTRUCTED</Chip></Pop>
      </div>}
      {inLines(f, 'L06', 'L07') && <div style={{marginTop: 30, display: 'flex', flexDirection: 'column', gap: 22}}>
        <Pop f={f} at={T.w('L06', 3)}><Chip size={72}>FOUND THE KEY 🔑</Chip></Pop>
        <Pop f={f} at={T.w('L06', 13)}><Chip bg={RED} color="#fff" size={72}>FORGOT HOW TO WIN</Chip></Pop>
      </div>}
      {inLines(f, 'L07', 'L08') && <div style={{marginTop: 30, display: 'flex', gap: 24}}>
        <In f={f} at={T.w('L07', 5)} style={{flex: 1}}><Card accent={GOLD}><Sub color={GOLD}>OPTION A</Sub>{H("FLICK'S SYSTEM?", 70)}</Card></In>
        <In f={f} at={T.w('L07', 11)} style={{flex: 1}}><Card accent={RED}><Sub color="#ff8aa0">OPTION B</Sub>{H('PLAYERS CHOKED?', 70)}</Card></In>
      </div>}
    </div>
  );
};

// ---------- 2 · the trap ----------
const barcaBuild = (at: number): Tok[] => [
  {id: 'gk', team: 'barca', label: 'GARCÍA', k: [[at, 4, 34]]},
  {id: 'cb1', team: 'barca', k: [[at, 15, 22]]}, {id: 'cb2', team: 'barca', k: [[at, 15, 46]]},
  {id: 'fb1', team: 'barca', k: [[at, 26, 7]]}, {id: 'fb2', team: 'barca', label: 'CANCELO', k: [[at, 26, 61]]},
  {id: 'm1', team: 'barca', label: 'PEDRI', k: [[at, 30, 30]]}, {id: 'm2', team: 'barca', k: [[at, 33, 42]]},
  {id: 'a1', team: 'barca', k: [[at, 58, 12]]}, {id: 'a2', team: 'barca', k: [[at, 62, 34]]}, {id: 'a3', team: 'barca', k: [[at, 58, 56]]},
];
const psgPress = (at: number, push: number): Tok[] => {
  const k = (x0: number, y0: number, x1: number, y1: number): [number, number, number][] => [[at, x0, y0], [push, x0, y0], [push + 24, x1, y1]];
  return [
    {id: 'p9', team: 'psg', k: k(36, 28, 20, 25)}, {id: 'p10', team: 'psg', k: k(36, 40, 20, 43)},
    {id: 'p7', team: 'psg', k: k(48, 9, 30, 10)}, {id: 'p8', team: 'psg', label: 'VITINHA', k: k(46, 27, 33, 33)},
    {id: 'p6', team: 'psg', label: 'NEVES', k: k(46, 41, 36, 41)}, {id: 'p11', team: 'psg', k: k(48, 59, 30, 58)},
    {id: 'd1', team: 'psg', k: k(66, 10, 56, 12)}, {id: 'd2', team: 'psg', k: k(64, 26, 58, 27)},
    {id: 'd3', team: 'psg', k: k(64, 42, 58, 41)}, {id: 'd4', team: 'psg', label: 'HAKIMI', k: k(66, 58, 56, 56)},
  ];
};
const Trap: React.FC<{f: number}> = ({f}) => {
  if (inLines(f, 'L08', 'L10')) {
    const at = T.s('L08') + 30, push = T.w('L09', 8);
    return <Board f={f} {...PIP_B} at={at} title="LUIS ENRIQUE'S TRAP" sub="PSG OUT OF POSSESSION · 4-4-2"
      toks={[...barcaBuild(at), ...psgPress(at, push)]}
      arrows={[{from: [15, 22], to: [30, 30], at: T.w('L09', 12), color: '#ffffffaa', width: 4}, {from: [15, 46], to: [33, 42], at: T.w('L09', 13), color: '#ffffffaa', width: 4},
        {from: [26, 61], to: [33, 42], at: T.w('L09', 14), color: '#ffffffaa', width: 4},
        {from: [4, 34], to: [74, 30], at: T.w('L09', 22), color: RED, dashed: true, bend: -0.18, label: 'FORCED LONG'}]}
      marks={[{x: 22.5, y: 26, at: T.w('L09', 15), kind: 'x'}, {x: 24, y: 44, at: T.w('L09', 16), kind: 'x'}, {x: 29.5, y: 51.5, at: T.w('L09', 17), kind: 'x'}]}
      ball={[[at, 15, 22]]} />;
  }
  if (inLines(f, 'L10', 'L12')) return (
    <div style={{position: 'absolute', left: 730, top: 150, width: 1130}}>
      {H('TO BEAT THE PRESS', 96)}
      <div style={{display: 'flex', gap: 24, marginTop: 30}}>
        <In f={f} at={T.w('L10', 11)} style={{flex: 1}}><Card accent={GREEN}><Sub color={GREEN}>1</Sub>{H('BE QUICK', 84)}{f >= T.w('L11', 2) && <Pop f={f} at={T.w('L11', 2)}><Chip bg={GREEN} size={44}>✓ BARÇA WAS</Chip></Pop>}</Card></In>
        <In f={f} at={T.w('L10', 14)} style={{flex: 1}}><Card accent={RED}><Sub color="#ff8aa0">2</Sub>{H('BE SMART', 84)}{f >= T.w('L11', 6) && <Pop f={f} at={T.w('L11', 6)}><Chip bg={RED} color="#fff" size={44}>✕ THEY PANICKED</Chip></Pop>}</Card></In>
      </div>
      {f >= T.w('L11', 9) && <In f={f} at={T.w('L11', 9)} style={{marginTop: 34}}><Sub color={GOLD}>FROM THE VERY FIRST MINUTE</Sub>{H('DECISIONS THAT MADE NO SENSE', 70)}</In>}
    </div>
  );
  if (inLines(f, 'L12', 'L13')) {
    const at = T.s('L12');
    return <Board f={f} {...PIP_B} at={at} title="CANCELO · OPENING MINUTES" sub="A RUSHED BALL UNDER PRESSURE" illustration
      toks={[...barcaBuild(at).map((t) => (t.id === 'fb2' ? {...t, hi: true} : t)), ...psgPress(at, at).map((t) => ({...t, k: [t.k[2]] as typeof t.k}))]}
      arrows={[{from: [26, 61], to: [30.5, 57], at: T.w('L12', 16), color: RED, width: 7, label: 'STRAIGHT TO PSG'}]}
      zones={[{x: 16, y: 40, w: 22, h: 26, at: T.w('L12', 26), color: RED, label: 'DANGER ZONE'}]}
      ball={[[at, 26, 61], [T.w('L12', 16), 26, 61], [T.w('L12', 16) + 14, 30, 57.5]]} />;
  }
  if (inLines(f, 'L13', 'L13b')) {
    const at = T.s('L13'), t0 = T.w('L13', 14);
    return <Board f={f} {...PIP_B} at={at} title="PEDRI · TOO MANY TOUCHES" sub="BALL LOST OUTSIDE HIS OWN BOX" illustration
      toks={[{id: 'pe', team: 'barca', label: 'PEDRI', hi: true, k: [[at, 24, 32], [t0, 24, 32], [t0 + 40, 21, 34]]},
        {id: 'q1', team: 'psg', k: [[at, 34, 26], [t0 + 30, 25, 30]]}, {id: 'q2', team: 'psg', k: [[at, 34, 40], [t0 + 34, 24, 37]]},
        {id: 'cb1', team: 'barca', k: [[at, 10, 24]]}, {id: 'cb2', team: 'barca', k: [[at, 10, 44]]}, {id: 'gk', team: 'barca', label: 'GARCÍA', k: [[at, 3, 34]]}]}
      marks={[...[0, 1, 2, 3].map((k) => ({x: 26 + (k % 2), y: 30 + k * 1.5, at: t0 + k * 7, kind: 'ball' as const, until: t0 + 48, color: GOLD})), {x: 22, y: 31, at: T.w('L13', 22), kind: 'x' as const}]}
      zones={[{x: 16.5, y: 22, w: 9, h: 24, at: T.w('L13', 24), color: RED, label: 'EDGE OF THE BOX'}]} />;
  }
  if (inLines(f, 'L13b', 'L14')) return (
    <div style={{position: 'absolute', left: 140, top: 200, width: 1300}}>
      <In f={f} at={T.w('L13b', 4)}><Sub color={GOLD}>NOT JUST PSG'S PRESS</Sub></In>
      <Pop f={f} at={T.w('L13b', 12)} rot={-2} style={{marginTop: 20}}><Chip bg={RED} color="#fff" size={110}>RUSHING EVERYTHING</Chip></Pop>
      {f >= T.w('L13b', 19) && <In f={f} at={T.w('L13b', 19)} style={{marginTop: 50}}>{H('EVEN IN THE FINAL THIRD:', 76)}{H('IMPATIENT', 150, GOLD)}</In>}
    </div>
  );
  if (inLines(f, 'L14', 'L15')) {
    const at = T.s('L14');
    return <Board f={f} {...PIP_B} at={at} title="THE PASS THEY DIDN'T PLAY" sub="FINAL THIRD" illustration
      toks={[{id: 'c', team: 'barca', hi: true, k: [[at, 76, 40]]}, {id: 'ov', team: 'barca', label: 'OVERLAP', k: [[at, 70, 62], [T.w('L14', 10), 84, 62]]},
        {id: 's', team: 'barca', k: [[at, 92, 30]]},
        {id: 'x1', team: 'psg', k: [[at, 88, 26]]}, {id: 'x2', team: 'psg', k: [[at, 91, 34]]}, {id: 'x3', team: 'psg', k: [[at, 86, 37]]}, {id: 'x4', team: 'psg', k: [[at, 94, 42]]},
        {id: 'gk', team: 'psg', k: [[at, 101, 34]]}]}
      zones={[{x: 84, y: 22, w: 13, h: 24, at: T.w('L14', 16), color: RED, label: 'CROWDED', round: true}]}
      arrows={[{from: [76, 40], to: [84, 61], at: T.w('L14', 10), color: GREEN, dashed: true, label: 'THE SMART PASS'},
        {from: [76, 40], to: [90, 31], at: T.w('L14', 18), color: RED, width: 7}]}
      marks={[{x: 89, y: 32, at: T.w('L14', 21), kind: 'x'}]} ball={[[at, 76, 40]]} />;
  }
  return ( // L15 split
    <div style={{position: 'absolute', left: 730, top: 160, width: 1130}}>
      <Pop f={f} at={T.w('L15', 2)}><Chip bg={RED} color="#fff" size={80}>INTO THE TRAP</Chip></Pop>
      {f >= T.w('L15', 10) && <In f={f} at={T.w('L15', 10)} style={{marginTop: 46}}><Card accent={GREEN}><Sub color={GREEN}>BUT WHEN THEY STAYED CALM…</Sub>
        {H('THROUGH THE MIDDLE', 92)}{f >= T.w('L15', 19) && <Pop f={f} at={T.w('L15', 19)}><Chip bg={GREEN} size={56}>= DANGEROUS</Chip></Pop>}</Card></In>}
    </div>
  );
};

// ---------- 3 · the missing key ----------
const Key: React.FC<{f: number}> = ({f}) => {
  if (inLines(f, 'L16', 'L17')) return (
    <div style={{position: 'absolute', left: 730, top: 170, width: 1130}}>
      <In f={f} at={T.w('L16', 12)}><Sub color={GOLD}>PSG HAD A WEAKNESS</Sub></In>
      <Pop f={f} at={T.w('L16', 17)} style={{marginTop: 16}}>{H('BARÇA FOUND IT 🔑', 110)}</Pop>
      {f >= T.w('L16', 25) && <Pop f={f} at={T.w('L16', 25)} rot={-2} style={{marginTop: 30}}><Chip bg={RED} color="#fff" size={70}>…AND BARELY USED IT</Chip></Pop>}
    </div>
  );
  if (inLines(f, 'L17', 'L20')) {
    const at = T.s('L17'), go = T.w('L17', 18), step = T.s('L19');
    const pairs: [number, number, number, number][] = [[80, 16, 77, 17], [84, 30, 81, 30], [84, 42, 81, 41], [80, 56, 77, 55], [66, 24, 64, 25], [66, 46, 64, 45]];
    const toks: Tok[] = [
      {id: 'car', team: 'barca', label: 'CARRIER', hi: true, k: [[at, 46, 34], [go, 46, 34], [go + 70, 66, 34]]},
      ...pairs.flatMap(([bx, by, px, py], k): Tok[] => [{id: `b${k}`, team: 'barca', k: [[at, bx, by]]},
        {id: `p${k}`, team: 'psg', k: k === 1 ? [[at, px, py], [step, px, py], [step + 26, 71, 34]] : [[at, px, py]]}]),
      {id: 'gk', team: 'psg', k: [[at, 101, 34]]},
    ];
    return <Board f={f} {...PIP_B} at={at} title="MAN-TO-MAN" sub="DRIBBLE THROUGH THE MIDDLE" toks={toks}
      tethers={pairs.map((_, k) => ({a: `b${k}`, b: `p${k}`, at: T.w('L17', 4), breakAt: k === 1 ? step + 8 : undefined}))}
      bands={[{y: 24, h: 20, at: go}]}
      arrows={[{from: [46, 34], to: [66, 34], at: go, dur: 70, width: 7}]}
      zones={[{x: 82, y: 24, w: 14, h: 12, at: step + 28, color: GREEN, label: 'WIDE OPEN'}]}
      marks={[{x: 74, y: 32, at: T.w('L18', 13), kind: 'q', until: step + 20}]}
      ball={[[at, 47.5, 35], [go, 47.5, 35], [go + 70, 67.5, 35]]} />;
  }
  if (inLines(f, 'L20', 'L22')) {
    const at = T.s('L20'), yam = T.s('L21');
    return <Board f={f} {...PIP_B} at={at} title="THE CENTRAL CHANNEL" sub="WHERE PSG CRACKED"
      bands={[{y: 23, h: 22, at}]}
      toks={[{id: 'gm', team: 'barca', label: 'GERARD MARTÍN', k: [[at, 24, 30], [T.w('L20', 16), 24, 30], [T.w('L20', 16) + 50, 46, 33]], until: yam},
        {id: 'pe', team: 'barca', label: 'PEDRI', k: [[at, 34, 40], [T.w('L20', 18), 34, 40], [T.w('L20', 18) + 50, 55, 37]], until: yam},
        {id: 'ly', team: 'barca', label: 'YAMAL', hi: true, at: yam, k: [[yam, 64, 62], [T.w('L21', 22), 64, 62], [T.w('L21', 22) + 40, 76, 42], [T.w('L21', 28) + 30, 88, 36]]},
        {id: 'd1', team: 'psg', k: [[at, 70, 28]]}, {id: 'd2', team: 'psg', k: [[at, 70, 42]], until: yam}, {id: 'd3', team: 'psg', k: [[at, 82, 36], [T.w('L21', 28), 82, 36], [T.w('L21', 28) + 30, 84, 44]]},
        {id: 'd4', team: 'psg', at: yam, k: [[yam, 66, 58], [T.w('L21', 22) + 30, 70, 54]]}]}
      arrows={[{from: [24, 30], to: [46, 33], at: T.w('L20', 16), color: GOLD, until: yam}, {from: [34, 40], to: [55, 37], at: T.w('L20', 18), color: GOLD, until: yam},
        {from: [64, 62], to: [76, 42], at: T.w('L21', 22), color: GOLD, bend: 0.12, label: 'INSIDE'}, {from: [76, 42], to: [88, 36], at: T.w('L21', 28), color: GOLD, width: 8}]}
      zones={[{x: 52, y: 22, w: 30, h: 24, at: T.w('L20', 24), color: RED, label: 'PSG DISORGANIZED', until: yam}]} />;
  }
  return ( // L22 · both goals (split? pip area) — presenter is pip here
    <div style={{position: 'absolute', left: 140, top: 170, width: 1300}}>
      <In f={f} at={T.s('L22')}><Sub color={GOLD}>BOTH BARÇA GOALS</Sub></In>
      <div style={{display: 'flex', gap: 30, marginTop: 24}}>
        {[{m: "55′", n: 'XAVI ESPART', d: 'ONE-TWO WITH FERMÍN · DROVE INTO THE BOX'}, {m: "79′", n: 'LAMINE YAMAL', d: 'RAN AT THE DEFENCE · BEAT HIS MAN'}].map((g, k) => (
          <In key={k} f={f} at={T.w('L22', 8) + k * 10} style={{flex: 1}}><Card accent={GOLD}>
            <div style={{display: 'flex', alignItems: 'center', gap: 16}}><Ball size={60} />{H(g.m, 80, GOLD)}</div>
            {H(g.n, 70)}<div style={{marginTop: 8}}><Sub size={24}>{g.d}</Sub></div>
          </Card></In>
        ))}
      </div>
      {f >= T.w('L22', 16) && <Pop f={f} at={T.w('L22', 16)} rot={-2} style={{marginTop: 40}}><Chip size={76}>RUN AT THEM · THROUGH THE MIDDLE</Chip></Pop>}
    </div>
  );
};

// ---------- 4 · Flick & Olmo (split) ----------
const Flick: React.FC<{f: number}> = ({f}) => {
  const X = 730;
  if (inLines(f, 'L23', 'L25')) return (
    <div style={{position: 'absolute', left: X, top: 160, width: 1130}}>
      <In f={f} at={T.s('L23')}>{H('SO WHY NOT MORE OFTEN?', 84)}</In>
      {f >= T.w('L23', 10) && <In f={f} at={T.w('L23', 10)} style={{marginTop: 30}}><Card accent={BLAU}><Sub color={GOLD}>HANSI FLICK'S PHILOSOPHY</Sub>
        <div style={{display: 'flex', gap: 18, marginTop: 12}}>{['FAST', 'VERTICAL', 'PASS QUICKLY'].map((t, k) => <Pop key={t} f={f} at={T.w('L24', [2, 3, 9][k])}><Chip bg="#ffffff" size={52}>{t} →</Chip></Pop>)}</div>
      </Card></In>}
      {f >= T.w('L24', 15) && <Pop f={f} at={T.w('L24', 15)} rot={-2} style={{marginTop: 30}}><Chip bg={RED} color="#fff" size={70}>THE RISK: TURNOVERS</Chip></Pop>}
    </div>
  );
  if (inLines(f, 'L25', 'L26')) return (
    <div style={{position: 'absolute', left: X, top: 180, width: 1130}}>
      <In f={f} at={T.w('L25', 4)}><Card accent={GOLD}><Sub color={GOLD}>THE MISSING PROFILE</Sub>{H('FRENKIE DE JONG', 110)}
        <div style={{display: 'flex', gap: 16, marginTop: 12}}><Chip bg="#ffffff" size={46}>GLIDES · CARRIES THE BALL</Chip>{f >= T.w('L25', 8) && <Pop f={f} at={T.w('L25', 8)}><Chip bg={RED} color="#fff" size={46}>NOT FULLY FIT</Chip></Pop>}</div>
      </Card></In>
      {f >= T.w('L25', 26) && <In f={f} at={T.w('L25', 26)} style={{marginTop: 34}}>{H('A DIFFERENT GAME?', 90, GOLD)}</In>}
    </div>
  );
  const at = T.s('L26'), off = T.s('L28');
  return (
    <div style={{position: 'absolute', left: X, top: 120, width: 1130}}>
      <In f={f} at={at}><Card accent={RED} style={{display: 'flex', alignItems: 'center', gap: 26}}>
        <div style={{width: 96, height: 96, borderRadius: 18, background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 84, color: '#fff', opacity: 0.8 + 0.2 * Math.sin(f / 5)}}>+</div>
        <div>{H('DANI OLMO', 86)}<Sub color="#ff8aa0">STARTED · OFF INJURED 26′</Sub></div>
      </Card></In>
      {f >= T.s('L27') - 4 && f < off && <Board f={f} x={0} y={330} w={1000} at={T.s('L27')} sub="BETWEEN THE LINES → LONG BALLS PAST THE PRESS"
        toks={[{id: 'ol', team: 'barca', label: 'OLMO', hi: true, k: [[T.s('L27'), 58, 34], [T.w('L27', 6), 58, 34], [T.w('L27', 6) + 30, 44, 30]]},
          {id: 'cb', team: 'barca', k: [[T.s('L27'), 18, 40]]}, {id: 'w', team: 'barca', k: [[T.s('L27'), 74, 10]]},
          ...[[36, 24], [36, 44], [52, 14], [50, 30], [50, 44], [52, 58]].map(([x, y], k): Tok => ({id: `q${k}`, team: 'psg', k: [[T.s('L27'), x, y]]}))]}
        arrows={[{from: [18, 40], to: [44, 30], at: T.w('L27', 10), color: '#ffffffcc', width: 5}, {from: [44, 30], to: [76, 10], at: T.w('L27', 18), color: GOLD, bend: -0.15, width: 7, label: 'PRESS BYPASSED'}]}
        bands={[{y: 22, h: 26, at: T.w('L27', 8), color: BLAU}]} />}
      {f >= off && <Pop f={f} at={off + 8} rot={-2} style={{marginTop: 60}}><Chip bg={RED} color="#fff" size={76}>LOST: THE CREATIVE BRAIN</Chip></Pop>}
    </div>
  );
};

// ---------- 5 · the chances (presenter full, panel right) ----------
const Chances: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', left: 1060, top: 110, width: 800}}>
    {inLines(f, 'L29', 'L30') && <>
      <In f={f} at={T.w('L29', 4)}><Sub color={GOLD}>EVEN WITH ALL THE MISTAKES</Sub></In>
      <Pop f={f} at={T.w('L29', 9)} style={{marginTop: 16}}>{H('BIG CHANCES', 130)}{H('CREATED', 130, GOLD)}</Pop>
      {f >= T.w('L29', 26) && <Pop f={f} at={T.w('L29', 26)} rot={-2} style={{marginTop: 30}}><Chip bg="#ffffff" size={60}>GAME-FLIPPING MOMENTS</Chip></Pop>}
    </>}
    {inLines(f, 'L30', 'L32') && <div style={{display: 'flex', flexDirection: 'column', gap: 26}}>
      <In f={f} at={T.s('L30')}><Card accent={GOLD}><Sub color={GOLD}>ONE-ON-ONE</Sub>{H('FERMÍN LÓPEZ', 84)}
        <svg width={600} height={120} style={{display: 'block', marginTop: 6}}><circle cx={60} cy={96} r={14} fill={GRANA} stroke={BLAU} strokeWidth={4} />
          <path d="M 70 92 Q 300 -40 560 80" fill="none" stroke={GOLD} strokeWidth={5} strokeDasharray={`${ramp(f, T.w('L30', 12), T.w('L30', 12) + 18) * 600} 600`} />
          <circle cx={300} cy={96} r={14} fill="#0b2a6b" stroke="#e30613" strokeWidth={4} /><rect x={540} y={60} width={8} height={50} fill="#fff" /></svg>
        <Chip bg={RED} color="#fff" size={40}>THE CHEEKY CHIP · MISSED</Chip></Card></In>
      {f >= T.s('L31') - 4 && <In f={f} at={T.s('L31')}><Card accent={BLAU}><Sub color={GOLD}>FERMÍN'S CROSS</Sub>{H('RAPHINHA', 84)}<Chip bg="#ffffff" size={40}>INCHES AWAY</Chip></Card></In>}
    </div>}
    {inLines(f, 'L32', 'L33') && <div style={{display: 'flex', flexDirection: 'column', gap: 24, marginTop: 40}}>
      <Pop f={f} at={T.w('L32', 4)}><Chip bg={GREEN} size={80}>MOMENTUM ✓</Chip></Pop>
      <Pop f={f} at={T.w('L32', 12)}><Chip bg={RED} color="#fff" size={80}>FINISHING ✕</Chip></Pop>
    </div>}
  </div>
);

// ---------- 6 · the defence (presenter pip) ----------
const Defence: React.FC<{f: number}> = ({f}) => {
  if (inLines(f, 'L33', 'L34')) return (
    <div style={{position: 'absolute', left: 140, top: 230, width: 1300}}>
      <In f={f} at={T.w('L33', 4)}><Sub color={GOLD}>MISS AGAINST A TOP TEAM…</Sub></In>
      <Pop f={f} at={T.w('L33', 14)} rot={-2} style={{marginTop: 20}}><Chip bg={RED} color="#fff" size={130}>PUNISHED</Chip></Pop>
      {f >= T.w('L33', 20) && <In f={f} at={T.w('L33', 20)} style={{marginTop: 50}}>{H('DEFENSIVELY: AN ABSOLUTE MESS', 84)}</In>}
    </div>
  );
  if (inLines(f, 'L34', 'L36')) {
    const at = T.s('L34');
    return <Board f={f} {...PIP_B} at={at} title="THE WIDE AREAS" sub="FULL-BACKS LEFT ONE-ON-ONE" illustration
      toks={[{id: 'f1', team: 'barca', label: 'FULL-BACK', k: [[at, 16, 8]]}, {id: 'w1', team: 'psg', k: [[at, 26, 6], [T.w('L34', 20), 26, 6], [T.w('L34', 20) + 30, 12, 4]]},
        {id: 'f2', team: 'barca', label: 'FULL-BACK', k: [[at, 16, 60]]}, {id: 'w2', team: 'psg', k: [[at, 26, 62], [T.w('L34', 22), 26, 62], [T.w('L34', 22) + 30, 12, 64]]},
        {id: 'c1', team: 'barca', k: [[at, 10, 28]]}, {id: 'c2', team: 'barca', k: [[at, 10, 40]]}, {id: 'gk', team: 'barca', label: 'GARCÍA', k: [[at, 3, 34]]},
        {id: 'n1', team: 'psg', k: [[at, 22, 30]]}, {id: 'n2', team: 'psg', k: [[at, 22, 40]]}]}
      zones={[{x: 4, y: 1, w: 28, h: 13, at: T.w('L34', 14), color: RED, label: '1v1'}, {x: 4, y: 54, w: 28, h: 13, at: T.w('L34', 16), color: RED, label: '1v1'}]}
      marks={[{x: 30, y: 34, at: T.s('L35') + 10, kind: 'x'}]} />;
  }
  if (inLines(f, 'L36', 'L38')) {
    const at = T.s('L36'), run = T.w('L37', 8);
    const from: [number, number][] = [[60, 12], [62, 24], [64, 36], [60, 50], [70, 20], [72, 44], [80, 30], [82, 52], [78, 10]];
    const to: [number, number][] = [[80, 12], [80, 26], [80, 42], [80, 56], [70, 20], [70, 34], [70, 48], [62, 28], [62, 42]];
    const back = Math.round(ramp(f, run, run + 40, 0, 9, (x) => x));
    return (
      <>
        <Board f={f} {...PIP_B} at={at} title="WHEN PSG LOST THE BALL" sub="TRANSITION SPEED"
          toks={from.map(([x, y], k): Tok => ({id: `s${k}`, team: 'psg', k: [[at, x, y], [run + k * 2, x, y], [run + 36 + k * 2, to[k][0], to[k][1]]]}))
            .concat([{id: 'bb', team: 'barca', k: [[at, 50, 34]]}])} ball={[[at, 52, 34]]} />
        {f >= run && <div style={{position: 'absolute', left: 1020, top: 110, transform: `scale(${popIn(f, run)})`}}><Chip bg={GOLD} size={76}>{back} BACK</Chip></div>}
      </>
    );
  }
  const at = T.s('L38'), go = T.w('L38', 12);
  return <Board f={f} {...PIP_B} at={at} title="WHEN BARÇA LOST IT" sub="TOO SLOW TO REACT" illustration
    toks={[{id: 'hk', team: 'psg', label: 'HAKIMI', hi: true, k: [[at, 46, 60], [go, 46, 60], [go + 60, 14, 58]]},
      {id: 'r1', team: 'psg', k: [[at, 48, 30], [go, 48, 30], [go + 60, 20, 28]]}, {id: 'r2', team: 'psg', k: [[at, 50, 42], [go + 6, 50, 42], [go + 66, 18, 40]]},
      {id: 'b1', team: 'barca', k: [[at, 40, 50], [go, 40, 50], [go + 70, 34, 52]]}, {id: 'b2', team: 'barca', k: [[at, 36, 30], [go + 70, 31, 30]]},
      {id: 'cb1', team: 'barca', k: [[at, 22, 30]]}, {id: 'cb2', team: 'barca', k: [[at, 22, 42]]}]}
    arrows={[{from: [46, 60], to: [14, 58], at: go, dur: 50, color: RED, width: 8, label: 'LAUNCHING FORWARD'}]}
    marks={[{x: 22, y: 25, at: T.w('L38', 20), kind: 'q'}, {x: 22, y: 47, at: T.w('L38', 22), kind: 'q'}]} ball={[[at, 47, 61], [go, 47, 61], [go + 60, 15, 59]]} />;
};

// ---------- 7 · the errors ----------
const Errors: React.FC<{f: number}> = ({f}) => {
  if (inLines(f, 'L39', 'L40')) return (
    <div style={{position: 'absolute', left: 730, top: 200, width: 1130}}>
      <In f={f} at={T.w('L39', 4)}><Sub color={GOLD}>THE INDIVIDUAL MISTAKES</Sub></In>
      <In f={f} at={T.w('L39', 11)} style={{marginTop: 20}}><Card accent={RED}>{H('GERARD MARTÍN', 110)}<Chip bg={RED} color="#fff" size={50}>A REALLY TOUGH NIGHT</Chip></Card></In>
    </div>
  );
  if (inLines(f, 'L40', 'L41')) {
    const at = T.s('L40'), cl = T.w('L40', 7), sh = T.w('L40', 26);
    return <Board f={f} {...PIP_B} at={at} title="81′ · PSG 3–2" sub="THE CLEARANCE INTO THE MIDDLE" illustration
      toks={[{id: 'gm', team: 'barca', label: 'G. MARTÍN', hi: true, k: [[at, 9, 30]]}, {id: 'gk', team: 'barca', label: 'GARCÍA', k: [[at, 2.5, 34]]},
        {id: 'vi', team: 'psg', label: 'VITINHA', k: [[at, 30, 38], [cl + 10, 30, 38], [cl + 40, 24, 34]]}, {id: 'o1', team: 'psg', k: [[at, 14, 22]]}, {id: 'o2', team: 'barca', k: [[at, 12, 42]]}]}
      zones={[{x: 18, y: 26, w: 12, h: 16, at: cl + 16, color: RED, label: 'THE WORST PLACE', round: true}]}
      arrows={[{from: [9, 30], to: [23, 34], at: cl, color: RED, width: 7}, {from: [24, 34], to: [0, 33], at: sh, color: GOLD, width: 8, dur: 10}]}
      ball={[[at, 9.5, 30.5], [cl, 9.5, 30.5], [cl + 16, 23, 34], [sh, 23.5, 34], [sh + 10, 0, 33]]} />;
  }
  if (inLines(f, 'L41', 'L42')) {
    const at = T.s('L41'), cr = T.w('L41', 6);
    return <Board f={f} {...PIP_B} at={at} title="86′ · PSG 4–2" sub="HAKIMI'S CROSS · FABIÁN RUIZ AT THE BACK POST"
      toks={[{id: 'hk', team: 'psg', label: 'HAKIMI', hi: true, k: [[at, 22, 10], [cr - 6, 10, 8]]}, {id: 'gm', team: 'barca', label: 'G. MARTÍN', k: [[at, 14, 15], [cr, 10, 13]]},
        {id: 'ru', team: 'psg', label: 'RUIZ', k: [[at, 14, 46], [cr + 10, 5, 41]]}, {id: 'gk', team: 'barca', label: 'GARCÍA', k: [[at, 2.5, 30]]},
        {id: 'cb', team: 'barca', k: [[at, 8, 30]]}]}
      arrows={[{from: [10, 9], to: [5, 40], at: cr, color: GOLD, bend: 0.12, width: 7}]}
      marks={[{x: 9.5, y: 16, at: cr + 4, kind: 'x'}]}
      ball={[[at, 22.5, 10.5], [cr - 6, 10.5, 8.5], [cr, 10.5, 9], [cr + 18, 5, 40]]} />;
  }
  return (
    <div style={{position: 'absolute', left: 140, top: 230, width: 1300}}>
      <In f={f} at={T.s('L42')}><Sub color={GOLD}>AGAINST PSG'S QUALITY</Sub></In>
      <Pop f={f} at={T.w('L42', 7)} rot={-2} style={{marginTop: 24}}><Chip bg="#ffffff" size={90}>ONE HEAVY TOUCH</Chip></Pop>
      <Pop f={f} at={T.w('L42', 12)} rot={-2} style={{marginTop: 20}}><Chip bg={RED} color="#fff" size={90}>= A GOAL</Chip></Pop>
    </div>
  );
};

// ---------- 8 · João Neves ----------
const Neves: React.FC<{f: number}> = ({f}) => {
  if (inLines(f, 'L43', 'L44')) {
    const lvl = ramp(f, T.w('L43', 20), T.w('L43', 26), 0, 1);
    return (
      <div style={{position: 'absolute', left: 730, top: 160, width: 1130}}>
        <In f={f} at={T.w('L43', 6)}><Card accent={GOLD}><Sub color={GOLD}>MORTI'S MAN OF THE MATCH</Sub>{H('JOÃO NEVES', 120)}
          <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 14}}><Sub>INTENSITY</Sub>
            <div style={{width: 560, height: 30, borderRadius: 15, background: '#ffffff18', overflow: 'hidden'}}><div style={{width: `${lvl * 100}%`, height: '100%', background: `linear-gradient(90deg, ${GOLD}, ${RED})`}} /></div>
            {lvl > 0.95 && <Chip bg={RED} color="#fff" size={34}>OFF THE SCALE</Chip>}</div>
        </Card></In>
      </div>
    );
  }
  if (inLines(f, 'L44', 'L45')) {
    const at = T.s('L44');
    const nv: [number, number, number][] = [[at, 50, 34], [at + 30, 40, 20], [at + 60, 46, 50], [at + 90, 36, 36], [at + 120, 52, 16], [at + 150, 42, 46], [at + 190, 48, 30]];
    const ra: [number, number, number][] = [[at, 70, 34], [T.w('L44', 14), 70, 34], [T.w('L44', 14) + 40, 58, 30], [T.w('L44', 20) + 40, 64, 42], [T.w('L44', 24) + 40, 56, 36]];
    return <Board f={f} {...PIP_B} at={at} title="NEVES COVERS · PACHO HUNTS" sub="PSG'S SHAPE HOLDS" illustration
      toks={[{id: 'nv', team: 'psg', label: 'NEVES', hi: true, k: nv},
        {id: 'ra', team: 'barca', label: 'RAPHINHA (9)', k: ra}, {id: 'pa', team: 'psg', label: 'PACHO', k: ra.map(([t, x, y]): [number, number, number] => [t + 8, x + 4, y + 2])},
        ...[[78, 14], [78, 54], [74, 26], [74, 44]].map(([x, y], k): Tok => ({id: `dd${k}`, team: 'psg', k: [[at, x, y]]})),
        {id: 'gk', team: 'psg', k: [[at, 101, 34]]}]}
      tethers={[{a: 'pa', b: 'ra', at: T.w('L44', 14), color: '#ff8aa0'}]}
      zones={[{x: 34, y: 12, w: 22, h: 42, at: at + 40, color: GOLD, label: 'NEVES COVERS THE GAPS'}]} />;
  }
  return (
    <div style={{position: 'absolute', left: 730, top: 200, width: 1130}}>
      <In f={f} at={T.s('L45')}><Sub color={GOLD}>LUIS ENRIQUE'S FLEXIBILITY</Sub></In>
      <Pop f={f} at={T.w('L45', 6)} rot={-2} style={{marginTop: 24}}><Chip bg={RED} color="#fff" size={84}>FALSE 9 · NEUTRALIZED</Chip></Pop>
    </div>
  );
};

// ---------- 9 · the numbers (pip) + verdict (full) ----------
const Numbers: React.FC<{f: number}> = ({f}) => {
  if (inLines(f, 'L46', 'L49')) {
    const k = ramp(f, T.w('L46', 9), T.w('L46', 9) + 24);
    const rows = [{n: 'SHOTS ON TARGET', a: 14, b: 5, max: 14}, {n: 'xG', a: 3.74, b: 2.25, max: 4, dec: true}, {n: 'GOALS', a: 4, b: 2, max: 4}];
    return (
      <div style={{position: 'absolute', left: 120, top: 120, width: 1380}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 30}}>{H('THE FINAL NUMBERS', 76)}<Sub size={22}>SOURCE: SEMPRE BARÇA MATCH STATS</Sub></div>
        <div style={{display: 'flex', gap: 30, marginTop: 10, fontFamily: DISPLAY, fontSize: 40}}><span style={{color: '#8fb1ff'}}>■ PSG</span><span style={{color: GOLD}}>■ BARÇA</span></div>
        {rows.map((r, i) => (
          <div key={r.n} style={{marginTop: 26, opacity: fadeIn(f, T.w('L46', 9) + i * 10)}}>
            <Sub>{r.n}</Sub>
            {[{v: r.a, c: '#8fb1ff'}, {v: r.b, c: GOLD}].map((b, j) => (
              <div key={j} style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 6}}>
                <div style={{width: (b.v / r.max) * 860 * ramp(f, T.w('L46', 9) + i * 10, T.w('L46', 9) + i * 10 + 24), height: 50, background: b.c, borderRadius: 10}} />
                <span style={{fontFamily: DISPLAY, fontSize: 60, color: b.c}}>{r.dec ? (b.v * k).toFixed(2) : Math.round(b.v * k)}</span>
              </div>
            ))}
          </div>
        ))}
        {f >= T.s('L47') && <div style={{position: 'absolute', left: 1000, top: 170, transform: `scale(${popIn(f, T.s('L47'))}) rotate(3deg)`}}>
          <Card accent={GOLD} style={{width: 380}}><Sub color={GOLD}>JOAN GARCÍA</Sub>{H('10 SAVES', 92)}<Sub size={22}>FACING A FIRING SQUAD</Sub></Card></div>}
        {f >= T.w('L48', 12) && <div style={{position: 'absolute', left: 1000, top: 520, transform: `scale(${popIn(f, T.w('L48', 12))}) rotate(-2deg)`}}><Chip size={56}>STILL SCORED TWICE</Chip></div>}
      </div>
    );
  }
  return ( // L49 · verdict, presenter full
    <div style={{position: 'absolute', left: 1060, top: 140, width: 800, display: 'flex', flexDirection: 'column', gap: 24}}>
      <In f={f} at={T.s('L49')}><Sub color={GOLD}>THE VERDICT</Sub></In>
      <Pop f={f} at={T.w('L49', 6)}><Chip bg={GREEN} size={66}>ATTACK: GOOD ENOUGH ✓</Chip></Pop>
      <Pop f={f} at={T.w('L49', 16)}><Chip bg={RED} color="#fff" size={66}>DEFENSIVE MISTAKES ✕</Chip></Pop>
      <Pop f={f} at={T.w('L49', 20)}><Chip bg={RED} color="#fff" size={66}>LACK OF MATURITY ✕</Chip></Pop>
      {f >= T.w('L49', 26) && <Pop f={f} at={T.w('L49', 26)} rot={-3} style={{marginTop: 20}}>{H('GAME THROWN AWAY', 96, GOLD)}</Pop>}
    </div>
  );
};

// ---------- 10 · poll (no voice) ----------
const Poll: React.FC<{f: number}> = ({f}) => {
  const d = f - POLL;
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 110}}>
      <div style={{opacity: fadeIn(d, 0, 12)}}><Sub color={GOLD} size={34}>YOUR VERDICT · PSG 4–2 BARÇA</Sub></div>
      <div style={{transform: `scale(${popIn(d, 6)})`, marginTop: 10}}>{H('WHO GETS THE BLAME?', 130)}</div>
      <div style={{display: 'flex', gap: 40, marginTop: 50}}>
        {[{l: 'A', t: "FLICK'S HIGH-RISK TACTICS", c: GOLD}, {l: 'B', t: "THE PLAYERS' MISTAKES", c: RED}].map((o, k) => (
          <div key={o.l} style={{transform: `scale(${popIn(d, 18 + k * 8)})`}}><Card accent={o.c} style={{width: 720, display: 'flex', alignItems: 'center', gap: 30}}>
            <div style={{width: 130, height: 130, borderRadius: 24, background: o.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 110, color: k ? '#fff' : '#000'}}>{o.l}</div>
            {H(o.t, 64)}</Card></div>
        ))}
      </div>
      <div style={{marginTop: 50, opacity: fadeIn(d, 50, 12), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
        <div style={{background: '#fff', borderRadius: 26, padding: '14px 34px', fontFamily: BODY, fontWeight: 900, fontSize: 40, color: NAVY}}>COMMENT A OR B 👇</div>
        <Sub size={28}>AND DID THE BETIS GAME PLAY A PART?</Sub>
      </div>
    </AbsoluteFill>
  );
};

// ---------- end screen ----------
const End: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <RadarBg tint={GRANA} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', opacity: fadeIn(f, 0, 14)}}>{H('BARÇA RADAR', 110)}<Sub color={GOLD}>MORE TACTICAL BREAKDOWNS · WATCH NEXT</Sub></div>
      {[0, 1].map((k) => <div key={k} style={{position: 'absolute', left: 140 + k * 860, top: 330, width: 780, height: 440, borderRadius: 18, border: '3px dashed #ffffff40', background: '#ffffff08', opacity: fadeIn(f, 6 + k * 6, 14)}} />)}
      <div style={{position: 'absolute', left: 860, top: 820, transform: `scale(${popIn(f, 18)})`}}><Mark size={200} brand="radar" /></div>
    </AbsoluteFill>
  );
};

export const HORadar: React.FC = () => (
  <RadarShell ed={ed} video="host/HO/HO-edit.mp4" sched={sched}
    tint={(f) => ({open: GRANA, trap: BLAU, key: GOLD, flick: BLAU, chances: GRANA, defence: RED, errors: RED, neves: BLAU, numbers: GOLD, poll: GRANA}[sec(f)] ?? BLAU)}
    music={[{src: 'music/km/volatile-reaction.mp3', from: 0, to: T.s('L08') + 10}, {src: 'music/km/investigations.mp3', from: T.s('L08') - 10, to: T.s('L33') + 10},
      {src: 'music/km/covert-affair.mp3', from: T.s('L33') - 10, to: POLL + 10}, {src: 'music/km/inspired.mp3', from: POLL - 10, to: HO_FRAMES}]}
    sfx={[{at: T.w('L01', 5), src: 'whoosh'}, {at: T.w('L02', 10), src: 'hit', vol: 0.3}, {at: T.w('L03', 7), src: 'pop'}, {at: T.s('L04') - 4, src: 'whoosh'},
      {at: T.w('L04', 13), src: 'impact', vol: 0.4}, {at: T.w('L05', 20), src: 'hit', vol: 0.3}, {at: T.w('L06', 3), src: 'pop'}, {at: T.w('L06', 13), src: 'hit', vol: 0.25},
      {at: T.s('L08') - 2, src: 'riser', vol: 0.25}, {at: T.w('L09', 15), src: 'tick', vol: 0.3}, {at: T.w('L09', 22), src: 'whoosh', vol: 0.3},
      {at: T.w('L12', 16), src: 'hit', vol: 0.25}, {at: T.w('L13b', 12), src: 'impact', vol: 0.3}, {at: T.w('L14', 21), src: 'hit', vol: 0.25},
      {at: T.s('L16') - 2, src: 'riser', vol: 0.25}, {at: T.w('L16', 17), src: 'pop'}, {at: T.s('L19') + 8, src: 'hit', vol: 0.25}, {at: T.w('L22', 8), src: 'crowd', vol: 0.35},
      {at: T.s('L26'), src: 'impact', vol: 0.3}, {at: T.s('L29') - 4, src: 'whoosh'}, {at: T.w('L32', 12), src: 'hit', vol: 0.25},
      {at: T.s('L33') - 2, src: 'riser', vol: 0.25}, {at: T.w('L33', 14), src: 'impact', vol: 0.4}, {at: T.w('L37', 8), src: 'whoosh', vol: 0.3},
      {at: T.w('L40', 26), src: 'crowd', vol: 0.3}, {at: T.w('L41', 6) + 18, src: 'crowd', vol: 0.3}, {at: T.w('L42', 12), src: 'hit', vol: 0.3},
      {at: T.w('L43', 6), src: 'pop'}, {at: T.w('L45', 6), src: 'hit', vol: 0.25}, {at: T.s('L46') - 4, src: 'whoosh'}, {at: T.s('L47'), src: 'pop'},
      {at: T.w('L49', 26), src: 'impact', vol: 0.35}, {at: POLL + 6, src: 'riser', vol: 0.25}]}
    render={(f) => {
      const s = sec(f);
      if (s === 'open') return <Open f={f} />;
      if (s === 'trap') return <Trap f={f} />;
      if (s === 'key') return <Key f={f} />;
      if (s === 'flick') return <Flick f={f} />;
      if (s === 'chances') return <Chances f={f} />;
      if (s === 'defence') return <Defence f={f} />;
      if (s === 'errors') return <Errors f={f} />;
      if (s === 'neves') return <Neves f={f} />;
      if (s === 'numbers') return <Numbers f={f} />;
      return <Poll f={f} />;
    }}
    overlay={(f) => <>
      <Sting f={f} at={T.s('L08') - 2} num="CHAPTER 1" title="THE TRAP" />
      <Sting f={f} at={T.s('L16') - 2} num="CHAPTER 2" title="THE MISSING KEY" />
      <Sting f={f} at={T.s('L33') - 2} num="CHAPTER 3" title="THE DEFENCE" />
    </>}
    endScreen={<End />} />
);

/** YouTube thumbnail 1280×720 (rendered as a still). */
export const HOThumb: React.FC = () => {
  const {Img, staticFile} = require('remotion') as typeof import('remotion');
  return (
    <AbsoluteFill style={{background: `linear-gradient(120deg, ${NAVY} 0%, #10204e 55%, #0b2a6b 100%)`}}>
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 78% 50%, #e3061330 0%, transparent 45%)'}} />
      <div style={{position: 'absolute', left: 40, top: 60, width: 600, height: 600, borderRadius: 34, overflow: 'hidden', border: `8px solid ${GOLD}`, transform: 'rotate(-3deg)', boxShadow: '0 30px 80px #000'}}>
        <Img src={staticFile('host/HO/thumb-face.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.12)', transformOrigin: '50% 30%'}} />
      </div>
      <div style={{position: 'absolute', left: 690, top: 40, width: 560}}>
        <div style={{fontFamily: DISPLAY, fontSize: 260, color: GOLD, lineHeight: 0.9, textShadow: '0 10px 0 #0008'}}>4–2</div>
        <div style={{fontFamily: DISPLAY, fontSize: 100, color: '#fff', lineHeight: 0.95}}>THEY HAD</div>
        <div style={{fontFamily: DISPLAY, fontSize: 100, color: '#fff', lineHeight: 0.95}}>THE KEY 🔑</div>
        <div style={{marginTop: 22, display: 'inline-block', fontFamily: DISPLAY, fontSize: 52, color: '#fff', background: RED, padding: '4px 22px', borderRadius: 12, transform: 'rotate(-3deg)'}}>…AND THREW IT AWAY</div>
      </div>
      <div style={{position: 'absolute', right: 26, bottom: 22}}><Mark size={96} brand="radar" /></div>
    </AbsoluteFill>
  );
};
