import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import type {SourceEpisodeProps} from './SourceEpisode';
import {SourceLong, FPS} from './SourceEpisode';

const gold = '#f2c230';
const ink = '#09142b';
const red = '#a9153d';
const blue = '#123879';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const enter = (f: number, at: number, span = 16) => interpolate(f, [at, at + span], [0, 1], {...clamp});

/** A clean, original vector interpretation of the shield's historic components.
 * It follows the club's documented layout without tracing a supplied logo asset.
 */
const Crest: React.FC<{f: number; assemble?: boolean; focus?: 'cross'|'bars'|'ball'}> = ({f, assemble = false, focus}) => {
  const reveal = (from: number) => assemble ? enter(f, from, 18) : 1;
  return <svg viewBox="0 0 520 570" width="100%" height="100%" role="img" aria-label="Illustrated Barcelona crest components">
    <defs><clipPath id="shieldClip"><path d="M55 30H465V318C465 428 370 506 260 548C150 506 55 428 55 318Z" /></clipPath></defs>
    <g clipPath="url(#shieldClip)">
      <rect x="55" y="30" width="205" height="147" fill="#f5f1e7" opacity={reveal(0)} />
      <path d="M152 30h36v51h72v38h-72v58h-36v-58H55V81h97z" fill={red} opacity={reveal(6)} />
      <rect x="260" y="30" width="205" height="147" fill="#f4ce4d" opacity={reveal(12)} />
      {[0,1,2,3].map((i) => <rect key={i} x={288 + i * 43} y="30" width="19" height="147" fill={red} opacity={reveal(18 + i * 5)} />)}
      <path d="M55 177H465V275H55Z" fill="#f4f0e5" opacity={reveal(40)} />
      <text x="260" y="247" textAnchor="middle" fill="#111827" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="67" letterSpacing="7" opacity={reveal(48)}>FCB</text>
      <rect x="55" y="275" width="410" height="273" fill={blue} opacity={reveal(58)} />
      {[0,1,2,3,4].map((i) => <rect key={i} x={87 + i * 82} y="275" width="41" height="273" fill={red} opacity={reveal(64 + i * 4)} />)}
      <g opacity={reveal(82)} transform="translate(260 414)">
        <circle r="54" fill="#eee9db" stroke="#d2b96c" strokeWidth="5" />
        <path d="M0-29 27-9 17 23H-17L-27-9Z" fill="#202631" />
        <path d="m-27-9 27-20m27 20L0-29M17 23 27-9M-17 23 0 0m-34 0h34m17 23L0 0m0 0 27-9" fill="none" stroke="#202631" strokeWidth="5" />
      </g>
    </g>
    <path d="M55 30H465V318C465 428 370 506 260 548C150 506 55 428 55 318Z" fill="none" stroke={gold} strokeWidth="11" />
    <path d="M260 30V177M55 177H465M55 275H465" fill="none" stroke="#f2c230" strokeWidth="5" opacity=".9" />
    {focus && <rect x={focus==='cross'?64:focus==='bars'?269:170} y={focus==='ball'?355:40} width={focus==='ball'?180:focus==='cross'?185:187} height={focus==='ball'?126:focus==='cross'?126:126} rx="18" fill="none" stroke={gold} strokeWidth="8" opacity={.72+.2*Math.sin(f/7)} />}
  </svg>;
};

const Frame: React.FC<{children: React.ReactNode; kicker?: string}> = ({children, kicker}) => <div style={{position:'absolute',left:886,top:286,width:954,height:600,borderRadius:26,overflow:'hidden',background:'linear-gradient(145deg,#101d37f5,#071020f7)',border:'1px solid #ffffff2b',boxShadow:'0 24px 70px #0008'}}>
  <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 45%,#c2a14b14,transparent 65%)'}} />
  {kicker && <div style={{position:'absolute',left:32,top:23,zIndex:2,fontFamily:'Arial,sans-serif',fontSize:17,fontWeight:800,letterSpacing:3,color:gold}}>{kicker}</div>}
  {children}
</div>;

