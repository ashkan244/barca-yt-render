// CREST-HISTORY-SHORT: a vertical cut-down of CREST-HISTORY-LONG from the presenter's own take. Ten moments of
// the source (hook, Senyera, Sant Jordi, England, the 1910 crest and its parts, the payoff) play back to back as
// jump cuts; the crest graphics above the presenter are timed to the source words like the long version.
import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {fitText} from '@remotion/layout-utils';
import {LOCAL_FONTS} from '../fonts';
import {ReviewedCaptions} from '../Captions';
import {RadarBg, GRANA, BLAU} from '../../radar/RadarStory';
import {Mark} from '../../Branding';
import {FPS, emphasisFor, media, type SourceEpisodeProps} from './SourceEpisode';
import {Arrow, CrestAt, allDim} from './CrestHistoryLong';
import {CrossField, EnglandFlag, Senyera, type CrestPart} from './CrestArt';

const GOLD = '#f2c230';
const INK = '#f5f4ef';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const sec = (s: number) => Math.round(s * FPS);
const ramp = (f: number, at: number, d = 10) => interpolate(f, [sec(at), sec(at) + d], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
const appear = (p: number, dy = 18): React.CSSProperties => ({opacity: p, transform: `translateY(${(1 - p) * dy}px)`});
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

const STAGE_H = 860; // graphics above, presenter square (1080×1080) below
const CX = 540;
const END = 1.6; // end card after the last cut, seconds

// ---------------- stage pieces ----------------
const Head: React.FC<{f: number; at: number; kicker: string; title: string}> = ({f, at, kicker, title}) => {
  const p = ramp(f, at, 8);
  const size = Math.min(84, Math.floor(fitText({text: title, withinWidth: 960, fontFamily: LOCAL_FONTS.display}).fontSize));
  return <div style={{position: 'absolute', left: 60, right: 60, top: 150, textAlign: 'center', ...appear(p, 12)}}>
    <div style={{color: GOLD, fontWeight: 800, fontSize: 30, letterSpacing: 5}}>{kicker}</div>
    <div style={{fontFamily: LOCAL_FONTS.display, fontSize: size, lineHeight: 1.04, color: INK, marginTop: 4, whiteSpace: 'nowrap'}}>{title}</div>
  </div>;
};

const Chip: React.FC<{f: number; at: number; x: number; y: number; w?: number; gold?: boolean; center?: boolean; children: React.ReactNode}> = ({f, at, x, y, w, gold, center, children}) =>
  <div style={{position: 'absolute', left: x, top: y, width: w, ...appear(ramp(f, at, 8)), background: '#081127f0', borderLeft: `7px solid ${gold ? GOLD : '#3d6fd8'}`, textAlign: center ? 'center' : 'left',
    borderRadius: 14, padding: '14px 22px', boxShadow: '0 14px 34px #0008', fontWeight: 900, letterSpacing: 2.5, fontSize: 34, color: gold ? GOLD : INK, lineHeight: 1.2}}>{children}</div>;

const At: React.FC<{x: number; y: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, children, style}) =>
  <div style={{position: 'absolute', left: x, top: y, ...style}}>{children}</div>;

/** Stage content is drawn from source-time frames, so cues read straight off the transcript. */
type Cut = {a: number; b: number; zoom: number; sfx?: string; draw: (f: number) => React.ReactNode};

const ASSEMBLY: [CrestPart, string, number][] = [['cross', 'CROSS OF ST GEORGE', 162.8], ['senyera', 'FOUR RED STRIPES', 164.34], ['initials', "CLUB'S INITIALS", 166.74], ['colours', 'BLUE AND GARNET', 168.6], ['ball', 'A FOOTBALL', 170.56]];

