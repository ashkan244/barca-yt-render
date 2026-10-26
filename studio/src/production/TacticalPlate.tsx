import React, {useId} from 'react';
import {interpolate} from 'remotion';
import {LOCAL_FONTS} from './fonts';
export type Player = {id: string; x: number; y: number; team: 'barca' | 'opp'; name?: string; to?: [number, number]; focus?: boolean};
export type PlateArrow = {from: [number, number]; to: [number, number]; kind?: 'run' | 'pass'; color?: string};
export const TacticalPlate: React.FC<{players: Player[]; arrows?: PlateArrow[]; zone?: {x: number; y: number; w: number; h: number; label: string}; progress?: number; label: string; ball?: [number, number]; opponent?: string}> = ({players, arrows = [], zone, progress = 0, label, ball, opponent = 'MADRID'}) => {
  const id = useId().replace(/:/g, ''); const p = Math.max(0, Math.min(1, progress));
  return <div style={{width: 960, height: 610, background: '#0e1c2d', border: '1px solid #ffffff22', borderRadius: 24, padding: '20px 24px'}}>
    <div style={{fontFamily: LOCAL_FONTS.body, fontSize: 22, fontWeight: 700, color: '#b6c5d5', letterSpacing: 2, marginBottom: 12}}>{label}</div>
    <svg width="912" height="480" viewBox="0 0 1050 680" style={{display: 'block'}}>
      <defs><marker id={id} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L7 3L0 6" fill="#f2c230" /></marker></defs>
      <rect width="1050" height="680" rx="18" fill="#123b35" />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={i * 175} width={175} height={680} fill={i % 2 ? '#ffffff03' : 'none'} />)}
      <g stroke="#b5c8bd" strokeWidth="3" opacity="0.5" fill="none"><rect x="14" y="14" width="1022" height="652" /><path d="M525 14V666M14 140H170V540H14M1036 140H880V540H1036M14 250H65V430H14M1036 250H985V430H1036" /><circle cx="525" cy="340" r="91" /></g>
      {zone && <g opacity={.1 + .16 * p}><rect x={zone.x * 10} y={zone.y * 10} width={zone.w * 10} height={zone.h * 10} rx="12" fill="#f2c230" stroke="#f2c230" strokeWidth="4" strokeDasharray="12 8" /></g>}
      {zone && <text x={(zone.x + zone.w / 2) * 10} y={zone.y * 10 - 16} textAnchor="middle" fontFamily={LOCAL_FONTS.body} fontWeight="800" fontSize="26" fill="#f2c230">{zone.label}</text>}
      {arrows.map((a, i) => <line key={i} x1={a.from[0] * 10} y1={a.from[1] * 10} x2={(a.from[0] + (a.to[0] - a.from[0]) * p) * 10} y2={(a.from[1] + (a.to[1] - a.from[1]) * p) * 10} stroke={a.color ?? '#f2c230'} strokeWidth={6} strokeDasharray={a.kind === 'run' ? '13 10' : undefined} markerEnd={`url(#${id})`} opacity={p} />)}
      {players.map((t) => {
        const x = interpolate(p, [0, 1], [t.x, t.to?.[0] ?? t.x]) * 10;
        const y = interpolate(p, [0, 1], [t.y, t.to?.[1] ?? t.y]) * 10;
        return <g key={t.id}>
          {t.to && <circle cx={t.x * 10} cy={t.y * 10} r="20" fill="none" stroke="#fff6" strokeDasharray="5 5" />}
          {t.focus && <circle cx={x} cy={y} r="37" fill="#f2c23022" />}
          <circle cx={x} cy={y} r="23" fill={t.team === 'barca' ? '#a71943' : '#f2f1ec'} stroke={t.focus ? '#f2c230' : t.team === 'barca' ? '#4389ff' : '#7a8aab'} strokeWidth="5" />
          <text x={x} y={y + 52} textAnchor="middle" fontFamily={LOCAL_FONTS.body} fontSize="25" fontWeight="800" fill="#fff" stroke="#091625" strokeWidth="6" paintOrder="stroke">{t.name}</text>
        </g>;
      })}
      {ball && <circle cx={ball[0] * 10} cy={ball[1] * 10} r="10" fill="#fff" stroke="#111" strokeWidth="3" />}
    </svg>
    <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: LOCAL_FONTS.body, fontSize: 18, color: '#a5b8b6', marginTop: 5}}><span>BARÇA <span style={{color: '#db4269'}}>●</span> / {opponent} ○</span><span>SCHEMATIC · NOT MATCH TRACKING</span></div>
  </div>;
};
