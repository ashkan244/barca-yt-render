import React, {useMemo, useState, useEffect} from 'react';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import {fitText} from '@remotion/layout-utils';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {LOCAL_FONTS, fontsReady} from './fonts';
/** Callers supply source word timings. ASR output must be reviewed before delivery. */
export const ReviewedCaptions: React.FC<{words: {w: string; s: number; e: number}[]; top?: number; width?: number}> = ({words, top = 1460, width = 860}) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {void fontsReady.then(() => setLoaded(true));}, []);
  const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const ms = frame / fps * 1000;
  const pages = useMemo(() => {
    const captions: Caption[] = words.map((w) => ({text: ` ${w.w}`, startMs: w.s * 1000, endMs: w.e * 1000, timestampMs: w.s * 1000, confidence: null}));
    return createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: 950, breakOnSilenceAfterMilliseconds: 350}).pages;
  }, [words]);
  const page = pages.find((p) => ms >= p.startMs && ms < p.startMs + p.durationMs);
  if (!page || !loaded) return null;
  const fontSize = Math.min(70, fitText({text: page.text.trim(), withinWidth: width - 44, fontFamily: LOCAL_FONTS.body, fontWeight: 800}).fontSize);
  return <div style={{position: 'absolute', top, left: (1080 - width) / 2, width, textAlign: 'center', pointerEvents: 'none'}}>
    <div style={{display: 'inline-block', maxWidth: '100%', background: '#050a14ed', borderRadius: 14, padding: '14px 22px', fontFamily: LOCAL_FONTS.body, fontSize, fontWeight: 800, lineHeight: 1.2, boxShadow: '0 10px 30px #0005'}}>
      {page.tokens.map((t, i) => <span key={i} style={{color: ms >= t.fromMs && ms < t.toMs ? '#f2c230' : '#f6f6f4', whiteSpace: 'pre'}}>{t.text}</span>)}
    </div>
  </div>;
};