const HistoryPanel: React.FC<{t:number;f:number;chapter:number}> = ({t,f,chapter}) => {
  if (chapter === 1) return <Frame kicker="SENYERA · THE FOUR BARS">
    <div style={{position:'absolute',left:60,top:98,width:470,height:282,background:'#d9b63b',borderRadius:18,overflow:'hidden',boxShadow:'0 18px 50px #0006'}}>
      {[0,1,2,3].map((i)=><div key={i} style={{position:'absolute',left:90+i*100,top:0,width:37,height:282,background:red,transform:`scaleY(${enter(f,Math.round(27*FPS)+i*9)})`,transformOrigin:'top'}} />)}
      <div style={{position:'absolute',left:18,bottom:15,fontSize:15,fontWeight:900,letterSpacing:2,color:'#201b0f'}}>CATALONIA</div>
    </div>
    <div style={{position:'absolute',left:565,top:107,width:330,color:'#f5f4ef'}}>
      <div style={{fontFamily:'Arial,sans-serif',fontWeight:900,fontSize:27,lineHeight:1.15}}>A heraldic sign<br/>across a historic realm</div>
      <div style={{marginTop:24,padding:'16px 18px',borderLeft:`4px solid ${gold}`,background:'#ffffff0a',fontSize:20,color:'#dce3ee'}}>FIRST DOCUMENTED SEAL<br/><b style={{color:gold,fontSize:28}}>1150</b> <span style={{color:'#aeb9ca'}}>· Ramon Berenguer IV</span></div>
      <div style={{marginTop:20,fontSize:15,color:'#aeb9ca',letterSpacing:1.2}}>CROWN OF ARAGON · COMPOSITE MONARCHY</div>
      <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:11}}>{['ARAGON','CATALONIA','VALENCIA','MEDITERRANEAN'].map((x,i)=><span key={x} style={{padding:'8px 11px',borderRadius:30,border:'1px solid #f2c23066',background:'#f2c23010',fontSize:14,color:'#f5e5b0',opacity:enter(f,Math.round((52+i*2)*FPS))}}>{x}</span>)}</div>
    </div>
    <div style={{position:'absolute',left:90,top:425,fontSize:16,color:'#9fabc0',letterSpacing:1.4}}>FOUR RED BARS · GOLD FIELD · A SYMBOL WITH A LONGER HISTORY THAN THE CLUB</div>
  </Frame>;
  if (chapter === 2) return <Frame kicker="A SHARED SAINT · DISTINCT HERALDIC TRADITIONS">
    {[{x:75,title:'BARCELONA',sub:'SANT JORDI',at:88},{x:545,title:'ENGLAND',sub:'ST GEORGE',at:104}].map((d,i)=><div key={d.title} style={{position:'absolute',left:d.x,top:100,width:330,height:330,opacity:enter(f,Math.round(d.at*FPS)),transform:`translateY(${(1-enter(f,Math.round(d.at*FPS)))*20}px)`}}>
      <div style={{position:'absolute',inset:0,background:'#f3f0e8',borderRadius:18,boxShadow:'0 18px 45px #0007'}} />
      <div style={{position:'absolute',left:'43%',top:22,width:'14%',height:286,background:red}} />
      <div style={{position:'absolute',left:22,top:'43%',width:286,height:'14%',background:red}} />
      <div style={{position:'absolute',left:0,right:0,bottom:-51,textAlign:'center',fontSize:17,letterSpacing:2.5,fontWeight:900,color:'#fff'}}>{d.title} <span style={{color:gold}}>· {d.sub}</span></div>
    </div>)}
    <div style={{position:'absolute',left:145,top:520,width:660,textAlign:'center',fontSize:18,color:'#d5deec'}}>Resemblance does not establish borrowing.<br/><b style={{color:gold}}>Two traditions. One widely venerated saint.</b></div>
  </Frame>;
  if (chapter === 3) return <Frame kicker="FROM CITY ARMS TO CLUB IDENTITY">
    <div style={{position:'absolute',left:40,right:40,top:103,height:58}}>
      <div style={{position:'absolute',left:95,right:95,top:26,height:4,background:'#ffffff35'}} />
      <div style={{position:'absolute',left:95,top:26,width:Math.max(0,Math.min(1,(t-131.94)/(159.56-131.94)))*690,height:4,background:gold}} />
      {[{x:95,y:'1899',label:'CITY ARMS'},{x:785,y:'1910',label:'FCB CREST'}].map((p,i)=><div key={p.y} style={{position:'absolute',left:p.x-12,top:11,width:29,height:29,borderRadius:30,background:gold,boxShadow:'0 0 0 8px #f2c23020'}}><div style={{position:'absolute',top:39,left:-52,width:140,textAlign:'center',fontSize:18,fontWeight:900,color:'#fff'}}>{p.y}</div><div style={{position:'absolute',top:67,left:-64,width:164,textAlign:'center',fontSize:13,letterSpacing:2,color:'#aeb9ca'}}>{p.label}</div></div>)}
    </div>
    <div style={{position:'absolute',left:78,top:220,width:318,height:312,opacity:1-enter(f,Math.round(151*FPS))}}>
      <div style={{position:'absolute',inset:28,border:'2px solid #d9b63b',borderRadius:'48% 48% 42% 42%',background:'#c6a63b'}} />
      <div style={{position:'absolute',left:94,top:78,width:178,height:104,background:'#eee9dc'}} />
      <div style={{position:'absolute',left:163,top:78,width:36,height:104,background:red}} /><div style={{position:'absolute',left:94,top:114,width:178,height:32,background:red}} />
      <div style={{position:'absolute',left:97,top:198,color:'#fff',fontSize:19,fontWeight:900}}>BARCELONA CITY ARMS</div>
    </div>
    <div style={{position:'absolute',left:430,top:210,width:420,height:350,transform:`scale(${interpolate(enter(f,Math.round(151*FPS)),[0,1],[.78,1])})`,opacity:enter(f,Math.round(151*FPS))}}><Crest f={f-Math.round(151*FPS)} assemble /></div>
    <div style={{position:'absolute',left:364,top:359,fontSize:40,color:gold,opacity:enter(f,Math.round(151*FPS))}}>→</div>
    <div style={{position:'absolute',left:60,bottom:24,right:60,textAlign:'center',fontSize:15,letterSpacing:1.6,color:'#aeb9ca'}}>1910 COMPETITION · A DISTINCTIVE EMBLEM · CORE ELEMENTS ENDURE</div>
  </Frame>;
  return <Frame kicker={chapter === 0 ? 'THE STORY BEHIND THE CREST' : 'MÉS QUE UN CLUB'}>
    <div style={{position:'absolute',left:chapter===0?258:480,top:chapter===0?38:80,width:chapter===0?420:360,height:chapter===0?490:410,transform:`rotate(${interpolate(f,[0,50],[5,0],clamp)}deg) scale(${interpolate(f,[0,40],[.88,1],clamp)})`}}><Crest f={f} focus={chapter===0?(t>=4.16&&t<6.84?'bars':t>=7.9&&t<12.84?'cross':t>=13.1&&t<19.64?'bars':undefined):undefined} /></div>
    {chapter===0 && <>
      <div style={{position:'absolute',left:40,bottom:37,color:'#e9edf5',fontSize:21,fontWeight:800,letterSpacing:2}}>WHY THESE SYMBOLS?</div>
    </>}
    {chapter===4 && <div style={{position:'absolute',left:68,top:205,width:345,fontFamily:'Arial,sans-serif',fontSize:28,lineHeight:1.35,color:'#e9edf5'}}>History.<br/><span style={{color:gold}}>Culture.</span><br/>Sporting identity.</div>}
  </Frame>;
};

