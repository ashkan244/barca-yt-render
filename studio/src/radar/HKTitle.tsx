// HK-TM · "The Night Barça Won the League by Beating Real Madrid" — Barça Radar, presenter: morti.
// Facts (verified): 10 May 2026 Barça 2–0 Real Madrid (Rashford direct FK, Ferran Torres; both inside 18'), 29th league
// title, 2nd in a row, first title clinched by beating Madrid; Supercopa final 11 Jan 2026 Jeddah 3–2 (Raphinha 2), SF 5–0
// Athletic; Copa SF v Atlético 0–4 / 3–0; UCL QF out v Atlético; Yamal hamstring (Apr); 94 pts (Real Madrid 86), 19/19 home,
// 95 league goals (Real Madrid 77, Villarreal 72), Yamal 24 goals all comps + La Liga Player of the Season.
// Sources: Wikipedia 2025–26 La Liga & FC Barcelona season, 2026 Supercopa de España final; SI; Sports Mole.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {DISPLAY, BODY} from '../lib';
import {Mark} from '../Branding';
import edit from './HK.edit.json';
import {RadarShell, RadarBg, Edit, Mode, makeT, FPS, END_SECS, Chip, Card, In, Count, Ball, Trophy, Sting, ramp, fadeIn, popIn,
  NAVY, GOLD, GRANA, BLAU, RED, GREEN} from './RadarStory';

const ed = edit as Edit;
const T = makeT(ed);
export const HK_FRAMES = Math.round(ed.duration * FPS) + END_SECS * FPS;

const sched: {at: number; mode: Mode}[] = [
  {at: 0, mode: 'full'}, {at: T.s('L05') - 4, mode: 'split'}, {at: T.s('L18') - 2, mode: 'off'}, {at: T.s('L18') + 40, mode: 'pip'},
  {at: T.s('L27') - 4, mode: 'split'}, {at: T.s('L32') - 2, mode: 'off'}, {at: T.s('L32') + 40, mode: 'pip'}, {at: T.s('L38') - 4, mode: 'split'},
  {at: T.s('L41') - 4, mode: 'full'},
];
const sec = (f: number) => { const t = f / FPS; return ed.lines.filter((l) => l.s - 0.15 <= t).pop()?.sec ?? 'open'; };
const inLines = (f: number, a: string, b: string) => f >= T.s(a) - 6 && f < (b === 'END' ? 1e9 : T.s(b) - 6);
const H = (txt: string, size = 92, color = '#fff') => <div style={{fontFamily: DISPLAY, fontSize: size, color, lineHeight: 1.02}}>{txt}</div>;
const Sub = ({children, color = '#ffffffb0', size = 30}: {children: React.ReactNode; color?: string; size?: number}) =>
  <div style={{fontFamily: BODY, fontWeight: 800, fontSize: size, color, letterSpacing: 3}}>{children}</div>;

// ---------- 1 · cold open (presenter full, panel right) ----------
const Open: React.FC<{f: number}> = ({f}) => {
  const X = 1060;
  return (
    <div style={{position: 'absolute', left: X, top: 120, width: 800}}>
      {inLines(f, 'L01', 'L02') && <>
        <In f={f} at={T.w('L01', 3)}>{H('WIN THE', 120)}{H('LEAGUE', 170, GOLD)}</In>
        <In f={f} at={T.w('L01', 13)} style={{marginTop: 40}}><Sub>THE OPPONENT IN YOUR WAY</Sub>{H('REAL MADRID', 104)}</In>
      </>}
      {inLines(f, 'L02', 'L03') && <div style={{transform: `scale(${popIn(f, T.w('L02', 5))})`, transformOrigin: 'left center'}}>
        <Card accent={GRANA} style={{display: 'inline-block', padding: '26px 44px'}}>
          <Sub color={GOLD}>SUNDAY · CAMP NOU</Sub>
          {H('10 MAY', 190)}{H('2026', 120, GOLD)}
        </Card>
      </div>}
      {inLines(f, 'L03', 'L04') && <>
        <In f={f} at={T.w('L03', 3)}><Chip size={44}>FIRST TIME IN CLUB HISTORY</Chip></In>
        <In f={f} at={T.w('L03', 10)} style={{marginTop: 34}}>{H('TITLE CLINCHED', 104)}{H('BY BEATING', 104)}{H('MADRID', 150, GOLD)}</In>
      </>}
      {inLines(f, 'L04', 'L05') && <div style={{marginTop: 120}}>
        {[['THAT NIGHT', 'L04', 5], ['THE SEASON', 'L04', 9]].map(([t, l, n], k) => (
          <In key={k} f={f} at={T.w(l as string, n as number)} style={{marginBottom: 26}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 22}}><div style={{width: 26, height: 26, borderRadius: 26, background: k ? BLAU : GOLD}} />{H(t as string, 110)}</div>
          </In>
        ))}
      </div>}
    </div>
  );
};

