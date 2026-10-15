import React from 'react';
import {Composition, Still} from 'remotion';
import {TacticsHook, HOOK_FRAMES} from './TacticsHook';
import {StoryHook, STORY_FRAMES} from './StoryHook';
import {ThumbFS, ThumbTM, ThumbPL, ThumbWI} from './Thumbs';

export const Root: React.FC = () => (
  <>
    <Composition id="TX-Hook-OneStep" component={TacticsHook} durationInFrames={HOOK_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="FS-Hook-Cruyff" component={StoryHook} durationInFrames={STORY_FRAMES} fps={30} width={1920} height={1080} />
    <Still id="Thumb-FS-Cruyff" component={ThumbFS} width={1280} height={720} />
    <Still id="Thumb-TM-2-6" component={ThumbTM} width={1280} height={720} />
    <Still id="Thumb-PL-Pedri" component={ThumbPL} width={1280} height={720} />
    <Still id="Thumb-WI-Messi" component={ThumbWI} width={1280} height={720} />
  </>
);
