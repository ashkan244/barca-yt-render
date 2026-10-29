// Isolated visual studies; deliberately separate from source-episode delivery.
import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {DecisionLab, DECISION_LAB_FRAMES} from './DecisionLab';

const Experiments: React.FC = () => <>
  <Composition id="DECISION-LAB-STUDY" component={DecisionLab} durationInFrames={DECISION_LAB_FRAMES} fps={30} width={1920} height={1080}/>
  <Composition id="DECISION-LAB-STUDY-VERTICAL" component={DecisionLab} durationInFrames={DECISION_LAB_FRAMES} fps={30} width={1080} height={1920}/>
</>;
registerRoot(Experiments);