const CUTS: Cut[] = [
  // "Have you ever wondered why FC Barcelona's crest looks the way it does? … stripes of Catalonia? … flag of England?"
  {a: 0, b: 12.95, zoom: 1, draw: (f) => {
    const q1 = ramp(f, 4.16, 14), q2 = ramp(f, 7.9, 14);
    const side = Math.max(q1, q2);
    return <>
      <Head f={f} at={0} kicker="BARÇA HISTORY" title={f < sec(4.16) ? 'WHY DOES THE CREST LOOK LIKE THIS?' : f < sec(7.9) ? 'WHY THE RED AND YELLOW STRIPES?' : "WHY A CROSS LIKE ENGLAND'S?"} />
      <CrestAt id="s0" cx={lerp(CX, 300, side)} cy={lerp(560, 560, side)} width={lerp(500, 420, side)} draw={interpolate(f, [sec(.2), sec(2.2)], [0, 1], clamp)}
        dim={f < sec(7.9) ? allDim(['senyera'], q1 * .9) : allDim(['cross'], q2 * .9)} glow={f < sec(7.9) ? 'senyera' : 'cross'} glowAmount={f < sec(7.9) ? ramp(f, 5.2) : ramp(f, 9.04)} />
      {f < sec(7.9) ? <>
        <At x={560} y={380} style={appear(ramp(f, 5.6))}><Senyera width={440} f={f} /></At>
        <Chip f={f} at={6.44} x={600} y={700} w={360} gold center>CATALONIA</Chip>
      </> : <>
        <At x={560} y={400} style={appear(ramp(f, 11.46))}><div style={{boxShadow: '0 16px 40px #0009'}}><EnglandFlag width={440} /></div></At>
        <Chip f={f} at={12.0} x={600} y={700} w={360} center>ENGLAND</Chip>
      </>}
    </>;
  }},
  // "These stripes represent the Senyera, the traditional flag of Catalonia."
  {a: 29.85, b: 35.1, zoom: 1.12, sfx: 'whoosh', draw: (f) => <>
    <Head f={f} at={29.85} kicker="THE FOUR RED STRIPES" title="THE SENYERA" />
    <At x={CX - 380} y={340} style={appear(ramp(f, 30.2))}><Senyera width={760} f={f} /></At>
    <Chip f={f} at={33.46} x={CX - 330} y={700} w={660} gold center>THE FLAG OF CATALONIA</Chip>
  </>},
  // "This is the cross of St. George, known in Catalonia as Sant Jordi."
  {a: 94.8, b: 98.85, zoom: 1, sfx: 'whoosh', draw: (f) => {
    const z = interpolate(f, [sec(94.9), sec(96.4)], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
    return <>
      <Head f={f} at={94.8} kicker="TOP LEFT OF THE CREST" title="THE CROSS OF ST GEORGE" />
      <CrestAt id="s2" cx={CX} cy={540} width={440} zoom={z} focus={[320, 255]} clip={{x: 150, y: 330, w: 780, h: 420}} dim={allDim(['cross'], z)} />
      <Chip f={f} at={97.94} x={CX - 220} y={700} w={440} gold center>SANT JORDI</Chip>
    </>;
  }},
  // "the same red cross on a white background is also the national flag of England."
  {a: 113.95, b: 118.95, zoom: 1.12, draw: (f) => <>
    <Head f={f} at={113.95} kicker="SAME CROSS, ANOTHER FLAG" title="ENGLAND'S FLAG TOO" />
    <At x={110} y={360} style={appear(ramp(f, 114.2))}><div style={{boxShadow: '0 16px 40px #0009'}}><CrossField size={300} /></div></At>
    <Chip f={f} at={114.4} x={110} y={690} w={300} center>BARÇA CREST</Chip>
    <div style={{position: 'absolute', left: 470, top: 460, fontFamily: LOCAL_FONTS.display, fontSize: 110, color: GOLD, opacity: ramp(f, 115.6)}}>=</div>
    <At x={590} y={390} style={appear(ramp(f, 117.02))}><div style={{boxShadow: '0 16px 40px #0009'}}><EnglandFlag width={400} /></div></At>
    <Chip f={f} at={117.4} x={590} y={690} w={400} center>ENGLAND</Chip>
  </>},
  // "But this doesn't mean Barcelona borrowed its symbol from England."
  {a: 122.75, b: 126.2, zoom: 1, draw: (f) => {
    const no = ramp(f, 124.6, 8);
    return <>
      <Head f={f} at={122.75} kicker="SAINT GEORGE" title="BUT NOT BORROWED" />
      <At x={90} y={400}><div style={{boxShadow: '0 16px 40px #0009'}}><EnglandFlag width={330} /></div></At>
      <Arrow x1={450} y1={500} x2={620} y2={500} p={ramp(f, 123.2, 14)} />
      <CrestAt id="s4" cx={820} cy={510} width={300} />
      {no > 0 && <svg style={{position: 'absolute', left: 470, top: 400, opacity: no}} width={140} height={200} viewBox="0 0 140 200">
        <path d="M20 40 L120 160 M120 40 L20 160" stroke="#ff3b4e" strokeWidth={16} strokeLinecap="round" />
      </svg>}
      <Chip f={f} at={125.0} x={CX - 340} y={700} w={680} gold center>TWO TRADITIONS, ONE OLDER SAINT</Chip>
    </>;
  }},
  // "The competition was organized to find a new design. The winning design established … we recognize today."
  {a: 152.4, b: 159.75, zoom: 1.12, sfx: 'riser', draw: (f) => <>
    <Head f={f} at={152.4} kicker="1910 · DESIGN COMPETITION" title="A CREST OF ITS OWN" />
    <CrestAt id="s5" cx={CX} cy={540} width={420} draw={interpolate(f, [sec(155.3), sec(159.5)], [0, 1], clamp)} />
    <Chip f={f} at={158.32} x={CX - 330} y={700} w={660} gold center>THE CREST WE KNOW TODAY</Chip>
  </>},
  // "The cross of St. George, the four red stripes …, the club's initials, … blue and garnet colors and a football at the bottom."
  {a: 162.45, b: 171.8, zoom: 1, draw: (f) => {
    const show = Object.fromEntries(ASSEMBLY.map(([p, , at]) => [p, ramp(f, at, 12)])) as Record<CrestPart, number>;
    return <>
      <Head f={f} at={162.45} kicker="THE 1910 DESIGN" title="FIVE PIECES, ONE CREST" />
      <CrestAt id="s6" cx={290} cy={540} width={420} show={show} bars={interpolate(f, [sec(164.34), sec(165.74)], [0, 4], clamp)} />
      {ASSEMBLY.map(([p, l, at], k) => {
        const on = ramp(f, at, 8);
        return <div key={p} style={{position: 'absolute', left: 540, top: 330 + k * 86, display: 'flex', alignItems: 'center', gap: 16, opacity: lerp(.3, 1, on)}}>
          <div style={{width: 50, height: 50, borderRadius: 11, border: `4px solid ${GOLD}`, background: on > .5 ? GOLD : 'transparent', color: '#1a1200', fontWeight: 900, fontSize: 34, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{on > .5 ? '✓' : ''}</div>
          <div style={{fontWeight: 900, letterSpacing: 2, fontSize: 36, color: INK, whiteSpace: 'nowrap'}}>{l}</div>
        </div>;
      })}
    </>;
  }},
  // "Every time a Barcelona player wears that badge, they're carrying symbols that existed long before the club was founded."
  {a: 203.35, b: 211.0, zoom: 1.12, sfx: 'whoosh', draw: (f) => <>
    <Head f={f} at={203.35} kicker="EVERY TIME THEY WEAR IT" title="OLDER THAN THE CLUB ITSELF" />
    <CrestAt id="s7" cx={CX} cy={540} width={400} glow="senyera" glowAmount={ramp(f, 206.5, 20)} />
    <Chip f={f} at={208.32} x={CX - 340} y={700} w={680} gold center>SYMBOLS OLDER THAN 1899</Chip>
  </>},
  // "Més que un club."
  {a: 218.35, b: 219.9, zoom: 1, draw: (f) => <>
    <CrestAt id="s8" cx={CX} cy={430} width={380} glow="colours" glowAmount={ramp(f, 218.4, 20)} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 660, textAlign: 'center', fontFamily: LOCAL_FONTS.display, fontSize: 110, color: GOLD, letterSpacing: 4, ...appear(ramp(f, 218.5, 8))}}>MÉS QUE UN CLUB</div>
  </>},
];

// output timeline: each cut starts where the previous one ended
const STARTS = CUTS.reduce<number[]>((acc, c, i) => [...acc, i === 0 ? 0 : acc[i - 1] + (sec(CUTS[i - 1].b) - sec(CUTS[i - 1].a))], []);
const CUT_FRAMES = STARTS[STARTS.length - 1] + sec(CUTS[CUTS.length - 1].b) - sec(CUTS[CUTS.length - 1].a);
export const crestShortFrames = CUT_FRAMES + sec(END);

const Presenter: React.FC<{spec: SourceEpisodeProps['spec']; zoom: number}> = ({spec, zoom}) =>
  <div style={{position: 'absolute', left: 0, top: STAGE_H - 20, width: 1080, height: 1080, overflow: 'hidden'}}>
    <OffthreadVideo src={media(spec, 'presenter.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`, transformOrigin: '50% 30%', filter: 'contrast(1.03) saturate(1.02)'}} />
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#07102a 0%, #07102a00 9%, #07102a00 52%, #07102acc 100%)'}} />
  </div>;

/** One cut on its own source timeline: presenter, voice, captions and stage all read source time. */
const CutView: React.FC<SourceEpisodeProps & {cut: Cut; i: number}> = ({spec, words, pages, cut, i}) => {
  const f = useCurrentFrame(); const a = sec(cut.a), b = sec(cut.b);
  const enter = interpolate(f, [a, a + 6], [0, 1], clamp);
  return <AbsoluteFill>
    <RadarBg tint={i % 2 ? BLAU : GRANA} />
    <Presenter spec={spec} zoom={cut.zoom} />
    <AbsoluteFill style={{opacity: enter, transform: `translateY(${(1 - enter) * 24}px)`}}>{cut.draw(f)}</AbsoluteFill>
    <ReviewedCaptions pages={pages} words={words} top={1420} width={960} minFontSize={60} maxFontSize={78} emphasis={emphasisFor(spec)} />
    {/* 2-frame fades at each edit keep the cut voice from clicking */}
    <Audio src={media(spec, 'voice.wav')} volume={(fr) => interpolate(fr, [a, a + 2, b - 2, b], [0, 1, 1, 0], clamp)} />
  </AbsoluteFill>;
};

export const CrestHistoryShort: React.FC<SourceEpisodeProps> = ({spec, words, pages}) => {
  const f = useCurrentFrame();
  const endIn = interpolate(f, [CUT_FRAMES, CUT_FRAMES + 8], [0, 1], clamp);
  return <AbsoluteFill style={{background: '#07102a', color: INK, fontFamily: LOCAL_FONTS.body}}>
    {CUTS.map((c, i) => <Sequence key={c.a} from={STARTS[i]} durationInFrames={sec(c.b) - sec(c.a)} name={`cut ${c.a}–${c.b}`}>
      <Sequence from={-sec(c.a)}><CutView spec={spec} words={words} pages={pages} cut={c} i={i} /></Sequence>
    </Sequence>)}
    {f >= CUT_FRAMES && <AbsoluteFill style={{opacity: endIn}}>
      <RadarBg tint={GRANA} />
      <CrestAt id="end" cx={CX} cy={760} width={520} glow="colours" glowAmount={1} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1110, textAlign: 'center', fontFamily: LOCAL_FONTS.display, fontSize: 120, color: GOLD, letterSpacing: 4}}>MÉS QUE UN CLUB</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1270, textAlign: 'center', fontWeight: 900, fontSize: 40, letterSpacing: 6, color: INK}}>FULL STORY ON BARÇA RADAR</div>
    </AbsoluteFill>}
    <div style={{position: 'absolute', top: 54, left: 60, fontFamily: LOCAL_FONTS.display, fontSize: 40, letterSpacing: 2}}>BARÇA <span style={{color: GOLD}}>RADAR</span></div>
    <div style={{position: 'absolute', right: 50, top: 36, opacity: .9}}><Mark size={84} brand="radar" /></div>
    {f < sec(3.2) && <div style={{position: 'absolute', left: 50, top: STAGE_H + 40, opacity: interpolate(f, [12, 22, sec(2.8), sec(3.2)], [0, 1, 1, 0], clamp), display: 'flex', alignItems: 'center', gap: 14, background: '#050914e6', padding: '10px 24px 10px 12px', borderRadius: 14, borderLeft: `7px solid ${GOLD}`}}>
      <Mark size={60} brand="radar" />
      <div><div style={{fontFamily: LOCAL_FONTS.display, fontSize: 42, lineHeight: 1}}>{spec.presenter}</div><div style={{fontWeight: 900, fontSize: 20, color: GOLD, letterSpacing: 4}}>BARÇA RADAR</div></div>
    </div>}
    <Audio src={staticFile('music/km/heroic-age.mp3')} volume={(fr) => .11 * interpolate(fr, [0, 20, CUT_FRAMES, CUT_FRAMES + 10, crestShortFrames - 12, crestShortFrames], [0, 1, 1, 2.6, 2.6, 0], clamp)} />
    {CUTS.map((c, i) => c.sfx ? <Sequence key={`x${i}`} from={Math.max(0, STARTS[i] - 4)} durationInFrames={40}><Audio src={staticFile(`sfx/${c.sfx}.wav`)} volume={.1} /></Sequence> : null)}
    {ASSEMBLY.map(([, , at]) => <Sequence key={at} from={STARTS[6] + sec(at) - sec(CUTS[6].a)} durationInFrames={20}><Audio src={staticFile('sfx/tick.wav')} volume={.14} /></Sequence>)}
  </AbsoluteFill>;
};
