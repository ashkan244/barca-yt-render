import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, DISPLAY, BODY, CHALK, Chalkboard, Halftone, Pop, clamp} from '../lib';
import {Mark} from '../Branding';
import type {Scene, T} from './types';
import {resolveT, type SceneTiming} from './timeline';
import {BoardSceneView} from './BoardScene';
import {PhotoSceneView} from './PhotoScenes';

type P = {st: SceneTiming};
const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const useR = (st: SceneTiming) => (t: T) => resolveT(t, st);

const Bg: React.FC<{kind?: string}> = ({kind}) =>
  kind === 'navy' ? <AbsoluteFill style={{background: 'radial-gradient(ellipse at 30% 20%, #16264d 0%, #0b1220 70%)'}} />
  : kind === 'paper' ? <AbsoluteFill style={{background: 'radial-gradient(circle at 40% 30%, #f3ead6, #ddcfae 75%)'}} />
  : <Chalkboard />;

/** Archive photo with the channel's ink/duotone look and a gentle camera move. */
export const ArchivePhoto: React.FC<{src: string; style?: string; move?: string; dur: number; focus?: [number, number]}> = ({src, style = 'ink', move = 'in', dur, focus = [50, 40]}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, dur], [0, 1], ease);
  const z = move === 'in' ? 1 + 0.07 * p : move === 'out' ? 1.07 - 0.07 * p : 1.04;
  const x = move === 'left' ? 2 - 4 * p : move === 'right' ? -2 + 4 * p : 0;
  const filter = style === 'ink' ? 'brightness(1.3) contrast(1.05) url(#ink)' : style === 'sepia' ? 'sepia(.55) contrast(1.05)' : 'grayscale(1) contrast(1.1)';
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#0b1220'}}>
      <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: `${filter} blur(18px) brightness(.5)`, transform: 'scale(1.15)'}} />
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${x}%) scale(${z})`, transformOrigin: `${focus[0]}% ${focus[1]}%`}}>
        <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', filter}} />
        {style === 'ink' && <Halftone opacity={0.14} size={6} />}
      </div>
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = C.gold}) => (
  <div style={{display: 'inline-block', fontFamily: BODY, fontWeight: 900, fontSize: 30, letterSpacing: 6, color: '#111', background: color, padding: '6px 16px'}}>{children}</div>
);

const Title: React.FC<P> = ({st}) => {
  const s = st.scene as Extract<Scene, {type: 'title'}>;
  return (
    <AbsoluteFill>
      {s.photo ? <ArchivePhoto src={s.photo} style={s.style ?? 'ink'} dur={st.dur} /> : <Bg kind={s.bg} />}
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(8,14,30,.9) 0%, rgba(8,14,30,.4) 50%, rgba(8,14,30,0) 75%)'}} />
      <div style={{position: 'absolute', left: 110, top: 300, width: 1100}}>
        {s.kicker && <Pop><Kicker>{s.kicker}</Kicker></Pop>}
        <Pop delay={8}><div style={{fontFamily: DISPLAY, fontSize: 140, lineHeight: 0.98, color: '#fff', marginTop: 18, whiteSpace: 'pre-line'}}>{s.title}</div></Pop>
        {s.sub && <Pop delay={18}><div style={{fontFamily: BODY, fontWeight: 600, fontSize: 38, color: '#ffffffcc', marginTop: 26}}>{s.sub}</div></Pop>}
      </div>
    </AbsoluteFill>
  );
};

const Chapter: React.FC<P> = ({st}) => {
  const s = st.scene as Extract<Scene, {type: 'chapter'}>;
  const f = useCurrentFrame();
  const line = interpolate(f, [8, 30], [0, 1], ease);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <Chalkboard />
      <div style={{textAlign: 'center', position: 'relative'}}>
        {s.num && <Pop><div style={{fontFamily: CHALK, fontSize: 56, color: C.gold}}>{s.num}</div></Pop>}
        <Pop delay={4}><div style={{fontFamily: DISPLAY, fontSize: 132, color: C.chalk, letterSpacing: 3, padding: '0 80px'}}>{s.title.toUpperCase()}</div></Pop>
        <svg width="900" height="30" style={{display: 'block', margin: '6px auto 0'}}>
          <path d={`M 20 15 Q 450 ${5 + 10 * Math.sin(3)} ${20 + 860 * line} 15`} stroke={C.gold} strokeWidth="8" fill="none" strokeLinecap="round" filter="url(#chalk)" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

const Photo: React.FC<P> = ({st}) => {
  const s = st.scene as Extract<Scene, {type: 'photo'}>;
  return (
    <AbsoluteFill>
      <ArchivePhoto src={s.src} style={s.style} move={s.move} dur={st.dur} focus={s.focus} />
      {s.caption && (
        <div style={{position: 'absolute', left: 80, bottom: 90, maxWidth: 1100, borderLeft: `8px solid ${C.gold}`, background: 'rgba(8,14,30,.72)', padding: '18px 28px'}}>
          <Pop><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 38, color: '#fff', lineHeight: 1.35}}>{s.caption}</div></Pop>
        </div>
      )}
      {s.credit && <div style={{position: 'absolute', right: 28, bottom: 20, fontFamily: BODY, fontSize: 18, color: '#ffffffa0'}}>{s.credit}</div>}
    </AbsoluteFill>
  );
};

const Stat: React.FC<P> = ({st}) => {
  const s = st.scene as Extract<Scene, {type: 'stat'}>;
  const f = useCurrentFrame();
  const num = Number(s.value.replace(/[^\d.]/g, ''));
  const isNum = !Number.isNaN(num) && /\d/.test(s.value);
  const shown = isNum ? Math.round(interpolate(f, [6, 40], [0, num], ease)).toLocaleString('en-US') : s.value;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <Bg kind={s.bg ?? 'navy'} />
      <div style={{textAlign: 'center', position: 'relative'}}>
        <div style={{fontFamily: DISPLAY, fontSize: 300, lineHeight: 1, color: C.gold}}>{s.prefix ?? ''}{shown}{s.suffix ?? ''}</div>
        <Pop delay={20}><div style={{fontFamily: BODY, fontWeight: 800, fontSize: 52, color: '#fff', maxWidth: 1400, marginTop: 10}}>{s.label}</div></Pop>
        {s.source && <div style={{fontFamily: BODY, fontSize: 24, color: '#ffffff90', marginTop: 26}}>Source: {s.source}</div>}
      </div>
    </AbsoluteFill>
  );
};

const Quote: React.FC<P> = ({st}) => {
  const s = st.scene as Extract<Scene, {type: 'quote'}>;
  return (
    <AbsoluteFill>
      {s.photo ? <ArchivePhoto src={s.photo} style="ink" move="in" dur={st.dur} /> : <Bg kind={s.bg ?? 'navy'} />}
      <AbsoluteFill style={{background: 'rgba(8,14,30,.55)'}} />
      <div style={{position: 'absolute', left: 160, right: 160, top: 300, borderLeft: `10px solid ${C.grana}`, paddingLeft: 40}}>
        <Pop><div style={{fontFamily: BODY, fontStyle: 'italic', fontWeight: 600, fontSize: 60, color: '#fff', lineHeight: 1.3}}>“{s.text}”</div></Pop>
        <Pop delay={14}><div style={{fontFamily: BODY, fontWeight: 800, fontSize: 34, color: C.gold, marginTop: 30}}>— {s.who}</div></Pop>
        {s.source && <Pop delay={18}><div style={{fontFamily: BODY, fontSize: 24, color: '#ffffffa0', marginTop: 8}}>{s.source}</div></Pop>}
      </div>
    </AbsoluteFill>
  );
};

const Headline: React.FC<P> = ({st}) => {
  const s = st.scene as Extract<Scene, {type: 'headline'}>;
  const f = useCurrentFrame();
  const rot = interpolate(f, [0, 18], [-8, -2], ease), sc = interpolate(f, [0, 18], [1.25, 1], ease);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', background: '#1a1410'}}>
      <div style={{width: 1300, background: '#efe7d4', padding: '50px 70px', transform: `rotate(${rot}deg) scale(${sc})`, boxShadow: '0 30px 80px rgba(0,0,0,.6)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: BODY, fontWeight: 700, fontSize: 24, color: '#3b3226', borderBottom: '3px double #3b3226', paddingBottom: 10}}>
          <span>{s.dateline}</span><span>RECONSTRUCTED HEADLINE</span>
        </div>
        <div style={{fontFamily: DISPLAY, fontSize: 108, lineHeight: 1.02, color: '#1c1712', marginTop: 24}}>{s.headline}</div>
        {s.deck && <div style={{fontFamily: BODY, fontWeight: 600, fontSize: 34, color: '#3b3226', marginTop: 20, lineHeight: 1.35}}>{s.deck}</div>}
        {s.note && <div style={{fontFamily: BODY, fontSize: 20, color: '#6b5d48', marginTop: 24}}>{s.note}</div>}
      </div>
    </AbsoluteFill>
  );
};

const Timeline: React.FC<P> = ({st}) => {
  const s = st.scene as Extract<Scene, {type: 'timeline'}>;
  const f = useCurrentFrame(); const R = useR(st);
  const n = s.events.length;
  const draw = interpolate(f, [0, 25], [0, 1], ease);
  return (
    <AbsoluteFill>
      <Chalkboard />
      {s.title && <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center', fontFamily: DISPLAY, fontSize: 90, color: C.chalk}}>{s.title}</div>}
      <svg width="1920" height="1080" style={{position: 'absolute'}}>
        <line x1={160} y1={560} x2={160 + 1600 * draw} y2={560} stroke={C.chalk} strokeWidth={7} filter="url(#chalk)" />
      </svg>
      {s.events.map((e, i) => {
        const x = 160 + (1600 * (i + 0.5)) / n; const on = f >= R(e.at);
        const sp = interpolate(f - R(e.at), [0, 12], [0, 1], ease);
        return on ? (
          <div key={i} style={{position: 'absolute', left: x - 170, width: 340, top: i % 2 ? 600 : 300, textAlign: 'center', opacity: sp, transform: `translateY(${(1 - sp) * 20}px)`}}>
            <div style={{fontFamily: DISPLAY, fontSize: 76, color: C.gold}}>{e.year}</div>
            <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.chalk, lineHeight: 1.3}}>{e.text}</div>
          </div>
        ) : null;
      })}
      {s.events.map((e, i) => { const x = 160 + (1600 * (i + 0.5)) / n; return f >= R(e.at) ? <div key={`d${i}`} style={{position: 'absolute', left: x - 16, top: 544, width: 32, height: 32, borderRadius: 16, background: C.blau, border: `6px solid ${C.grana}`}} /> : null; })}
    </AbsoluteFill>
  );
};

const MapScene: React.FC<P> = ({st}) => {
  const s = st.scene as Extract<Scene, {type: 'map'}>;
  const f = useCurrentFrame();
  const p = interpolate(f, [10, 70], [0, 1], ease);
  const [x1, y1] = s.from.xy, [x2, y2] = s.to.xy;
  const cx = (x1 + x2) / 2, cy = Math.min(y1, y2) - 220;
  const bx = (1 - p) ** 2 * x1 + 2 * (1 - p) * p * cx + p * p * x2, by = (1 - p) ** 2 * y1 + 2 * (1 - p) * p * cy + p * p * y2;
  const qx = x1 + (cx - x1) * p, qy = y1 + (cy - y1) * p;
  return (
    <AbsoluteFill>
      <Bg kind="navy" />
      <svg width="1920" height="1080" style={{position: 'absolute'}}>
        {Array.from({length: 48}).map((_, i) => <line key={i} x1={i * 40} y1={0} x2={i * 40} y2={1080} stroke="#ffffff08" />)}
        {Array.from({length: 27}).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={1920} y2={i * 40} stroke="#ffffff08" />)}
        <path d={`M ${x1} ${y1} Q ${qx} ${qy} ${bx} ${by}`} stroke={C.gold} strokeWidth={8} fill="none" strokeDasharray="20 14" strokeLinecap="round" />
        {[s.from, s.to, ...(s.extra ?? [])].map((c, i) => (
          <g key={i}><circle cx={c.xy[0]} cy={c.xy[1]} r={18} fill={i === 1 ? C.grana : C.blau} stroke="#fff" strokeWidth={5} />
            <text x={c.xy[0]} y={c.xy[1] + 70} textAnchor="middle" fontFamily={DISPLAY} fontSize={54} fill="#fff">{c.name}</text></g>
        ))}
        <circle cx={bx} cy={by} r={12} fill="#fff" />
      </svg>
      {s.label && <div style={{position: 'absolute', top: 110, width: '100%', textAlign: 'center'}}><Pop><Kicker>{s.label}</Kicker></Pop></div>}
    </AbsoluteFill>
  );
};

const Score: React.FC<P> = ({st}) => {
  const s = st.scene as Extract<Scene, {type: 'score'}>;
  const f = useCurrentFrame(); const R = useR(st);
  const shown = s.events.filter((e) => f >= R(e.at));
  const h = shown.filter((e) => e.side === 'home').length, a = shown.filter((e) => e.side === 'away').length;
  const last = shown[shown.length - 1];
  const pulse = last ? interpolate(f - R(last.at), [0, 10, 24], [1.25, 1.25, 1], clamp) : 1;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <Chalkboard />
      <div style={{position: 'relative', width: 1300, background: 'linear-gradient(#262626,#141414)', borderRadius: 28, border: '6px solid #444', padding: '40px 60px', boxShadow: '0 30px 80px rgba(0,0,0,.7)'}}>
        {(s.venue || s.date) && <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 32, color: C.gold, textAlign: 'center', letterSpacing: 3}}>{[s.venue, s.date].filter(Boolean).join(' · ')}</div>}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}>
          <div style={{fontFamily: DISPLAY, fontSize: 84, color: '#fff', width: 420}}>{s.home}</div>
          <div style={{fontFamily: DISPLAY, fontSize: 170, color: '#ffb300', textShadow: '0 0 24px #ff8f00', transform: `scale(${pulse})`}}>{h}–{a}</div>
          <div style={{fontFamily: DISPLAY, fontSize: 84, color: '#fff', width: 420, textAlign: 'right'}}>{s.away}</div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 20, minHeight: 60}}>
          {(['home', 'away'] as const).map((side) => (
            <div key={side} style={{width: 560, textAlign: side === 'home' ? 'left' : 'right'}}>
              {shown.filter((e) => e.side === side).map((e, i) => <div key={i} style={{fontFamily: BODY, fontWeight: 700, fontSize: 32, color: '#ddd'}}>{e.who} {e.minute}'</div>)}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const List: React.FC<P> = ({st}) => {
  const s = st.scene as Extract<Scene, {type: 'list'}>;
  const f = useCurrentFrame(); const R = useR(st);
  return (
    <AbsoluteFill>
      <Bg kind={s.bg} />
      {s.title && <div style={{position: 'absolute', top: 110, left: 140, fontFamily: DISPLAY, fontSize: 96, color: C.chalk}}>{s.title}</div>}
      <div style={{position: 'absolute', top: s.title ? 300 : 220, left: 140, right: 140}}>
        {s.items.map((it, i) => {
          const p = interpolate(f - R(it.at), [0, 12], [0, 1], ease);
          return f >= R(it.at) ? (
            <div key={i} style={{display: 'flex', gap: 34, alignItems: 'center', marginBottom: 34, opacity: p, transform: `translateX(${(1 - p) * -40}px)`}}>
              <div style={{width: 96, height: 96, borderRadius: 48, background: C.blau, border: `8px solid ${C.grana}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 54, color: '#fff', flexShrink: 0}}>{i + 1}</div>
              <div>
                <div style={{fontFamily: DISPLAY, fontSize: 70, color: '#fff', lineHeight: 1}}>{it.text}</div>
                {it.sub && <div style={{fontFamily: BODY, fontWeight: 600, fontSize: 32, color: C.chalkDim, marginTop: 6}}>{it.sub}</div>}
              </div>
            </div>
          ) : null;
        })}
      </div>
    </AbsoluteFill>
  );
};

