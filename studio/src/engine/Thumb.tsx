import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, DISPLAY, BODY, CHALK, Chalkboard, ChalkDefs, Halftone} from '../lib';
import type {Thumb} from './types';

const Tag: React.FC<{text: string}> = ({text}) => (
  <div style={{display: 'inline-block', fontFamily: BODY, fontWeight: 900, fontSize: 32, letterSpacing: 4, color: '#111', background: C.gold, padding: '6px 16px'}}>{text}</div>
);

const Headline: React.FC<{t: Thumb; size?: number}> = ({t, size = 170}) => {
  const lines = t.title.split('\n');
  const acc = (t.accent ?? '').toUpperCase();
  return (
    <div style={{fontFamily: DISPLAY, fontSize: size, lineHeight: 0.92, color: '#fff', marginTop: 16, textShadow: '0 8px 30px rgba(0,0,0,.55)'}}>
      {lines.map((l, i) => <div key={i} style={{color: acc && l.toUpperCase().includes(acc) ? C.gold : '#fff'}}>{l.toUpperCase()}</div>)}
    </div>
  );
};

/** 1280×720 thumbnail from an episode's thumb spec. */
export const EpisodeThumb: React.FC<{t: Thumb}> = ({t}) => (
  <AbsoluteFill style={{background: '#0b1220'}}>
    <ChalkDefs />
    {t.style === 'photo' && t.photo ? (
      <>
        <Img src={staticFile(t.photo)} style={{position: 'absolute', right: -200, top: -40, height: 820, filter: 'brightness(1.3) contrast(1.15) url(#ink)'}} />
        <Halftone opacity={0.16} size={6} />
        <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(8,14,30,.96) 0%, rgba(8,14,30,.65) 42%, rgba(8,14,30,0) 64%)'}} />
      </>
    ) : t.style === 'bars' ? (
      <AbsoluteFill style={{background: 'linear-gradient(135deg, #0b1630 0%, #2a0a1c 100%)'}}>
        <div style={{position: 'absolute', right: 60, bottom: 70, display: 'flex', alignItems: 'flex-end', gap: 12, height: 440}}>
          {[3, 8, 15, 24, 31, 27, 19, 11, 6, 2].map((b, i) => <div key={i} style={{width: 48, height: b * 13, background: i === 4 ? C.gold : i % 2 ? C.grana : C.blau, borderRadius: '6px 6px 0 0'}} />)}
        </div>
      </AbsoluteFill>
    ) : (
      <Chalkboard />
    )}
    {t.style === 'board' && (
      <svg width="1280" height="720" style={{position: 'absolute'}}>
        <g filter="url(#chalk)" stroke={C.chalk} strokeWidth={4} fill="none" opacity={0.7}>
          <circle cx={930} cy={380} r={150} /><line x1={930} y1={0} x2={930} y2={720} />
        </g>
        {[0, 1, 2].map((i) => <path key={i} d={`M ${930 - 90 - i * 70} ${380 - 120 - i * 40} A ${130 + i * 80} ${130 + i * 80} 0 0 1 ${930 + 90 + i * 70} ${380 - 120 - i * 40}`} stroke={C.gold} strokeWidth={7} fill="none" opacity={1 - i * 0.25} strokeDasharray="18 12" />)}
        <circle cx={930} cy={380} r={40} fill={C.blau} stroke={C.grana} strokeWidth={9} />
        <path d="M 930 380 L 1190 250" stroke={C.chalk} strokeWidth={7} strokeDasharray="16 12" filter="url(#chalk)" />
      </svg>
    )}
    {t.style === 'number' && t.number && (
      <div style={{position: 'absolute', right: 60, top: 70, fontFamily: DISPLAY, fontSize: 400, lineHeight: 0.9, color: C.chalk, WebkitTextStroke: `6px ${C.grana}`, textShadow: `14px 14px 0 ${C.blau}`}}>{t.number}</div>
    )}
    <div style={{position: 'absolute', left: 54, top: t.style === 'number' ? 330 : 110, maxWidth: t.style === 'number' ? 1150 : 760}}>
      <Tag text={t.kicker} />
      <Headline t={t} size={t.style === 'number' ? 120 : 160} />
    </div>
    <div style={{position: 'absolute', right: 26, bottom: 18, fontFamily: CHALK, fontSize: 28, color: '#ffffffb0'}}>The Culer Files</div>
  </AbsoluteFill>
);
