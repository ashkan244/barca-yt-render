import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BODY, C, DISPLAY} from './theme';
import {Center, DarkBg, Kicker, SceneProps, clamp, useDrift, useIn} from './kit';

const Panel: React.FC<{children: React.ReactNode; width?: number; delay?: number; style?: React.CSSProperties}> = ({children, width = 820, delay = 4, style}) => {
  const p = useIn(delay, 18);
  return <div style={{
    width, boxSizing: 'border-box', padding: '30px 34px', borderRadius: 24,
    background: 'rgba(255,255,255,0.065)', border: '2px solid rgba(255,255,255,0.13)',
    boxShadow: '0 24px 60px rgba(0,0,0,0.24)', opacity: p,
    transform: `translateY(${(1-p)*38}px)`, ...style,
  }}>{children}</div>;
};

const Large: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 180, color = C.gold, style}) => (
  <div style={{fontFamily: DISPLAY, fontSize: size, lineHeight: 0.92, letterSpacing: 2, color, textAlign: 'center', ...style}}>{children}</div>
);

const Small: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 35, color = 'rgba(255,255,255,0.78)', style}) => (
  <div style={{fontFamily: BODY, fontSize: size, fontWeight: 800, lineHeight: 1.2, letterSpacing: 2, color, textAlign: 'center', ...style}}>{children}</div>
);

export const FlickCentury: React.FC<SceneProps> = ({frames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame-6, fps, config: {damping: 14, stiffness: 95}});
  const count = Math.round(interpolate(frame, [4, Math.min(frames-4, 38)], [0, 100], clamp));
  const drift = useDrift(frames, 1.045);
  return <AbsoluteFill>
    <DarkBg glow="#302a16"/>
    <div style={{position:'absolute', inset:0, opacity:.2, transform:`scale(${drift})`}}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1920">
        <circle cx="540" cy="810" r="420" fill="none" stroke={C.gold} strokeWidth="2" strokeDasharray="3 18"/>
        <circle cx="540" cy="810" r="340" fill="none" stroke={C.garnet} strokeWidth="18" strokeDasharray="30 14" transform="rotate(-90 540 810)"/>
      </svg>
    </div>
    <Kicker text="HANSI FLICK · BARÇA" y={255}/>
    <Center y={800}>
      <div style={{transform:`scale(${.78+.22*p})`,opacity:p}}>
        <Large size={390}>{count}</Large>
        <Small size={46} style={{marginTop:18, letterSpacing:9}}>WINS</Small>
      </div>
    </Center>
    <Center y={1180}><Panel width={700} delay={18}><Small>THE FIRST CENTURY</Small></Panel></Center>
  </AbsoluteFill>;
};

export const FlickPace: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <DarkBg glow="#152949"/>
    <Kicker text="THE ROAD TO 100" y={250}/>
    <Center y={620}><Panel width={810}><Small>FLICK</Small><Large size={155}>131</Large><Small>GAMES TO 100 WINS</Small></Panel></Center>
    <div style={{position:'absolute',top:880,left:140,right:140,height:3,background:'rgba(255,255,255,.18)'}}>
      <div style={{position:'absolute',left:'50%',top:-12,width:28,height:28,borderRadius:20,background:C.gold,boxShadow:`0 0 30px ${C.gold}`}}/>
    </div>
    <Center y={1120}><Panel width={810} delay={12} style={{borderColor:'rgba(242,194,48,.42)'}}>
      <Small color={C.gold}>ONLY LUIS ENRIQUE WAS FASTER</Small>
      <Large size={110} style={{marginTop:16}}>126 GAMES</Large>
    </Panel></Center>
  </AbsoluteFill>
);

