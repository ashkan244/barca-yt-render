import React from 'react';
import {AbsoluteFill, Sequence, Audio, OffthreadVideo, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {LOCAL_FONTS} from './fonts';
import {PhotoMotion} from './PhotoMotion';
import {SourcePlate, scenes} from './ClasicoSource';
import {ReviewedCaptions} from './Captions';
import episode from '../episodes-source/clasico-source.manifest.json';
import captionDocument from '../episodes-source/clasico-source.pages.json';
/** Source timeline remains continuous; only the editorial frame changes. */
export const AdaptiveSource: React.FC = () => {
 const frame=useCurrentFrame();const t=frame/episode.fps;const scene=scenes.find(s=>t>=s.a&&t<s.b)??scenes[scenes.length-1];const board=scene.layout==='board';const photo=scene.layout==='photo'&&scene.photoId;const supporting=board||!!photo;
 const speaker={left:60,top:330,width:960,height:1080,borderRadius:26};
 const inset={left:760,top:1270,width:250,height:250,borderRadius:125};const index=scenes.indexOf(scene);const previous=index>0&&['board','photo'].includes(scenes[index-1].layout??'')?inset:speaker;const target=supporting?inset:speaker;const k=index===0?1:interpolate(frame,[scene.a*episode.fps,scene.a*episode.fps+12],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});const box={left:previous.left+(target.left-previous.left)*k,top:previous.top+(target.top-previous.top)*k,width:previous.width+(target.width-previous.width)*k,height:previous.height+(target.height-previous.height)*k,borderRadius:previous.borderRadius+(target.borderRadius-previous.borderRadius)*k};
 const fade=interpolate(frame,[scene.a*episode.fps,scene.a*episode.fps+8],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 return <AbsoluteFill style={{background:'#080e1b',fontFamily:LOCAL_FONTS.body,color:'#f5f4ef'}}>
  <AbsoluteFill style={{background:'radial-gradient(ellipse at 12% 30%,#1f5fd62b,transparent 60%),radial-gradient(ellipse at 90% 85%,#b3123f22,transparent 60%)'}}/>
  <div style={{position:'absolute',top:70,left:60,right:60,display:'flex',justifyContent:'space-between',fontFamily:LOCAL_FONTS.display,fontSize:37}}><span>BARÇA <span style={{color:'#f2c230'}}>RADAR</span></span><span style={{fontFamily:LOCAL_FONTS.body,fontSize:22,letterSpacing:3}}>EL CLÁSICO</span></div>
  <div style={{position:'absolute',top:160,left:60,right:60,opacity:scene.a===0?1:fade}}><div style={{fontSize:24,color:'#f2c230',fontWeight:800,letterSpacing:2,marginBottom:12}}>{scene.sub}</div><div style={{fontFamily:LOCAL_FONTS.display,fontSize:scene.title.length>26?66:78,lineHeight:1.02}}>{scene.title}</div></div>
  {supporting&&<div style={{position:'absolute',left:60,top:335,width:960,height:850,opacity:fade,overflow:'hidden',borderRadius:24}}>
   {photo?<Sequence layout="none" from={Math.round(scene.a*episode.fps)} durationInFrames={Math.round((scene.b-scene.a)*episode.fps)}><PhotoMotion id={photo} duration={Math.round((scene.b-scene.a)*episode.fps)} fit="cover"/></Sequence>:<SourcePlate scene={scene} f={frame} readable/>}
  </div>}
  <div style={{position:'absolute',...box,overflow:'hidden',background:'#152133',border:'2px solid #ffffff28',boxShadow:'0 18px 50px #0006'}}>
   <OffthreadVideo src={staticFile(episode.media.video)} muted style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'50% 30%'}}/>
  </div>
  {!supporting&&scene.cards&&<div style={{position:'absolute',left:65,right:65,top:1430,display:'flex',gap:18}}>{scene.cards.map(([title],i)=><div key={title} style={{padding:'12px 20px',borderLeft:'4px solid #f2c230',background:'#101c30',fontFamily:LOCAL_FONTS.display,fontSize:36,opacity:interpolate(frame,[scene.a*episode.fps+(scene.cardDelays?.[i]??i*.3)*episode.fps,scene.a*episode.fps+(scene.cardDelays?.[i]??i*.3)*episode.fps+8],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>{title}</div>)}</div>}
  <ReviewedCaptions pages={captionDocument.pages} top={1580} width={870} minFontSize={54}/>
  <div style={{position:'absolute',left:70,right:70,bottom:88,fontSize:22,color:'#b3c1d1',letterSpacing:2}}>WITH MORTI · BARÇA RADAR</div>
  <Audio src={staticFile(episode.media.voice)}/><Audio src={staticFile(episode.media.score)} volume={.22}/>
 </AbsoluteFill>;
};
