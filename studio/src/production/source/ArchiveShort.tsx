// BARÇA RADAR — "Archive Split" Short: licensed archive B-roll on top, presenter below, full-frame punch-ins
// and typographic cards, all cued on the presenter's own timeline (spec.archive in <id>.spec.json).
// Rhythm comes from the speech: a new shot when the sentence names a new place, person or moment.
import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {LOCAL_FONTS} from '../fonts';
import {ReviewedCaptions} from '../Captions';
import {Grain} from '../../lib';
import {Mark} from '../../Branding';
import {FPS, BoardPlate, type SourceEpisodeProps, type SourceSpec} from './SourceEpisode';

const GOLD = '#f2c230', NAVY = '#07102a';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export type ArchiveShot = {src?: string; board?: string; kind?: 'image' | 'video' | 'board'; grade?: 'bw' | 'warm' | 'none'; label?: string; focus?: [number, number]; from?: number; zoom?: 'in' | 'out'};
export type ArchiveCue = {a: number; b: number; layout: 'split' | 'full' | 'card'; shot?: string; punch?: boolean; card?: string[]; cardStyle?: 'light' | 'dark' | 'gold'; sfx?: string};
export type ArchiveSpec = {media?: string; hook?: {text: string; until: number}; cta?: {at: number; text: string}; shots: Record<string, ArchiveShot>; cues: ArchiveCue[]};
type Props = SourceEpisodeProps & {window?: [number, number]};

const SPLIT_Y = 840; // B-roll occupies 0–840, presenter 840–1920 (≈ 44/56, like the reference format)
const archive = (spec: SourceSpec) => (spec as SourceSpec & {archive: ArchiveSpec}).archive;

export const validateArchive = (spec: SourceSpec) => {
  const ar = archive(spec); if (!ar) return;
  const err = (m: string) => { throw new Error(`${spec.id} archive: ${m}`); };
  ar.cues.forEach((c, i) => {
    if (i === 0 ? c.a !== 0 : Math.abs(c.a - ar.cues[i - 1].b) > 1e-6) err(`cue ${i} must start where the previous cue ends`);
    if (c.b <= c.a) err(`cue ${i} has no duration`);
    if (c.layout === 'split' && !(c.shot && ar.shots[c.shot])) err(`cue ${i} needs a known shot`);
    if (c.layout === 'card' && !c.card?.length) err(`cue ${i} needs card text`);
    const sh = c.shot ? ar.shots[c.shot] : undefined;
    if (sh && (sh.kind === 'board' ? !spec.boards[sh.board ?? ''] : !sh.src)) err(`shot ${c.shot} needs a src or a known board`);
  });
  if (Math.abs(ar.cues[ar.cues.length - 1].b - spec.duration) > 1e-6) err('last cue must end at duration');
};

const gradeFilter = (g: ArchiveShot['grade']) =>
  g === 'bw' ? 'grayscale(1) contrast(1.18) brightness(0.95)' : g === 'warm' ? 'sepia(0.35) saturate(1.1) contrast(1.06)' : 'contrast(1.04) saturate(1.05)';

