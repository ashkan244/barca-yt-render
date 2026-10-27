import React, {useMemo, useState, useEffect} from 'react';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import {fitText} from '@remotion/layout-utils';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {LOCAL_FONTS, fontsReady} from './fonts';
/** Accent- and punctuation-insensitive key used to match spoken words against emphasis names. */
export const captionKey = (w: string) => w.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const NAME = '#7cc4ff';
/** Callers supply source word timings. ASR output must be reviewed before delivery.
 *  `emphasis` (names, places) get a fixed colour and a small pop while spoken: kinetic captions. */
export const ReviewedCaptions: React.FC<{words: {w: string; s: number; e: number}[]; top?: number; width?: number; frameWidth?: number; maxFontSize?: number; emphasis?: string[]}> = ({words, top = 1460, width = 860, frameWidth = 1080, maxFontSize = 70, emphasis}) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {void fontsReady.then(() => setLoaded(true));}, []);
  const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const ms = frame / fps * 1000;
  const pages = useMemo(() => {
    const captions: Caption[] = words.map((w) => ({text: ` ${w.w}`, startMs: w.s * 1000, endMs: w.e * 1000, timestampMs: w.s * 1000, confidence: null}));
    return createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: 950, breakOnSilenceAfterMilliseconds: 350}).pages;
  }, [words]);
  const keys = useMemo(() => new Set((emphasis ?? []).map(captionKey).filter(Boolean)), [emphasis]);
  const page = pages.find((p) => ms >= p.startMs && ms < p.startMs + p.durationMs);
  if (!page || !loaded) return null;
  const fontSize = Math.min(maxFontSize, fitText({text: page.text.trim(), withinWidth: width - 44, fontFamily: LOCAL_FONTS.body, fontWeight: 800}).fontSize);
  return <div style={{position: 'absolute', top, left: (frameWidth - width) / 2, width, textAlign: 'center', pointerEvents: 'none'}}>
    <div style={{display: 'inline-block', maxWidth: '100%', background: '#050a14ed', borderRadius: 14, padding: '14px 22px', fontFamily: LOCAL_FONTS.body, fontSize, fontWeight: 800, lineHeight: 1.2, boxShadow: '0 10px 30px #0005'}}>
      {page.tokens.map((t, i) => {
        const active = ms >= t.fromMs && ms < t.toMs; const name = keys.has(captionKey(t.text));
        if (!name) return <span key={i} style={{color: active ? '#f2c230' : '#f6f6f4', whiteSpace: 'pre'}}>{t.text}</span>;
        const pop = active ? 1 + 0.12 * Math.max(0, 1 - (ms - t.fromMs) / 180) : 1;
        return <span key={i} style={{whiteSpace: 'pre'}}>{t.text.match(/^\s*/)![0]}<span style={{display: 'inline-block', color: active ? '#f2c230' : NAME, transform: `scale(${pop})`}}>{t.text.trim()}</span></span>;
      })}
    </div>
  </div>;
};
