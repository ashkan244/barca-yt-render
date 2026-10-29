// MOTION-LIBRARY: every primitive of the motion library on committed photos, each labelled with the name a spec
// uses for it. Reference reel for choosing an edit's vocabulary; not an episode.
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {LOCAL_FONTS} from '../fonts';
import {Grain} from '../../lib';
import {Callout, Counter, DrawPath, Handheld, Highlight, LightLeak, LowerThird, Parallax, ScanLines, Sheen, Shine, Slam, Stamp,
  TRANSITIONS, TransitionIn, TransitionOut, TransitionOverlay, Typewriter, Vignette, WordPop, needsOutgoing, type TransitionName} from '.';

const GOLD = '#f2c230';
const PHOTOS = ['photos/curated/pedri-2025.jpg', 'photos/curated/yamal-2025.jpg', 'photos/barca74/cruyff-jumps-1974.jpg', 'photos/cruyff/barca-team-1975.jpg',
  'photos/barca74/mud-1974.jpg', 'photos/cruyff/barca-training-1977.jpg', 'photos/barca74/michels-journalists.jpg', 'photos/barca74/cruyff-reixach.jpg'];
const ORDER: TransitionName[] = ['flash', 'whip', 'zoom', 'glitch', 'push', 'iris', 'wipe', 'leak', 'dip'];
const T_LEN = 42;

const Photo: React.FC<{src: string; local: number; grade?: string}> = ({src, local, grade = 'contrast(1.05)'}) =>
  <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%', transform: `scale(${1.04 + local * .0015})`, filter: grade}} />;

type Section = {name: string; group: string; len: number; draw: (local: number) => React.ReactNode};
const transitionSections: Section[] = ORDER.map((name, i) => ({name, group: 'transition', len: T_LEN, draw: (local) => <>
  {needsOutgoing(name) && <TransitionOut name={name} local={local}><Photo src={PHOTOS[i % PHOTOS.length]} local={local + T_LEN} /></TransitionOut>}
  <TransitionIn name={name} local={local} seed={i}><Photo src={PHOTOS[(i + 1) % PHOTOS.length]} local={local} /></TransitionIn>
  <TransitionOverlay name={name} local={local} seed={i} />
</>}));