/** One B-roll shot with slow push (Ken Burns), archive grade, vignette and an optional label. */
const Shot: React.FC<{spec: SourceSpec; shot: ArchiveShot; local: number; len: number; index: number; height: number}> = ({spec, shot, local, len, index, height}) => {
  if (shot.kind === 'board') return <AbsoluteFill style={{height, background: 'radial-gradient(ellipse at 50% 40%, #12305a, #07102a 70%)', alignItems: 'center', justifyContent: 'center'}}>
    <div style={{transform: 'scale(1.08)'}}><BoardPlate spec={spec} board={shot.board!} progress={interpolate(local, [6, 50], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)})} /></div>
  </AbsoluteFill>;
  const k = interpolate(local, [0, len], [0, 1], clamp);
  const zoomIn = shot.zoom ? shot.zoom === 'in' : index % 2 === 0;
  const scale = zoomIn ? 1.04 + 0.08 * k : 1.12 - 0.08 * k;
  const [fx, fy] = shot.focus ?? [50, 45];
  const drift = (index % 2 ? -1 : 1) * 14 * k;
  const style: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${fx}% ${fy}%`, transform: `scale(${scale}) translateX(${drift}px)`, transformOrigin: `${fx}% ${fy}%`, filter: gradeFilter(shot.grade)};
  const labelIn = interpolate(local, [4, 12], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return <AbsoluteFill style={{height, overflow: 'hidden', background: '#000'}}>
    {shot.kind === 'video'
      ? <OffthreadVideo src={staticFile(shot.src!)} muted startFrom={Math.round((shot.from ?? 0) * FPS)} style={style} />
      : <Img src={staticFile(shot.src!)} style={style} />}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, #000a 100%)'}} />
    {shot.grade === 'bw' && <Grain opacity={0.16} />}
    {shot.label && <div style={{position: 'absolute', left: 40, bottom: 34, opacity: labelIn, transform: `translateX(${(1 - labelIn) * -24}px)`, display: 'flex', alignItems: 'center', gap: 12}}>
      <div style={{width: 6, height: 38, background: GOLD}} />
      <div style={{fontFamily: LOCAL_FONTS.body, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: '#fff', textShadow: '0 2px 10px #000'}}>{shot.label}</div>
    </div>}
  </AbsoluteFill>;
};

const Card: React.FC<{lines: string[]; style?: ArchiveCue['cardStyle']; local: number}> = ({lines, style = 'light', local}) => {
  const bg = style === 'light' ? '#f6f4ee' : style === 'gold' ? GOLD : NAVY;
  const fg = style === 'dark' ? '#fff' : '#0a0f1c';
  const s = interpolate(local, [0, 6], [1.18, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return <AbsoluteFill style={{background: bg, alignItems: 'center', justifyContent: 'center'}}>
    <div style={{transform: `scale(${s})`, textAlign: 'center'}}>
      {lines.map((l, i) => <div key={i} style={{fontFamily: LOCAL_FONTS.display, fontSize: lines.length > 2 ? 120 : 150, lineHeight: 1, color: style === 'dark' && i === lines.length - 1 ? GOLD : fg, letterSpacing: 2}}>{l}</div>)}
    </div>
    {style !== 'light' && <Grain opacity={0.06} />}
  </AbsoluteFill>;
};

export const ArchiveShort: React.FC<Props> = ({spec, words, window}) => {
  const f = useCurrentFrame(); const t = f / FPS; const ar = archive(spec);
  const ci = Math.max(0, ar.cues.findIndex((c) => t >= c.a && t < c.b)); const cue = ar.cues[ci] ?? ar.cues[ar.cues.length - 1];
  const local = f - Math.round(cue.a * FPS); const len = Math.round((cue.b - cue.a) * FPS);
  const [wa, wb] = window ? [Math.round(window[0] * FPS), Math.round(window[1] * FPS)] : [0, Math.round(spec.duration * FPS)];
  const media = ar.media ?? spec.media;
  const split = cue.layout === 'split';
  // Presenter: split → bottom panel; full → whole frame (square source is centred on a blurred copy of itself).
  const punch = cue.punch ? 1.1 : 1;
  const shotIndex = ar.cues.slice(0, ci + 1).filter((c) => c.layout === 'split').length;
  const flash = interpolate(local, [0, 3], [0.55, 0], clamp) * (ci > 0 && (split || cue.layout !== ar.cues[ci - 1].layout) ? 1 : 0);
  const hook = ar.hook && t < ar.hook.until;
  const ctaK = ar.cta ? interpolate(t, [ar.cta.at, ar.cta.at + .25, ar.cta.at + 2.6, ar.cta.at + 2.9], [0, 1, 1, 0], clamp) : 0;
  const presenter = (top: number, height: number) => <div style={{position: 'absolute', left: 0, top, width: 1080, height, overflow: 'hidden', background: '#000'}}>
    <OffthreadVideo src={staticFile(`${media}/presenter.mp4`)} muted style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(40px) brightness(0.45)', transform: 'scale(1.2)'}} />
    <OffthreadVideo src={staticFile(`${media}/presenter.mp4`)} muted style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: height > 1400 ? 'contain' : 'cover', objectPosition: '50% 30%', transform: `scale(${punch})`, transformOrigin: '50% 35%', filter: 'contrast(1.04) saturate(1.04)'}} />
  </div>;
  return <AbsoluteFill style={{background: '#000', fontFamily: LOCAL_FONTS.body}}>
    {cue.layout === 'card' ? <Card lines={cue.card!} style={cue.cardStyle} local={local} /> : <>
      {split ? presenter(SPLIT_Y, 1920 - SPLIT_Y) : presenter(0, 1920)}
      {split && <Shot spec={spec} shot={ar.shots[cue.shot!]} local={local} len={len} index={shotIndex} height={SPLIT_Y} />}
      {split && <div style={{position: 'absolute', left: 0, top: SPLIT_Y - 3, width: 1080, height: 6, background: `linear-gradient(90deg, ${GOLD}, #b3123f 60%, #1f5fd6)`}} />}
      <div style={{position: 'absolute', left: 0, right: 0, top: split ? SPLIT_Y + 1080 - 330 : 1440}}>
        <ReviewedCaptions words={words} top={0} width={900} maxFontSize={62} />
      </div>
    </>}
    {hook && <div style={{position: 'absolute', left: 60, right: 60, top: 300, textAlign: 'center', opacity: interpolate(f, [4, 12], [0, 1], clamp)}}>
      <div style={{display: 'inline-block', background: '#050914e0', borderRadius: 18, padding: '18px 30px', borderBottom: `6px solid ${GOLD}`}}>
        <div style={{fontFamily: LOCAL_FONTS.display, fontSize: 92, lineHeight: 1.02, color: '#fff'}}>{ar.hook!.text}</div>
      </div>
    </div>}
    {cue.layout !== 'card' && <div style={{position: 'absolute', top: split ? SPLIT_Y + 26 : 60, right: 30, display: 'flex', alignItems: 'center', gap: 10, opacity: .92}}>
      <Mark size={64} brand="radar" />
    </div>}
    {ctaK > 0 && <div style={{position: 'absolute', left: 0, right: 0, top: 1180, textAlign: 'center', opacity: ctaK, transform: `scale(${0.9 + 0.1 * ctaK})`}}>
      <span style={{fontFamily: LOCAL_FONTS.display, fontSize: 66, color: '#000', background: GOLD, padding: '8px 30px', borderRadius: 14}}>{ar.cta!.text}</span>
    </div>}
    <AbsoluteFill style={{background: '#fff', opacity: flash, pointerEvents: 'none'}} />
    <div style={{position: 'absolute', bottom: 0, left: 0, height: 6, width: `${(f - wa) / (wb - wa) * 100}%`, background: GOLD}} />
    <Audio src={staticFile(`${media}/voice.wav`)} volume={window ? (fr) => interpolate(fr, [wb - 6, wb], [1, 0], clamp) : undefined} />
    <Audio src={staticFile(`${media}/score.wav`)} volume={(fr) => .16 * interpolate(fr, [wa, wa + 45, wb - 60, wb], [0, 1, 1, 0], clamp)} />
    {ar.cues.map((c, i) => i > 0 && c.layout !== ar.cues[i - 1].layout || (c.layout === 'split' && i > 0)
      ? <Sequence key={i} from={Math.round(c.a * FPS) - 3} durationInFrames={40}><Audio src={staticFile(`sfx/${c.sfx ?? (c.layout === 'card' ? 'impact' : 'whoosh')}.wav`)} volume={c.layout === 'card' ? .32 : .12} /></Sequence> : null)}
  </AbsoluteFill>;
};
