// Burned-in narration captions: short phrases, current word highlighted.
// Word timings come from public/audio/<code>/words.json (Whisper alignment) when present,
// otherwise they are estimated from the line duration, weighted by word length.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, BODY} from '../lib';
import type {LineTiming} from './timeline';

export type WordTiming = {w: string; s: number; e: number}; // seconds from line start

const MAX_WORDS = 7, MAX_CHARS = 38;

export const estimateWords = (text: string, lenFrames: number, fps = 30): WordTiming[] => {
  const words = text.split(/\s+/).filter(Boolean);
  const weights = words.map((w) => w.replace(/[^\p{L}\p{N}]/gu, '').length + 2 + (/[.,;:!?—]$/.test(w) ? 3 : 0));
  const total = weights.reduce((a, b) => a + b, 0), dur = lenFrames / fps;
  let t = 0;
  return words.map((w, i) => { const d = (weights[i] / total) * dur; const r = {w, s: t, e: t + d}; t += d; return r; });
};

const chunk = (words: WordTiming[]) => {
  const out: WordTiming[][] = []; let cur: WordTiming[] = [];
  for (const w of words) {
    const len = cur.map((x) => x.w).join(' ').length + w.w.length + 1;
    if (cur.length && (cur.length >= MAX_WORDS || len > MAX_CHARS)) { out.push(cur); cur = []; }
    cur.push(w);
    if (/[.!?;:—]$/.test(w.w) && cur.length >= 3) { out.push(cur); cur = []; }
  }
  if (cur.length) out.push(cur);
  return out;
};

/** Render inside a Sequence that starts at the line (frame 0 = line start). */
export const LineCaption: React.FC<{line: LineTiming; words?: WordTiming[]; position?: 'bottom' | 'center'}> = ({line, words, position = 'bottom'}) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const ws = words?.length ? words : estimateWords(line.text, line.len);
  const groups = chunk(ws);
  const g = groups.find((x) => t < x[x.length - 1].e + 0.15) ?? groups[groups.length - 1];
  if (!g || t > ws[ws.length - 1].e + 0.4) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, ...(position === 'bottom' ? {bottom: 64} : {top: 470}), textAlign: 'center', pointerEvents: 'none'}}>
      <span style={{display: 'inline-block', background: 'rgba(6,10,20,.78)', padding: '10px 26px 12px', borderRadius: 10, boxShadow: '0 8px 30px rgba(0,0,0,.45)'}}>
        {g.map((w, i) => (
          <span key={i} style={{fontFamily: BODY, fontWeight: 800, fontSize: position === 'bottom' ? 46 : 64, marginRight: 14,
            color: t >= w.s && t < w.e + 0.05 ? C.gold : t >= w.e ? '#fff' : '#ffffff70'}}>{w.w}</span>
        ))}
      </span>
    </div>
  );
};
