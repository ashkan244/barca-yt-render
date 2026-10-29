// BARÇA RADAR motion library. Vocabulary + rules: .claude/skills/barca-motion/SKILL.md.
// Every primitive is a pure function of a frame offset (no state, no randomness without a seed), so parallel
// chunked renders and stills match the full render exactly.
export {TRANSITIONS, TRANSITION_STYLES, TransitionIn, TransitionOut, TransitionOverlay, needsOutgoing, styleDirection, styleTransition, type Direction, type TransitionName, type TransitionStyle} from './transitions';
export {LightLeak, ScanLines, Sheen, Vignette} from './overlays';
export {Handheld, Parallax, Shake} from './camera';
export {Callout, DrawPath} from './draw';
export {Counter, Highlight, LowerThird, Shine, Slam, Stamp, Typewriter, WordPop} from './text';

/** How a shot moves inside its frame. `push` is the default Ken Burns; `parallax` fakes depth from one photo. */
export type ShotMotion = 'push' | 'parallax' | 'handheld' | 'still';
/** How a card's text arrives. */
export type CardMotion = 'scale' | 'slam' | 'pop' | 'type' | 'count';
