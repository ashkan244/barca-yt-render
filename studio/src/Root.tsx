import React from 'react';
import {Composition, Still} from 'remotion';
import {TacticsHook, HOOK_FRAMES} from './TacticsHook';
import {StoryHook, STORY_FRAMES} from './StoryHook';
import {ThumbFS, ThumbTM, ThumbPL, ThumbWI} from './Thumbs';
import {Banner, Avatar, Watermark} from './Branding';
import {Episode, episodeFrames} from './engine/Episode';
import {EpisodeThumb} from './engine/Thumb';
import {EPISODES} from './episodes/registry.generated';
import {SHORT_COMPONENTS} from './shorts';
import {SHORTS} from './shorts/data.generated';
import {HKRadar, HK_FRAMES, HKThumb} from './radar/HKTitle';
import {HKShortCut, HK_RS1_FRAMES, HKShortStats, HK_RS2_FRAMES} from './radar/HKShorts';
import {HKShortPro, HK_RS3_FRAMES} from './radar/HKShortPro';
import {ClasicoExplainer, CLASICO_FRAMES} from './explainer/Clasico';

export const Root: React.FC = () => (
  <>
    {EPISODES.map((d) => (
      <React.Fragment key={d.spec.id}>
        <Composition id={d.spec.id} component={Episode} durationInFrames={Math.max(30, episodeFrames(d))} fps={30} width={1920} height={1080} defaultProps={d} />
        {d.spec.thumb && <Still id={`${d.spec.id}-thumb`} component={EpisodeThumb} width={1280} height={720} defaultProps={{t: d.spec.thumb}} />}
      </React.Fragment>
    ))}
    {SHORTS.filter((d) => SHORT_COMPONENTS[d.id]).map((d) => (
      <Composition key={d.id} id={d.id} component={SHORT_COMPONENTS[d.id]} durationInFrames={d.total} fps={30} width={1080} height={1920} defaultProps={{d}} />
    ))}
    <Still id="HK-RADAR-thumb" component={HKThumb} width={1280} height={720} />
    <Composition id="HK-RS1-CUT" component={HKShortCut} durationInFrames={HK_RS1_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="HK-RS2-STATS" component={HKShortStats} durationInFrames={HK_RS2_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="HK-RS3-PRO" component={HKShortPro} durationInFrames={HK_RS3_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="CF-CLASICO-WHY" component={ClasicoExplainer} durationInFrames={CLASICO_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="HK-RADAR" component={HKRadar} durationInFrames={HK_FRAMES} fps={30} width={1920} height={1080} />
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