const Compare: React.FC<P> = ({st}) => {
  const s = st.scene as Extract<Scene, {type: 'compare'}>;
  const col = (side: typeof s.left, d: number, good?: boolean) => (
    <div style={{flex: 1, padding: 60, background: good ? 'rgba(31,95,214,.18)' : 'rgba(179,18,63,.18)', borderTop: `10px solid ${good ? C.blau : C.grana}`}}>
      <Pop delay={d}><div style={{fontFamily: DISPLAY, fontSize: 80, color: '#fff'}}>{good ? '✓ ' : '✗ '}{side.title}</div></Pop>
      {side.points.map((pt, i) => <Pop key={i} delay={d + 10 + i * 8}><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 38, color: '#ffffffd0', marginTop: 24, lineHeight: 1.3}}>• {pt}</div></Pop>)}
    </div>
  );
  return (
    <AbsoluteFill>
      <Bg kind={s.bg} />
      <div style={{position: 'absolute', inset: '110px 90px', display: 'flex', gap: 50}}>
        {col(s.left, 0, s.left.good ?? false)}
        {col(s.right, 14, s.right.good ?? true)}
      </div>
    </AbsoluteFill>
  );
};

const Bars: React.FC<P> = ({st}) => {
  const s = st.scene as Extract<Scene, {type: 'bars'}>;
  const f = useCurrentFrame();
  const max = Math.max(...s.bars.map((b) => b.value), 1);
  // short units ("%", "m") ride on each value; longer ones ("goals", "€m, reported") become a subtitle
  const unit = s.unit ?? '';
  const inline = unit.length <= 2;
  return (
    <AbsoluteFill>
      <Bg kind={s.bg ?? 'navy'} />
      {s.title && <div style={{position: 'absolute', top: 90, width: '100%', textAlign: 'center', fontFamily: DISPLAY, fontSize: 84, color: '#fff'}}>{s.title}</div>}
      {!inline && <div style={{position: 'absolute', top: 214, width: '100%', textAlign: 'center', fontFamily: BODY, fontWeight: 600, fontSize: 28, color: '#ffffffb0', letterSpacing: 1}}>{unit}</div>}
      <div style={{position: 'absolute', left: 160, right: 160, bottom: 170, top: 250, display: 'flex', alignItems: 'flex-end', gap: 30}}>
        {s.bars.map((b, i) => {
          const g = interpolate(f, [10 + i * 6, 50 + i * 6], [0, 1], ease);
          return (
            <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
              <div style={{fontFamily: DISPLAY, fontSize: 46, color: b.highlight ? C.gold : '#fff', marginBottom: 10, opacity: g}}>{Math.round(b.value * g)}{inline ? unit : ''}</div>
              <div style={{width: '100%', height: `${(b.value / max) * 82 * g}%`, background: b.highlight ? C.gold : i % 2 ? C.grana : C.blau, borderRadius: '10px 10px 0 0'}} />
              <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: '#ffffffd0', marginTop: 14, textAlign: 'center'}}>{b.label}</div>
            </div>
          );
        })}
      </div>
      {s.note && <div style={{position: 'absolute', bottom: 70, width: '100%', textAlign: 'center', fontFamily: BODY, fontSize: 26, color: '#ffffff99'}}>{s.note}</div>}
      {s.tag && <div style={{position: 'absolute', top: 44, right: 60, fontFamily: BODY, fontWeight: 700, fontSize: 22, color: '#ffffff80', letterSpacing: 2}}>{s.tag}</div>}
    </AbsoluteFill>
  );
};

