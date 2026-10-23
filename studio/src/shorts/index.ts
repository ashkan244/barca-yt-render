import React from 'react';
import type {ShortData} from './kit';
import {S01Seven} from './S01Seven';
import {S02Gap} from './S02Gap';
import {S03Season} from './S03Season';
import {S04Raphinha} from './S04Raphinha';
import {S05Eleven} from './S05Eleven';
import {S06Kinetic} from './S06Kinetic';
import {S07Data} from './S07Data';

export const SHORT_COMPONENTS: Record<string, React.FC<{d: ShortData}>> = {
  'S01-SEVEN': S01Seven, 'S02-GAP': S02Gap, 'S03-1974': S03Season, 'S04-RAPHINHA': S04Raphinha, 'S05-ELEVEN': S05Eleven, 'S06-KINETIC': S06Kinetic, 'S07-DATA': S07Data,
};
