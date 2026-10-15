import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {ChalkDefs, Grain, clamp} from '../lib';
import {LineCaption, type WordTiming} from './Captions';
import {SceneView} from './Scenes';
import {plan, resolveT, type Plan} from './timeline';
import type {EpisodeSpec, NarrationLine} from './types';

export type EpisodeData = {spec: EpisodeSpec; narration: NarrationLine[]; durations: Record<string, number>; captions?: boolean; words?: Record<string, WordTiming[]>};

const FADE = 8;

/** Music ducks under narration (0.06 while speaking, 0.2 in gaps), with fades. */
const Music: React.FC<{src: string; p: Plan}> = ({src, p}) => {
  // distance (frames) to the nearest narration line -> smooth 12-frame ramp between duck levels
  const gap = (f: number) => {
    let d = Infinity;
    for (const l of p.lines) {
      if (f >= l.from && f < l.from + l.len) return 0;
      d = Math.min(d, Math.abs(f - l.from), Math.abs(f - (l.from + l.len)));
    }
    return d;
  };
  const volume = (f: number) => {
    const fadeIn = interpolate(f, [0, 45], [0, 1], clamp);
    const fadeOut = interpolate(f, [p.total - 90, p.total], [1, 0], clamp);
    return interpolate(gap(f), [4, 16], [0.06, 0.2], clamp) * fadeIn * fadeOut;
  };
  return <Audio src={staticFile(src)} loop volume={volume} />;
};

export const Episode: React.FC<EpisodeData> = ({spec, narration, durations, captions, words}) => {
  const showCaptions = captions ?? spec.captions ?? false;
  const p = plan(spec, narration, durations);
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#0d1311'}}>
      <ChalkDefs />
      {p.scenes.map((st, i) => (
        <Sequence key={i} from={st.from} durationInFrames={st.dur + (i < p.scenes.length - 1 ? FADE : 0)}>
          <AbsoluteFill style={{opacity: i === 0 ? 1 : interpolate(frame - st.from, [0, FADE], [0, 1], clamp)}}>
            <SceneView st={st} />
          </AbsoluteFill>
          {(st.scene.sfx ?? []).map((s, k) => (
            <Sequence key={k} from={resolveT(s.at, st)}>
              <Audio src={staticFile(`sfx/${s.name}.wav`)} volume={s.volume ?? 0.5} />
            </Sequence>
          ))}
          {/* default whoosh on every scene cut except the first */}
          {i > 0 && <Audio src={staticFile('sfx/whoosh.wav')} volume={0.18} />}
        </Sequence>
      ))}
      {p.lines.map((l) => (
        <Sequence key={l.id} from={l.from} durationInFrames={l.len + 2}>
          <Audio src={staticFile(`audio/${spec.code}/${l.id}.wav`)} />
          {showCaptions && <LineCaption line={l} words={words?.[l.id]} />}
        </Sequence>
      ))}
      {spec.music && <Music src={`music/${spec.music}`} p={p} />}
      <Grain opacity={0.06} />
    </AbsoluteFill>
  );
};

export const episodeFrames = (d: EpisodeData) => plan(d.spec, d.narration, d.durations).total;
