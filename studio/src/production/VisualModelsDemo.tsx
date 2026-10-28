import React from 'react';
import {AbsoluteFill, Audio, staticFile, Sequence, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {PhotoMotion, PhotoComparison, PhotoDetail} from './PhotoMotion';
import {LOCAL_FONTS} from './fonts';
export const VISUAL_DEMO_FRAMES=810;
export const VisualModelsDemo: React.FC = () => {
 const f=useCurrentFrame();const {width,height}=useVideoConfig();const portrait=height>width;const pad=portrait?60:100;
 const titleStyle:React.CSSProperties={position:'absolute',left:pad,right:pad,top:portrait?170:110,color:'#fff',fontFamily:LOCAL_FONTS.display,fontSize:portrait?98:110,lineHeight:1.03};
 const overlay=<AbsoluteFill style={{background:'linear-gradient(180deg,#060d1cdb,transparent 65%,#060d1c8a)'}}/>;
 return <AbsoluteFill style={{background:'#080e1b'}}>
   <Sequence from={0} durationInFrames={150}><PhotoMotion id="cruyff-airport-1988" duration={150} fit={portrait?'contain':'cover'}/>{overlay}<div style={titleStyle}><div style={{fontFamily:LOCAL_FONTS.body,fontSize:28,color:'#f2c230',letterSpacing:4,marginBottom:20}}>ARCHIVE PORTRAIT · 1988</div>ONE IMAGE.<br/>A CLEAR STORY.</div></Sequence>
   <Sequence from={150} durationInFrames={165}><div style={{position:'absolute',inset:portrait?'300px 50px 130px':'190px 80px 100px'}}><PhotoComparison left="michels-airport-1973" right="cruyff-airport-1988" duration={165} vertical={portrait}/></div><div style={{...titleStyle,top:portrait?150:65,fontSize:portrait?72:85}}>TWO ARCHIVE MOMENTS</div><div style={{position:'absolute',bottom:45,left:pad,color:'#b6c6da',fontFamily:LOCAL_FONTS.body,fontSize:24}}>1973 / 1988 · Different photographs, dates preserved</div></Sequence>
   <Sequence from={315} durationInFrames={165}><div style={{position:'absolute',inset:portrait?'300px 50px 130px':'190px 80px 90px'}}><PhotoDetail id="michels-airport-1973" duration={165} vertical={portrait}/></div><div style={{...titleStyle,top:portrait?145:65,fontSize:portrait?70:85}}>LOOK AT THE ORIGINAL DETAIL</div></Sequence>
   <Sequence from={480} durationInFrames={150}><div style={{position:'absolute',inset:portrait?'350px 55px 180px':'170px 100px 90px',transform:'rotate(-1deg)'}}><PhotoMotion id="madrid-amsterdam-1959" duration={150} treatment="dossier" fit="contain"/></div><div style={{...titleStyle,top:portrait?155:65,fontSize:portrait?85:90}}>THE ARCHIVE FILE</div><div style={{position:'absolute',left:pad,bottom:portrait?95:40,fontFamily:LOCAL_FONTS.body,fontSize:27,color:'#f2c230'}}>AMSTERDAM · 30 JUNE 1959</div></Sequence>
   <Sequence from={630} durationInFrames={180}><div style={{position:'absolute',inset:portrait?'310px 50px 100px':'190px 80px 70px'}}><PhotoComparison left="pedri-2025" right="yamal-2025" duration={180} vertical={portrait} treatment="natural"/></div><div style={{...titleStyle,top:portrait?145:65,fontSize:portrait?78:90}}>PLAYER IMAGES · 2025</div></Sequence>
   <div style={{position:'absolute',top:portrait?65:35,left:pad,fontFamily:LOCAL_FONTS.body,fontSize:24,fontWeight:800,letterSpacing:3,color:'#f2c230'}}>BARÇA RADAR · VISUAL DESIGN STUDY</div>
   <div style={{position:'absolute',bottom:0,height:5,left:0,width:width*f/VISUAL_DEMO_FRAMES,background:'#f2c230'}}/>
   <Audio src={staticFile('audio/production-demo/score.wav')} volume={.6}/>
 </AbsoluteFill>;
};