// The accent is a phrase: highlight its first contiguous occurrence, ignoring case and punctuation.
const normWord = (w: string) => w.replace(/[^\p{L}\p{N}%€£$'-]/gu, '').toLowerCase();
export const accentRange = (words: string[], accent?: string): [number, number] => {
  const acc = (accent ?? '').split(' ').map(normWord).filter(Boolean);
  if (!acc.length) return [-1, -1];
  for (let i = 0; i + acc.length <= words.length; i++) {
    if (acc.every((a, j) => normWord(words[i + j]) === a)) return [i, i + acc.length];
  }
  return [-1, -1];
};

const Statement: React.FC<P> = ({st}) => {
  const s = st.scene as Extract<Scene, {type: 'statement'}>;
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const words = s.text.split(' ');
  const hl = accentRange(words, s.accent);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 140}}>
      <Bg kind={s.bg} />
      <div style={{fontFamily: DISPLAY, fontSize: 120, lineHeight: 1.08, color: '#fff', textAlign: 'center', position: 'relative'}}>
        {words.map((w, i) => {
          const sp = spring({frame: f - i * 3, fps, config: {damping: 16}});
          const accent = i >= hl[0] && i < hl[1];
          return <span key={i} style={{display: 'inline-block', marginRight: 26, opacity: sp, transform: `translateY(${(1 - sp) * 30}px)`, color: accent ? C.gold : '#fff'}}>{w}</span>;
        })}
        {s.small && <div style={{fontFamily: BODY, fontWeight: 600, fontSize: 36, color: C.chalkDim, marginTop: 30}}>{s.small}</div>}
      </div>
    </AbsoluteFill>
  );
};

