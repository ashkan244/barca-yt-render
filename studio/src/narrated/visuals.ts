import React from 'react';
import { SceneProps } from './kit';
import { CREST_VISUALS } from './crestScenes';
import { LAMINE_VISUALS } from './lamineScenes';

// scene components by Short (props are serialised, so compositions pass the key, not the components)
export const VISUALS: Record<string, Record<string, React.FC<SceneProps>>> = {
  crest: CREST_VISUALS,
  lamine: LAMINE_VISUALS,
};
