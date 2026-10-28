#!/usr/bin/env python3
"""Optional MLT engine smoke: two 3s excerpts, 15-frame dissolve; not a full editor test.
Input must have >=24s video at 30fps and audio. Outputs/QC stay outside tracked source.
"""
import argparse,hashlib,json,os,shutil,subprocess,sys,tempfile,time
from fractions import Fraction
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]

def main():
 p=argparse.ArgumentParser(description=__doc__)
 p.add_argument('--source',type=Path,required=True);p.add_argument('--output',type=Path,required=True)
 p.add_argument('--profile',choices=['landscape','vertical'],default='landscape');p.add_argument('--credits',type=Path)
 a=p.parse_args();src=a.source.resolve();out=a.output.resolve()
 if not src.is_file():p.error('Source file missing.')
 if src==out or out.exists() or out.suffix.lower()!='.mp4':p.error('Choose a new .mp4 output, different from source.')
 if not shutil.which('melt') or not shutil.which('ffprobe'):p.error('melt and ffprobe must be installed.')
 if a.credits and not a.credits.is_file():p.error('Credits file missing.')
 probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(src)]))
 video=next((s for s in probe['streams'] if s['codec_type']=='video'),None)
 if video is None or Fraction(video.get('avg_frame_rate','0/1'))!=30 or float(probe['format']['duration'])<24 or not any(s['codec_type']=='audio' for s in probe['streams']):p.error('Fixture needs >=24s video at exactly30fps and an audio stream.')
 width,height=(1920,1080) if a.profile=='landscape' else (1080,1920)
 if (video['width'],video['height'])!=(width,height):p.error('Use matching source/output ratio for this smoke; no automatic creative reframing.')
 out.parent.mkdir(parents=True,exist_ok=True);log=out.with_suffix('.render.log');qc=out.with_suffix('.quality.json')
 profile=f'description=Barca MLT smoke\nframe_rate_num=30\nframe_rate_den=1\nwidth={width}\nheight={height}\nprogressive=1\nsample_aspect_num=1\nsample_aspect_den=1\ndisplay_aspect_num={width}\ndisplay_aspect_den={height}\ncolorspace=709\n'
 start=time.perf_counter()
 with tempfile.TemporaryDirectory(prefix='barca-mlt-') as temp:
  path=Path(temp)/'profile';path.write_text(profile)
  cmd=['melt','-profile',str(path),str(src),'in=0','out=89',str(src),'in=630','out=719','-mix','15','-mixer','luma','-consumer','avformat:'+str(out),'vcodec=libx264','crf=18','preset=fast','pix_fmt=yuv420p','color_primaries=bt709','color_trc=bt709','colorspace=709','acodec=aac','ab=192k','ar=48000','channels=2','movflags=+faststart','threads=2','real_time=-2','-progress']
  env=os.environ.copy();env.setdefault('QT_QPA_PLATFORM','offscreen')
  with log.open('w') as f:subprocess.run(cmd,env=env,stdout=f,stderr=subprocess.STDOUT,check=True)
 elapsed=time.perf_counter()-start
 subprocess.run([sys.executable,str(ROOT/'tools/video/media.py'),'qc',str(out),'--profile',a.profile,'--decode','--loudness','--output',str(qc)],check=True)
 q=json.loads(qc.read_text());v=next(s for s in q['probe']['streams'] if s['codec_type']=='video')
 if int(v.get('nb_frames',0))!=165:raise ValueError('Expected165 frames after15-frame overlap; do not label this output verified.')
 with out.open('rb') as f:checksum=hashlib.file_digest(f,'sha256').hexdigest()
 with src.open('rb') as f:source_hash=hashlib.file_digest(f,'sha256').hexdigest()
 record={'scope':'MLT avformat/luma engine smoke, not GUI or full editor acceptance','sourceSha256':source_hash,'sha256':checksum,'profile':a.profile,'frames':165,'durationSeconds':float(q['probe']['format']['duration']),'renderSeconds':round(elapsed,3),'decodeChecked':q['decode_checked'],'qcPassed':q['passed'],'bytes':out.stat().st_size}
 out.with_suffix('.study.json').write_text(json.dumps(record,indent=2)+'\n')
 if a.credits:shutil.copyfile(a.credits,out.with_suffix('.credits.md'))
 print(json.dumps(record,indent=2))
if __name__=='__main__':main()