export const FlickScore: React.FC<SceneProps> = () => {
  const frame=useCurrentFrame();
  const p=spring({frame:frame-5,fps:30,config:{damping:12,stiffness:100}});
  return <AbsoluteFill>
    <DarkBg glow="#351321"/>
    <Kicker text="THE CENTURY MATCH" y={250}/>
    <Center y={760}><div style={{transform:`scale(${.82+.18*p})`,opacity:p}}>
      <Small size={39}>BARÇA <span style={{color:C.gold}}>·</span> ALAVÉS</Small>
      <div style={{display:'flex',alignItems:'center',gap:34,marginTop:28}}>
        <Large size={270}>6</Large><Large size={110} color="rgba(255,255,255,.55)">—</Large><Large size={270} color="#fff">1</Large>
      </div>
      <Small style={{marginTop:26}}>31 OCTOBER 2026</Small>
    </div></Center>
    <Center y={1160}><div style={{display:'flex',gap:13}}>{Array.from({length:6},(_,i)=><div key={i} style={{width:56,height:18,borderRadius:12,background:i<4?C.gold:C.garnet,opacity:.9}}/>)}</div></Center>
  </AbsoluteFill>;
};

export const FlickResponse: React.FC<SceneProps> = ({frames}) => {
  const frame=useCurrentFrame();
  const p=interpolate(frame,[0,frames*.55],[0,1],{...clamp,easing:Easing.out(Easing.cubic)});
  return <AbsoluteFill>
    <DarkBg glow="#22202a"/>
    <Kicker text="THE RESPONSE" y={250}/>
    <Center y={610}><Panel width={820} style={{display:'flex',justifyContent:'space-between',alignItems:'center',borderColor:'rgba(230,64,84,.35)'}}>
      <Small color="rgba(255,255,255,.58)">PSG</Small><Small color="#ed5969">DEFEAT</Small>
    </Panel></Center>
    <Center y={775}><Panel width={820} delay={10} style={{display:'flex',justifyContent:'space-between',alignItems:'center',borderColor:'rgba(230,64,84,.35)'}}>
      <Small color="rgba(255,255,255,.58)">REAL MADRID</Small><Small color="#ed5969">DEFEAT</Small>
    </Panel></Center>
    <div style={{position:'absolute',top:980,left:130,right:130,height:2,background:`linear-gradient(90deg,transparent ${100-p*100}%, ${C.gold} 100%)`}}/>
    <Center y={1160}><Large size={120} color={C.gold}>BACK TO WINNING</Large></Center>
  </AbsoluteFill>;
};

export const FlickGoals: React.FC<SceneProps> = ({frames}) => {
  const frame=useCurrentFrame();
  const p=interpolate(frame,[4,Math.max(5,frames-3)],[0,1],clamp);
  return <AbsoluteFill>
    <DarkBg glow="#182948"/>
    <Kicker text="SIX GOALS · ONE MATCH" y={250}/>
    <Center y={620}><Panel width={820}><Small>BEFORE HALF-TIME</Small><div style={{display:'flex',justifyContent:'center',gap:18,marginTop:34}}>
      {Array.from({length:4},(_,i)=><div key={i} style={{width:92,height:120,borderRadius:16,background:i<p*4?C.gold:'rgba(255,255,255,.1)',transform:`translateY(${(1-p)*26}px)`}}/>)}
    </div><Small size={28} style={{marginTop:22}}>4</Small></Panel></Center>
    <Center y={1030}><Panel width={820} delay={13}><Small>AFTER THE BREAK</Small><div style={{display:'flex',justifyContent:'center',gap:18,marginTop:30}}>
      {Array.from({length:2},(_,i)=><div key={i} style={{width:92,height:100,borderRadius:16,background:i<Math.max(0,(p-.35)*4)?C.garnet:'rgba(255,255,255,.1)'}}/>)}
    </div><Small size={28} style={{marginTop:20}}>2</Small></Panel></Center>
  </AbsoluteFill>;
};

