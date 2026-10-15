import React from 'react';
import {Composition, Still} from 'remotion';
import {TacticsHook, HOOK_FRAMES} from './TacticsHook';
import {StoryHook, STORY_FRAMES} from './StoryHook';
import {ThumbFS, ThumbTM, ThumbPL, ThumbWI} from './Thumbs';
import {Banner, Avatar, Watermark} from './Branding';
import {Episode, episodeFrames} from './engine/Episode';
import {EpisodeThumb} from './engine/Thumb';
import {EPISODES} from './episodes/registry.generated';

export const Root: React.FC = () => (
  <>
    {EPISODES.map((d) => (
      <React.Fragment key={d.spec.id}>
        <Composition id={d.spec.id} component={Episode} durationInFrames={Math.max(30, episodeFrames(d))} fps={30} width={1920} height={1080} defaultProps={d} />
        {d.spec.thumb && <Still id={`${d.spec.id}-thumb`} component={EpisodeThumb} width={1280} height={720} defaultProps={{t: d.spec.thumb}} />}
      </React.Fragment>
    ))}
    <Composition id="TX-Hook-OneStep" component={TacticsHook} durationInFrames={HOOK_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="FS-Hook-Cruyff" component={StoryHook} durationInFrames={STORY_FRAMES} fps={30} width={1920} height={1080} />
    <Still id="Thumb-FS-Cruyff" component={ThumbFS} width={1280} height={720} />
    <Still id="Thumb-TM-2-6" component={ThumbTM} width={1280} height={720} />
    <Still id="Thumb-PL-Pedri" component={ThumbPL} width={1280} height={720} />
    <Still id="Thumb-WI-Messi" component={ThumbWI} width={1280} height={720} />
    <Still id="Brand-Banner" component={Banner} width={2560} height={1440} />
    <Still id="Brand-Avatar" component={Avatar} width={800} height={800} />
    <Still id="Brand-Watermark" component={Watermark} width={150} height={150} />
  </>
);
