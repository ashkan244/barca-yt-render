import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, DISPLAY, BODY, CHALK, Chalkboard, ChalkDefs, Halftone, Grain} from './lib';

// 1280x720 thumbnail concepts. Rules: ≤4 words, one focal point, high contrast, no unlicensed faces.

const Tag: React.FC<{text: string; color?: string}> = ({text, color = C.gold}) => (
  <div style={{display: 'inline-block', fontFamily: BODY, fontWeight: 900, fontSize: 30, letterSpacing: 4, color: '#111', background: color, padding: '6px 16px'}}>{text}</div>
);

export const ThumbFS: React.FC = () => (
  <AbsoluteFill style={{background: '#0b1220'}}>
    <ChalkDefs />
    <Img src={staticFile('photos/cruyff/cruyff-02.jpg')} style={{position: 'absolute', right: -250, top: -30, height: 940, filter: 'url(#ink) brightness(1.3) contrast(1.15)'}} />
    <Halftone opacity={0.16} size={6} />
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(8,14,30,.95) 0%, rgba(8,14,30,.6) 42%, rgba(8,14,30,0) 62%)'}} />
    <div style={{position: 'absolute', left: 50, top: 120}}>
      <Tag text="THE FULL STORY" />
      <div style={{fontFamily: DISPLAY, fontSize: 168, lineHeight: 0.92, color: '#fff', marginTop: 18}}>HE BUILT<br /><span style={{color: C.gold}}>BARÇA</span></div>
    </div>
  </AbsoluteFill>
);

export const ThumbTM: React.FC = () => (
  <AbsoluteFill>
    <Chalkboard />
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      <div style={{fontFamily: DISPLAY, fontSize: 420, lineHeight: 0.9, color: C.chalk, WebkitTextStroke: `6px ${C.grana}`, textShadow: `14px 14px 0 ${C.blau}`}}>2-6</div>
      <div style={{fontFamily: CHALK, fontSize: 58, color: C.gold, marginTop: 10}}>the night it all changed</div>
    </div>
    <div style={{position: 'absolute', left: 40, top: 36}}><Tag text="BERNABÉU · 2009" color={C.chalk} /></div>
    <Grain opacity={0.08} />
  </AbsoluteFill>
);

export const ThumbPL: React.FC = () => (
  <AbsoluteFill>
    <ChalkDefs />
    <Chalkboard />
    <svg width="1280" height="720" style={{position: 'absolute'}}>
      <g filter="url(#chalk)" stroke={C.chalk} strokeWidth={4} fill="none" opacity={0.8}>
        <circle cx={900} cy={380} r={150} />
        <line x1={900} y1={0} x2={900} y2={720} />
      </g>
      {/* scanning arcs */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${900 - 90 - i * 70} ${380 - 120 - i * 40} A ${130 + i * 80} ${130 + i * 80} 0 0 1 ${900 + 90 + i * 70} ${380 - 120 - i * 40}`} stroke={C.gold} strokeWidth={7} fill="none" opacity={1 - i * 0.25} strokeDasharray="18 12" />
      ))}
      <circle cx={900} cy={380} r={38} fill={C.blau} stroke={C.grana} strokeWidth={9} />
      <text x={900} y={394} textAnchor="middle" fontFamily={CHALK} fontSize={38} fill="#fff">8</text>
      <path d="M 900 380 L 1150 250" stroke={C.chalk} strokeWidth={7} strokeDasharray="16 12" filter="url(#chalk)" />
    </svg>
    <div style={{position: 'absolute', left: 50, top: 110}}>
      <Tag text="PLAY LIKE PEDRI" />
      <div style={{fontFamily: DISPLAY, fontSize: 176, lineHeight: 0.92, color: '#fff', marginTop: 16}}>SCAN<br /><span style={{color: C.gold}}>BEFORE</span></div>
    </div>
  </AbsoluteFill>
);

export const ThumbWI: React.FC = () => {
  const bars = [3, 8, 15, 24, 31, 27, 19, 11, 6, 2];
  return (
    <AbsoluteFill style={{background: 'linear-gradient(135deg, #0b1630 0%, #2a0a1c 100%)'}}>
      <div style={{position: 'absolute', right: 60, bottom: 70, display: 'flex', alignItems: 'flex-end', gap: 12, height: 440}}>
        {bars.map((b, i) => (
          <div key={i} style={{width: 48, height: b * 13, background: i === 4 ? C.gold : i % 2 ? C.grana : C.blau, borderRadius: '6px 6px 0 0', opacity: 0.95}} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 50, top: 110}}>
        <Tag text="WHAT IF MESSI STAYED?" />
        <div style={{fontFamily: DISPLAY, fontSize: 160, lineHeight: 0.92, color: '#fff', marginTop: 16}}>1,000<br /><span style={{color: C.gold}}>SEASONS</span></div>
      </div>
    </AbsoluteFill>
  );
};
