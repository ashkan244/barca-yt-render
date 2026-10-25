// Tactics board for Barça Radar: a horizontal pitch (Barça attack left → right) with keyframed player tokens,
// drawn-on arrows, man-marking tethers, glowing space zones and a ball. Coordinates are pitch metres (105 × 68).
// No match footage: every board is a schematic; boards built from the presenter's reading carry an ILLUSTRATION tag.
import React from 'react';
import {interpolate, Easing} from 'remotion';
import {DISPLAY, BODY, clamp} from '../lib';
import {NAVY, GOLD, GRANA, BLAU, RED, GREEN, ramp} from './RadarStory';

export type KF = [number, number, number]; // [frame, x, y]
export type Tok = {id: string; team: 'barca' | 'psg'; label?: string; k: KF[]; at?: number; until?: number; hi?: boolean; ghost?: boolean};
export type Arrow = {from: [number, number]; to: [number, number]; at: number; dur?: number; color?: string; dashed?: boolean; bend?: number; width?: number; label?: string; until?: number};
export type Zone = {x: number; y: number; w: number; h: number; at: number; color?: string; label?: string; until?: number; round?: boolean};
export type Tether = {a: string; b: string; at: number; until?: number; color?: string; breakAt?: number};
export type Mark = {x: number; y: number; at: number; kind: 'x' | 'q' | 'ball'; until?: number; color?: string};

const PSG_FILL = '#0b2a6b', PSG_RING = '#e30613';

/** Position of a keyframed token at frame f (holds first/last key, eases between keys). */
export const posAt = (k: KF[], f: number): [number, number] => {
  if (k.length === 1) return [k[0][1], k[0][2]];
  const fr = k.map((p) => p[0]);
  const e = {...clamp, easing: Easing.inOut(Easing.cubic)};
  return [interpolate(f, fr, k.map((p) => p[1]), e), interpolate(f, fr, k.map((p) => p[2]), e)];
};

const bez = (a: [number, number], b: [number, number], bend: number, t: number): [number, number] => {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const cx = mx - dy * bend, cy = my + dx * bend;
  const u = 1 - t;
  return [u * u * a[0] + 2 * u * t * cx + t * t * b[0], u * u * a[1] + 2 * u * t * cy + t * t * b[1]];
};

