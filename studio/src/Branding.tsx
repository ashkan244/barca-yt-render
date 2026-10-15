import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, DISPLAY, BODY, CHALK, Chalkboard, ChalkDefs, Grain} from './lib';

export const BRAND = {
  name: 'The Culer Files',
  tagline: 'Barça stories & tactics, explained on the chalkboard',
  badge: 'UNOFFICIAL FAN CHANNEL',
};

/** Logo mark: a chalk "player token" with the CF monogram (same language as the tactics boards). */
export const Mark: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <defs>
      <filter id="markchalk" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="5" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.5" />
      </filter>
    </defs>
    <circle cx="100" cy="100" r="86" fill={C.blau} />
    <circle cx="100" cy="100" r="86" fill="none" stroke={C.grana} strokeWidth="16" filter="url(#markchalk)" />
    <circle cx="100" cy="100" r="66" fill="none" stroke={C.gold} strokeWidth="3" strokeDasharray="8 7" opacity="0.9" />
    <text x="100" y="124" textAnchor="middle" fontFamily={DISPLAY} fontSize="74" fill="#fff" letterSpacing="2">CF</text>
  </svg>
);

/** Profile picture 800×800 (YouTube crops to a circle). */
export const Avatar: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, ${C.slate2}, ${C.slate})`, alignItems: 'center', justifyContent: 'center'}}>
    <Mark size={640} />
  </AbsoluteFill>
);

/** Watermark 150×150 (video branding). */
export const Watermark: React.FC = () => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    <Mark size={150} />
  </AbsoluteFill>
);

/** Channel banner 2560×1440. Safe area for all devices: centre 1546×423. */
export const Banner: React.FC = () => (
  <AbsoluteFill>
    <ChalkDefs />
    <Chalkboard />
    {/* faint pitch drawn across the full banner (visible on TV/desktop) */}
    <svg width="2560" height="1440" style={{position: 'absolute'}}>
      <g stroke={C.chalk} strokeWidth="5" fill="none" opacity="0.18" filter="url(#chalk)">
        <rect x="140" y="250" width="2280" height="940" />
        <line x1="1280" y1="250" x2="1280" y2="1190" />
        <circle cx="1280" cy="720" r="190" />
        <rect x="140" y="470" width="300" height="500" />
        <rect x="2120" y="470" width="300" height="500" />
      </g>
      {/* tokens + arrows hint at the tactics language, outside the safe text area */}
      <g opacity="0.85">
        {[[300, 520], [360, 900], [2260, 540], [2220, 900]].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="34" fill={i < 2 ? C.blau : 'transparent'} stroke={i < 2 ? C.grana : C.chalk} strokeWidth="8" filter="url(#chalk)" />
          </g>
        ))}
        <path d="M 330 510 Q 380 380 470 330" stroke={C.gold} strokeWidth="7" fill="none" strokeDasharray="18 12" />
        <path d="M 2230 530 Q 2180 390 2090 330" stroke={C.chalk} strokeWidth="7" fill="none" strokeDasharray="18 12" />
      </g>
    </svg>
    {/* safe area content */}
    <div style={{position: 'absolute', left: 507, top: 509, width: 1546, height: 423, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 46}}>
      <Mark size={300} />
      <div>
        <div style={{fontFamily: DISPLAY, fontSize: 170, lineHeight: 0.95, color: '#fff', letterSpacing: 3}}>
          THE CULER <span style={{color: C.gold}}>FILES</span>
        </div>
        <div style={{fontFamily: CHALK, fontSize: 44, color: C.chalk, marginTop: 14, whiteSpace: 'nowrap'}}>{BRAND.tagline}</div>
        <div style={{display: 'flex', gap: 18, marginTop: 22}}>
          {['FULL STORIES', 'TACTICS', 'PLAY LIKE BARÇA', 'WHAT IF'].map((t) => (
            <div key={t} style={{fontFamily: BODY, fontWeight: 900, fontSize: 28, letterSpacing: 3, color: '#111', background: C.gold, padding: '6px 14px'}}>{t}</div>
          ))}
        </div>
      </div>
    </div>
    <div style={{position: 'absolute', right: 520, top: 952, fontFamily: BODY, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: C.chalkDim}}>{BRAND.badge}</div>
    <Grain opacity={0.06} />
  </AbsoluteFill>
);
