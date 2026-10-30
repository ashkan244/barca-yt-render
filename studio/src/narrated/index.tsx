import React from 'react';
import { Composition } from 'remotion';
import { FPS, H, W } from './theme';
import { Short, ShortData, shortFrames } from './Short';
import crestData from './data/crest.json';
import lamineData from './data/lamine.json';

// Narrated Barça Radar Shorts (English, ElevenLabs). Data: tools/narrated/eleven.py; render: render-narrated-short.yml
const SHORTS = [
  { id: 'NR-CREST', data: crestData as ShortData, music: 'music/km/heroic-age.mp3' },
  { id: 'NR-LAMINE', data: lamineData as ShortData, music: 'music/km/inspired.mp3' },
];

export const NarratedShorts: React.FC = () => (
  <>
    {SHORTS.map((s) => (
      <Composition key={s.id} id={s.id} component={Short} durationInFrames={shortFrames(s.data)} fps={FPS} width={W} height={H}
        defaultProps={{ data: s.data, music: s.music }} />
    ))}
  </>
);
