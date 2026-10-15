import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate} from 'remotion';
import {C, DISPLAY, CHALK, BODY, Chalkboard, ChalkDefs, Grain, Pop, Narration, clamp, kf} from './lib';
import {Board, PitchLines, Token, ChalkArrow, OffsideLine, Zone, lerp} from './board';
import txDur from '../public/audio/tx/durations.json';

// Illustrative scenario (not a real match): Barça defend the left goal (x=0).
// Timeline is driven by the narration (tools/tts/tx-hook.json → public/audio/tx).
const BACK = [12, 26, 42, 56];
const MID = [20, 34, 48];
const B_START = 280; // scenario B (one defender doesn't step) replays the play
const WG = 470; // "weapon / gamble"
const END = 548; // end card
export const HOOK_FRAMES = 670;

const LINES = [
  {id: 'tx-01', from: 15, text: 'Watch the back four. Not the ball.'},
  {id: 'tx-02', from: 108, text: 'He looks up. They step up.'},
  {id: 'tx-03', from: 180, text: 'One step, and the striker is offside.'},
  {id: 'tx-04', from: B_START + 40, text: 'But if one man hesitates, the whole line is open.'},
  {id: 'tx-05', from: WG + 2, text: 'A weapon. And a gamble.'},
  {id: 'tx-06', from: END + 4, text: 'These are the tactics behind the Clásico.'},
];

const Scene: React.FC<{f: number; laggard?: number}> = ({f, laggard}) => {
  const lineX = (i: number) => (i === laggard ? 44 : kf(f, [[120, 44], [150, 47.5]]));
  const strikerX = kf(f, [[24, 46.5], [90, 45.8], [160, 45.8], [235, 30]]);
  const strikerY = kf(f, [[160, 36], [235, 38]]);
  const passP = lerp(f, 150, 205, 0, 1);
  const ballX = kf(f, [[150, 64], [205, 26]]);
  const ballY = kf(f, [[150, 30], [205, 38]]);
  const lift = f > 90 && f < 135 ? 0.6 + 0.4 * Math.sin(f / 3) : 0;
  const offside = laggard === undefined;
  const frozen = f >= 205;
  return (
    <>
      <PitchLines />
      {!offside && <Zone x={0} y={0} w={44} h={68} color={C.grana} opacity={lerp(f, 150, 200, 0, 0.22)} />}
      <OffsideLine x={offside ? 47.5 : 44} opacity={frozen ? 0.55 + 0.45 * Math.abs(Math.sin(f / 4)) : 0} color={offside ? C.gold : C.red} />
      {BACK.map((y, i) => (i === laggard ? null : <ChalkArrow key={y} from={[44, y + 4.2]} to={[47.6, y + 4.2]} progress={lerp(f, 118, 150, 0, 1)} color={C.gold} />))}
      {BACK.map((y, i) => <Token key={`b${y}`} x={lineX(i)} y={y} side="barca" label={['2', '4', '5', '3'][i]} highlight={i === laggard && f > 150 ? C.red : undefined} />)}
      {MID.map((y) => <Token key={`m${y}`} x={58} y={y} side="barca" />)}
      <Token x={18} y={34} side="barca" label="1" />
      <Token x={64} y={30} side="opp" label="8" highlight={lift ? `rgba(242,194,48,${lift})` : undefined} />
      <Token x={48.5} y={19} side="opp" label="11" />
      <Token x={60} y={50} side="opp" label="10" />
      {frozen && <Token x={45.8} y={36} side="opp" opacity={0.35} />}
      <Token x={strikerX} y={strikerY} side="opp" label="9" highlight={frozen ? (offside ? C.red : C.gold) : undefined} />
      <ChalkArrow from={[64, 30]} to={[26, 38]} progress={passP} dashed curve={-160} />
      {passP > 0 && passP < 1 && <circle cx={ballX * 15} cy={ballY * 15 - Math.sin(passP * Math.PI) * 90} r={9} fill="#fff" />}
    </>
  );
};

export const TacticsHook: React.FC = () => {
  const frame = useCurrentFrame();
  const inA = frame < B_START;
  // scenario A is retimed so the narration lands on the step (play frame 120–150) and the freeze (205)
  const fA = interpolate(frame, [0, 108, 180, B_START], [0, 100, 205, 240], clamp);
  const f = inA ? fA : frame - B_START + 24;
  const zoom = inA ? kf(frame, [[0, 1.1], [30, 1.28], [200, 1.4], [B_START, 1.4]]) : kf(frame, [[B_START, 1.28], [WG, 1.4]]);
  const rewind = interpolate(frame, [B_START - 10, B_START, B_START + 22], [0, 1, 0], clamp);
  return (
    <AbsoluteFill>
      <ChalkDefs />
      <Chalkboard />
      <Board zoom={zoom} focusX={kf(frame, [[0, 50], [200, 44], [B_START, 44]])}>
        <Scene f={Math.min(f, 240)} laggard={inA ? undefined : 2} />
      </Board>
      <div style={{position: 'absolute', top: 40, left: 60, fontFamily: CHALK, fontSize: 38, color: C.chalkDim}}>FLICK'S BARÇA · THE HIGH LINE</div>
      <div style={{position: 'absolute', top: 44, right: 60, fontFamily: BODY, fontWeight: 700, fontSize: 22, color: C.chalkDim, letterSpacing: 2}}>ILLUSTRATION</div>
      <Sequence from={200} durationInFrames={B_START - 210}>
        <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 110}}>
          <Pop><div style={{fontFamily: DISPLAY, fontSize: 190, color: C.gold, textShadow: '0 10px 40px rgba(0,0,0,.7)', letterSpacing: 4}}>ONE STEP.</div></Pop>
        </AbsoluteFill>
      </Sequence>
      <AbsoluteFill style={{background: '#fff', opacity: rewind * 0.5}} />
      <Sequence from={B_START - 8} durationInFrames={40}>
        <div style={{position: 'absolute', top: 120, left: 60, fontFamily: DISPLAY, fontSize: 64, color: '#fff', opacity: 0.9}}>◀◀ REWIND</div>
      </Sequence>
      <Sequence from={B_START + 30} durationInFrames={WG - B_START - 30}>
        <div style={{position: 'absolute', top: 120, left: 60}}>
          <Pop><div style={{fontFamily: DISPLAY, fontSize: 64, color: C.red}}>NOW: ONE MAN DOESN'T STEP</div></Pop>
        </div>
      </Sequence>
      <Sequence from={WG} durationInFrames={END - WG}>
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 10, flexDirection: 'row', background: 'rgba(10,14,12,.55)'}}>
          <Pop><div style={{fontFamily: DISPLAY, fontSize: 170, color: C.blau, WebkitTextStroke: '3px #fff'}}>WEAPON.</div></Pop>
          <Pop delay={30}><div style={{fontFamily: DISPLAY, fontSize: 170, color: C.grana, WebkitTextStroke: '3px #fff', marginLeft: 40}}>GAMBLE.</div></Pop>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={END}>
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', background: C.slate}}>
          <Pop><div style={{fontFamily: DISPLAY, fontSize: 96, color: C.chalk, textAlign: 'center', lineHeight: 1.1}}>THE TACTICS BEHIND<br /><span style={{color: C.gold}}>THE CLÁSICO</span></div></Pop>
        </AbsoluteFill>
      </Sequence>
      <Narration dir="tx" lines={LINES} durations={txDur as Record<string, number>} />
      <Grain opacity={0.07} />
    </AbsoluteFill>
  );
};