// ---------- 2 · the road to May (split; vertical timeline) ----------
const Road: React.FC<{f: number}> = ({f}) => {
  const X = 730, Y = 110;
  const nodes = [{t: 'JAN', at: T.s('L05'), y: 0}, {t: 'SPRING', at: T.s('L09'), y: 300}, {t: 'APRIL', at: T.s('L14'), y: 560}, {t: 'MAY', at: T.s('L17'), y: 720}];
  const prog = ramp(f, T.s('L05'), T.s('L17') + 30, 0, 1, (x) => x);
  const show = (a: string, b: string) => inLines(f, a, b);
  return (
    <div style={{position: 'absolute', left: X, top: Y, width: 1130, height: 830}}>
      <div style={{position: 'absolute', left: 58, top: 30, width: 6, height: 780, background: '#ffffff18', borderRadius: 3}} />
      <div style={{position: 'absolute', left: 58, top: 30, width: 6, height: 780 * prog, background: `linear-gradient(${GOLD}, ${GRANA})`, borderRadius: 3}} />
      {nodes.map((n) => f >= n.at - 6 && (
        <div key={n.t} style={{position: 'absolute', left: 0, top: n.y + 10, width: 120, textAlign: 'center', transform: `scale(${popIn(f, n.at - 6)})`}}>
          <div style={{width: 40, height: 40, borderRadius: 40, background: GOLD, margin: '0 auto', boxShadow: `0 0 30px ${GOLD}`}} />
          <div style={{fontFamily: DISPLAY, fontSize: 30, color: GOLD, marginTop: 6}}>{n.t}</div>
        </div>
      ))}
      <div style={{position: 'absolute', left: 160, top: 0, width: 960}}>
        {show('L05', 'L09') && <>
          <In f={f} at={T.s('L05')}><Card><Sub color={GOLD}>SUPERCOPA FINAL · JEDDAH · 11 JAN 2026</Sub>
            <div style={{display: 'flex', alignItems: 'center', gap: 30, marginTop: 8}}>{H('BARÇA', 84)}{H(f >= T.w('L06', 11) ? '3–2' : '–', 110, GOLD)}{H('REAL MADRID', 84)}</div>
            {f >= T.w('L06', 13) && <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 10, transform: `scale(${popIn(f, T.w('L06', 13))})`, transformOrigin: 'left'}}><Ball /><Ball /><Chip bg="#ffffff" size={38}>RAPHINHA · 2 GOALS</Chip></div>}
          </Card></In>
          {f >= T.s('L07') - 6 && <In f={f} at={T.s('L07')} style={{marginTop: 22}}><Card accent={BLAU}><Sub>SEMI-FINAL</Sub>
            <div style={{display: 'flex', gap: 26, alignItems: 'baseline'}}>{H('BARÇA', 70)}{H(f >= T.w('L07', 8) ? '5–0' : '', 90, GOLD)}{H('ATHLETIC CLUB', 70)}</div></Card></In>}
          {f >= T.w('L08', 3) && <div style={{marginTop: 26, transform: `scale(${popIn(f, T.w('L08', 3))}) rotate(-3deg)`, transformOrigin: 'left'}}><Chip bg={GRANA} color="#fff" size={64}>A STATEMENT</Chip></div>}
        </>}
        {show('L09', 'L14') && <div style={{marginTop: 260}}>
          <In f={f} at={T.s('L10')}><Card accent={RED}><Sub color="#ff8aa0">ATLÉTICO MADRID · TWICE</Sub>
            <div style={{display: 'flex', gap: 18, marginTop: 10, flexWrap: 'wrap'}}>
              <Chip bg="#ffffff14" color="#fff" size={40} style={{opacity: fadeIn(f, T.w('L10', 7))}}>COPA DEL REY · SEMI-FINAL ✕</Chip>
              <Chip bg="#ffffff14" color="#fff" size={40} style={{opacity: fadeIn(f, T.w('L10', 16))}}>CHAMPIONS LEAGUE · QUARTER-FINAL ✕</Chip>
            </div>
          </Card></In>
          {f >= T.s('L12') - 6 && <In f={f} at={T.s('L12')} style={{marginTop: 22}}><Card accent={RED}>
            <div style={{display: 'flex', gap: 40, alignItems: 'center'}}>
              <div><Sub>1ST LEG · MADRID</Sub>{H(f >= T.w('L12', 5) ? '0–4' : '–', 96, '#ff8aa0')}</div>
              <div><Sub>2ND LEG · HOME</Sub>{H(f >= T.w('L12', 14) ? '3–0' : '–', 96, GREEN)}</div>
              {f >= T.s('L13') && <div style={{transform: `scale(${popIn(f, T.s('L13'))})`}}><Sub>AGGREGATE</Sub>{H('3–4', 96, '#fff')}</div>}
            </div>
            {f >= T.s('L13') && <div style={{marginTop: 12}}><Chip bg={RED} color="#fff" size={50}>ONE GOAL SHORT</Chip></div>}
          </Card></In>}
        </div>}
        {show('L14', 'L17') && <div style={{marginTop: 470}}>
          <In f={f} at={T.w('L15', 0)}><Card accent={RED} style={{display: 'flex', alignItems: 'center', gap: 30}}>
            <div style={{width: 110, height: 110, borderRadius: 20, background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 96, color: '#fff', opacity: 0.75 + 0.25 * Math.sin(f / 5)}}>+</div>
            <div>{H('LAMINE YAMAL', 84)}<Sub color="#ff8aa0">HAMSTRING · OUT FOR THE SEASON</Sub></div>
          </Card></In>
        </div>}
        {show('L17', 'L18') && <div style={{marginTop: 610}}>
          <In f={f} at={T.s('L17')}><Card accent={GOLD}><Sub color={GOLD}>10 MAY · CAMP NOU</Sub>
            <div style={{display: 'flex', gap: 30, alignItems: 'baseline'}}>{H('WIN = TITLE', 96)}{f >= T.w('L17', 20) && <span style={{opacity: fadeIn(f, T.w('L17', 20))}}><Chip bg="#ffffff14" color="#fff" size={40}>WITHOUT YAMAL</Chip></span>}</div>
          </Card></In>
        </div>}
      </div>
    </div>
  );
};

