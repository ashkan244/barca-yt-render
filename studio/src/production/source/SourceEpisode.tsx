// BARÇA RADAR — source-led episode engine. One presenter recording + one JSON spec
// (src/episodes-source/<id>.spec.json) → vertical Short, 16:9 long-form, vertical cover and YouTube thumbnail.
// Speech timing is never changed: scenes, chapters and captions all key off the source timeline.
import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {LOCAL_FONTS} from '../fonts';
import {ReviewedCaptions} from '../Captions';
import type {Player, PlateArrow} from '../TacticalPlate';
import {BoardPlate, Shot, Thumb, shotLibrary} from './Shot';
export {BoardPlate} from './Shot';
import {RadarBg, GRANA, BLAU} from '../../radar/RadarStory';
import {Mark} from '../../Branding';

export const FPS = 30;
const GOLD = '#f2c230';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export type BoardDef = {label?: string; note?: string; players: Player[]; arrows?: PlateArrow[]; zone?: {x: number; y: number; w: number; h: number; label: string}};
export type SourceScene = {a: number; b: number; title: string; sub: string; board?: string; names?: string[]; cards?: [string, string][]; cardDelays?: number[];
  /** Optional photo per card row (shot id from archive.shots; must show the person the card names). */
  cardShots?: (string | null)[]};
export type SourceSpec = {
  id: string; media: string; docs?: string; duration: number; label: string; presenter: string; opponent: string;
  source: {sha256: string; bytes?: number; note?: string};
  punch?: [number, number][]; boards: Record<string, BoardDef>; scenes: SourceScene[];
  chapters: {at: number; title: string}[];
  cover: {kicker: string; lines: string[]; board?: string};
  long?: {endSeconds?: number; endKicker?: string};
  /** Stand-alone Shorts cut from the same take; a/b must be scene boundaries so every cut lands between sentences. */
  clips?: {name: string; a: number; b: number}[];
  /** Photo beats: while a name or place is spoken, its shot replaces the board/cards panel (seconds on the source timeline). */
  beats?: {a: number; b: number; shot: string}[];
};
export type Word = {w: string; s: number; e: number};
export type SourceEpisodeProps = {spec: SourceSpec; words: Word[]};
export type SourceClipProps = SourceEpisodeProps & {clip: string};

/** Fails the bundle early on spec mistakes that would otherwise only show up in a rendered frame. */
export const validateSourceEpisode = (d: SourceEpisodeProps): SourceEpisodeProps => {
  const {spec, words} = d; const err = (m: string) => { throw new Error(`${spec.id}: ${m}`); };
  spec.scenes.forEach((s, i) => {
    if (i === 0 ? s.a !== 0 : Math.abs(s.a - spec.scenes[i - 1].b) > 1e-6) err(`scene ${i} does not start where the previous one ends`);
    if (s.b <= s.a) err(`scene ${i} has no duration`);
    if (!s.board === !s.cards) err(`scene ${i} needs exactly one of board/cards`);
    if (s.board && !spec.boards[s.board]) err(`scene ${i} uses unknown board "${s.board}"`);
  });
  if (Math.abs(spec.scenes[spec.scenes.length - 1].b - spec.duration) > 1e-6) err('last scene must end at duration');
  if (spec.chapters[0]?.at !== 0) err('first chapter must start at 0 (YouTube chapters)');
  spec.chapters.forEach((c, i) => { const end = spec.chapters[i + 1]?.at ?? spec.duration; if (end - c.at < 10) err(`chapter "${c.title}" is shorter than 10s`); });
  if (spec.chapters.length < 3) err('YouTube needs at least 3 chapters');
  if (spec.cover.board && !spec.boards[spec.cover.board]) err('cover uses unknown board');
  const lib = shotLibrary(spec);
  spec.scenes.forEach((s, i) => s.cardShots?.forEach((id) => { if (id && !lib[id]?.src) err(`scene ${i} card uses unknown shot "${id}"`); }));
  (spec.beats ?? []).forEach((b, i, all) => {
    if (!lib[b.shot]) err(`beat ${i} uses unknown shot "${b.shot}"`);
    if (b.b <= b.a || b.a < 0 || b.b > spec.duration) err(`beat ${i} has invalid timing`);
    if (i && b.a < all[i - 1].b) err(`beat ${i} overlaps the previous beat`);
  });
  const bounds = spec.scenes.map((s) => s.a).concat(spec.duration);
  spec.clips?.forEach((c) => {
    if (![c.a, c.b].every((x) => bounds.some((y) => Math.abs(x - y) < 1e-6))) err(`clip ${c.name} must start and end on scene boundaries`);
    if (c.b - c.a < 15 || c.b - c.a > 60) err(`clip ${c.name} should be 15–60s`);
  });
  words.forEach((w, i) => { if (w.e < w.s || w.s < 0 || w.e > spec.duration + .05 || (i && w.s < words[i - 1].s)) err(`word ${i} "${w.w}" has invalid timing`); });
  return d;
};

