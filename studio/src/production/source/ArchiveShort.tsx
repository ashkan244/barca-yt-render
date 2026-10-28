// BARÇA RADAR — "Archive Split" Short: licensed archive B-roll on top, presenter below, full-frame punch-ins
// and typographic cards, all cued on the presenter's own timeline (spec.archive in <id>.spec.json).
// Rhythm comes from the speech: a new shot when the sentence names a new place, person or moment.
import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {LOCAL_FONTS} from '../fonts';
import {ReviewedCaptions} from '../Captions';
import {Grain} from '../../lib';
import {Mark} from '../../Branding';
import {FPS, emphasisFor, type SourceEpisodeProps, type SourceSpec} from './SourceEpisode';
import {Shot, type ArchiveShot} from './Shot';
export type {ArchiveShot} from './Shot';

const GOLD = '#f2c230', NAVY = '#07102a';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** A split cue shows `shot`, or several `shots` in a row (starting at `at`, seconds; evenly spaced if omitted). */
export type ArchiveCue = {a: number; b: number; layout: 'split' | 'full' | 'card'; shot?: string; shots?: string[]; at?: number[]; punch?: boolean; card?: string[]; cardStyle?: 'light' | 'dark' | 'gold'; sfx?: string};
export type ArchiveSpec = {media?: string; hook?: {text: string; until: number}; cta?: {at: number; text: string}; shots: Record<string, ArchiveShot>; cues: ArchiveCue[]};
type Props = SourceEpisodeProps & {window?: [number, number]};

const cueShots = (c: ArchiveCue) => c.shots ?? (c.shot ? [c.shot] : []);
/** Start times (seconds) of each shot in a split cue. */
const shotStarts = (c: ArchiveCue) => { const n = cueShots(c).length; return c.at ?? Array.from({length: n}, (_, k) => c.a + (c.b - c.a) * k / n); };
const SPLIT_Y = 840; // B-roll occupies 0–840, presenter 840–1920 (≈ 44/56, like the reference format)
const archive = (spec: SourceSpec) => (spec as SourceSpec & {archive: ArchiveSpec}).archive;