// ---------- 3 · eighteen minutes (graphics full, presenter pip) ----------
const Match: React.FC<{f: number}> = ({f}) => {
  const g1 = T.w('L19', 14), g2 = T.w('L21', 5);
  const score = `${(f >= g1 ? 1 : 0) + (f >= g2 ? 1 : 0)}–0`;
  const ft = f >= T.w('L25', 3);
  const PW = 1100, PH = 540, PX = 240, PY = 300;
  const fk = ramp(f, T.w('L19', 11), g1, 0, 1, (x) => x);
  const bx = 300 + fk * 700, by = 380 - Math.sin(fk * Math.PI) * 230 - fk * 150;
  const champions = f >= T.s('L26') - 4;
  return (
    <>
      {/* broadcast score bug */}
      <div style={{position: 'absolute', left: 80, top: 110, display: 'flex', alignItems: 'stretch', borderRadius: 14, overflow: 'hidden', boxShadow: '0 20px 60px #000a'}}>
        <div style={{background: `linear-gradient(135deg, ${BLAU}, ${GRANA})`, padding: '8px 30px', fontFamily: DISPLAY, fontSize: 56, color: '#fff'}}>BARÇA</div>
        <div style={{background: '#fff', padding: '8px 30px', fontFamily: DISPLAY, fontSize: 56, color: NAVY, transform: `scale(${f >= g1 && f < g1 + 12 ? popIn(f, g1) : f >= g2 && f < g2 + 12 ? popIn(f, g2) : 1})`}}>{score}</div>
        <div style={{background: '#e9ecf3', padding: '8px 30px', fontFamily: DISPLAY, fontSize: 56, color: NAVY}}>REAL MADRID</div>
        <div style={{background: ft ? GOLD : '#050914', padding: '8px 24px', fontFamily: DISPLAY, fontSize: 50, color: ft ? '#000' : GOLD}}>{ft ? 'FT' : '10 MAY 2026'}</div>
      </div>
      {!champions && f < T.s('L22') - 6 && (
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <g transform={`translate(${PX} ${PY})`}>
            <rect width={PW} height={PH} rx={18} fill="#0d3b25" opacity={0.9} />
            {Array.from({length: 8}).map((_, k) => <rect key={k} x={k * PW / 8} width={PW / 8} height={PH} fill={k % 2 ? '#0f4429' : 'transparent'} />)}
            <g stroke="#ffffffb0" strokeWidth={4} fill="none"><rect x={8} y={8} width={PW - 16} height={PH - 16} rx={10} />
              <rect x={PW - 210} y={PH / 2 - 150} width={202} height={300} /><rect x={PW - 80} y={PH / 2 - 70} width={72} height={140} />
              <line x1={PW / 2} y1={8} x2={PW / 2} y2={PH - 8} /><circle cx={PW / 2} cy={PH / 2} r={80} /></g>
            <rect x={PW - 14} y={PH / 2 - 48} width={20} height={96} fill="#fff" />
            {/* wall */}
            {f >= T.w('L19', 7) && [0, 1, 2, 3].map((k) => <circle key={k} cx={760} cy={250 + k * 34} r={15} fill="#e9ecf3" stroke={NAVY} strokeWidth={3} />)}
            {f >= T.w('L19', 7) && <path d={`M 300 380 Q 700 ${-20} ${PW - 6} ${PH / 2 - 30}`} fill="none" stroke={GOLD} strokeWidth={6} strokeDasharray="16 12" opacity={fk > 0 ? 0.9 : 0.35} />}
          </g>
          {f >= T.w('L19', 7) && <g transform={`translate(${PX + bx - 20} ${PY + by - 20})`}><circle cx={20} cy={20} r={18} fill="#fff" stroke="#111" strokeWidth={3} /></g>}
          {f >= T.w('L19', 0) && <g opacity={fadeIn(f, T.w('L19', 0))}><text x={PX} y={PY - 18} fontFamily={DISPLAY} fontSize={46} fill="#fff">MARCUS RASHFORD · DIRECT FREE-KICK</text></g>}
          {f >= T.s('L21') && <g opacity={fadeIn(f, T.s('L21'))}><text x={PX} y={PY + PH + 64} fontFamily={DISPLAY} fontSize={52} fill={GOLD}>+ FERRAN TORRES</text></g>}
        </svg>
      )}
      {!champions && f >= T.s('L22') - 6 && (
        <div style={{position: 'absolute', left: 120, top: 290, width: 1340}}>
          <Sub color={GOLD}>BOTH GOALS · INSIDE THE FIRST 18 MINUTES</Sub>
          <div style={{position: 'relative', height: 120, marginTop: 30}}>
            <div style={{position: 'absolute', left: 0, right: 0, top: 50, height: 16, background: '#ffffff20', borderRadius: 8}} />
            <div style={{position: 'absolute', left: 0, width: `${(18 / 90) * 100 * ramp(f, T.s('L22'), T.s('L22') + 18)}%`, top: 50, height: 16, background: GOLD, borderRadius: 8}} />
            {f >= T.s('L23') && <div style={{position: 'absolute', left: '20%', width: `${80 * ramp(f, T.s('L23'), T.e('L23'))}%`, top: 50, height: 16, background: `repeating-linear-gradient(90deg, ${RED}aa 0 18px, transparent 18px 30px)`, borderRadius: 8}} />}
            {[0, 1].map((k) => <div key={k} style={{position: 'absolute', left: `${4 + k * 9}%`, top: 30, transform: `scale(${popIn(f, T.s('L22') + 6 + k * 6)})`}}><Ball size={56} /></div>)}
            {['0′', '18′', '45′', '90′'].map((m, k) => <div key={m} style={{position: 'absolute', left: `${[0, 20, 50, 100][k]}%`, top: 84, transform: 'translateX(-50%)', fontFamily: DISPLAY, fontSize: 36, color: k === 1 ? GOLD : '#ffffff80'}}>{m}</div>)}
          </div>
          {f >= T.s('L23') && <In f={f} at={T.s('L23')} style={{marginTop: 70}}>{H('MADRID: MORE THAN AN HOUR', 92)}</In>}
          {f >= T.s('L24') && <div style={{marginTop: 24, transform: `scale(${popIn(f, T.s('L24'))}) rotate(-2deg)`, transformOrigin: 'left'}}><Chip bg={RED} color="#fff" size={84}>NO WAY BACK</Chip></div>}
          {ft && <div style={{marginTop: 30, transform: `scale(${popIn(f, T.w('L25', 3))})`, transformOrigin: 'left'}}>{H('FULL TIME · 2–0', 120, GOLD)}</div>}
        </div>
      )}
      {champions && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingRight: 280}}>
          {Array.from({length: 40}).map((_, k) => { const d = f - T.s('L26'); const x = 760 + Math.cos(k * 2.4) * d * (6 + (k % 5)); const y = 520 + Math.sin(k * 2.4) * d * (5 + (k % 4)) + d * d * 0.05;
            return <div key={k} style={{position: 'absolute', left: x, top: y, width: 14, height: 22, background: [GOLD, GRANA, BLAU, '#fff'][k % 4], transform: `rotate(${k * 37 + d * 9}deg)`, opacity: Math.max(0, 1 - d / 120)}} />; })}
          <div style={{transform: `scale(${popIn(f, T.s('L26'))})`}}><Trophy size={220} /></div>
          {H('CHAMPIONS OF SPAIN', 140, GOLD)}
          {f >= T.w('L26', 7) && <div style={{transform: `scale(${popIn(f, T.w('L26', 7))})`, marginTop: 16}}><Chip bg="#fff" size={60}>2ND SEASON IN A ROW</Chip></div>}
        </AbsoluteFill>
      )}
    </>
  );
};

