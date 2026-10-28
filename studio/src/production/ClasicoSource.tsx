import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {LOCAL_FONTS} from './fonts';
import {PhotoMotion} from './PhotoMotion';
import {ReviewedCaptions} from './Captions';
import {TacticalPlate, type Player, type PlateArrow} from './TacticalPlate';
import episode from '../episodes-source/clasico-source.manifest.json';
import captionDocument from '../episodes-source/clasico-source.pages.json';
const FPS = episode.fps;
export const CLASICO_SOURCE_FRAMES = Math.round(episode.duration * FPS);
const GOLD = '#f2c230';
const mix = (f: number, at: number, d = 14) => interpolate(f, [at, at + d], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
export type Scene = {a: number; b: number; title: string; sub: string; mode: 'press' | 'block' | 'line' | 'wings' | 'corner' | 'cards'; cards?: string[][]; cardDelays?: number[]; layout?: string; photoId?: string; cues?: {moveAt?: number; arrowAt?: number; spaceAt?: number}};
export const scenes = episode.scenes as Scene[];
export const SourcePlate: React.FC<{scene: Scene; f: number; readable?: boolean}> = ({scene, f, readable=false}) => {
  const local = f - scene.a * FPS; const p = mix(local, 25, 85);
  let players: Player[] = []; let arrows: PlateArrow[] = []; let zone: {x: number; y: number; w: number; h: number; label: string} | undefined;
  if (scene.mode === 'press') {
    players = [{id:'b1',team:'barca',x:17,y:20},{id:'b2',team:'barca',x:17,y:48},{id:'p',team:'barca',x:38,y:28,to:[27,28],name:'PEDRI',focus:true},{id:'r',team:'barca',x:40,y:47,to:[29,47],name:'RODRI'},
      {id:'m',team:'madrid',x:39,y:14,to:[25,18],name:'MBAPPÉ'},{id:'j',team:'madrid',x:49,y:37,to:[34,32],name:'BELLINGHAM'},{id:'g',team:'madrid',x:61,y:50,name:'GÜLER'}];
    arrows = [{from:[38,28],to:[27,28],kind:'run'},{from:[49,37],to:[34,32],kind:'run'}]; zone={x:32,y:15,w:23,h:37,label:'PRESSURE'};
  } else if (scene.mode === 'block') {
    players=[{id:'p',team:'barca',x:36,y:33,name:'PEDRI',focus:true},{id:'a',team:'barca',x:58,y:13},{id:'b',team:'barca',x:60,y:56},{id:'m1',team:'madrid',x:45,y:18,name:'MBAPPÉ'},{id:'m2',team:'madrid',x:45,y:53,name:'DIOMANDE'},{id:'j',team:'madrid',x:60,y:34,name:'BELLINGHAM'},{id:'d',team:'madrid',x:70,y:28},{id:'d2',team:'madrid',x:70,y:43}];
    zone={x:52,y:23,w:25,h:25,label:'CENTRE CLOSED'};
  } else if (scene.mode === 'line') {
    players=[{id:'b1',team:'barca',x:47,y:15},{id:'b2',team:'barca',x:47,y:30},{id:'b3',team:'barca',x:47,y:44},{id:'b4',team:'barca',x:47,y:57},{id:'m',team:'madrid',x:59,y:26,to:[22,26],name:'MBAPPÉ',focus:true},{id:'d',team:'madrid',x:66,y:48,to:[37,48],name:'RUNNER'}];
    arrows=[{from:[59,26],to:[22,26],kind:'run'},{from:[66,48],to:[37,48],kind:'pass'}]; zone={x:12,y:15,w:29,h:42,label:'SPACE IN BEHIND'};
  } else if (scene.mode === 'wings') {
    players=[{id:'y',team:'barca',x:68,y:9,name:'YAMAL',focus:true},{id:'b1',team:'barca',x:58,y:31},{id:'b2',team:'barca',x:57,y:49},{id:'m1',team:'madrid',x:76,y:24},{id:'m2',team:'madrid',x:77,y:37},{id:'m3',team:'madrid',x:77,y:49},{id:'m4',team:'madrid',x:89,y:30},{id:'m5',team:'madrid',x:89,y:44}];
    zone={x:73,y:23,w:20,h:29,label:'CROWDED CENTRE'};
  } else {
    // The presenter mentions a rehearsed corner, but supplies no player routes.
    // Show the set-piece origin without inventing the scoring sequence.
    players=[{id:'c',team:'barca',x:101,y:5,name:'CORNER',focus:true},{id:'b1',team:'barca',x:88,y:29},{id:'b2',team:'barca',x:86,y:42},{id:'m1',team:'madrid',x:91,y:27},{id:'m2',team:'madrid',x:91,y:43},{id:'g',team:'madrid',x:101,y:34}];
    zone={x:83,y:23,w:15,h:24,label:'SET-PIECE AREA'};
  }
  if (scene.mode === 'press' && scene.a >= 19.2) players = players.map((player) => ({...player, name: player.id === 'p' ? 'PEDRI' : player.id === 'r' && scene.a < 29 ? 'RODRI' : undefined}));
  if(readable){const ids=scene.mode==='press'?(scene.a<19.2?['m','j']:scene.a<29?['p','r']:['p']):scene.mode==='block'?['p','j']:scene.mode==='line'?['m','d']:scene.mode==='wings'?['y']:['c'];players=players.map(player=>({...player,name:ids.includes(player.id)?player.name:undefined}));}
  const cue=(name:'moveAt'|'arrowAt'|'spaceAt')=>scene.cues?.[name]??(scene.a+.8);
  return <TacticalPlate readable={readable} height={readable?850:610} camera={readable?(scene.mode==='wings'?[400,0,650,680]:scene.mode==='corner'?[600,0,450,680]:[0,0,850,680]):undefined} movementProgress={readable?mix(f,cue('moveAt')*FPS,40):p} arrowProgress={readable?mix(f,cue('arrowAt')*FPS,28):p} zoneProgress={readable?mix(f,cue('spaceAt')*FPS,18):p} players={players} arrows={arrows} zone={zone} progress={p} label={scene.mode === 'corner' ? 'A REHEARSED SET PIECE' : 'TACTICAL CONCEPT'} />;
};
export const ClasicoSourceShort: React.FC = () => {
  const f = useCurrentFrame(); const t = f / FPS; const scene = scenes.find((s) => t >= s.a && t < s.b) ?? scenes[scenes.length - 1];
  const photo=scene.layout==='photo'&&scene.photoId;
  const enter = scene.a===0?1:mix(f, scene.a * FPS); const isBoard = scene.mode !== 'cards';
  const punch = (t < 11.84 || (t >= 152.8 && t < 160.7)) ? 1.035 : 1;
  return <AbsoluteFill style={{background:'#080e1b',color:'#f5f4ef',fontFamily:LOCAL_FONTS.body}}>
    <AbsoluteFill style={{background:'radial-gradient(ellipse at 10% 30%, #1f5fd629, transparent 55%), radial-gradient(ellipse at 95% 65%, #b3123f29, transparent 60%)'}} />
    <div style={{position:'absolute',top:74,left:64,right:64,display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={{fontFamily:LOCAL_FONTS.display,fontSize:38,letterSpacing:2}}>BARÇA <span style={{color:GOLD}}>RADAR</span></span><span style={{fontSize:20,fontWeight:700,letterSpacing:3,color:'#b0bfd3'}}>EL CLÁSICO</span></div>
    <div style={{position:'absolute',left:64,top:157,right:64,opacity:enter,transform:`translateY(${(1-enter)*14}px)`}}>
      <div style={{color:GOLD,fontSize:21,fontWeight:800,letterSpacing:3,marginBottom:12}}>{scene.sub}</div>
      <div style={{fontFamily:LOCAL_FONTS.display,fontSize:scene.title.length>25?64:76,lineHeight:1.04}}>{scene.title}</div>
    </div>
    <div style={{position:'absolute',left:60,top:305,opacity:enter}}>
      {photo ? <div style={{position:'relative',width:960,height:610,overflow:'hidden',borderRadius:24}}><Sequence layout="none" from={Math.round(scene.a*FPS)} durationInFrames={Math.round((scene.b-scene.a)*FPS)}><PhotoMotion id={photo} duration={Math.round((scene.b-scene.a)*FPS)} fit="cover"/></Sequence></div> : isBoard ? <SourcePlate scene={scene} f={f}/> : <div style={{width:960,height:500,display:'flex',flexDirection:'column',justifyContent:'center',gap:24}}>
        {scene.cards?.map(([a,b],i)=><div key={a} style={{borderLeft:`5px solid ${i? '#3c75db':GOLD}`,padding:'24px 30px',background:'#101c30',borderRadius:12,opacity:mix(f,scene.a*FPS+(scene.cardDelays?.[i] ?? i*.3)*FPS),transform:`translateX(${(1-mix(f,scene.a*FPS+(scene.cardDelays?.[i] ?? i*.3)*FPS))*20}px)`}}><div style={{fontFamily:LOCAL_FONTS.display,fontSize:54,color:i?'#f5f4ef':GOLD}}>{a}</div><div style={{fontSize:25,fontWeight:700,letterSpacing:2,marginTop:5,color:'#b9c7d8'}}>{b}</div></div>)}
      </div>}
    </div>
    <div style={{position:'absolute',left:90,top:940,width:900,height:810,borderRadius:24,overflow:'hidden',background:'#152133',border:'2px solid #ffffff28',boxShadow:'0 22px 65px #0007'}}>
      <OffthreadVideo src={staticFile(episode.media.video)} muted style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'50% 36%',transform:`scale(${punch})`,filter:'contrast(1.025) saturate(0.98)'}} />
      <div style={{position:'absolute',inset:0,background:'linear-gradient(transparent 62%, #080e1b99 100%)',pointerEvents:'none'}} />
    </div>
    <ReviewedCaptions pages={captionDocument.pages} top={1540} width={860} minFontSize={54}/>
    <div style={{position:'absolute',bottom:89,left:70,right:70,display:'flex',justifyContent:'space-between',color:'#a4b1c4',fontSize:20,letterSpacing:2}}><span>WITH MORTI</span><span>TACTICAL ANALYSIS</span></div>
    <div style={{position:'absolute',bottom:68,left:70,width:940,height:3,background:'#ffffff1a'}}><div style={{height:3,width:`${f/CLASICO_SOURCE_FRAMES*100}%`,background:GOLD}}/></div>
    <Audio src={staticFile(episode.media.voice)}/>
    <Audio src={staticFile(episode.media.score)} volume={(fr)=>.22*interpolate(fr,[0,60,CLASICO_SOURCE_FRAMES-75,CLASICO_SOURCE_FRAMES],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}/>
  </AbsoluteFill>;
};

export const ClasicoSourceCover: React.FC = () => <AbsoluteFill style={{background:'#080e1b',color:'#fff',fontFamily:LOCAL_FONTS.body}}>
  <div style={{position:'absolute',top:86,left:70,fontFamily:LOCAL_FONTS.display,fontSize:45}}>BARÇA <span style={{color:GOLD}}>RADAR</span></div>
  <div style={{position:'absolute',top:180,left:70,color:GOLD,fontSize:26,fontWeight:800,letterSpacing:4}}>EL CLÁSICO · TACTICAL BREAKDOWN</div>
  <div style={{position:'absolute',top:245,left:70,right:70,fontFamily:LOCAL_FONTS.display,fontSize:130,lineHeight:1.02}}>THE SPACE<br/><span style={{color:GOLD}}>BEHIND</span></div>
  <div style={{position:'absolute',top:565,left:60}}><SourcePlate scene={scenes[5]} f={1800}/></div>
  <div style={{position:'absolute',left:110,top:1200,width:860,height:620,overflow:'hidden',borderRadius:26,border:'3px solid #f2c23080'}}><Img src={staticFile(episode.media.cover)} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'50% 25%'}}/></div>
</AbsoluteFill>;