export const validateArchive = (spec: SourceSpec) => {
  const ar = archive(spec); if (!ar) return;
  const err = (m: string) => { throw new Error(`${spec.id} archive: ${m}`); };
  ar.cues.forEach((c, i) => {
    if (i === 0 ? c.a !== 0 : Math.abs(c.a - ar.cues[i - 1].b) > 1e-6) err(`cue ${i} must start where the previous cue ends`);
    if (c.b <= c.a) err(`cue ${i} has no duration`);
    const list = cueShots(c);
    if (c.layout === 'split' && (!list.length || list.some((id) => !ar.shots[id]))) err(`cue ${i} needs known shots`);
    if (c.at && (c.at.length !== list.length || Math.abs(c.at[0] - c.a) > 1e-6 || c.at.some((x, k) => x >= c.b || (k && x <= c.at![k - 1])))) err(`cue ${i} has invalid shot times`);
    if (c.layout === 'card' && !c.card?.length) err(`cue ${i} needs card text`);
    list.forEach((id) => { const sh = ar.shots[id]; if (sh && (sh.kind === 'board' ? !spec.boards[sh.board ?? ''] : !sh.src)) err(`shot ${id} needs a src or a known board`); });
  });
  if (Math.abs(ar.cues[ar.cues.length - 1].b - spec.duration) > 1e-6) err('last cue must end at duration');
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

export const ArchiveShort: React.FC<Props> = ({spec, words, pages, window}) => {
  const f = useCurrentFrame(); const t = f / FPS; const ar = archive(spec);
  const ci = Math.max(0, ar.cues.findIndex((c) => t >= c.a && t < c.b)); const cue = ar.cues[ci] ?? ar.cues[ar.cues.length - 1];
  const local = f - Math.round(cue.a * FPS);
  const [wa, wb] = window ? [Math.round(window[0] * FPS), Math.round(window[1] * FPS)] : [0, Math.round(spec.duration * FPS)];
  const media = ar.media ?? spec.media;
  const split = cue.layout === 'split';
  // Presenter: split → bottom panel; full → whole frame (square source is centred on a blurred copy of itself).
  const punch = cue.punch ? 1.1 : 1;
  // Current shot inside a split cue (several shots per sentence keep the B-roll moving every 2–3 s).
  const starts = shotStarts(cue); let si = 0; while (si + 1 < starts.length && starts[si + 1] <= t) si++;
  const shotId = cueShots(cue)[si]; const shotA = Math.round((starts[si] ?? cue.a) * FPS);
  const shotLen = Math.round(((starts[si + 1] ?? cue.b) - (starts[si] ?? cue.a)) * FPS); const shotLocal = f - shotA;
  const shotIndex = ar.cues.slice(0, ci).reduce((n, c) => n + cueShots(c).length, 0) + si;
  const flash = split && (ci > 0 || si > 0) ? interpolate(shotLocal, [0, 3], [0.55, 0], clamp)
    : interpolate(local, [0, 3], [0.55, 0], clamp) * (ci > 0 && cue.layout !== ar.cues[ci - 1].layout ? 1 : 0);
  const hook = ar.hook && t < ar.hook.until;
  const ctaK = ar.cta ? interpolate(t, [ar.cta.at, ar.cta.at + .25, ar.cta.at + 2.6, ar.cta.at + 2.9], [0, 1, 1, 0], clamp) : 0;
  const presenter = (top: number, height: number) => <div style={{position: 'absolute', left: 0, top, width: 1080, height, overflow: 'hidden', background: '#000'}}>
    <OffthreadVideo src={staticFile(`${media}/presenter.mp4`)} muted style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(40px) brightness(0.45)', transform: 'scale(1.2)'}} />
    <OffthreadVideo src={staticFile(`${media}/presenter.mp4`)} muted style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: height > 1400 ? 'contain' : 'cover', objectPosition: '50% 30%', transform: `scale(${punch})`, transformOrigin: '50% 35%', filter: 'contrast(1.04) saturate(1.04)'}} />
  </div>;
  return <AbsoluteFill style={{background: '#000', fontFamily: LOCAL_FONTS.body}}>
    {cue.layout === 'card' ? <Card lines={cue.card!} style={cue.cardStyle} local={local} /> : <>
      {split ? presenter(SPLIT_Y, 1920 - SPLIT_Y) : presenter(0, 1920)}
      {split && <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: SPLIT_Y}}><Shot spec={spec} shot={ar.shots[shotId]} local={shotLocal} len={shotLen} index={shotIndex} /></div>}
      {split && <div style={{position: 'absolute', left: 0, top: SPLIT_Y - 3, width: 1080, height: 6, background: `linear-gradient(90deg, ${GOLD}, #b3123f 60%, #1f5fd6)`}} />}
      <div style={{position: 'absolute', left: 0, right: 0, top: split ? SPLIT_Y + 1080 - 330 : 1440}}>
        <ReviewedCaptions pages={pages} words={words} top={0} width={900} maxFontSize={62} minFontSize={50} emphasis={emphasisFor(spec)} />
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
    {ar.cues.flatMap((c, i) => {
      const at = c.layout === 'split' ? shotStarts(c) : [c.a];
      return at.map((x, k) => (i > 0 || k > 0) && (c.layout === 'split' || c.layout !== ar.cues[i - 1].layout)
        ? <Sequence key={`${i}-${k}`} from={Math.max(0, Math.round(x * FPS) - 3)} durationInFrames={40}><Audio src={staticFile(`sfx/${c.sfx ?? (c.layout === 'card' ? 'impact' : 'whoosh')}.wav`)} volume={c.layout === 'card' ? .32 : k ? .08 : .12} /></Sequence> : null);
    })}
  </AbsoluteFill>;
};