const SECTIONS: Section[] = [
  ...transitionSections,
  {name: 'motion: push', group: 'shot', len: 60, draw: (l) => <Photo src={PHOTOS[2]} local={l * 2} grade="grayscale(1) contrast(1.18)" />},
  {name: 'motion: parallax', group: 'shot', len: 75, draw: (l) => <Parallax src={PHOTOS[0]} local={l} len={75} focus={[50, 32]} />},
  {name: 'motion: handheld', group: 'shot', len: 60, draw: (l) => <Handheld frame={l} amount={1.4}><Photo src={PHOTOS[3]} local={0} grade="sepia(.35) contrast(1.06)" /></Handheld>},
  {name: 'callout', group: 'shot', len: 60, draw: (l) => <><Photo src={PHOTOS[1]} local={0} /><Callout local={l - 6} x={60} y={21} r={12} label="LAMINE YAMAL" /></>},
  {name: 'slam', group: 'card', len: 55, draw: (l) => <AbsoluteFill style={{background: '#07102a', alignItems: 'center', justifyContent: 'center'}}><Slam lines={['THE PRESS', 'BROKE', 'MADRID']} local={l} /></AbsoluteFill>},
  {name: 'pop', group: 'card', len: 55, draw: (l) => <AbsoluteFill style={{background: '#f6f4ee', alignItems: 'center', justifyContent: 'center', padding: 70}}><WordPop text="A HIGH LINE IS A BET ON TIMING" local={l} size={110} color="#0a0f1c" hot={['timing']} /></AbsoluteFill>},
  {name: 'type', group: 'card', len: 70, draw: (l) => <AbsoluteFill style={{background: '#050914', justifyContent: 'center', padding: 90}}><Typewriter text={'"We will play the same way\nat the Bernabéu."'} local={l} size={70} /></AbsoluteFill>},
  {name: 'count', group: 'card', len: 55, draw: (l) => <AbsoluteFill style={{background: GOLD, alignItems: 'center', justifyContent: 'center'}}><Counter value="12" local={l} label="OFFSIDES CAUGHT" size={260} color="#7a0f2b" /></AbsoluteFill>},
  {name: 'stamp', group: 'card', len: 50, draw: (l) => <><Photo src={PHOTOS[6]} local={0} grade="grayscale(1) brightness(.7)" /><AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}><Stamp text="CONFIRMED" local={l - 4} size={120} /></AbsoluteFill></>},
  {name: 'highlight', group: 'text', len: 50, draw: (l) => <AbsoluteFill style={{background: '#07102a', justifyContent: 'center', padding: 80, lineHeight: 1.4}}><div><Highlight text="the space behind" local={l} size={96} /></div></AbsoluteFill>},
  {name: 'shine', group: 'text', len: 60, draw: (l) => <AbsoluteFill style={{background: '#050914', alignItems: 'center', justifyContent: 'center'}}><Shine text="BARÇA RADAR" frame={l} size={150} /></AbsoluteFill>},
  {name: 'lower third', group: 'text', len: 55, draw: (l) => <><Photo src={PHOTOS[7]} local={0} grade="grayscale(1)" /><div style={{position: 'absolute', left: 60, bottom: 420}}><LowerThird title="JOHAN CRUYFF" sub="BARCELONA · 1974" local={l} size={64} /></div></>},
  {name: 'draw path', group: 'board', len: 60, draw: (l) => <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #12305a, #07102a 70%)'}}>
    <DrawPath d="M 20 80 C 30 55, 60 60, 70 30" local={l} arrow />
    <DrawPath d="M 15 45 L 85 45" local={l - 18} dashed color="#ffffff" width={5} />
  </AbsoluteFill>},
  {name: 'leak + scan + sheen', group: 'overlay', len: 70, draw: (l) => <><Photo src={PHOTOS[4]} local={l} grade="sepia(.3) contrast(1.1)" /><ScanLines /><LightLeak progress={l / 70} seed={4} /><Sheen frame={l} period={70} /></>},
];

export const MOTION_SHOWCASE_FRAMES = SECTIONS.reduce((n, s) => n + s.len, 0);

export const MotionShowcase: React.FC = () => {
  const f = useCurrentFrame();
  let a = 0, i = 0; while (i < SECTIONS.length - 1 && f >= a + SECTIONS[i].len) a += SECTIONS[i++].len;
  const sec = SECTIONS[i]; const local = f - a;
  return <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    {sec.draw(local)}
    <Vignette strength={.35} />
    <Grain opacity={.05} />
    <div style={{position: 'absolute', left: 50, top: 70, display: 'flex', alignItems: 'center', gap: 16}}>
      <div style={{fontFamily: LOCAL_FONTS.body, fontWeight: 800, fontSize: 26, letterSpacing: 4, color: '#000', background: GOLD, padding: '6px 14px', borderRadius: 6}}>{sec.group.toUpperCase()}</div>
      <div style={{fontFamily: LOCAL_FONTS.display, fontSize: 64, color: '#fff', textShadow: '0 3px 14px #000'}}>{sec.name}</div>
    </div>
    {sec.group === 'transition' && <div style={{position: 'absolute', left: 50, top: 160, fontFamily: LOCAL_FONTS.body, fontWeight: 700, fontSize: 28, color: '#ffffffcc', textShadow: '0 2px 10px #000'}}>
      {TRANSITIONS[sec.name as TransitionName].frames} frames · {TRANSITIONS[sec.name as TransitionName].sfx?.src ?? 'silent'}
    </div>}
    <div style={{position: 'absolute', bottom: 0, left: 0, height: 6, width: `${f / MOTION_SHOWCASE_FRAMES * 100}%`, background: GOLD}} />
  </AbsoluteFill>;
};
