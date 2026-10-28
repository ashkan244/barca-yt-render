import React, {useMemo, useState, useEffect} from 'react';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import {fitText} from '@remotion/layout-utils';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {LOCAL_FONTS, fontsReady} from './fonts';

export type CaptionPage = {s: number; e: number; text: string; tokens: {w: string; s: number; e: number}[]};
/** Accent- and punctuation-insensitive key used to match spoken words against emphasis names. */
export const captionKey = (w: string) => w.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const NAME = '#7cc4ff';

/** Fallback paging when no reviewed page document exists (preview only). */
const pagesFromWords = (words: {w: string; s: number; e: number}[]): CaptionPage[] => {
  const captions: Caption[] = words.map((w) => ({text: ` ${w.w}`, startMs: w.s * 1000, endMs: w.e * 1000, timestampMs: w.s * 1000, confidence: null}));
  return createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: 950, breakOnSilenceAfterMilliseconds: 350}).pages.map((p) => ({
    s: p.startMs / 1000, e: (p.startMs + p.durationMs) / 1000, text: p.text.trim(),
    tokens: p.tokens.map((t) => ({w: t.text.trim(), s: t.fromMs / 1000, e: t.toMs / 1000})),
  }));
};

/** Burned-in captions. Prefer `pages` built by tools/video/episode.py: the same pages are written to the SRT,
 *  so screen and subtitle file never disagree. `words` paging is a preview fallback. ASR text must be reviewed.
 *  `emphasis` (names, places) get a fixed colour and a short pop while spoken (kinetic captions). */
export const ReviewedCaptions: React.FC<{pages?: CaptionPage[]; words?: {w: string; s: number; e: number}[]; top?: number; width?: number; frameWidth?: number;
  maxFontSize?: number; minFontSize?: number; emphasis?: string[]}> = ({pages, words, top = 1540, width = 860, frameWidth = 1080, maxFontSize = 70, minFontSize = 0, emphasis}) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {let active = true; void fontsReady.then(() => {if (active) setLoaded(true);}); return () => {active = false;};}, []);
  const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const t = frame / fps;
  const all = useMemo(() => pages ?? pagesFromWords(words ?? []), [pages, words]);
  const keys = useMemo(() => new Set((emphasis ?? []).map(captionKey).filter(Boolean)), [emphasis]);
  const page = all.find((p) => t >= p.s && t < p.e);
  if (!page || !loaded) return null;
  // A readable floor (minFontSize) keeps long phrases on two lines instead of shrinking them away.
  const fitted = Math.min(maxFontSize, fitText({text: page.text, withinWidth: width - 44, fontFamily: LOCAL_FONTS.body, fontWeight: 800}).fontSize);
  const fontSize = Math.max(minFontSize, fitted);
  return <div style={{position: 'absolute', top, left: (frameWidth - width) / 2, width, textAlign: 'center', pointerEvents: 'none'}}>
    <div style={{display: 'inline-block', maxWidth: '100%', background: '#050a14ed', borderRadius: 14, padding: '14px 22px', fontFamily: LOCAL_FONTS.body, fontSize, fontWeight: 800, lineHeight: 1.2, boxShadow: '0 10px 30px #0005'}}>
      {page.tokens.map((w, i) => {
        const active = t >= w.s && t < w.e; const name = keys.has(captionKey(w.w));
        const pop = name && active ? 1 + 0.12 * Math.max(0, 1 - (t - w.s) / 0.18) : 1;
        return <React.Fragment key={i}>{i > 0 ? ' ' : null}<span style={{display: name ? 'inline-block' : undefined, color: active ? '#f2c230' : name ? NAME : '#f6f6f4', transform: name ? `scale(${pop})` : undefined}}>{w.w}</span></React.Fragment>;
      })}
    </div>
  </div>;
};
