import React, {useState, useEffect} from 'react';
import {fitText} from '@remotion/layout-utils';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {LOCAL_FONTS, fontsReady} from './fonts';
export type CaptionPage = {s: number; e: number; text: string; tokens: {w: string; s: number; e: number}[]};
/** The same semantic pages are serialized to SRT by tools/video/episode.py. */
export const ReviewedCaptions: React.FC<{pages: CaptionPage[]; top?: number; width?: number}> = ({pages, top = 1540, width = 860}) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {let active=true; void fontsReady.then(() => {if(active)setLoaded(true);}); return ()=>{active=false;};}, []);
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const t = f / fps;
  const page = pages.find((p) => t >= p.s && t < p.e);
  if (!page || !loaded) return null;
  // Two lines retain a readable floor rather than silently shrinking a long phrase.
  const size = Math.min(70, fitText({text:page.text,withinWidth:width-44,fontFamily:LOCAL_FONTS.body,fontWeight:800}).fontSize);
  const fontSize = Math.max(54,size);
  return <div style={{position:'absolute',top,left:(1080-width)/2,width,textAlign:'center',pointerEvents:'none'}}>
    <div style={{display:'inline-block',maxWidth:'100%',background:'#050a14ef',borderRadius:14,padding:'14px 22px',fontFamily:LOCAL_FONTS.body,fontSize,fontWeight:800,lineHeight:1.2,boxShadow:'0 10px 30px #0005'}}>
      {page.tokens.map((w,i)=><React.Fragment key={i}>{i>0?' ':null}<span style={{color:t>=w.s&&t<w.e?'#f2c230':'#f6f6f4'}}>{w.w}</span></React.Fragment>)}
    </div>
  </div>;
};
