import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate} from 'remotion';
import {C, DISPLAY, CHALK, BODY, Chalkboard, ChalkDefs, Grain, Pop, Caption, clamp, kf} from './lib';
import {Board, PitchLines, Token, ChalkArrow, OffsideLine, Zone, lerp} from './board';

// Illustrative scenario (not a real match): Barça defend the left goal (x=0).
const BACK = [12, 26, 42, 56];
const MID = [20, 34, 48];
export const HOOK_FRAMES = 480;

const Scene: React.FC<{f: number; laggard?: number}> = ({f, laggard}) => {
  // f = local frame of the play. laggard = index of the defender who fails to step (scenario B)
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
      {/* danger zone behind the line in scenario B */}
      {!offside && <Zone x={0} y={0} w={44} h={68} color={C.grana} opacity={lerp(f, 150, 200, 0, 0.22)} />}
      <OffsideLine x={offside ? 47.5 : 44} opacity={frozen ? 0.55 + 0.45 * Math.abs(Math.sin(f / 4)) : 0} color={offside ? C.gold : C.red} />
      {/* step arrows */}
      {BACK.map((y, i) => (i === laggard ? null : <ChalkArrow key={y} from={[44, y + 4.2]} to={[47.6, y + 4.2]} progress={lerp(f, 118, 150, 0, 1)} color={C.gold} />))}
      {BACK.map((y, i) => <Token key={`b${y}`} x={lineX(i)} y={y} side="barca" label={['2', '4', '5', '3'][i]} highlight={i === laggard && f > 150 ? C.red : undefined} />)}
      {MID.map((y) => <Token key={`m${y}`} x={58} y={y} side="barca" />)}
      <Token x={18} y={34} side="barca" label="1" />
      <Token x={64} y={30} side="opp" label="8" highlight={lift ? `rgba(242,194,48,${lift})` : undefined} />
      <Token x={48.5} y={19} side="opp" label="11" />
      <Token x={60} y={50} side="opp" label="10" />
      {/* ghost of striker at the moment of the pass */}
      {frozen && <Token x={45.8} y={36} side="opp" opacity={0.35} />}
      <Token x={strikerX} y={strikerY} side="opp" label="9" highlight={frozen ? (offside ? C.red : C.gold) : undefined} />
      <ChalkArrow from={[64, 30]} to={[26, 38]} progress={passP} dashed curve={-160} />
      {passP > 0 && passP < 1 && <circle cx={ballX * 15} cy={ballY * 15 - Math.sin(passP * Math.PI) * 90} r={9} fill="#fff" />}
    </>
  );
};

export const TacticsHook: React.FC = () => {
  const frame = useCurrentFrame();
  const inA = frame < 270;
  const f = inA ? frame : frame - 270 + 24; // scenario B replays the play
  const zoom = inA ? kf(frame, [[0, 1.1], [30, 1.28], [200, 1.4], [270, 1.4]]) : kf(frame, [[270, 1.28], [450, 1.4]]);
  const rewind = interpolate(frame, [262, 270, 292], [0, 1, 0], clamp);
  return (
    <AbsoluteFill>
      <ChalkDefs />
      <Chalkboard />
      <Board zoom={zoom} focusX={kf(frame, [[0, 50], [200, 44], [270, 44]])}>
        <Scene f={Math.min(f, 240)} laggard={inA ? undefined : 2} />
      </Board>
      {/* header */}
      <div style={{position: 'absolute', top: 40, left: 60, fontFamily: CHALK, fontSize: 38, color: C.chalkDim}}>FLICK'S BARÇA · THE HIGH LINE</div>
      <div style={{position: 'absolute', top: 44, right: 60, fontFamily: BODY, fontWeight: 700, fontSize: 22, color: C.chalkDim, letterSpacing: 2}}>ILLUSTRATION</div>
      {/* scenario A punchline */}
      <Sequence from={205} durationInFrames={65}>
        <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 110}}>
          <Pop><div style={{fontFamily: DISPLAY, fontSize: 190, color: C.gold, textShadow: '0 10px 40px rgba(0,0,0,.7)', letterSpacing: 4}}>ONE STEP.</div></Pop>
        </AbsoluteFill>
      </Sequence>
      {/* rewind flash */}
      <AbsoluteFill style={{background: '#fff', opacity: rewind * 0.5}} />
      <Sequence from={262} durationInFrames={40}>
        <div style={{position: 'absolute', top: 120, left: 60, fontFamily: DISPLAY, fontSize: 64, color: '#fff', opacity: 0.9}}>◀◀ REWIND</div>
      </Sequence>
      {/* scenario B label */}
      <Sequence from={300} durationInFrames={95}>
        <div style={{position: 'absolute', top: 120, left: 60}}>
          <Pop><div style={{fontFamily: DISPLAY, fontSize: 64, color: C.red}}>NOW: ONE MAN DOESN'T STEP</div></Pop>
        </div>
      </Sequence>
      {/* weapon / gamble */}
      <Sequence from={395} durationInFrames={50}>
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 10, flexDirection: 'row', background: 'rgba(10,14,12,.55)'}}>
          <Pop><div style={{fontFamily: DISPLAY, fontSize: 170, color: C.blau, WebkitTextStroke: '3px #fff'}}>WEAPON.</div></Pop>
          <Pop delay={10}><div style={{fontFamily: DISPLAY, fontSize: 170, color: C.grana, WebkitTextStroke: '3px #fff', marginLeft: 40}}>GAMBLE.</div></Pop>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={445}>
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', background: C.slate}}>
          <Pop><div style={{fontFamily: DISPLAY, fontSize: 96, color: C.chalk, textAlign: 'center', lineHeight: 1.1}}>THE TACTICS BEHIND<br /><span style={{color: C.gold}}>THE CLÁSICO</span></div></Pop>
        </AbsoluteFill>
      </Sequence>
      {/* narration captions (placeholder for TTS) */}
      <Caption start={24} end={90} text="Watch the back four, not the ball." />
      <Caption start={92} end={148} text="He lifts his head. They don't drop. They step." />
      <Caption start={150} end={204} text="One step forward, and the striker is already offside." />
      <Caption start={300} end={394} text="But if one man hesitates, the whole line is open." />
      <Grain opacity={0.07} />
    </AbsoluteFill>
  );
};
