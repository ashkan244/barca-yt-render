// Render explicit review frames from a built Studio bundle; no success if frames are invalid.
// From repo root: node tools/video/qc_frames.mjs COMPOSITION 0,354,600 /tmp/qc-frames
import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'../..');
const require=createRequire(path.join(root,'studio/package.json'));
const {openBrowser,selectComposition,renderStill}=require('@remotion/renderer');
const [id,list,output]=process.argv.slice(2);
if(!id||!list||!output)throw new Error('Usage: qc_frames.mjs COMPOSITION 0,354,600 OUTPUT_DIR');
const frames=list.split(',').map(Number);if(frames.some(f=>!Number.isInteger(f)||f<0))throw new Error('Frames must be nonnegative integers.');
const browser=await openBrowser('chrome',{browserExecutable:process.env.BROWSER_EXECUTABLE||null});
try{
 const serveUrl=path.join(root,'studio/build');const composition=await selectComposition({serveUrl,id,puppeteerInstance:browser});
 if(frames.some(f=>f>=composition.durationInFrames))throw new Error('Frame outside composition.');
 fs.mkdirSync(output,{recursive:true});
 for(const frame of frames)await renderStill({serveUrl,composition,frame,output:path.join(output,`${String(frame).padStart(5,'0')}.png`),scale:.5,puppeteerInstance:browser});
 fs.writeFileSync(path.join(output,'manifest.json'),JSON.stringify({id,frames,scale:.5},null,2)+'\n');console.log(`Rendered ${frames.length} explicit review frames.`);
}finally{await browser.close({silent:true});}
