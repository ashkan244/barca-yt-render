import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, interpolate, getInputProps} from 'remotion';
import {C, DISPLAY, BODY, ChalkDefs, Grain, Halftone, Pop, Narration, clamp, kf} from './lib';
import fsDur from '../public/audio/fs/durations.json';

const LINES = [
  {id: 'fs-01', from: 112, text: 'Johan Cruyff. The man who built Barça. Twice.'},
  {id: 'fs-02', from: 255, text: 'As he once put it: playing football is very simple. But playing simple football is the hardest thing there is.'},
];

export const STORY_FRAMES = 520;
const SRC = staticFile('photos/cruyff/cruyff-02.jpg');

/** FS hook: archival CC0 photo -> illustrated ink/duotone look, slow push-in, title + real quote. */
export const StoryHook: React.FC = () => {
  const frame = useCurrentFrame();
  const z = kf(frame, [[0, 1.0], [520, 1.1]]);
  const halftone = Number((getInputProps() as {halftone?: number}).halftone ?? 0.18);
  const wipe = interpolate(frame, [45, 95], [0, 100], clamp); // % revealed illustrated
  const imgStyle: React.CSSProperties = {position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`, transformOrigin: '58% 30%'};
  return (
    <AbsoluteFill style={{background: '#0b1220'}}>
      <ChalkDefs />
      <Img src={SRC} style={{...imgStyle, filter: 'grayscale(1) contrast(1.1)'}} />
      <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - wipe}% 0 0)`}}>
        {/* halftone lives inside the zooming layer so it moves with the image (encoder-friendly) */}
        <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '58% 30%'}}>
          <Img src={SRC} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(1.3) contrast(1.05) url(#ink)'}} />
          {halftone > 0 && <Halftone opacity={halftone} size={6} />}
        </div>
      </div>
      {wipe > 0 && wipe < 100 && <div style={{position: 'absolute', top: 0, bottom: 0, left: `${wipe}%`, width: 6, background: C.gold, boxShadow: `0 0 30px ${C.gold}`}} />}
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(8,14,30,.85) 0%, rgba(8,14,30,.35) 45%, rgba(8,14,30,0) 70%)'}} />
      <Sequence from={110}>
        <div style={{position: 'absolute', left: 90, top: 300, width: 900}}>
          <Pop><div style={{fontFamily: BODY, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.gold}}>THE FULL STORY</div></Pop>
          <Pop delay={8}><div style={{fontFamily: DISPLAY, fontSize: 150, lineHeight: 0.95, color: '#fff', marginTop: 10}}>JOHAN<br />CRUYFF</div></Pop>
          <Pop delay={20}><div style={{fontFamily: BODY, fontWeight: 600, fontSize: 34, color: '#ffffffcc', marginTop: 24}}>The man who built Barça. Twice.</div></Pop>
        </div>
      </Sequence>
      <Sequence from={250}>
        <div style={{position: 'absolute', left: 90, bottom: 150, width: 980, borderLeft: `6px solid ${C.grana}`, paddingLeft: 26}}>
          <Pop><div style={{fontFamily: BODY, fontStyle: 'italic', fontWeight: 600, fontSize: 38, color: '#fff', lineHeight: 1.35}}>
            “Playing football is very simple, but playing simple football is the hardest thing there is.”
          </div></Pop>
          <Pop delay={10}><div style={{fontFamily: BODY, fontSize: 24, color: '#ffffffaa', marginTop: 10}}>— Johan Cruyff</div></Pop>
        </div>
      </Sequence>
      <div style={{position: 'absolute', right: 30, bottom: 22, fontFamily: BODY, fontSize: 16, color: '#ffffff99'}}>
        Photo: Rob Mieremet / Anefo, Nationaal Archief (CC0) · Feyenoord–Barcelona, 1974
      </div>
      <Narration dir="fs" lines={LINES} durations={fsDur as Record<string, number>} />
      <Grain opacity={Number((getInputProps() as {grain?: number}).grain ?? 0.1)} />
    </AbsoluteFill>
  );
};
