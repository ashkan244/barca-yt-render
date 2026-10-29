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
import {Counter, Shake, Slam, Stamp, TRANSITIONS, TransitionIn, TransitionOut, TransitionOverlay, Typewriter, WordPop, needsOutgoing, styleDirection, styleTransition,
  type CardMotion, type Direction, type TransitionName, type TransitionStyle} from '../motion';
export type {ArchiveShot} from './Shot';

const GOLD = '#f2c230', NAVY = '#07102a';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** A split cue shows `shot`, or several `shots` in a row (starting at `at`, seconds; evenly spaced if omitted).
 *  `transition` names the cut into each shot (one name for the cue's first shot, or one per shot); without it the
 *  archive `style` decides. Cards: `cardMotion` picks how the text lands (`count` animates a number on the first
 *  line) and `stamp` adds a verdict. */
export type ArchiveCue = {a: number; b: number; layout: 'split' | 'full' | 'card'; shot?: string; shots?: string[]; at?: number[]; punch?: boolean; card?: string[]; cardStyle?: 'light' | 'dark' | 'gold'; sfx?: string;
  transition?: TransitionName | TransitionName[]; dir?: Direction; cardMotion?: CardMotion; stamp?: string};
/** `style` = transition preset (energetic | documentary | clean). `hook.motion` = how the opening line lands. */
export type ArchiveSpec = {media?: string; style?: TransitionStyle; hook?: {text: string; until: number; motion?: 'fade' | 'pop' | 'slam'; hot?: string[]}; cta?: {at: number; text: string}; shots: Record<string, ArchiveShot>; cues: ArchiveCue[]};
type Props = SourceEpisodeProps & {window?: [number, number]};

const cueShots = (c: ArchiveCue) => c.shots ?? (c.shot ? [c.shot] : []);
/** Start times (seconds) of each shot in a split cue. */
const shotStarts = (c: ArchiveCue) => { const n = cueShots(c).length; return c.at ?? Array.from({length: n}, (_, k) => c.a + (c.b - c.a) * k / n); };
/** Every split shot on one flat timeline (frames), with the cut that brings it in. */
type Segment = {id: string; a: number; b: number; index: number; cue: number; k: number; transition: TransitionName; dir: Direction};
const segments = (ar: ArchiveSpec): Segment[] => {
  const out: Segment[] = []; let cueStarts = 0;
  ar.cues.forEach((c, ci) => {
    if (c.layout !== 'split') return;
    const st = shotStarts(c); const first = cueStarts++;
    cueShots(c).forEach((id, k) => {
      const given = Array.isArray(c.transition) ? c.transition[k] : k === 0 ? c.transition : undefined;
      const transition = ci === 0 && k === 0 ? 'cut' : given ?? styleTransition(ar.style, k === 0 ? first : out.length, k > 0);
      out.push({id, a: Math.round(st[k] * FPS), b: Math.round((st[k + 1] ?? c.b) * FPS), index: out.length, cue: ci, k, transition, dir: c.dir ?? styleDirection(out.length)});
    });
  });
  return out;
};
const firstTransition = (c: ArchiveCue) => Array.isArray(c.transition) ? c.transition[0] : c.transition;
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
    if (Array.isArray(c.transition) && c.transition.length !== list.length) err(`cue ${i} needs one transition per shot`);
    [c.transition ?? []].flat().forEach((n) => { if (!TRANSITIONS[n]) err(`cue ${i} has unknown transition "${n}"`); });
    list.forEach((id) => { const sh = ar.shots[id]; if (sh && (sh.kind === 'board' ? !spec.boards[sh.board ?? ''] : !sh.src)) err(`shot ${id} needs a src or a known board`); });
  });
  if (Math.abs(ar.cues[ar.cues.length - 1].b - spec.duration) > 1e-6) err('last cue must end at duration');
};

