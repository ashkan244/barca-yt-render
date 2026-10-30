import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C } from './theme';

// A flag waving from a pole on the left: the artwork is cut into vertical strips,
// each shifted on a travelling sine wave and shaded by the wave's slope.
export const WavingFlag: React.FC<{
  w: number;
  h: number;
  id: string;
  amp?: number;
  speed?: number;
  children: React.ReactNode; // artwork drawn in a w x h box
}> = ({ w, h, id, amp = 0.045, speed = 0.11, children }) => {
  const frame = useCurrentFrame();
  const N = 40;
  const A = h * amp;
  const strips = Array.from({ length: N }, (_, i) => {
    const u = i / (N - 1);
    const phase = u * Math.PI * 2.2 - frame * speed;
    const dy = A * Math.sin(phase) * (0.25 + u);
    const slope = Math.cos(phase);
    return { i, x: (i * w) / N, dy, shade: slope };
  });
  return (
    <svg width={w} height={h + A * 3} viewBox={`0 ${-A * 1.5} ${w} ${h + A * 3}`} style={{ overflow: 'visible' }}>
      <defs>
        {strips.map((s) => (
          <clipPath id={`${id}-s${s.i}`} key={s.i}>
            <rect x={s.x - 0.6} y={-A * 2} width={w / N + 1.2} height={h + A * 4} />
          </clipPath>
        ))}
      </defs>
      {strips.map((s) => (
        <g key={s.i} clipPath={`url(#${id}-s${s.i})`}>
          <g transform={`translate(0 ${s.dy})`}>
            {children}
            <rect x={0} y={0} width={w} height={h}
              fill={s.shade > 0 ? '#fff' : '#000'} opacity={Math.abs(s.shade) * (s.shade > 0 ? 0.16 : 0.3)} />
          </g>
        </g>
      ))}
    </svg>
  );
};

export const EnglandArt: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <g>
    <rect width={w} height={h} fill={C.white} />
    <rect x={w / 2 - h * 0.1} width={h * 0.2} height={h} fill={C.red} />
    <rect y={h * 0.4} width={w} height={h * 0.2} fill={C.red} />
  </g>
);

export const SenyeraArt: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <g>
    {Array.from({ length: 9 }, (_, i) => (
      <rect key={i} y={(i * h) / 9} width={w} height={h / 9 + 0.5} fill={i % 2 ? C.red : C.gold} />
    ))}
  </g>
);
