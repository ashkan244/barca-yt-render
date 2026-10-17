import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile} from 'remotion';
import {ChalkDefs, Grain, clamp} from '../lib';
import {LineCaption, type WordTiming} from './Captions';
import {SceneView} from './Scenes';
import {CamRig, Enter, Exit, Ambience, transitionFor, XF} from './Motion';
import {plan, resolveT, type Plan, type HostManifest} from './timeline';
import {HostStage} from './Host';
import type {EpisodeSpec, NarrationLine} from './types';

export type EpisodeData = {spec: EpisodeSpec; narration: NarrationLine[]; durations: Record<string, number>; captions?: boolean; words?: Record<string, WordTiming[]>; host?: HostManifest};

// distance (frames) from f to the nearest narration line (0 while speaking)
const gapAt = (p: Plan, f: number) => {
  let d = Infinity;
  for (const l of p.lines) {
    if (f >= l.from && f < l.from + l.len) return 0;
    d = Math.min(d, Math.abs(f - l.from), Math.abs(f - (l.from + l.len)));
  }
  return d;
};

/**
 * Music bed: one track per chapter (cycling through the list), crossfaded at chapter cards,
 * ducked under narration (0.08 speaking → 0.24 in gaps), faded in/out at the ends.
 */
const Music: React.FC<{tracks: string[]; p: Plan}> = ({tracks, p}) => {
  const starts = [0, ...p.scenes.filter((st, i) => i > 0 && st.scene.type === 'chapter').map((st) => st.from)];
  const XM = 30; // crossfade frames
  return (
    <>
      {starts.map((from, i) => {
        const to = i + 1 < starts.length ? starts[i + 1] : p.total;
        const a = Math.max(0, from - XM);
        return (
          <Sequence key={i} from={a} durationInFrames={to - a + (i + 1 < starts.length ? XM : 0)}>
            <Audio src={staticFile(`music/${tracks[i % tracks.length]}`)} loop volume={(f) => {
              const g = a + f;
              const xin = i === 0 ? interpolate(g, [0, 45], [0, 1], clamp) : interpolate(g, [from - XM, from], [0, 1], clamp);
              const xout = i + 1 < starts.length ? interpolate(g, [to - XM, to], [1, 0], clamp) : interpolate(g, [p.total - 90, p.total], [1, 0], clamp);
              return interpolate(gapAt(p, g), [4, 14], [0.08, 0.24], clamp) * xin * xout;
            }} />
          </Sequence>
        );
      })}
    </>
  );
};

export const Episode: React.FC<EpisodeData> = ({spec, narration, durations, captions, words, host}) => {
  const showCaptions = captions ?? spec.captions ?? false;
  const p = plan(spec, narration, durations, host);
  const recorded = (take?: string) => !!(take && host?.takes[take]);
  const tracks = !spec.music ? [] : Array.isArray(spec.music) ? spec.music : [spec.music];
  return (
    <AbsoluteFill style={{background: '#0d1311'}}>
      <ChalkDefs />
      {p.scenes.map((st, i) => {
        const enter = transitionFor(st.scene.type, i);
        const exit = i + 1 < p.scenes.length ? transitionFor(p.scenes[i + 1].scene.type, i + 1) : 'cut';
        return (
          <Sequence key={i} from={st.from} durationInFrames={st.dur + (i < p.scenes.length - 1 ? XF : 0)}>
            <Exit kind={exit} dur={st.dur}>
              <Enter kind={enter}>
                {spec.host ? (
                  <HostStage code={spec.code} take={st.scene.take} host={host} scene={st.scene} dur={st.dur}>
                    {st.scene.host === 'split' ? <SceneView st={st} /> : <CamRig st={st} index={i}><SceneView st={st} /></CamRig>}
                  </HostStage>
                ) : (
                  <CamRig st={st} index={i}><SceneView st={st} /></CamRig>
                )}
              </Enter>
            </Exit>
            {(st.scene.sfx ?? []).map((s, k) => (
              <Sequence key={k} from={resolveT(s.at, st)}>
                <Audio src={staticFile(`sfx/${s.name}.wav`)} volume={s.volume ?? 0.5} />
              </Sequence>
            ))}
            {/* transition sound on every cut except the first: whoosh, plus an impact on chapter flashes */}
            {i > 0 && <Audio src={staticFile('sfx/whoosh.wav')} volume={0.28} />}
            {enter === 'flash' && <Audio src={staticFile('sfx/impact.wav')} volume={0.22} />}
          </Sequence>
        );
      })}
      {!spec.host && <Ambience total={p.total} />}
      {p.lines.map((l) => (
        <Sequence key={l.id} from={l.from} durationInFrames={l.len + 2}>
          {/* TTS voice, unless this line belongs to a recorded presenter take (its audio comes with the video) */}
          {!recorded(p.scenes.find((s) => s.lines.includes(l))?.scene.take) && <Audio src={staticFile(`audio/${spec.code}/${l.id}.wav`)} />}
          {showCaptions && <LineCaption line={l} words={words?.[l.id]} />}
        </Sequence>
      ))}
      {tracks.length > 0 && <Music tracks={tracks} p={p} />}
      <Grain opacity={0.06} />
    </AbsoluteFill>
  );
};

export const episodeFrames = (d: EpisodeData) => plan(d.spec, d.narration, d.durations, d.host).total;
