import React, { useEffect, useState } from 'react';
import {
  AbsoluteFill, Audio, Sequence, cancelRender, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import { BODY, C, FPS } from './theme';
import { Grain, RadarMark } from './kit';
import { VISUALS } from './visuals';

export type Word = { w: string; start: number; end: number };
export type SceneData = { visual: string; text: string; start: number; end: number; words: Word[] };
export type ShortData = { id: string; engine: string; audio: string | null; duration: number; scenes: SceneData[] };
export type ShortProps = { data: ShortData; music?: string };

const TAIL = 1.8; // seconds held after the last word
const XFADE = 7; // frames a new visual fades in over the old one

export const shortFrames = (d: ShortData) => Math.ceil((d.duration + TAIL) * FPS);

// scene i is on screen from its first word (scene 0: from frame 0) until the next scene's first word
const sceneSpans = (d: ShortData) => {
  const total = shortFrames(d);
  return d.scenes.map((s, i) => {
    const from = i === 0 ? 0 : Math.round(s.start * FPS) - 3;
    const to = i === d.scenes.length - 1 ? total : Math.round(d.scenes[i + 1].start * FPS) - 3;
    return { ...s, from, frames: to - from };
  });
};

const useFonts = () => {
  const [handle] = useState(() => delayRender('narrated fonts'));
  useEffect(() => {
    const faces = [
      new FontFace('NR Anton', `url("${staticFile('fonts/anton/Anton-Regular.ttf')}")`),
      new FontFace('NR Montserrat', `url("${staticFile('fonts/montserrat/Montserrat[wght].ttf')}")`, { weight: '100 900' }),
    ];
    Promise.all(faces.map((f) => f.load())).then((loaded) => {
      loaded.forEach((f) => document.fonts.add(f));
      continueRender(handle);
    }).catch((e) => cancelRender(e)); // a missing licensed font fails the render instead of falling back
  }, [handle]);
};

const BREAK = /[,.:;?!]$/;

type Chunk = { words: Word[]; from: number; to: number };

const chunks = (d: ShortData): Chunk[] => {
  const out: Chunk[] = [];
  for (const s of d.scenes) {
    let cur: Word[] = [];
    const flush = () => { if (cur.length) { out.push({ words: cur, from: 0, to: 0 }); cur = []; } };
    for (const w of s.words) {
      cur.push(w);
      const len = cur.map((x) => x.w).join(' ').length;
      if (BREAK.test(w.w) || cur.length >= 4 || len > 18) flush();
    }
    flush();
  }
  out.forEach((c, i) => {
    c.from = Math.round(c.words[0].start * FPS);
    const next = out[i + 1];
    c.to = next ? Math.round(next.words[0].start * FPS) : Math.round((c.words[c.words.length - 1].end + 0.6) * FPS);
    if (next && c.to - Math.round(c.words[c.words.length - 1].end * FPS) > 24) c.to = Math.round(c.words[c.words.length - 1].end * FPS) + 12;
  });
  return out;
};

const Captions: React.FC<{ data: ShortData }> = ({ data }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const list = chunks(data);
  const cur = list.find((c) => frame >= c.from && frame < c.to);
  if (!cur) return null;
  const k = frame - cur.from;
  const pop = interpolate(k, [0, 5], [0.88, 1], { extrapolateRight: 'clamp' });
  const op = interpolate(k, [0, 3], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <div style={{
      position: 'absolute', left: 70, right: 70, top: 1390, textAlign: 'center', fontFamily: BODY, fontWeight: 900,
      fontSize: 78, lineHeight: 1.12, color: '#fff', transform: `scale(${pop})`, opacity: op,
      textShadow: '0 4px 18px rgba(0,0,0,0.85), 0 0 3px rgba(0,0,0,0.9)',
    }}>
      {cur.words.map((w, i) => (
        <span key={i} style={{ color: t >= w.start && t < w.end + 0.08 ? C.gold : '#fff' }}>
          {w.w.replace(/[,;:]$/, '')}{i < cur.words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </div>
  );
};

// the reference's signature: thin rule + page name under the captions, page mark top right
const Signature: React.FC = () => (
  <>
    <div style={{ position: 'absolute', top: 1612, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: 300, height: 2, background: 'rgba(255,255,255,0.3)' }} />
      <div style={{ marginTop: 14, fontFamily: BODY, fontWeight: 600, fontSize: 34, letterSpacing: 3, color: 'rgba(255,255,255,0.62)' }}>BARÇA RADAR</div>
    </div>
    <div style={{ position: 'absolute', top: 120, right: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.85 }}>
      <RadarMark size={78} />
    </div>
  </>
);

const FadeIn: React.FC<{ children: React.ReactNode; on: boolean }> = ({ children, on }) => {
  const frame = useCurrentFrame();
  const o = on ? interpolate(frame, [0, XFADE], [0, 1], { extrapolateRight: 'clamp' }) : 1;
  const s = on ? interpolate(frame, [0, XFADE], [1.04, 1], { extrapolateRight: 'clamp' }) : 1;
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${s})` }}>{children}</AbsoluteFill>;
};

export const Short: React.FC<ShortProps> = ({ data, music }) => {
  const visuals = VISUALS[data.id] ?? {};
  useFonts();
  const { durationInFrames } = useVideoConfig();
  const spans = sceneSpans(data);
  // music ducks under the voice and swells in the gaps (word times are exact, so no sidechain needed)
  const words = data.scenes.flatMap((s) => s.words);
  const speaking = (t: number) => words.some((w) => t >= w.start - 0.12 && t <= w.end + 0.25);
  const musicVol = (f: number) => {
    let talk = 0;
    for (let k = -3; k <= 3; k++) talk += speaking((f + k * 3) / FPS) ? 1 : 0;
    const level = interpolate(talk / 7, [0, 1], [0.24, 0.085]);
    return level * interpolate(f, [0, 15, durationInFrames - 45, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  };
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {spans.map((s, i) => {
        const V = visuals[s.visual];
        const lead = i === 0 ? 0 : XFADE;
        return (
          <Sequence key={`v${i}`} from={s.from - lead} durationInFrames={s.frames + lead} name={s.visual}>
            <FadeIn on={i > 0}>
              <Sequence from={lead} layout="none">
                {V ? <V frames={s.frames} /> : <AbsoluteFill style={{ background: 'magenta' }} />}
              </Sequence>
            </FadeIn>
          </Sequence>
        );
      })}
      <Grain />
      <Captions data={data} />
      <Signature />
      {spans.slice(1).map((s, i) => (
        <Sequence key={`w${i}`} from={Math.max(0, s.from - 6)} durationInFrames={30}>
          <Audio src={staticFile('sfx/whoosh.wav')} volume={0.22} />
        </Sequence>
      ))}
      <Sequence from={2} durationInFrames={45}><Audio src={staticFile('sfx/impact.wav')} volume={0.35} /></Sequence>
      {data.audio ? <Audio src={staticFile(data.audio)} /> : null}
      {music ? <Audio src={staticFile(music)} volume={musicVol} loop /> : null}
    </AbsoluteFill>
  );
};