/** Long-form wrapper keeps the established presenter/caption/audio engine, replacing its generic card area with authored motion graphics. */
export const CrestHistoryLong: React.FC<SourceEpisodeProps> = (props) => {
  const f=useCurrentFrame(); const t=f/FPS;
  const chapter=t<26.22?0:t<88.02?1:t<131.94?2:t<189.06?3:4;
  const outro=props.spec.duration;
  return <AbsoluteFill>
    <SourceLong {...props} />
    {t<props.spec.duration && <HistoryPanel t={t} f={f} chapter={chapter} />}
    {t>=outro && <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 45%,#17284c 0%,#071020 70%)',color:'#f5f4ef',fontFamily:'Arial,sans-serif'}}>
      <div style={{position:'absolute',left:650,top:155,width:620,height:650,opacity:enter(f,outro*FPS,20),transform:`translateY(${(1-enter(f,outro*FPS,20))*22}px)`}}><Crest f={f} /></div>
      <div style={{position:'absolute',left:130,right:130,top:770,textAlign:'center',opacity:enter(f,outro*FPS+22,18)}}>
        <div style={{fontSize:52,fontWeight:900,letterSpacing:5}}>BARÇA <span style={{color:gold}}>RADAR</span></div>
        <div style={{marginTop:16,fontSize:20,fontWeight:800,letterSpacing:5,color:'#d7b74c'}}>MÉS QUE UN CLUB</div>
      </div>
    </AbsoluteFill>}
  </AbsoluteFill>;
};