const Card: React.FC<{lines: string[]; style?: ArchiveCue['cardStyle']; motion?: CardMotion; stamp?: string; local: number}> = ({lines, style = 'light', motion = 'scale', stamp, local}) => {
  const bg = style === 'light' ? '#f6f4ee' : style === 'gold' ? GOLD : NAVY;
  const fg = style === 'dark' ? '#fff' : '#0a0f1c';
  const accent = style === 'dark' ? GOLD : style === 'gold' ? '#7a0f2b' : '#b3123f';
  const size = lines.length > 2 ? 120 : 150;
  const s = interpolate(local, [0, 6], [1.18, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const body = motion === 'slam' ? <Slam lines={lines} local={local} size={size} color={fg} accent={accent} />
    : motion === 'pop' ? <div style={{width: 940}}><WordPop text={lines.join(' ')} local={local} size={size * .8} color={fg} hot={[lines[lines.length - 1]]} /></div>
    : motion === 'type' ? <div style={{width: 900}}><Typewriter text={lines.join('\n')} local={local} size={size * .55} color={fg} font={LOCAL_FONTS.display} /></div>
    : motion === 'count' ? <Counter value={lines[0]} local={local} label={lines.slice(1).join(' ')} size={size * 1.6} color={accent} />
    : <div style={{transform: `scale(${s})`, textAlign: 'center'}}>
      {lines.map((l, i) => <div key={i} style={{fontFamily: LOCAL_FONTS.display, fontSize: size, lineHeight: 1, color: style === 'dark' && i === lines.length - 1 ? GOLD : fg, letterSpacing: 2}}>{l}</div>)}
    </div>;
  return <AbsoluteFill style={{background: bg, alignItems: 'center', justifyContent: 'center'}}>
    {body}
    {stamp && <div style={{position: 'absolute', bottom: 520, right: 90}}><Stamp text={stamp} local={local - 14} /></div>}
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
  // Current shot (several shots per sentence keep the B-roll moving every 2–3 s); the previous one stays
  // underneath while a push/whip/iris/wipe reveals the new one.
  const segs = React.useMemo(() => segments(ar), [ar]);
  const si = segs.findIndex((s) => f >= s.a && f < s.b); const seg = segs[si];
  const prev = seg && si > 0 && segs[si - 1].b === seg.a && needsOutgoing(seg.transition) ? segs[si - 1] : undefined;
  const segLocal = seg ? f - seg.a : 0;
  // Layout changes (split ↔ full ↔ card) use a flash unless the cue names a transition.
  const layoutTr: TransitionName = ci > 0 && cue.layout !== ar.cues[ci - 1].layout ? firstTransition(cue) ?? 'flash' : 'cut';
  const hook = ar.hook && t < ar.hook.until;
  const ctaK = ar.cta ? interpolate(t, [ar.cta.at, ar.cta.at + .25, ar.cta.at + 2.6, ar.cta.at + 2.9], [0, 1, 1, 0], clamp) : 0;
  const presenter = (top: number, height: number) => <div style={{position: 'absolute', left: 0, top, width: 1080, height, overflow: 'hidden', background: '#000'}}>
    <OffthreadVideo src={staticFile(`${media}/presenter.mp4`)} muted style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(40px) brightness(0.45)', transform: 'scale(1.2)'}} />
    <Shake frame={local} at={0} amount={cue.punch ? 12 : 0}>
      <OffthreadVideo src={staticFile(`${media}/presenter.mp4`)} muted style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: height > 1400 ? 'contain' : 'cover', objectPosition: '50% 30%', transform: `scale(${punch})`, transformOrigin: '50% 35%', filter: 'contrast(1.04) saturate(1.04)'}} />
    </Shake>
  </div>;
  const shotAt = (s: Segment) => <Shot spec={spec} shot={ar.shots[s.id]} local={f - s.a} len={s.b - s.a} index={s.index} />;
  return <AbsoluteFill style={{background: '#000', fontFamily: LOCAL_FONTS.body}}>
    {cue.layout === 'card' ? <Card lines={cue.card!} style={cue.cardStyle} motion={cue.cardMotion} stamp={cue.stamp} local={local} /> : <>
      {split ? presenter(SPLIT_Y, 1920 - SPLIT_Y) : presenter(0, 1920)}
      {split && seg && <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: SPLIT_Y, overflow: 'hidden', background: '#000'}}>
        {prev && <TransitionOut name={seg.transition} local={segLocal} dir={seg.dir}>{shotAt(prev)}</TransitionOut>}
        <TransitionIn name={seg.transition} local={segLocal} dir={seg.dir} seed={seg.index}>{shotAt(seg)}</TransitionIn>
        <TransitionOverlay name={seg.transition} local={segLocal} seed={seg.index} />
      </div>}
      {split && <div style={{position: 'absolute', left: 0, top: SPLIT_Y - 3, width: 1080, height: 6, background: `linear-gradient(90deg, ${GOLD}, #b3123f 60%, #1f5fd6)`}} />}
      <div style={{position: 'absolute', left: 0, right: 0, top: split ? SPLIT_Y + 1080 - 330 : 1440}}>
        <ReviewedCaptions pages={pages} words={words} top={0} width={900} maxFontSize={62} minFontSize={50} emphasis={emphasisFor(spec)} />
      </div>
    </>}
    {hook && <div style={{position: 'absolute', left: 60, right: 60, top: 300, textAlign: 'center', opacity: interpolate(f, [4, 12], [0, 1], clamp)}}>
      <div style={{display: 'inline-block', background: '#050914e0', borderRadius: 18, padding: '18px 30px', borderBottom: `6px solid ${GOLD}`}}>
        {ar.hook!.motion === 'fade' ? <div style={{fontFamily: LOCAL_FONTS.display, fontSize: 92, lineHeight: 1.02, color: '#fff'}}>{ar.hook!.text}</div>
          : ar.hook!.motion === 'slam' ? <Slam lines={ar.hook!.text.split('\n')} local={f - 4} size={92} />
          : <WordPop text={ar.hook!.text} local={f - 4} size={92} hot={ar.hook!.hot} stagger={2} />}
      </div>
    </div>}
    {cue.layout !== 'card' && <div style={{position: 'absolute', top: split ? SPLIT_Y + 26 : 60, right: 30, display: 'flex', alignItems: 'center', gap: 10, opacity: .92}}>
      <Mark size={64} brand="radar" />
    </div>}
    {ctaK > 0 && <div style={{position: 'absolute', left: 0, right: 0, top: 1180, textAlign: 'center', opacity: ctaK, transform: `scale(${0.9 + 0.1 * ctaK})`}}>
      <span style={{fontFamily: LOCAL_FONTS.display, fontSize: 66, color: '#000', background: GOLD, padding: '8px 30px', borderRadius: 14}}>{ar.cta!.text}</span>
    </div>}
    <TransitionOverlay name={layoutTr} local={local} seed={ci} />
    <div style={{position: 'absolute', bottom: 0, left: 0, height: 6, width: `${(f - wa) / (wb - wa) * 100}%`, background: GOLD}} />
    <Audio src={staticFile(`${media}/voice.wav`)} volume={window ? (fr) => interpolate(fr, [wb - 6, wb], [1, 0], clamp) : undefined} />
    <Audio src={staticFile(`${media}/score.wav`)} volume={(fr) => .16 * interpolate(fr, [wa, wa + 45, wb - 60, wb], [0, 1, 1, 0], clamp)} />
    {/* Sound by role (no whoosh per photo): a sentence's first shot takes its transition's sound, photos inside a
        sentence stay silent unless the cue names `sfx`, cards land on an impact, layout changes use their transition's sound. */}
    {segs.map((s) => {
      const c = ar.cues[s.cue]; const role = TRANSITIONS[s.transition].sfx;
      const src = s.k === 0 ? c.sfx ?? role?.src : undefined;
      if (!src || s.a === 0) return null;
      return <Sequence key={`s${s.index}`} from={Math.max(0, s.a - 3)} durationInFrames={40}><Audio src={staticFile(`sfx/${src}.wav`)} volume={role?.volume ?? .1} /></Sequence>;
    })}
    {ar.cues.map((c, i) => {
      if (i === 0 || c.layout === 'split' || c.layout === ar.cues[i - 1].layout && c.layout !== 'card') return null;
      const tr = firstTransition(c) ?? 'flash';
      const src = c.sfx ?? (c.layout === 'card' ? 'impact' : TRANSITIONS[tr].sfx?.src);
      return src ? <Sequence key={`c${i}`} from={Math.max(0, Math.round(c.a * FPS) - 3)} durationInFrames={40}><Audio src={staticFile(`sfx/${src}.wav`)} volume={c.layout === 'card' ? .32 : TRANSITIONS[tr].sfx?.volume ?? .1} /></Sequence> : null;
    })}
  </AbsoluteFill>;
};
