import React from 'react';
import { SceneProps } from './kit';
import { CREST_VISUALS } from './crestScenes';
import { FLICK_VISUALS } from './FlickScenes';
import { LAMINE_VISUALS } from './lamineScenes';

export const VISUALS: Record<string, Record<string, React.FC<SceneProps>>> = {
  crest: CREST_VISUALS,
  lamine: LAMINE_VISUALS,
  flick: FLICK_VISUALS,
};
