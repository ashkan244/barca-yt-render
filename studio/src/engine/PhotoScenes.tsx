// Image-led scene types: gallery (a photo per line), duo (two lives side by side), collage (polaroid album).
import React from 'react';
import {AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, DISPLAY, BODY, CHALK, Chalkboard, Pop, clamp} from '../lib';
import type {Scene, T} from './types';
import {resolveT, type SceneTiming} from './timeline';
import {ArchivePhoto} from './Scenes';

type P = {st: SceneTiming};
const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const XF = 14; // crossfade frames between gallery photos
const FILTER: Record<string, string> = {bw: 'grayscale(1) contrast(1.1)', sepia: 'sepia(.55) contrast(1.05)', ink: 'brightness(1.3) contrast(1.05) url(#ink)'};
const MOVES = ['in', 'left', 'out', 'right'];

const YearTag: React.FC<{text: string}> = ({text}) => (
  <div style={{position: 'absolute', top: 60, left: 80}}>
    <Pop><div style={{fontFamily: DISPLAY, fontSize: 64, color: '#111', background: C.gold, padding: '2px 22px', letterSpacing: 2}}>{text}</div></Pop>
  </div>
);

/** A sequence of archive photos, each starting at its own narration line, with crossfades. */
const Gallery: React.FC<P> = ({st}) => {
  const s = st.scene as Extract<Scene, {type: 'gallery'}>;
  const starts = s.photos.map((p, i) => (i === 0 ? 0 : resolveT(p.at, st)));
  return (
    <AbsoluteFill style={{background: '#0b1220'}}>
      {s.photos.map((p, i) => {
        const from = starts[i], to = i + 1 < starts.length ? starts[i + 1] : st.dur;
        const len = Math.max(1, to - from) + (i + 1 < starts.length ? XF : 0);
        return (
          <Sequence key={i} from={from} durationInFrames={len}>
            <Fade first={i === 0}>
              <ArchivePhoto src={p.src} style={p.style ?? s.style ?? 'bw'} move={p.move ?? MOVES[i % 4]} dur={len} focus={p.focus} />
              {p.year && <YearTag text={p.year} />}
              {p.caption && (
                <div style={{position: 'absolute', left: 80, top: 160, maxWidth: 900, borderLeft: `8px solid ${C.gold}`, background: 'rgba(8,14,30,.72)', padding: '14px 24px'}}>
                  <Pop><div style={{fontFamily: BODY, fontWeight: 700, fontSize: 34, color: '#fff', lineHeight: 1.3}}>{p.caption}</div></Pop>
                </div>
              )}
              {p.credit && <div style={{position: 'absolute', right: 28, top: 22, fontFamily: BODY, fontSize: 18, color: '#ffffffa0'}}>{p.credit}</div>}
            </Fade>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const Fade: React.FC<{first: boolean; children: React.ReactNode}> = ({first, children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: first ? 1 : interpolate(f, [0, XF], [0, 1], clamp)}}>{children}</AbsoluteFill>;
};

/** Two photos side by side — two lives, two eras, before/after. */
const Duo: React.FC<P> = ({st}) => {
  const s = st.scene as Extract<Scene, {type: 'duo'}>;
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const tRight = s.at !== undefined ? resolveT(s.at, st) : 10;
  const top = s.title ? 180 : 90, h = s.title ? 690 : 780; // bottom stays clear for captions
  const card = (side: 'left' | 'right', c: NonNullable<typeof s.left>, t0: number) => {
    const sp = spring({frame: f - t0, fps, config: {damping: 18}});
    const z = interpolate(f, [t0, st.dur], [1.02, 1.1], ease);
    const x = side === 'left' ? 110 : 1010;
    return (
      <div style={{position: 'absolute', left: x, top, width: 800, height: h, opacity: sp, transform: `translateX(${(1 - sp) * (side === 'left' ? -80 : 80)}px)`,
        overflow: 'hidden', borderRadius: 6, boxShadow: '0 20px 60px rgba(0,0,0,.6)', border: `4px solid ${side === 'left' ? C.blau : C.grana}`}}>
        <Img src={staticFile(c.src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${(c.focus ?? [50, 35])[0]}% ${(c.focus ?? [50, 35])[1]}%`,
          filter: FILTER[c.style ?? s.style ?? 'bw'], transform: `scale(${z})`}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '80px 30px 26px', background: 'linear-gradient(transparent, rgba(5,10,20,.92))'}}>
          <div style={{fontFamily: DISPLAY, fontSize: 64, color: '#fff', lineHeight: 1}}>{c.label}</div>
          {c.sub && <div style={{fontFamily: BODY, fontWeight: 600, fontSize: 28, color: C.gold, marginTop: 8}}>{c.sub}</div>}
        </div>
        {c.credit && <div style={{position: 'absolute', right: 12, top: 10, fontFamily: BODY, fontSize: 16, color: '#ffffffb0'}}>{c.credit}</div>}
      </div>
    );
  };
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 30%, #16264d 0%, #0b1220 75%)'}}>
      {s.title && <div style={{position: 'absolute', top: 60, width: '100%', textAlign: 'center'}}><Pop><div style={{fontFamily: DISPLAY, fontSize: 84, color: '#fff'}}>{s.title}</div></Pop></div>}
      {card('left', s.left, 0)}
      {card('right', s.right, tRight)}
      {s.divider && f >= tRight && (
        <div style={{position: 'absolute', left: 960 - 70, top: top + h / 2 - 70, width: 140, height: 140, borderRadius: 70, background: C.gold, display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 56, color: '#111', boxShadow: '0 10px 30px rgba(0,0,0,.5)'}}>
          <Pop>{s.divider}</Pop>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Polaroid album: photos drop onto the board one by one; a "spot" lifts one photo to the centre. */
const Collage: React.FC<P> = ({st}) => {
  const s = st.scene as Extract<Scene, {type: 'collage'}>;
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const n = s.photos.length;
  const cols = n <= 3 ? n : n === 4 ? 2 : 3, rows = Math.ceil(n / cols);
  const areaTop = s.title ? 200 : 110, areaH = 870 - areaTop, areaW = 1700;
  const cw = areaW / cols, ch = areaH / rows;
  const tileW = Math.min(cw * 0.86, (ch * 0.86 - 60) * 1.4), tileH = tileW / 1.4 + 60;
  const spot = (s.spot ?? []).map((x) => ({i: x.i, a: resolveT(x.at, st), b: x.until !== undefined ? resolveT(x.until, st) : st.dur}));
  const lift = (i: number) => {
    const sp = spot.find((x) => x.i === i);
    if (!sp) return 0;
    return Math.min(interpolate(f, [sp.a, sp.a + 18], [0, 1], ease), interpolate(f, [sp.b - 14, sp.b], [1, 0], ease));
  };
  const anyLift = Math.max(0, ...s.photos.map((_, i) => lift(i)));
  return (
    <AbsoluteFill>
      <Chalkboard />
      {s.title && <div style={{position: 'absolute', top: 70, width: '100%', textAlign: 'center'}}><Pop><div style={{fontFamily: CHALK, fontSize: 72, color: C.chalk}}>{s.title}</div></Pop></div>}
      {s.photos.map((p, i) => {
        const t0 = resolveT(p.at, st);
        const sp = spring({frame: f - t0, fps, config: {damping: 13, mass: 0.7}});
        if (f < t0) return null;
        const r = Math.floor(i / cols), c = i % cols;
        const rowCount = r === rows - 1 ? n - r * cols : cols;
        const gx = 110 + (areaW - rowCount * cw) / 2 + c * cw + (cw - tileW) / 2, gy = areaTop + r * ch + (ch - tileH) / 2;
        const rot = p.rot ?? [-4, 3, -2, 4, -3, 2, -5, 3, -1][i % 9];
        const L = lift(i);
        const bigW = 1100, bigX = 960 - bigW / 2, bigScale = bigW / tileW, bigY = 540 - (tileH * bigScale) / 2;
        const x = gx + (bigX - gx) * L, y = gy + (bigY - gy) * L, scale = (0.6 + 0.4 * sp) * (1 + (bigScale - 1) * L);
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, width: tileW, height: tileH, transformOrigin: '0 0', zIndex: L > 0 ? 10 : 1,
            transform: `scale(${scale}) rotate(${rot * (1 - L)}deg)`, opacity: sp * (1 - 0.65 * (anyLift - L)), background: '#f4f1e8', padding: 12, boxSizing: 'border-box',
            boxShadow: '0 18px 40px rgba(0,0,0,.55)'}}>
            <Img src={staticFile(p.src)} style={{width: '100%', height: tileH - 72, objectFit: 'cover', filter: FILTER[p.style ?? s.style ?? 'bw']}} />
            <div style={{fontFamily: CHALK, fontSize: Math.min(30, (tileW - 24) / Math.max(1, (p.label ?? '').length * 0.56)), color: '#222', textAlign: 'center', marginTop: 8, whiteSpace: 'nowrap', overflow: 'hidden'}}>{p.label ?? ''}</div>
          </div>
        );
      })}
      {s.credit && <div style={{position: 'absolute', right: 28, bottom: 18, fontFamily: BODY, fontSize: 18, color: '#ffffff90'}}>{s.credit}</div>}
    </AbsoluteFill>
  );
};

export const PhotoSceneView: React.FC<P> = ({st}) =>
  st.scene.type === 'gallery' ? <Gallery st={st} /> : st.scene.type === 'duo' ? <Duo st={st} /> : <Collage st={st} />;