export const Board: React.FC<{f: number; x: number; y: number; w: number; toks?: Tok[]; arrows?: Arrow[]; zones?: Zone[]; tethers?: Tether[];
  marks?: Mark[]; ball?: KF[]; title?: string; sub?: string; illustration?: boolean; at?: number; bands?: {y: number; h: number; at: number; until?: number; color?: string}[]}> =
  ({f, x, y, w, toks = [], arrows = [], zones = [], tethers = [], marks = [], ball, title, sub, illustration, at = 0, bands = []}) => {
  const s = w / 105, h = 68 * s;
  const P = (px: number, py: number): [number, number] => [px * s, py * s];
  const show = (a: number, u?: number) => f >= a && (u === undefined || f < u);
  const fadeK = (a: number, u?: number) => Math.min(ramp(f, a, a + 8), u === undefined ? 1 : 1 - ramp(f, u - 8, u));
  const toks2 = toks.filter((t) => show(t.at ?? at, t.until));
  const posOf = (id: string) => { const t = toks.find((q) => q.id === id)!; return posAt(t.k, f); };
  const enter = ramp(f, at, at + 14);
  return (
    <div style={{position: 'absolute', left: x, top: y - 70, opacity: enter, transform: `translateY(${(1 - enter) * 30}px)`}}>
      <div style={{height: 70, display: 'flex', alignItems: 'baseline', gap: 20}}>
        {title && <div style={{fontFamily: DISPLAY, fontSize: 52, color: '#fff'}}>{title}</div>}
        {sub && <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: GOLD}}>{sub}</div>}
        {illustration && <div style={{marginLeft: 'auto', fontFamily: BODY, fontWeight: 800, fontSize: 18, letterSpacing: 3, color: '#ffffff90', border: '1px solid #ffffff40', borderRadius: 8, padding: '2px 10px'}}>ILLUSTRATION</div>}
      </div>
      <svg width={w} height={h} style={{display: 'block', overflow: 'visible', filter: 'drop-shadow(0 26px 50px #000a)'}}>
        <defs>
          <radialGradient id="tbglow"><stop offset="0" stopColor={GREEN} stopOpacity="0.55" /><stop offset="1" stopColor={GREEN} stopOpacity="0" /></radialGradient>
        </defs>
        <rect width={w} height={h} rx={18} fill="#0c3a24" />
        {Array.from({length: 10}).map((_, k) => <rect key={k} x={(k * w) / 10} width={w / 10} height={h} fill={k % 2 ? '#0f4129' : 'transparent'} />)}
        <g stroke="#ffffffa0" strokeWidth={3} fill="none">
          <rect x={6} y={6} width={w - 12} height={h - 12} rx={10} />
          <line x1={w / 2} y1={6} x2={w / 2} y2={h - 6} /><circle cx={w / 2} cy={h / 2} r={9.15 * s} />
          <rect x={6} y={(34 - 20.15) * s} width={16.5 * s} height={40.3 * s} /><rect x={6} y={(34 - 9.15) * s} width={5.5 * s} height={18.3 * s} />
          <rect x={w - 6 - 16.5 * s} y={(34 - 20.15) * s} width={16.5 * s} height={40.3 * s} /><rect x={w - 6 - 5.5 * s} y={(34 - 9.15) * s} width={5.5 * s} height={18.3 * s} />
        </g>
        <rect x={-6} y={(34 - 3.66) * s} width={10} height={7.32 * s} fill="#fff" /><rect x={w - 4} y={(34 - 3.66) * s} width={10} height={7.32 * s} fill="#fff" />
        {bands.filter((b) => show(b.at, b.until)).map((b, k) => <rect key={'b' + k} x={6} y={b.y * s} width={(w - 12) * ramp(f, b.at, b.at + 18)} height={b.h * s} fill={b.color ?? GOLD} opacity={0.16 * fadeK(b.at, b.until)} />)}
        {zones.filter((z) => show(z.at, z.until)).map((z, k) => {
          const [zx, zy] = P(z.x, z.y), pulse = 0.8 + 0.2 * Math.sin((f - z.at) / 5), c = z.color ?? GREEN;
          return (
            <g key={'z' + k} opacity={fadeK(z.at, z.until)}>
              {z.round ? <ellipse cx={zx + (z.w * s) / 2} cy={zy + (z.h * s) / 2} rx={(z.w * s) / 2} ry={(z.h * s) / 2} fill={c} opacity={0.28 * pulse} stroke={c} strokeWidth={3} strokeDasharray="10 8" />
                : <rect x={zx} y={zy} width={z.w * s} height={z.h * s} rx={14} fill={c} opacity={0.26 * pulse} stroke={c} strokeWidth={3} strokeDasharray="10 8" />}
              {z.label && <text x={zx + (z.w * s) / 2} y={zy - 12} textAnchor="middle" fontFamily={DISPLAY} fontSize={34} fill={c}>{z.label}</text>}
            </g>
          );
        })}
        {tethers.filter((t) => show(t.at, t.until)).map((t, k) => {
          const [ax, ay] = P(...posOf(t.a)), [bx, by] = P(...posOf(t.b));
          const broken = t.breakAt !== undefined && f >= t.breakAt;
          return <line key={'t' + k} x1={ax} y1={ay} x2={bx} y2={by} stroke={broken ? RED : t.color ?? '#ffffffcc'} strokeWidth={broken ? 4 : 3} strokeDasharray={broken ? '4 10' : '2 7'} opacity={fadeK(t.at, t.until)} />;
        })}
        {arrows.filter((a) => show(a.at, a.until)).map((a, k) => {
          const p = ramp(f, a.at, a.at + (a.dur ?? 16), 0, 1, Easing.out(Easing.quad));
          const pts: [number, number][] = [];
          for (let i = 0; i <= 24; i++) pts.push(bez(a.from, a.to, a.bend ?? 0, (i / 24) * p));
          const sp = pts.map(([px, py]) => P(px, py));
          const [ex, ey] = sp[sp.length - 1], [qx, qy] = sp[Math.max(0, sp.length - 3)];
          const ang = Math.atan2(ey - qy, ex - qx), c = a.color ?? GOLD, wd = a.width ?? 6;
          return (
            <g key={'a' + k} opacity={fadeK(a.at, a.until)}>
              <polyline points={sp.map((q) => q.join(',')).join(' ')} fill="none" stroke={c} strokeWidth={wd} strokeLinecap="round" strokeDasharray={a.dashed ? '14 12' : undefined} />
              {p > 0.05 && <polygon points={`0,0 -${wd * 3.2},-${wd * 1.8} -${wd * 3.2},${wd * 1.8}`} fill={c} transform={`translate(${ex} ${ey}) rotate(${(ang * 180) / Math.PI})`} />}
              {a.label && p > 0.6 && <text x={ex} y={ey - 22} textAnchor="middle" fontFamily={DISPLAY} fontSize={32} fill={c} opacity={ramp(f, a.at + 10, a.at + 18)}>{a.label}</text>}
            </g>
          );
        })}
        {toks2.map((t) => {
          const [tx, ty] = P(...posAt(t.k, f)), r = 1.9 * s, k = ramp(f, t.at ?? at, (t.at ?? at) + 8);
          const fill = t.team === 'barca' ? GRANA : PSG_FILL, ring = t.team === 'barca' ? BLAU : PSG_RING;
          return (
            <g key={t.id} transform={`translate(${tx} ${ty}) scale(${k})`} opacity={(t.ghost ? 0.4 : 1) * (t.until === undefined ? 1 : 1 - ramp(f, t.until - 8, t.until))}>
              {t.hi && <circle r={r * (1.9 + 0.25 * Math.sin(f / 5))} fill={GOLD} opacity={0.25} />}
              <circle r={r} fill={fill} stroke={t.hi ? GOLD : ring} strokeWidth={t.hi ? 6 : 5} />
              {t.label && <text y={r + 30} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={24} fill="#fff" stroke="#000a" strokeWidth={5} paintOrder="stroke">{t.label}</text>}
            </g>
          );
        })}
        {ball && f >= ball[0][0] && (() => { const [bx, by] = P(...posAt(ball, f)); return <g transform={`translate(${bx} ${by})`}><circle r={11} fill="#fff" stroke="#111" strokeWidth={3} /><circle r={4} fill="#111" /></g>; })()}
        {marks.filter((m) => show(m.at, m.until)).map((m, k) => {
          const [mx, my] = P(m.x, m.y), sc = interpolate(f, [m.at, m.at + 6, m.at + 11], [0, 1.25, 1], clamp), c = m.color ?? RED;
          return (
            <g key={'m' + k} transform={`translate(${mx} ${my}) scale(${sc})`}>
              {m.kind === 'x' && <><circle r={26} fill={c} /><path d="M-11 -11 L11 11 M11 -11 L-11 11" stroke="#fff" strokeWidth={7} strokeLinecap="round" /></>}
              {m.kind === 'q' && <><circle r={24} fill="#fff" /><text y={12} textAnchor="middle" fontFamily={DISPLAY} fontSize={36} fill={NAVY}>?</text></>}
              {m.kind === 'ball' && <><circle r={22} fill={c} opacity={0.35} /><circle r={11} fill="#fff" stroke="#111" strokeWidth={3} /></>}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
