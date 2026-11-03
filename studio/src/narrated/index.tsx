import React from 'react';
import { CalculateMetadataFunction, Composition, staticFile } from 'remotion';
import { FPS, H, W } from './theme';
import { Short, ShortData, ShortProps, shortFrames } from './Short';
import crestData from './data/crest.json';
import flickData from './data/flick.json';
import lamineData from './data/lamine.json';

const SHORTS = [
  { id: 'NR-CREST', data: crestData as ShortData, music: 'music/km/heroic-age.mp3', kokoro: 'NRC' },
  { id: 'NR-LAMINE', data: lamineData as ShortData, music: 'music/km/inspired.mp3', kokoro: 'NRL' },
  { id: 'NR-FLICK-CENTURY', data: flickData as ShortData, music: 'music/km/volatile-reaction.mp3', kokoro: 'F100' },
];

const GAP = 0.32;
const LEAD = 0.3;

const fromKokoro = async (data: ShortData, code: string): Promise<ShortData | null> => {
  let dur: Record<string, number>;
  try {
    const res = await fetch(staticFile(`audio/${code}/durations.json`));
    if (!res.ok) return null;
    dur = await res.json();
  } catch {
    return null;
  }
  let t = LEAD;
  const scenes = data.scenes.map((s, i) => {
    const id = `${code}-${String(i + 1).padStart(3, '0')}`;
    const d = dur[id];
    if (!d) throw new Error(`Kokoro line ${id} missing from durations.json`);
    const toks = s.text.split(/\s+/).filter(Boolean);
    const wts = toks.map((x) => Math.max(1, x.replace(/\W/g, '').length) + 1);
    const a = t + 0.08, b = t + d - 0.15, sum = wts.reduce((x, y) => x + y, 0);
    let c = a;
    const words = toks.map((w, k) => {
      const span = ((b - a) * wts[k]) / sum;
      const o = { w, start: +c.toFixed(3), end: +(c + span * 0.92).toFixed(3) };
      c += span;
      return o;
    });
    const scene = { visual: s.visual, text: s.text, start: +t.toFixed(3), end: +(t + d).toFixed(3), words, audio: `audio/${code}/${id}.wav` };
    t += d + GAP;
    return scene;
  });
  return { id: data.id, engine: `kokoro:${code}`, audio: null, duration: +(t - GAP + 0.2).toFixed(3), scenes };
};

const metadata: CalculateMetadataFunction<ShortProps> = async ({ props }) => {
  let data = props.data;
  if (!data.engine.startsWith('eleven') && props.kokoro) data = (await fromKokoro(data, props.kokoro)) ?? data;
  return { durationInFrames: shortFrames(data), props: { ...props, data } };
};

export const NarratedShorts: React.FC = () => (
  <>
    {SHORTS.map((s) => (
      <Composition key={s.id} id={s.id} component={Short} durationInFrames={shortFrames(s.data)} fps={FPS} width={W} height={H}
        defaultProps={{ data: s.data, music: s.music, kokoro: s.kokoro }} calculateMetadata={metadata} />
    ))}
  </>
);
