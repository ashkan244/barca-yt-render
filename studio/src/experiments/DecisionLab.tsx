import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {LOCAL_FONTS} from '../production/fonts';

/** Original design study, not a reconstruction or a forecast of a real match.
 * Both branches use the same starting geometry. Only the central defender's
 * response changes. No source recording, statistics or external media are used.
 * All animation is evaluated from the current frame, including random seeks.
 */
export const DECISION_LAB_FRAMES = 480;
const C = {ink: '#101c29', paper: '#f0eee6', muted: '#aeb9c6', gold: '#edc353', blue: '#357ec4', red: '#af3153', line: '#c5cfc5'};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const progress = (f: number, start: number, end: number) => interpolate(f, [start, end], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

const Pitch: React.FC<{branch: 'step' | 'hold'; frame: number}> = ({branch, frame}) => {
  const move = progress(frame, 150, 240);
  const reveal = progress(frame, 270, 300);
  const step = branch === 'step';
  const defenderX = 520 - (step ? 155 * move : 0);
  const defenderY = 270 + (step ? 150 * move : 0);
  const actors = [
    {x: 285, y: 405, team: 'attack', carrier: true},
    {x: 770, y: 160, team: 'attack'},
    {x: 800, y: 455, team: 'attack'},
    {x: 800, y: 290, team: 'defend'},
    {x: defenderX, y: defenderY, team: 'defend', focus: true},
  ];
  return <svg viewBox="0 0 1000 600" width="100%" height="100%" role="img" aria-label={step ? 'Schematic: defender steps out and a lane opens' : 'Schematic: defender holds and screens the same lane'}>
    <rect x="0" y="0" width="1000" height="600" rx="24" fill={C.paper}/>
    <g stroke={C.line} strokeWidth="3" fill="none">
      <rect x="35" y="35" width="930" height="530" rx="8"/>
      <path d="M35 35V565 M965 150H820V450H965 M965 225H915V375H965"/>
      <path d="M115 35V565" strokeDasharray="5 12"/>
    </g>
    <text x="65" y="80" fontSize="22" fontWeight="700" letterSpacing="3" fill="#607166">ATTACK →</text>
    <rect x="450" y="140" width="190" height="210" rx="22" fill={step ? '#dfba4a' : '#59796e'} opacity={.08 + reveal * .14}/>
    <path d="M310 390L744 174" stroke={step ? '#b17910' : '#84948b'} strokeWidth="7" strokeDasharray="15 12" opacity={reveal} />
    <g opacity={reveal}>
      {step ? <path d="M721 168L754 168L741 198" fill="none" stroke="#b17910" strokeWidth="7"/> : <g stroke={C.red} strokeWidth="9"><path d="M500 285L540 325M540 285L500 325"/></g>}
    </g>
    {step && <g opacity={move * .7}><circle cx="520" cy="270" r="24" stroke="#67776c" strokeWidth="3" strokeDasharray="7 7" fill="none"/><path d={`M510 280L${defenderX + 10} ${defenderY - 10}`} stroke="#67776c" strokeWidth="3" strokeDasharray="7 7"/></g>}
    {actors.map((p, i) => <g key={i}>
      {p.focus && <circle cx={p.x} cy={p.y} r="46" fill={C.gold} opacity=".45"/>}
      <circle cx={p.x} cy={p.y + 6} r="27" fill="#182b2b22"/>
      <circle cx={p.x} cy={p.y} r="27" fill={p.team === 'attack' ? C.red : C.ink} stroke={p.team === 'attack' ? '#7a1534' : '#fff'} strokeWidth="4"/>
      {p.carrier && <circle cx={p.x + 37} cy={p.y - 5} r="10" fill="#fff" stroke={C.ink} strokeWidth="3"/>}
    </g>)}
    <g opacity={reveal}>
      <rect x="280" y="486" width="460" height="54" rx="27" fill={step ? C.gold : C.ink}/>
      <text x="510" y="522" textAnchor="middle" fontSize="30" fontWeight="800" fill={step ? C.ink : '#fff'}>{step ? 'PASSING LANE OPENS' : 'PASSING LANE SCREENED'}</text>
    </g>
  </svg>;
};

export const DecisionLab: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const portrait = height > width;
  const phase = frame < 90 ? 0 : frame < 150 ? 1 : frame < 270 ? 2 : frame < 390 ? 3 : 4;
  const stage = ['READ THE SHAPE', 'PAUSE. CHOOSE.', 'CHANGE ONE DECISION', 'COMPARE THE SPACE', 'THE TRADE-OFF'][phase];
  const takeaway = phase === 4 ? 'More pressure can mean less cover.' : phase === 3 ? 'Same start. Different passing lane.' : phase === 2 ? 'Follow the highlighted defender.' : phase === 1 ? 'Step toward the ball — or protect the lane?' : 'One defender. Two possible responses.';
  const box = portrait ? {left: 70, top: 440, width: 940, height: 610, gap: 55} : {left: 80, top: 320, width: 850, height: 590, gap: 60};
  return <AbsoluteFill style={{background: C.ink, color: C.paper, fontFamily: LOCAL_FONTS.body}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 95% 0%, #284b6150, transparent 65%)'}}/>
    <div style={{position: 'absolute', top: portrait ? 80 : 55, left: portrait ? 70 : 80, right: 80, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: portrait ? 28 : 24, letterSpacing: 3}}>
      <span>BARÇA <span style={{color: C.gold}}>RADAR</span></span><span style={{color: C.muted}}>DECISION LAB / 01</span>
    </div>
    <div style={{position: 'absolute', top: portrait ? 158 : 120, left: portrait ? 70 : 80, right: 80}}>
      <div style={{fontFamily: LOCAL_FONTS.display, fontSize: portrait ? 100 : 100, lineHeight: 1.04, letterSpacing: 1}}>ONE STEP.{portrait ? <br/> : ' '}<span style={{color: C.gold}}>TWO OUTCOMES.</span></div>
      <div style={{fontSize: 26, letterSpacing: 3, marginTop: 20, color: C.muted}}>SCHEMATIC STUDY · NOT MATCH FOOTAGE</div>
    </div>
    {(['step', 'hold'] as const).map((branch, i) => <div key={branch} style={{position: 'absolute', left: box.left + (portrait ? 0 : i * (box.width + box.gap)), top: box.top + (portrait ? i * (box.height + box.gap) : 0), width: box.width, height: box.height}}>
      <div style={{height: 65, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
        <span style={{fontFamily: LOCAL_FONTS.display, fontSize: portrait ? 45 : 40}}><span style={{color: C.gold}}>{i ? 'B' : 'A'} / </span>{i ? 'HOLD THE LANE' : 'STEP TO THE BALL'}</span>
        <span style={{fontSize: 21, color: C.muted}}>SAME START</span>
      </div>
      <div style={{height: portrait ? 564 : 510, borderRadius: 26, overflow: 'hidden', boxShadow: '0 20px 50px #0003'}}><Pitch branch={branch} frame={frame}/></div>
    </div>)}
    <div style={{position: 'absolute', left: portrait ? 70 : 80, right: 80, top: portrait ? 1770 : 945}}>
      <div style={{fontSize: portrait ? 23 : 20, letterSpacing: 3, fontWeight: 800, color: C.gold, marginBottom: 12}}>{stage}</div>
      <div style={{fontSize: portrait ? 35 : 36, fontWeight: 700, lineHeight: 1.2}}>{takeaway}</div>
    </div>
    <div style={{position: 'absolute', bottom: 25, left: 0, width: `${100 * frame / (DECISION_LAB_FRAMES - 1)}%`, height: 4, background: C.gold}}/>
  </AbsoluteFill>;
};
