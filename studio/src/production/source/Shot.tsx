// Shared visual atoms for source-led episodes: schematic boards and archive shots (photo / video / board)
// with archive grade, slow push, vignette and a name label. Used by the Short, long-form and Archive Split.
import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, Easing} from 'remotion';
import {LOCAL_FONTS} from '../fonts';
import {Grain} from '../../lib';
import {TacticalPlate} from '../TacticalPlate';
import type {SourceSpec} from './SourceEpisode';

const FPS = 30;
const GOLD = '#f2c230';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** A person's photo carries `label` only when the Commons file title names that person. Generic shots have no label. */
export type ArchiveShot = {src?: string; board?: string; names?: string[]; kind?: 'image' | 'video' | 'board'; grade?: 'bw' | 'warm' | 'none'; label?: string; focus?: [number, number]; from?: number; zoom?: 'in' | 'out'};

export const shotLibrary = (spec: SourceSpec): Record<string, ArchiveShot> =>
  (spec as SourceSpec & {archive?: {shots?: Record<string, ArchiveShot>}}).archive?.shots ?? {};

/** The scene's schematic board; `names` limits which labels are shown so attention stays on one relationship.
 *  `readable` (phone scale) enlarges labels and zooms to the board's `camera`; `stage` runs player moves,
 *  arrows and the highlighted space on their own spoken cues instead of one shared ramp. */
export const BoardPlate: React.FC<{spec: SourceSpec; board: string; names?: string[]; progress: number; readable?: boolean; height?: number;
  stage?: {move: number; arrow: number; space: number}}> = ({spec, board, names, progress, readable = false, height, stage}) => {
  const def = spec.boards[board];
  const players = names ? def.players.map((p) => ({...p, name: names.includes(p.id) ? p.name : undefined})) : def.players;
  return <TacticalPlate players={players} arrows={def.arrows} zone={def.zone} progress={progress} label={def.label ?? 'TACTICAL CONCEPT'} opponent={spec.opponent}
    readable={readable} height={height} camera={readable ? def.camera : undefined}
    movementProgress={stage?.move} arrowProgress={stage?.arrow} zoneProgress={stage?.space} />;
};

const gradeFilter = (g: ArchiveShot['grade']) =>
  g === 'bw' ? 'grayscale(1) contrast(1.18) brightness(0.95)' : g === 'warm' ? 'sepia(0.35) saturate(1.1) contrast(1.06)' : 'contrast(1.04) saturate(1.05)';

/** One shot filling its parent box: slow push (Ken Burns), grade, vignette and an optional label. */
export const Shot: React.FC<{spec: SourceSpec; shot: ArchiveShot; local: number; len: number; index: number; labelSize?: number}> = ({spec, shot, local, len, index, labelSize = 30}) => {
  if (shot.kind === 'board') return <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #12305a, #07102a 70%)', alignItems: 'center', justifyContent: 'center'}}>
    <div style={{transform: 'scale(1.08)'}}><BoardPlate spec={spec} board={shot.board!} names={shot.names} readable height={720} progress={interpolate(local, [6, 50], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)})} /></div>
  </AbsoluteFill>;
  const k = interpolate(local, [0, Math.max(1, len)], [0, 1], clamp);
  const zoomIn = shot.zoom ? shot.zoom === 'in' : index % 2 === 0;
  const scale = zoomIn ? 1.04 + 0.08 * k : 1.12 - 0.08 * k;
  const [fx, fy] = shot.focus ?? [50, 45];
  const drift = (index % 2 ? -1 : 1) * 14 * k;
  const style: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${fx}% ${fy}%`, transform: `scale(${scale}) translateX(${drift}px)`, transformOrigin: `${fx}% ${fy}%`, filter: gradeFilter(shot.grade)};
  const labelIn = interpolate(local, [4, 12], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
    {shot.kind === 'video'
      ? <OffthreadVideo src={staticFile(shot.src!)} muted startFrom={Math.round((shot.from ?? 0) * FPS)} style={style} />
      : <Img src={staticFile(shot.src!)} style={style} />}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, #000a 100%)'}} />
    {shot.grade === 'bw' && <Grain opacity={0.16} />}
    {shot.label && <div style={{position: 'absolute', left: labelSize * 1.3, bottom: labelSize * 1.1, opacity: labelIn, transform: `translateX(${(1 - labelIn) * -24}px)`, display: 'flex', alignItems: 'center', gap: 12}}>
      <div style={{width: 6, height: labelSize * 1.25, background: GOLD}} />
      <div style={{fontFamily: LOCAL_FONTS.body, fontWeight: 800, fontSize: labelSize, letterSpacing: 3, color: '#fff', textShadow: '0 2px 10px #000'}}>{shot.label}</div>
    </div>}
  </AbsoluteFill>;
};

/** Small photo for a card row (face crop). */
export const Thumb: React.FC<{shot: ArchiveShot; size: number}> = ({shot, size}) =>
  <div style={{width: size, height: size, flex: 'none', borderRadius: 12, overflow: 'hidden', border: `2px solid ${GOLD}80`, background: '#000'}}>
    <Img src={staticFile(shot.src!)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${shot.focus?.[0] ?? 50}% ${shot.focus?.[1] ?? 25}%`, filter: gradeFilter(shot.grade)}} />
  </div>;
