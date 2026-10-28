import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {LOCAL_FONTS} from './fonts';
import catalog from './photo-catalog.json';
export const photoById = (id: string) => {
  const photo = catalog.assets.find((a)=>a.id===id);
  if(!photo || photo.rightsStatus!=='verified')throw new Error(`Unverified/unknown photo: ${id}`);
  return photo;
};
/** Photograph only: pan/crop/monochrome; no invented depth or regenerated historical detail. */
export const PhotoMotion: React.FC<{id:string;duration:number;treatment?:'natural'|'mono'|'dossier';fit?:'cover'|'contain';credit?:boolean}> = ({id,duration,treatment='natural',fit='cover',credit=true}) => {
  const photo=photoById(id);const f=useCurrentFrame();const p=interpolate(f,[0,Math.max(1,duration-1)],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const filter=treatment==='natural'?'none':'grayscale(1) contrast(1.035)';
  return <AbsoluteFill style={{overflow:'hidden',background:'#0c1421'}}>
    {fit==='contain'&&<Img src={staticFile(photo.src)} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',filter:'blur(22px) brightness(.3)',transform:'scale(1.12)'}}/>}
    <Img src={staticFile(photo.src)} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:fit,objectPosition:`${photo.focus[0]}% ${photo.focus[1]}%`,transform:`scale(${1.015+.055*p})`,transformOrigin:`${photo.focus[0]}% ${photo.focus[1]}%`,filter}}/>
    {treatment==='dossier'&&<AbsoluteFill style={{pointerEvents:'none',boxShadow:'inset 0 0 120px #0006',border:'14px solid #e7dfcb'}}/>}
    {credit&&<div style={{position:'absolute',left:24,right:24,bottom:22,background:'#050b16e8',padding:'10px 16px',fontFamily:LOCAL_FONTS.body,color:'#f7f3e8',fontSize:25,lineHeight:1.3}}><span style={{display:"block",fontWeight:800,color:"#f2c230"}}>{photo.displayName}</span>{photo.date} · {photo.creator} · {photo.license}</div>}
  </AbsoluteFill>;
};
export const PhotoComparison: React.FC<{left:string;right:string;duration:number;vertical?:boolean;treatment?:'natural'|'mono'|'dossier'}> = ({left,right,duration,vertical=false,treatment='mono'}) => <AbsoluteFill style={{display:'grid',gridTemplateColumns:vertical?'1fr':'1fr 1fr',gridTemplateRows:vertical?'1fr 1fr':'1fr',gap:18,background:'#080e1b'}}>
  {[left,right].map((id)=><div key={id} style={{position:'relative',overflow:'hidden',borderRadius:16}}><PhotoMotion id={id} duration={duration} treatment={treatment} fit="contain"/></div>)}
</AbsoluteFill>;
/** Detail window magnifies existing pixels; it never reconstructs text/faces. */
export const PhotoDetail: React.FC<{id:string;duration:number;vertical?:boolean;focus?:[number,number]}> = ({id,duration,vertical=false,focus=[76,51]}) => {
 const photo=photoById(id);const f=useCurrentFrame();const z=interpolate(f,[0,duration-1],[1.65,1.9],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 return <AbsoluteFill style={{display:'grid',gridTemplateColumns:vertical?'1fr':'1.4fr 1fr',gridTemplateRows:vertical?'1fr 1fr':'1fr',gap:22}}>
  <div style={{position:'relative',overflow:'hidden',borderRadius:18}}><PhotoMotion id={id} duration={duration} fit="contain" treatment="mono"/></div>
  <div style={{position:'relative',overflow:'hidden',border:'3px solid #f2c230',borderRadius:18,background:'#0c1421'}}>
   <Img src={staticFile(photo.src)} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:`${focus[0]}% ${focus[1]}%`,transform:`scale(${z})`,transformOrigin:`${focus[0]}% ${focus[1]}%`}}/>
   <div style={{position:'absolute',bottom:20,left:20,right:20,fontFamily:LOCAL_FONTS.body,fontSize:25,padding:12,color:'#fff',background:'#080e1be8'}}>DETAIL FROM THE SAME PHOTOGRAPH</div>
  </div>
 </AbsoluteFill>;
};
