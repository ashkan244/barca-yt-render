import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, Easing} from 'remotion';
import {C, DISPLAY, CHALK, BODY, Chalkboard, Pop, clamp} from '../lib';
import {Board, PitchLines, Token, ChalkArrow, OffsideLine, Zone, px} from '../board';
import type {BoardScene as BS, T} from './types';
import {resolveT, type SceneTiming} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};

/** Interpolate a keyframed [time, a, b] path at frame f. */
const along = (f: number, path: [T, number, number][], st: SceneTiming): [number, number] => {
  if (path.length === 1) return [path[0][1], path[0][2]];
  const ts = path.map((p) => resolveT(p[0], st));
  // keep strictly increasing frames for interpolate()
  for (let i = 1; i < ts.length; i++) if (ts[i] <= ts[i - 1]) ts[i] = ts[i - 1] + 1;
  return [interpolate(f, ts, path.map((p) => p[1]), ease), interpolate(f, ts, path.map((p) => p[2]), ease)];
};

const ScanArc: React.FC<{x: number; y: number; side: 'left' | 'right'; p: number; color: string}> = ({x, y, side, p, color}) => {
  // arc in front of the player, opening to the requested side (board coords: left = up the pitch on screen)
  const r = 95, sweep = 110 * p;
  const base = side === 'left' ? -150 : 40;
  const a0 = (base * Math.PI) / 180, a1 = ((base + sweep) * Math.PI) / 180;
  const cx = px(x), cy = px(y);
  const d = `M ${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)}`;
  return p > 0 ? <path d={d} stroke={color} strokeWidth={9} fill="none" strokeDasharray="18 12" strokeLinecap="round" filter="url(#chalk)" opacity={0.95} /> : null;
};

