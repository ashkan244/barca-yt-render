// Presenter layer for host episodes. Each scene places the recorded take one of four ways:
//   full  — presenter fills the frame (slow push-in), scene's headline as a lower third
//   split — presenter on the left, the scene's graphics on a framed screen on the right
//   pip   — graphics fill the frame, presenter in a round frame bottom-right
//   off   — graphics only (voice, if any, still plays)
// Without a recording (preview/animatic) a styled placeholder shows where the presenter will be.
import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, DISPLAY, BODY, Pop, clamp} from '../lib';
import type {Scene} from './types';
import type {HostManifest} from './timeline';

const FPS = 30;
const ease = {...clamp, easing: Easing.out(Easing.cubic)};

type TakeRef = {code: string; take?: string; host?: HostManifest};

/** The recorded take (or a placeholder) as a cover-fitted video layer. */
const TakeVideo: React.FC<TakeRef & {muted?: boolean; zoom?: number}> = ({code, take, host, muted, zoom = 1}) => {
  const t = take ? host?.takes[take] : undefined;
  if (!t) {
    return (
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 35%, #2a3550 0%, #0b1220 75%)', alignItems: 'center', justifyContent: 'center'}}>
        <svg width="46%" viewBox="0 0 200 200" style={{opacity: 0.35}}>
          <circle cx="100" cy="72" r="38" fill="#cfd6e6" />
          <path d="M30 200 C30 140 60 118 100 118 C140 118 170 140 170 200 Z" fill="#cfd6e6" />
        </svg>
        <div style={{position: 'absolute', bottom: '10%', fontFamily: BODY, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: '#ffffffb0'}}>PRESENTER · {take ?? '—'}</div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <OffthreadVideo src={staticFile(`host/${code}/${t.file}`)} startFrom={Math.round(t.start * FPS)} muted={muted}
        style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}} />
    </AbsoluteFill>
  );
};

/** Headline used for the lower third in full-screen presenter scenes. */
const headlineOf = (s: Scene): string | undefined => {
  const x = s as Record<string, unknown>;
  return (x.text ?? x.title ?? x.kicker) as string | undefined;
};

export const HostStage: React.FC<TakeRef & {scene: Scene; dur: number; children: React.ReactNode}> = ({code, take, host, scene, dur, children}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const mode = scene.host ?? 'pip';
  const recorded = !!(take && host?.takes[take]);
  if (mode === 'off') {
    const t = take ? host?.takes[take] : undefined;
    return <>{children}{t && <Audio src={staticFile(`host/${code}/${t.file}`)} startFrom={Math.round(t.start * FPS)} />}</>;
  }
  if (mode === 'full') {
    const head = headlineOf(scene);
    const zoom = interpolate(f, [0, dur], [1.02, 1.1], clamp);
    const lt = spring({frame: f - 12, fps, config: {damping: 16, stiffness: 160}});
    return (
      <AbsoluteFill>
        <TakeVideo code={code} take={take} host={host} zoom={zoom} />
        <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(5,10,20,.85) 0%, rgba(5,10,20,0) 38%)'}} />
        {head && (
          <div style={{position: 'absolute', left: 90, bottom: 230, maxWidth: 1250, transform: `translateX(${(1 - lt) * -60}px)`, opacity: lt}}>
            <div style={{width: 120, height: 8, background: C.gold, marginBottom: 16}} />
            <div style={{fontFamily: DISPLAY, fontSize: 70, lineHeight: 1.05, color: '#fff', whiteSpace: 'pre-line', textShadow: '0 4px 20px rgba(0,0,0,.6)'}}>{head.replace(/\\n/g, '\n')}</div>
          </div>
        )}
        {scene.type === 'question' && (scene as Extract<Scene, {type: 'question'}>).options && (
          <div style={{position: 'absolute', right: 90, top: 140, display: 'flex', flexDirection: 'column', gap: 18}}>
            {(scene as Extract<Scene, {type: 'question'}>).options!.map((o, i) => (
              <Pop key={i} delay={20 + i * 8}><div style={{fontFamily: BODY, fontWeight: 800, fontSize: 34, color: '#111', background: '#fff', padding: '12px 26px', borderRadius: 10, borderLeft: `10px solid ${[C.blau, C.grana, C.gold][i % 3]}`}}>{o}</div></Pop>
            ))}
          </div>
        )}
        {!recorded && <div style={{position: 'absolute', top: 40, right: 50, fontFamily: BODY, fontWeight: 700, fontSize: 22, letterSpacing: 2, color: '#ffffff90'}}>PREVIEW</div>}
      </AbsoluteFill>
    );
  }
  if (mode === 'split') {
    const p = spring({frame: f, fps, config: {damping: 18, stiffness: 170}});
    return (
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 70% 40%, #16264d 0%, #0b1220 75%)'}}>
        <div style={{position: 'absolute', left: 60, top: 70, width: 640, height: 820, borderRadius: 18, overflow: 'hidden', boxShadow: '0 25px 70px rgba(0,0,0,.6)',
          border: `5px solid ${C.blau}`, transform: `translateX(${(1 - p) * -120}px)`, opacity: p}}>
          <TakeVideo code={code} take={take} host={host} />
        </div>
        <div style={{position: 'absolute', left: 740, top: 165, width: 1120, height: 630, borderRadius: 14, overflow: 'hidden', boxShadow: '0 25px 70px rgba(0,0,0,.6)',
          border: `5px solid ${C.grana}`, transform: `translateX(${(1 - p) * 140}px)`, opacity: p}}>
          <div style={{width: 1920, height: 1080, transform: `scale(${1120 / 1920})`, transformOrigin: '0 0', position: 'relative'}}>{children}</div>
        </div>
      </AbsoluteFill>
    );
  }
  // pip
  const p = spring({frame: f - 4, fps, config: {damping: 15, stiffness: 190}});
  return (
    <AbsoluteFill>
      {children}
      <div style={{position: 'absolute', right: 56, bottom: 56, width: 330, height: 330, borderRadius: 165, overflow: 'hidden', border: `7px solid ${C.gold}`,
        boxShadow: '0 18px 50px rgba(0,0,0,.6)', transform: `scale(${p})`}}>
        <TakeVideo code={code} take={take} host={host} />
      </div>
    </AbsoluteFill>
  );
};