const Question: React.FC<P> = ({st}) => {
  const s = st.scene as Extract<Scene, {type: 'question'}>;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <Chalkboard />
      <div style={{textAlign: 'center', padding: '0 140px', position: 'relative'}}>
        <Pop><Kicker>YOUR TURN</Kicker></Pop>
        <Pop delay={6}><div style={{fontFamily: DISPLAY, fontSize: 110, color: '#fff', marginTop: 24, lineHeight: 1.05}}>{s.text}</div></Pop>
        {s.options && <div style={{display: 'flex', gap: 30, justifyContent: 'center', marginTop: 50}}>
          {s.options.map((o, i) => <Pop key={i} delay={16 + i * 6}><div style={{fontFamily: BODY, fontWeight: 900, fontSize: 38, color: '#fff', border: `4px solid ${C.gold}`, padding: '16px 34px', borderRadius: 14}}>{o}</div></Pop>)}
        </div>}
      </div>
    </AbsoluteFill>
  );
};

const EndScreen: React.FC<P> = ({st}) => {
  const s = st.scene as Extract<Scene, {type: 'endscreen'}>;
  return (
    <AbsoluteFill>
      <Chalkboard />
      <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center', fontFamily: DISPLAY, fontSize: 88, color: C.chalk}}>{s.next ?? 'KEEP WATCHING'}</div>
      {/* placeholders where YouTube end-screen elements are placed */}
      {[[160, 380], [1000, 380]].map(([x, y], i) => (
        <div key={i} style={{position: 'absolute', left: x, top: y, width: 760, height: 428, border: `5px dashed ${C.chalkDim}`, borderRadius: 18}} />
      ))}
      <div style={{position: 'absolute', left: 860, top: 860}}><Mark size={200} /></div>
    </AbsoluteFill>
  );
};

export const SceneView: React.FC<P> = ({st}) => {
  switch (st.scene.type) {
    case 'board': return <BoardSceneView st={st} />;
    case 'title': return <Title st={st} />;
    case 'chapter': return <Chapter st={st} />;
    case 'photo': return <Photo st={st} />;
    case 'stat': return <Stat st={st} />;
    case 'quote': return <Quote st={st} />;
    case 'headline': return <Headline st={st} />;
    case 'timeline': return <Timeline st={st} />;
    case 'map': return <MapScene st={st} />;
    case 'score': return <Score st={st} />;
    case 'list': return <List st={st} />;
    case 'compare': return <Compare st={st} />;
    case 'bars': return <Bars st={st} />;
    case 'statement': return <Statement st={st} />;
    case 'question': return <Question st={st} />;
    case 'endscreen': return <EndScreen st={st} />;
    case 'gallery': case 'duo': case 'collage': return <PhotoSceneView st={st} />;
    default: return <AbsoluteFill style={{background: '#300'}} />;
  }
};