export const BoardSceneView: React.FC<{st: SceneTiming}> = ({st}) => {
  const f = useCurrentFrame(); // scene-local
  const s = st.scene as BS;
  const R = (t: T) => resolveT(t, st);
  const win = (at: T, until?: T) => f >= R(at) && (until === undefined || f < R(until));
  const pos = new Map<string, [number, number]>();
  for (const t of s.tokens ?? []) pos.set(t.id, along(f, t.path, st));

  // camera
  const cam = s.camera?.length ? s.camera : [{at: 0, zoom: 1.15, focus: [52.5, 34] as [number, number]}];
  const cts = cam.map((c) => R(c.at));
  for (let i = 1; i < cts.length; i++) if (cts[i] <= cts[i - 1]) cts[i] = cts[i - 1] + 1;
  const zoom = cam.length > 1 ? interpolate(f, cts, cam.map((c) => c.zoom), ease) : cam[0].zoom;
  const fx = cam.length > 1 ? interpolate(f, cts, cam.map((c) => (c.focus ?? [52.5, 34])[0]), ease) : (cam[0].focus ?? [52.5, 34])[0];

  return (
    <AbsoluteFill>
      <Chalkboard />
      <Board tilt={s.tilt ?? 26} zoom={zoom} focusX={fx}>
        <PitchLines />
        {(s.zones ?? []).map((z, i) => win(z.at, z.until) && (
          <Zone key={i} x={z.x} y={z.y} w={z.w} h={z.h} color={z.color ?? C.grana} opacity={interpolate(f - R(z.at), [0, 12], [0, z.opacity ?? 0.25], clamp)} />
        ))}
        {(s.offside ?? []).map((o, i) => win(o.at, o.until) && (
          <OffsideLine key={i} x={o.x} opacity={0.6 + 0.4 * Math.abs(Math.sin(f / 5))} color={o.color ?? C.gold} />
        ))}
        {(s.cones ?? []).map((c, i) => {
          if (!win(c.at, c.until)) return null;
          const p = pos.get(c.token); if (!p) return null;
          const L = px(c.length ?? 22), a = (c.angle * Math.PI) / 180, w = (c.width * Math.PI) / 360;
          const op = interpolate(f - R(c.at), [0, 10], [0, 1], clamp);
          const [x, y] = [px(p[0]), px(p[1])];
          return <path key={i} d={`M ${x} ${y} L ${x + L * Math.cos(a - w)} ${y + L * Math.sin(a - w)} A ${L} ${L} 0 0 1 ${x + L * Math.cos(a + w)} ${y + L * Math.sin(a + w)} Z`} fill={c.color ?? C.gold} opacity={0.22 * op} />;
        })}
        {(s.arrows ?? []).map((a, i) => {
          if (!win(a.at, a.until)) return null;
          const p = interpolate(f - R(a.at), [0, Math.round((a.dur ?? 0.8) * 30)], [0, 1], clamp);
          return <ChalkArrow key={i} from={a.from} to={a.to} progress={p} color={a.color ?? C.chalk} dashed={a.dashed} curve={a.curve ?? 0} />;
        })}
        {(s.scans ?? []).map((sc, i) => {
          const p0 = pos.get(sc.token); if (!p0 || f < R(sc.at)) return null;
          const p = interpolate(f - R(sc.at), [0, 12], [0, 1], clamp);
          const fade = interpolate(f - R(sc.at), [40, 70], [1, 0.25], clamp);
          return <g key={i} opacity={fade}><ScanArc x={p0[0]} y={p0[1]} side={sc.side} p={p} color={sc.color ?? C.gold} /></g>;
        })}
        {(s.tokens ?? []).map((t) => {
          const p = pos.get(t.id)!;
          const hi = (t.hi ?? []).find((h) => win(h[0], h[1]));
          const op = t.fade ? interpolate(f, [R(t.fade[0]), R(t.fade[1])], [1, 0.25], clamp) : 1;
          return <Token key={t.id} x={p[0]} y={p[1]} side={t.side === 'neutral' ? 'opp' : t.side} label={t.label} highlight={hi?.[2]} opacity={op} />;
        })}
        {s.ball && (() => {
          const [bx, by] = along(f, s.ball.path, st);
          const lift = s.ball.lift ? Math.sin(Math.max(0, Math.min(1, (f - R(s.ball.lift[0])) / Math.max(1, R(s.ball.lift[1]) - R(s.ball.lift[0])))) * Math.PI) * 80 : 0;
          return <circle cx={px(bx)} cy={px(by) - lift} r={11} fill="#fff" stroke="#111" strokeWidth={2} />;
        })()}
        {(s.labels ?? []).map((l, i) => win(l.at, l.until) && (
          <text key={i} x={px(l.x)} y={px(l.y)} textAnchor="middle" fontFamily={CHALK} fontSize={40} fill={l.color ?? C.chalk}
            opacity={interpolate(f - R(l.at), [0, 8], [0, 1], clamp)}>{l.text}</text>
        ))}
      </Board>
      {s.title && <div style={{position: 'absolute', top: 40, left: 60, fontFamily: CHALK, fontSize: 38, color: C.chalkDim}}>{s.title}</div>}
      <div style={{position: 'absolute', top: 44, right: 60, fontFamily: BODY, fontWeight: 700, fontSize: 22, color: C.chalkDim, letterSpacing: 2}}>{s.tag ?? 'ILLUSTRATION'}</div>
      {(s.overlay ?? []).map((o, i) => win(o.at, o.until) && (
        <AbsoluteFill key={i} style={{justifyContent: o.pos === 'bottom' ? 'flex-end' : o.pos === 'center' ? 'center' : 'flex-start', alignItems: 'center', padding: o.pos === 'bottom' ? '0 0 120px' : '110px 0 0'}}>
          <Pop delay={R(o.at)}><div style={{fontFamily: DISPLAY, fontSize: 150, color: o.color ?? C.gold, textShadow: '0 10px 40px rgba(0,0,0,.7)', letterSpacing: 3, textAlign: 'center'}}>{o.text}</div></Pop>
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};