export const shortFrames = (spec: SourceSpec) => Math.round(spec.duration * FPS);
export const endSeconds = (spec: SourceSpec) => spec.long?.endSeconds ?? 20;
export const longFrames = (spec: SourceSpec) => Math.round((spec.duration + endSeconds(spec)) * FPS);
const findClip = (spec: SourceSpec, name: string) => spec.clips!.find((c) => c.name === name)!;
export const clipFrames = (spec: SourceSpec, name: string) => { const c = findClip(spec, name); return Math.round((c.b - c.a) * FPS); };

const mix = (f: number, at: number, d = 14) => interpolate(f, [at, at + d], [0, 1], clamp);
const sceneAt = (spec: SourceSpec, t: number) => spec.scenes.find((s) => t >= s.a && t < s.b) ?? spec.scenes[spec.scenes.length - 1];
const punchAt = (spec: SourceSpec, t: number) => (spec.punch ?? []).some(([a, b]) => t >= a && t < b) ? 1.035 : 1;
const media = (spec: SourceSpec, file: string) => staticFile(`${spec.media}/${file}`);

const sceneBoard = (spec: SourceSpec, scene: SourceScene, f: number) =>
  <BoardPlate spec={spec} board={scene.board!} names={scene.names} progress={mix(f - scene.a * FPS, 25, 85)} />;

const Cards: React.FC<{spec: SourceSpec; scene: SourceScene; f: number; width: number; height: number; size?: number}> = ({spec, scene, f, width, height, size = 54}) => {
  const lib = shotLibrary(spec);
  return <div style={{width, height, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24}}>
    {scene.cards?.map(([a, b], i) => {
      const k = mix(f, scene.a * FPS + (scene.cardDelays?.[i] ?? i * .3) * FPS);
      const photo = scene.cardShots?.[i] ? lib[scene.cardShots[i]!] : undefined;
      return <div key={a} style={{display: 'flex', alignItems: 'center', gap: 26, borderLeft: `5px solid ${i ? '#3c75db' : GOLD}`, padding: photo ? '16px 30px 16px 18px' : '24px 30px', background: '#101c30', borderRadius: 12, opacity: k, transform: `translateX(${(1 - k) * 20}px)`}}>
        {photo && <Thumb shot={photo} size={Math.round(size * 2.3)} />}
        <div>
          <div style={{fontFamily: LOCAL_FONTS.display, fontSize: size, color: i ? '#f5f4ef' : GOLD}}>{a}</div>
          <div style={{fontSize: Math.round(size * .46), fontWeight: 700, letterSpacing: 2, marginTop: 5, color: '#b9c7d8'}}>{b}</div>
        </div>
      </div>;
    })}
  </div>;
};