export const FlickMove: React.FC<SceneProps> = ({frames}) => {
  const frame=useCurrentFrame();
  const p=useIn(4);
  const active=Math.min(15,Math.max(0,Math.floor((frame-5)/2)));
  return <AbsoluteFill>
    <DarkBg glow="#13263f"/>
    <Kicker text="THE OPENER" y={250}/>
    <Center y={655}><Large size={190}>15</Large></Center>
    <Center y={825}><Small size={34} color={C.gold}>PASSES IN THE TEAM MOVE</Small></Center>
    <div style={{position:'absolute',left:100,right:100,top:970,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      {Array.from({length:15},(_,i)=><div key={i} style={{width:26,height:26,borderRadius:20,background:i<active?C.gold:'rgba(255,255,255,.15)',boxShadow:i===active-1?`0 0 25px ${C.gold}`:'none'}}/>)}
    </div>
    <Center y={1140}><Panel width={720} delay={14}><Large size={92} color="#fff">9 PLAYERS</Large><Small size={27} style={{marginTop:13}}>INVOLVED IN THE MOVE</Small></Panel></Center>
  </AbsoluteFill>;
};

export const FlickFermin: React.FC<SceneProps> = () => {
  const p=useIn(6);
  return <AbsoluteFill>
    <DarkBg glow="#351321"/>
    <Kicker text="A NIGHT OF OUTPUT" y={250}/>
    <Center y={720}><div style={{opacity:p,transform:`scale(${.86+.14*p})`}}>
      <Small size={43} color="#fff">FERMÍN LÓPEZ</Small>
      <div style={{display:'flex',gap:20,marginTop:38}}>
        <Panel width={310} delay={10}><Large size={130}>1</Large><Small size={25}>GOAL</Small></Panel>
        <Panel width={310} delay={16}><Large size={130} color="#fff">2</Large><Small size={25}>ASSISTS</Small></Panel>
      </div>
    </div></Center>
    <Center y={1110}><Small size={29} color={C.gold}>ONE GOAL · TWO ASSISTS</Small></Center>
  </AbsoluteFill>;
};

export const FlickDebut: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <DarkBg glow="#202638"/>
    <Kicker text="A NEW FIRST-TEAM DEBUT" y={250}/>
    <Center y={650}><Panel width={820}><Small color={C.gold}>BRIAN FARIÑAS</Small><Large size={90} color="#fff" style={{marginTop:18}}>RIGHT-BACK</Large><Small size={29} style={{marginTop:14}}>MADE HIS FIRST APPEARANCE</Small></Panel></Center>
    <Center y={1035}><div style={{display:'flex',gap:20}}>
      <Panel width={340}><Large size={106}>6</Large><Small size={24}>UNAVAILABLE</Small></Panel>
      <Panel width={340}><Large size={106} color="#fff">4</Large><Small size={24}>DEFENDERS</Small></Panel>
    </div></Center>
  </AbsoluteFill>
);

export const FlickRate: React.FC<SceneProps> = ({frames}) => {
  const frame=useCurrentFrame();
  const n=interpolate(frame,[5,Math.min(frames-3,40)],[0,76.33],clamp);
  const drift=useDrift(frames,1.035);
  return <AbsoluteFill>
    <DarkBg glow="#2b2414"/>
    <Kicker text="THE RECORD" y={250}/>
    <Center y={760}><div style={{transform:`scale(${drift})`}}>
      <Large size={205}>{n.toFixed(2)}%</Large>
      <Small size={31} color="#fff" style={{marginTop:25}}>WIN RATE AS BARÇA MANAGER</Small>
    </div></Center>
    <Center y={1110}><Panel width={780} delay={12}><Small color={C.gold}>HIGHEST IN CLUB HISTORY</Small></Panel></Center>
  </AbsoluteFill>;
};

export const FlickOutro: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <DarkBg glow="#292315"/>
    <Kicker text="HANSI FLICK · BARÇA" y={340}/>
    <Center y={790}><Large size={290}>100</Large></Center>
    <Center y={1030}><Small size={42} color="#fff">WINS FROM 131 GAMES</Small></Center>
    <Center y={1210}><Panel width={720}><Small color={C.gold}>WHAT COMES NEXT?</Small></Panel></Center>
  </AbsoluteFill>
);

export const FLICK_VISUALS: Record<string, React.FC<SceneProps>> = {
  'f-century': FlickCentury,
  'f-pace': FlickPace,
  'f-score': FlickScore,
  'f-response': FlickResponse,
  'f-goals': FlickGoals,
  'f-move': FlickMove,
  'f-fermin': FlickFermin,
  'f-debut': FlickDebut,
  'f-rate': FlickRate,
  'f-outro': FlickOutro,
};