// ---------- 4 · why it was different (split) ----------
const History: React.FC<{f: number}> = ({f}) => {
  const lit = Math.round(ramp(f, T.s('L27'), T.w('L27', 6) + 10, 0, 29, (x) => x));
  return (
    <div style={{position: 'absolute', left: 740, top: 120, width: 1120}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 26}}><Count f={f} a={T.s('L27')} b={T.w('L27', 6) + 10} to={29} style={{fontFamily: DISPLAY, fontSize: 230, color: GOLD, lineHeight: 1}} />{H('LEAGUE TITLES', 80)}</div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: 10, marginTop: 12, width: 1000}}>
        {Array.from({length: 29}).map((_, k) => <div key={k} style={{height: 50, borderRadius: 8, background: k < lit ? (k === 28 ? GOLD : '#ffffff40') : '#ffffff10', boxShadow: k === 28 && k < lit ? `0 0 26px ${GOLD}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 22, color: '#000'}}>{k === 28 && k < lit ? '2026' : ''}</div>)}
      </div>
      {f >= T.s('L28') && <In f={f} at={T.s('L28')} style={{marginTop: 40}}>{H('BUT THIS ONE FELT DIFFERENT', 76)}</In>}
      {f >= T.s('L29') && <div style={{marginTop: 26, display: 'flex', flexDirection: 'column', gap: 14}}>
        <In f={f} at={T.w('L29', 2)}><Chip bg="#ffffff14" color="#fff" size={44}>✓ WON LEAGUES AHEAD OF MADRID</Chip></In>
        <In f={f} at={T.w('L29', 8)}><Chip bg="#ffffff14" color="#fff" size={44}>✓ BEATEN THEM IN TITLE RACES</Chip></In>
      </div>}
      {f >= T.w('L30', 4) && <div style={{marginTop: 30, transform: `scale(${popIn(f, T.w('L30', 4))}) rotate(-2deg)`, transformOrigin: 'left'}}>
        <Card accent={GOLD} style={{display: 'inline-block'}}><Sub color={GOLD}>NEVER BEFORE 10 MAY 2026</Sub>{H('TITLE CLINCHED IN A CLÁSICO WIN', 64)}</Card>
      </div>}
    </div>
  );
};

// ---------- 5 · the numbers (graphics full, presenter pip) ----------
const Numbers: React.FC<{f: number}> = ({f}) => {
  const L = 110, TOP = 140;
  if (inLines(f, 'L32', 'L33')) {
    const k = ramp(f, T.w('L32', 6), T.w('L32', 9) + 12);
    return (
      <div style={{position: 'absolute', left: L, top: TOP + 40, width: 1400}}>
        <Sub color={GOLD}>LA LIGA 2025–26 · FINAL TABLE</Sub>
        {[{n: 'BARÇA', v: 94, c: GOLD}, {n: 'REAL MADRID', v: 86, c: '#e9ecf3'}].map((r, i) => (
          <div key={r.n} style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 34}}>
            <div style={{width: 330, fontFamily: DISPLAY, fontSize: 64, color: '#fff'}}>{r.n}</div>
            <div style={{width: (r.v / 94) * 820 * k, height: 92, background: r.c, borderRadius: 12}} />
            <Count f={f} a={T.w('L32', 6)} b={T.w('L32', 9) + 12} to={r.v} style={{fontFamily: DISPLAY, fontSize: 96, color: r.c}} />
            {i === 0 && <span style={{fontFamily: BODY, fontWeight: 800, fontSize: 30, color: '#ffffffa0'}}>PTS</span>}
          </div>
        ))}
        {f >= T.w('L32', 10) && <div style={{marginTop: 30, transform: `scale(${popIn(f, T.w('L32', 10))})`, transformOrigin: 'left'}}><Chip size={70}>+8 POINTS</Chip></div>}
      </div>
    );
  }
  if (inLines(f, 'L33', 'L35')) {
    const n = Math.round(ramp(f, T.w('L33', 5), T.s('L34') + 20, 0, 19, (x) => x));
    return (
      <div style={{position: 'absolute', left: L, top: TOP + 30, width: 1400}}>
        <Sub color={GOLD}>LEAGUE GAMES AT HOME</Sub>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 14, marginTop: 24, width: 1380}}>
          {Array.from({length: 19}).map((_, k) => <div key={k} style={{height: 120, borderRadius: 14, background: k < n ? GREEN : '#ffffff10', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 64, color: '#04140c', transform: `scale(${k < n ? 1 : 0.9})`}}>{k < n ? 'W' : ''}</div>)}
        </div>
        {f >= T.s('L34') && <div style={{marginTop: 30, transform: `scale(${popIn(f, T.s('L34'))})`, transformOrigin: 'left'}}>{H('19 OUT OF 19', 150, GOLD)}</div>}
      </div>
    );
  }
  if (inLines(f, 'L35', 'L36')) return (
    <div style={{position: 'absolute', left: L, top: TOP + 20, width: 1400, display: 'flex', gap: 40}}>
      <In f={f} at={T.s('L35')}><Card accent={GOLD} style={{width: 640}}>
        <Sub color={GOLD}>TEAM TOP SCORER · ALL COMPETITIONS</Sub>{H('LAMINE YAMAL', 96)}
        <div style={{display: 'flex', alignItems: 'baseline', gap: 16}}><Count f={f} a={T.w('L35', 7)} b={T.w('L35', 10)} to={24} style={{fontFamily: DISPLAY, fontSize: 220, color: GOLD, lineHeight: 1}} />{H('GOALS', 70)}</div>
      </Card></In>
      {f >= T.w('L35', 16) && <div style={{transform: `scale(${popIn(f, T.w('L35', 16))})`}}><Card accent={BLAU} style={{width: 640, textAlign: 'center'}}>
        <Trophy size={150} /><Sub color={GOLD}>LA LIGA AWARD</Sub>{H('PLAYER OF THE SEASON', 76)}
        {f >= T.w('L35', 23) && <div style={{marginTop: 14, opacity: fadeIn(f, T.w('L35', 23))}}><Sub color="#ff8aa0" size={28}>DESPITE MISSING THE FINAL WEEKS</Sub></div>}
      </Card></div>}
    </div>
  );
  if (inLines(f, 'L36', 'L37')) {
    const k = ramp(f, T.w('L36', 3), T.w('L36', 6) + 12);
    return (
      <div style={{position: 'absolute', left: L, top: TOP + 30, width: 1400}}>
        <Sub color={GOLD}>LA LIGA 2025–26 · GOALS SCORED</Sub>
        {[{n: 'BARÇA', v: 95, c: GOLD}, {n: 'REAL MADRID', v: 77, c: '#e9ecf3'}, {n: 'VILLARREAL', v: 72, c: '#ffd34d'}].map((r, i) => (
          <div key={r.n} style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 28, opacity: i === 0 ? 1 : fadeIn(f, T.w('L36', 7))}}>
            <div style={{width: 330, fontFamily: DISPLAY, fontSize: 60, color: '#fff'}}>{r.n}</div>
            <div style={{width: (r.v / 95) * 820 * (i === 0 ? k : ramp(f, T.w('L36', 7), T.w('L36', 7) + 14)), height: 84, background: r.c, opacity: i ? 0.55 : 1, borderRadius: 12}} />
            <span style={{fontFamily: DISPLAY, fontSize: 86, color: i ? '#ffffffb0' : GOLD}}>{i === 0 ? <Count f={f} a={T.w('L36', 3)} b={T.w('L36', 6) + 12} to={95} /> : r.v}</span>
          </div>
        ))}
        {f >= T.w('L36', 9) && <div style={{marginTop: 26, transform: `scale(${popIn(f, T.w('L36', 9))})`, transformOrigin: 'left'}}><Chip size={60}>MOST IN SPAIN</Chip></div>}
      </div>
    );
  }
  if (inLines(f, 'L37', 'L38')) return (
    <div style={{position: 'absolute', left: L, top: TOP + 60, width: 1400}}>
      {['RAPHINHA', 'FERRAN TORRES', 'FERMÍN LÓPEZ'].map((n, k) => (
        <In key={n} f={f} at={T.w('L37', [0, 1, 3][k])} dx={-120} style={{marginBottom: 20, marginLeft: k * 120}}><Chip bg={[GOLD, '#fff', BLAU][k]} color={k === 2 ? '#fff' : '#000'} size={96}>{n}</Chip></In>
      ))}
      {f >= T.w('L37', 6) && <div style={{marginTop: 40, display: 'flex', alignItems: 'center', gap: 20, opacity: fadeIn(f, T.w('L37', 6))}}>
        {Array.from({length: 7}).map((_, k) => <div key={k} style={{transform: `translateY(${Math.sin(f / 6 + k) * 10}px) scale(${popIn(f, T.w('L37', 6) + k * 2)})`}}><Ball size={64} /></div>)}
        {H('GOALS FROM EVERYWHERE', 80, GOLD)}
      </div>}
    </div>
  );
  return null;
};

// ---------- 6 · verdict (split) ----------
const Verdict: React.FC<{f: number}> = ({f}) => {
  const col = (title: string, items: string[], good: boolean, at: number) => (
    <In f={f} at={at} style={{flex: 1}}><Card accent={good ? GREEN : RED} style={{height: 470}}>
      {H(title, 78, good ? GREEN : '#ff8aa0')}
      {items.map((t, k) => <div key={t} style={{fontFamily: BODY, fontWeight: 800, fontSize: 46, color: '#fff', marginTop: 26, opacity: fadeIn(f, at + 8 + k * 6)}}>{good ? '✓' : '✕'} {t}</div>)}
    </Card></In>
  );
  return (
    <div style={{position: 'absolute', left: 730, top: 120, width: 1130}}>
      {H('NOT A PERFECT SEASON', 84)}
      <div style={{display: 'flex', gap: 26, marginTop: 26}}>
        {col("WHAT DIDN'T", ['Atlético, twice', 'Out of the Copa · semis', 'Out of Europe · quarters'], false, T.s('L39'))}
        {f >= T.s('L40') - 6 && col('WHAT WORKED', ['A fortress at home', 'Goals from everywhere', 'Two wins over Madrid'], true, T.s('L40'))}
      </div>
      {f >= T.w('L40', 11) && <div style={{marginTop: 22, transform: `scale(${popIn(f, T.w('L40', 11))})`, transformOrigin: 'left'}}><Chip size={60}>WHEN IT COUNTED · DELIVERED</Chip></div>}
    </div>
  );
};

// ---------- 7 · the twist (presenter full) ----------
const Twist: React.FC<{f: number}> = ({f}) => {
  const X = 1060;
  if (inLines(f, 'L41', 'L44')) return (
    <div style={{position: 'absolute', left: X, top: 120, width: 800}}>
      <div style={{transform: `scale(${popIn(f, T.s('L41'))})`, transformOrigin: 'left'}}>{H('THE TWIST', 150, GOLD)}</div>
      {f >= T.s('L42') && <In f={f} at={T.s('L42')}><Sub>TWO GOALSCORERS FROM THAT NIGHT · ALREADY GONE</Sub></In>}
      {[{n: 'RASHFORD', to: 'BACK TO ENGLAND', at: T.w('L43', 0)}, {n: 'FERRAN TORRES', to: 'SOLD TO PSG', tag: 'WORLD CUP FINAL WINNER', at: T.w('L43', 6)}].map((p, k) => f >= p.at - 4 && (
        <In key={p.n} f={f} at={p.at} style={{marginTop: 26}}><Card accent={GRANA}>
          {H(p.n, 84)}
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 6}}><span style={{fontFamily: DISPLAY, fontSize: 56, color: GOLD}}>→</span>{H(p.to, 58, '#ffffffd0')}</div>
          {p.tag && f >= T.w('L43', 11) && <div style={{marginTop: 10, opacity: fadeIn(f, T.w('L43', 11))}}><Chip bg="#ffffff" size={34}>{p.tag}</Chip></div>}
          {f >= p.at + 20 && <div style={{position: 'absolute', right: 26, top: 22, transform: `rotate(-12deg) scale(${popIn(f, p.at + 20)})`}}><Chip bg={RED} color="#fff" size={44}>GONE</Chip></div>}
        </Card></In>
      ))}
    </div>
  );
  return (
    <div style={{position: 'absolute', left: X, top: 150, width: 800}}>
      <In f={f} at={T.s('L44')}><Sub color={GOLD}>THE QUESTION FOR 2026–27</Sub></In>
      {f >= T.w('L45', 0) && <In f={f} at={T.w('L45', 0)} style={{marginTop: 18}}>{H('CAN THE NEW BARÇA', 104)}{H('GO ALL THE WAY', 104, GOLD)}{H('IN EUROPE?', 150)}</In>}
      {f >= T.s('L46') && <div style={{marginTop: 46, transform: `scale(${popIn(f, T.s('L46'))})`, transformOrigin: 'left', display: 'flex', alignItems: 'center', gap: 22}}>
        <div style={{background: '#fff', borderRadius: 26, padding: '14px 30px', fontFamily: BODY, fontWeight: 900, fontSize: 34, color: NAVY, whiteSpace: 'nowrap'}}>YES OR NO? TELL ME IN THE COMMENTS</div>
      </div>}
    </div>
  );
};

// ---------- end screen (20 s, YouTube end-screen elements go on the two frames + round logo) ----------
const End: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <RadarBg tint={GRANA} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', opacity: fadeIn(f, 0, 14)}}>{H('BARÇA RADAR', 110)}<Sub color={GOLD}>NEW EPISODE EVERY WEEK · WATCH NEXT</Sub></div>
      {[0, 1].map((k) => <div key={k} style={{position: 'absolute', left: 140 + k * 860, top: 330, width: 780, height: 440, borderRadius: 18, border: '3px dashed #ffffff40', background: '#ffffff08', opacity: fadeIn(f, 6 + k * 6, 14)}} />)}
      <div style={{position: 'absolute', left: 860, top: 820, transform: `scale(${popIn(f, 18)})`}}><Mark size={200} brand="radar" /></div>
    </AbsoluteFill>
  );
};

export const HKRadar: React.FC = () => (
  <RadarShell ed={ed} video="host/HK/HK-edit.mp4" sched={sched}
    tint={(f) => ({open: BLAU, road: BLAU, match: GRANA, history: GOLD, numbers: BLAU, verdict: GRANA, twist: GRANA}[sec(f)] ?? BLAU)}
    music={[{src: 'music/km/long-road-ahead-b.mp3', from: 0, to: T.s('L18') + 10}, {src: 'music/km/crusade.mp3', from: T.s('L18') - 10, to: T.s('L41') + 10},
      {src: 'music/km/inspired.mp3', from: T.s('L41') - 10, to: HK_FRAMES}]}
    sfx={[{at: T.w('L01', 3), src: 'whoosh'}, {at: T.w('L02', 5), src: 'hit', vol: 0.3}, {at: T.w('L03', 3), src: 'pop'}, {at: T.s('L05') - 4, src: 'whoosh'},
      {at: T.w('L06', 11), src: 'hit', vol: 0.3}, {at: T.w('L07', 8), src: 'hit', vol: 0.3}, {at: T.s('L13'), src: 'impact', vol: 0.35}, {at: T.w('L15', 0), src: 'impact', vol: 0.3},
      {at: T.s('L18') - 2, src: 'riser', vol: 0.25}, {at: T.w('L19', 14), src: 'crowd', vol: 0.45}, {at: T.w('L21', 5), src: 'crowd', vol: 0.45}, {at: T.w('L25', 3), src: 'whistle', vol: 0.35},
      {at: T.s('L26'), src: 'crowd', vol: 0.5}, {at: T.s('L27') - 4, src: 'whoosh'}, {at: T.w('L30', 4), src: 'hit', vol: 0.3}, {at: T.s('L32') - 2, src: 'riser', vol: 0.25},
      {at: T.s('L34'), src: 'pop'}, {at: T.w('L35', 16), src: 'pop'}, {at: T.w('L36', 9), src: 'pop'}, {at: T.s('L38') - 4, src: 'whoosh'}, {at: T.s('L41'), src: 'impact', vol: 0.35},
      {at: T.w('L43', 0) + 20, src: 'hit', vol: 0.25}, {at: T.w('L43', 6) + 20, src: 'hit', vol: 0.25}, {at: T.w('L45', 0), src: 'riser', vol: 0.2}]}
    render={(f) => {
      const s = sec(f);
      if (s === 'open') return <Open f={f} />;
      if (s === 'road') return <Road f={f} />;
      if (s === 'match') return <Match f={f} />;
      if (s === 'history') return <History f={f} />;
      if (s === 'numbers') return <Numbers f={f} />;
      if (s === 'verdict') return <Verdict f={f} />;
      return <Twist f={f} />;
    }}
    overlay={(f) => <>
      <Sting f={f} at={T.s('L18') - 2} num="CHAPTER 1" title="EIGHTEEN MINUTES" />
      <Sting f={f} at={T.s('L32') - 2} num="CHAPTER 2" title="THE NUMBERS" />
    </>}
    endScreen={<End />} />
);

/** YouTube thumbnail 1280×720 (rendered as a still). */
export const HKThumb: React.FC = () => {
  const {Img, staticFile} = require('remotion') as typeof import('remotion');
  return (
    <AbsoluteFill style={{background: `linear-gradient(120deg, ${NAVY} 0%, #1a1446 55%, ${GRANA} 100%)`}}>
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 78% 50%, #f2c23030 0%, transparent 45%)'}} />
      <div style={{position: 'absolute', left: 40, top: 60, width: 600, height: 600, borderRadius: 34, overflow: 'hidden', border: `8px solid ${GOLD}`, transform: 'rotate(-3deg)', boxShadow: '0 30px 80px #000'}}>
        <Img src={staticFile('host/HK/thumb-face.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.18)', transformOrigin: '50% 30%'}} />
      </div>
      <div style={{position: 'absolute', left: 690, top: 40, width: 560}}>
        <div style={{fontFamily: DISPLAY, fontSize: 280, color: GOLD, lineHeight: 0.9, textShadow: '0 10px 0 #0008'}}>2–0</div>
        <div style={{fontFamily: DISPLAY, fontSize: 104, color: '#fff', lineHeight: 0.95}}>CHAMPIONS</div>
        <div style={{fontFamily: DISPLAY, fontSize: 104, color: '#fff', lineHeight: 0.95}}>v MADRID</div>
        <div style={{marginTop: 22, display: 'inline-block', fontFamily: DISPLAY, fontSize: 52, color: '#fff', background: RED, padding: '4px 22px', borderRadius: 12, transform: 'rotate(-3deg)'}}>FIRST TIME EVER</div>
      </div>
      <div style={{position: 'absolute', right: 26, bottom: 22}}><Mark size={96} brand="radar" /></div>
    </AbsoluteFill>
  );
};