/** The active photo beat (if any) drawn into a panel of the given size, with a quick scale-in and flash. */
const BeatPanel: React.FC<{spec: SourceSpec; f: number; width: number; height: number; labelSize: number}> = ({spec, f, width, height, labelSize}) => {
  const t = f / FPS; const bi = (spec.beats ?? []).findIndex((b) => t >= b.a && t < b.b);
  if (bi < 0) return null;
  const beat = spec.beats![bi]; const local = f - Math.round(beat.a * FPS); const len = Math.round((beat.b - beat.a) * FPS);
  const k = interpolate(local, [0, 7], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const out = interpolate(local, [len - 6, len], [1, 0], clamp);
  return <div style={{position: 'absolute', inset: 0, width, height, borderRadius: 24, overflow: 'hidden', opacity: Math.min(k, out), transform: `scale(${0.96 + 0.04 * k})`, boxShadow: '0 22px 60px #000a', border: `3px solid ${GOLD}70`}}>
    <Shot spec={spec} shot={shotLibrary(spec)[beat.shot]} local={local} len={len} index={bi} labelSize={labelSize} />
    <AbsoluteFill style={{background: '#fff', opacity: interpolate(local, [0, 3], [.45, 0], clamp)}} />
  </div>;
};

const BeatSfx: React.FC<{spec: SourceSpec; offset?: number}> = ({spec}) => <>
  {(spec.beats ?? []).map((b, i) => <Sequence key={i} from={Math.max(0, Math.round(b.a * FPS) - 3)} durationInFrames={30}><Audio src={staticFile('sfx/whoosh.wav')} volume={.1} /></Sequence>)}
</>;

const Presenter: React.FC<{spec: SourceSpec; t: number; style: React.CSSProperties}> = ({spec, t, style}) =>
  <div style={{position: 'absolute', overflow: 'hidden', background: '#152133', border: '2px solid #ffffff28', boxShadow: '0 22px 65px #0007', ...style}}>
    <OffthreadVideo src={media(spec, 'presenter.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 36%', transform: `scale(${punchAt(spec, t)})`, filter: 'contrast(1.025) saturate(0.98)'}} />
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(transparent 62%, #080e1b99 100%)', pointerEvents: 'none'}} />
  </div>;

// ---------------- vertical Short (1080×1920) ----------------
/** `window` (seconds) limits progress bar and music envelope to a clip of the take; frames stay on the source timeline. */
export const SourceShort: React.FC<SourceEpisodeProps & {window?: [number, number]}> = ({spec, words, window}) => {
  const f = useCurrentFrame(); const t = f / FPS; const scene = sceneAt(spec, t);
  const [wa, wb] = window ? [Math.round(window[0] * FPS), Math.round(window[1] * FPS)] : [0, shortFrames(spec)];
  const enter = mix(f, scene.a * FPS);
  return <AbsoluteFill style={{background: '#080e1b', color: '#f5f4ef', fontFamily: LOCAL_FONTS.body}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 10% 30%, #1f5fd629, transparent 55%), radial-gradient(ellipse at 95% 65%, #b3123f29, transparent 60%)'}} />
    <div style={{position: 'absolute', top: 74, left: 64, right: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><span style={{fontFamily: LOCAL_FONTS.display, fontSize: 38, letterSpacing: 2}}>BARÇA <span style={{color: GOLD}}>RADAR</span></span><span style={{fontSize: 20, fontWeight: 700, letterSpacing: 3, color: '#b0bfd3'}}>{spec.label}</span></div>
    <div style={{position: 'absolute', left: 64, top: 157, right: 64, opacity: enter, transform: `translateY(${(1 - enter) * 14}px)`}}>
      <div style={{color: GOLD, fontSize: 21, fontWeight: 800, letterSpacing: 3, marginBottom: 12}}>{scene.sub}</div>
      <div style={{fontFamily: LOCAL_FONTS.display, fontSize: scene.title.length > 25 ? 64 : 76, lineHeight: 1.04}}>{scene.title}</div>
    </div>
    <div style={{position: 'absolute', left: 60, top: 305, opacity: enter}}>
      {scene.board ? sceneBoard(spec, scene, f) : <Cards spec={spec} scene={scene} f={f} width={960} height={500} />}
    </div>
    <div style={{position: 'absolute', left: 60, top: 305, width: 960, height: 610}}><BeatPanel spec={spec} f={f} width={960} height={610} labelSize={30} /></div>
    <Presenter spec={spec} t={t} style={{left: 90, top: 940, width: 900, height: 810, borderRadius: 24}} />
    <ReviewedCaptions words={words} top={1540} width={860} />
    <div style={{position: 'absolute', bottom: 89, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', color: '#a4b1c4', fontSize: 20, letterSpacing: 2}}><span>WITH {spec.presenter}</span><span>TACTICAL ANALYSIS</span></div>
    <div style={{position: 'absolute', bottom: 68, left: 70, width: 940, height: 3, background: '#ffffff1a'}}><div style={{height: 3, width: `${(f - wa) / (wb - wa) * 100}%`, background: GOLD}} /></div>
    <Audio src={media(spec, 'voice.wav')} volume={window ? (fr) => interpolate(fr, [wb - 6, wb], [1, 0], clamp) : undefined} />
    <Audio src={media(spec, 'score.wav')} volume={(fr) => .22 * interpolate(fr, [wa, wa + 60, wb - 75, wb], [0, 1, 1, 0], clamp)} />
    <BeatSfx spec={spec} />
  </AbsoluteFill>;
};

/** A clip Short: the vertical layout shifted so the clip's first frame is source time `a`. */
export const SourceClip: React.FC<SourceClipProps> = ({spec, words, clip}) => {
  const c = findClip(spec, clip);
  return <Sequence from={-Math.round(c.a * FPS)}><SourceShort spec={spec} words={words} window={[c.a, c.b]} /></Sequence>;
};

// ---------------- long-form (1920×1080) ----------------
type Box = {x: number; y: number; w: number; h: number};
const SPLIT: Box = {x: 70, y: 200, w: 640, h: 640};   // presenter beside a board
const HOST: Box = {x: 70, y: 150, w: 760, h: 760};    // presenter-led scene with cards
const lerp = (a: Box, b: Box, k: number): Box => ({x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, w: a.w + (b.w - a.w) * k, h: a.h + (b.h - a.h) * k});

const chapterIndex = (spec: SourceSpec, t: number) => { let i = 0; while (i + 1 < spec.chapters.length && spec.chapters[i + 1].at <= t) i++; return i; };

const EndScreen: React.FC<{spec: SourceSpec; f: number}> = ({spec, f}) =>
  <AbsoluteFill>
    <RadarBg tint={GRANA} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', opacity: mix(f, 0)}}>
      <div style={{fontFamily: LOCAL_FONTS.display, fontSize: 110, color: '#fff'}}>BARÇA <span style={{color: GOLD}}>RADAR</span></div>
      <div style={{fontWeight: 900, fontSize: 28, letterSpacing: 6, color: GOLD}}>{spec.long?.endKicker ?? 'WATCH NEXT'}</div>
    </div>
    {/* Placeholders sized for YouTube end-screen elements (added in Studio after upload). */}
    {[0, 1].map((k) => <div key={k} style={{position: 'absolute', left: 140 + k * 860, top: 330, width: 780, height: 440, borderRadius: 18, border: '3px dashed #ffffff40', background: '#ffffff08', opacity: mix(f, 6 + k * 6)}} />)}
    <div style={{position: 'absolute', left: 860, top: 820, transform: `scale(${interpolate(f, [18, 24, 29], [0, 1.08, 1], {...clamp, easing: Easing.out(Easing.cubic)})})`}}><Mark size={200} brand="radar" /></div>
  </AbsoluteFill>;

export const SourceLong: React.FC<SourceEpisodeProps> = ({spec, words}) => {
  const f = useCurrentFrame(); const t = f / FPS; const main = shortFrames(spec); const total = longFrames(spec);
  const si = spec.scenes.indexOf(sceneAt(spec, t)); const scene = spec.scenes[si]; const prev = spec.scenes[Math.max(0, si - 1)];
  const enter = mix(f, scene.a * FPS);
  const layout = (s: SourceScene) => s.board ? SPLIT : HOST;
  const box = lerp(layout(prev), layout(scene), si === 0 ? 1 : interpolate(f, [scene.a * FPS, scene.a * FPS + 14], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)}));
  const ci = chapterIndex(spec, t); const chapter = spec.chapters[ci]; const chapterIn = mix(f, chapter.at * FPS, 12);
  const right = box.x + box.w + 60;
  const musicVol = (fr: number) => fr < main ? .18 * interpolate(fr, [0, 60], [0, 1], clamp) : interpolate(fr, [main, main + 20, total - 45, total], [.18, .5, .5, 0], clamp);
  return <AbsoluteFill style={{background: '#07102a', color: '#f5f4ef', fontFamily: LOCAL_FONTS.body}}>
    {f < main ? <>
      <RadarBg tint={ci % 2 ? BLAU : GRANA} />
      <div style={{position: 'absolute', top: 44, left: 70, display: 'flex', alignItems: 'baseline', gap: 22}}>
        <span style={{fontFamily: LOCAL_FONTS.display, fontSize: 40, letterSpacing: 2}}>BARÇA <span style={{color: GOLD}}>RADAR</span></span>
        <span style={{fontSize: 20, fontWeight: 700, letterSpacing: 3, color: '#b0bfd3'}}>{spec.label}</span>
      </div>
      {ci > 0 && <div style={{position: 'absolute', top: 46, right: 150, opacity: chapterIn, transform: `translateY(${(1 - chapterIn) * -16}px)`, display: 'flex', alignItems: 'center', gap: 14, background: '#050914d9', border: '1px solid #ffffff1f', borderRadius: 12, padding: '8px 18px'}}>
        <span style={{fontFamily: LOCAL_FONTS.display, fontSize: 26, color: GOLD}}>{String(ci).padStart(2, '0')}/{String(spec.chapters.length - 1).padStart(2, '0')}</span>
        <span style={{fontWeight: 800, fontSize: 20, letterSpacing: 2.5}}>{chapter.title.toUpperCase()}</span>
      </div>}
      <div style={{position: 'absolute', left: right, top: 128, right: 70, opacity: enter, transform: `translateY(${(1 - enter) * 14}px)`}}>
        <div style={{color: GOLD, fontSize: 24, fontWeight: 800, letterSpacing: 3, marginBottom: 10}}>{scene.sub}</div>
        <div style={{fontFamily: LOCAL_FONTS.display, fontSize: scene.title.length > 22 ? 62 : 74, lineHeight: 1.04}}>{scene.title}</div>
      </div>
      <div style={{position: 'absolute', left: right, top: scene.board ? 290 : 330, opacity: enter}}>
        {scene.board ? <div style={{transform: 'scale(1.08)', transformOrigin: '0 0'}}>{sceneBoard(spec, scene, f)}</div>
          : <Cards spec={spec} scene={scene} f={f} width={1920 - right - 70} height={540} size={60} />}
      </div>
      <div style={{position: 'absolute', left: right, top: 290, width: 1920 - right - 70, height: 640}}><BeatPanel spec={spec} f={f} width={1920 - right - 70} height={640} labelSize={34} /></div>
      <Presenter spec={spec} t={t} style={{left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: 26}} />
      {t < 6 && <div style={{position: 'absolute', left: box.x + 34, top: box.y + box.h - 140, opacity: mix(f, 24) * (1 - mix(f, 5.4 * FPS)), display: 'flex', alignItems: 'center', gap: 16, background: '#050914e6', padding: '12px 26px 12px 14px', borderRadius: 16, borderLeft: `8px solid ${GOLD}`}}>
        <Mark size={70} brand="radar" />
        <div><div style={{fontFamily: LOCAL_FONTS.display, fontSize: 46, lineHeight: 1}}>{spec.presenter}</div><div style={{fontWeight: 900, fontSize: 22, color: GOLD, letterSpacing: 4}}>BARÇA RADAR</div></div>
      </div>}
      <ReviewedCaptions words={words} top={958} width={1500} frameWidth={1920} maxFontSize={50} />
      <div style={{position: 'absolute', bottom: 22, left: 70, width: 1780, height: 4, background: '#ffffff1a'}}>
        <div style={{height: 4, width: `${f / main * 100}%`, background: GOLD}} />
        {spec.chapters.slice(1).map((c) => <div key={c.at} style={{position: 'absolute', top: -4, left: `${c.at / spec.duration * 100}%`, width: 3, height: 12, background: c.at <= t ? GOLD : '#ffffff55'}} />)}
      </div>
    </> : <EndScreen spec={spec} f={f - main} />}
    <div style={{position: 'absolute', right: 36, top: 30, opacity: .9}}><Mark size={74} brand="radar" /></div>
    <Audio src={media(spec, 'voice.wav')} />
    <Audio src={media(spec, 'score-long.wav')} volume={musicVol} />
    <BeatSfx spec={spec} />
  </AbsoluteFill>;
};

// ---------------- stills ----------------
const CoverLines: React.FC<{spec: SourceSpec; size: number}> = ({spec, size}) =>
  <>{spec.cover.lines.map((l, i) => <div key={l} style={{fontFamily: LOCAL_FONTS.display, fontSize: size, lineHeight: 1.02, color: i === spec.cover.lines.length - 1 ? GOLD : '#fff'}}>{l}</div>)}</>;

export const SourceCover: React.FC<SourceEpisodeProps> = ({spec}) => <AbsoluteFill style={{background: '#080e1b', color: '#fff', fontFamily: LOCAL_FONTS.body}}>
  <div style={{position: 'absolute', top: 86, left: 70, fontFamily: LOCAL_FONTS.display, fontSize: 45}}>BARÇA <span style={{color: GOLD}}>RADAR</span></div>
  <div style={{position: 'absolute', top: 180, left: 70, color: GOLD, fontSize: 26, fontWeight: 800, letterSpacing: 4}}>{spec.cover.kicker}</div>
  <div style={{position: 'absolute', top: 245, left: 70, right: 70}}><CoverLines spec={spec} size={130} /></div>
  {spec.cover.board && <div style={{position: 'absolute', top: 565, left: 60}}><BoardPlate spec={spec} board={spec.cover.board} progress={1} /></div>}
  <div style={{position: 'absolute', left: 110, top: 1200, width: 860, height: 620, overflow: 'hidden', borderRadius: 26, border: '3px solid #f2c23080'}}><Img src={media(spec, 'cover.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 25%'}} /></div>
</AbsoluteFill>;

/** YouTube thumbnail 1280×720 for the long-form version. */
export const SourceThumb: React.FC<SourceEpisodeProps> = ({spec}) => <AbsoluteFill style={{background: 'linear-gradient(120deg, #07102a 0%, #10204e 55%, #0b2a6b 100%)', fontFamily: LOCAL_FONTS.body}}>
  <AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 78% 50%, #b3123f40 0%, transparent 45%)'}} />
  <div style={{position: 'absolute', left: 40, top: 70, width: 580, height: 580, borderRadius: 34, overflow: 'hidden', border: `8px solid ${GOLD}`, transform: 'rotate(-3deg)', boxShadow: '0 30px 80px #000'}}>
    <Img src={media(spec, 'cover.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%', transform: 'scale(1.08)'}} />
  </div>
  <div style={{position: 'absolute', left: 670, top: 60, width: 580}}>
    <div style={{display: 'inline-block', fontFamily: LOCAL_FONTS.display, fontSize: 44, color: '#000', background: GOLD, padding: '2px 18px', borderRadius: 10}}>{spec.label}</div>
    <div style={{marginTop: 18, textShadow: '0 8px 0 #0008'}}><CoverLines spec={spec} size={150} /></div>
    <div style={{marginTop: 18, fontWeight: 900, fontSize: 30, letterSpacing: 4, color: '#dfe7f3'}}>TACTICAL BREAKDOWN</div>
  </div>
  <div style={{position: 'absolute', right: 26, bottom: 22}}><Mark size={96} brand="radar" /></div>
</AbsoluteFill>;
