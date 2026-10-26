#!/usr/bin/env python3
"""Prepare this episode's original source without changing timing or speaking rate."""
import argparse,json,subprocess
from pathlib import Path

def main():
 p=argparse.ArgumentParser();p.add_argument('source',type=Path);p.add_argument('--output-dir',type=Path,required=True);a=p.parse_args();a.output_dir.mkdir(parents=True,exist_ok=True)
 def cmd(x):return subprocess.run(x,check=True,capture_output=True,text=True)
 cmd(['ffmpeg','-v','error','-y','-i',str(a.source),'-map','0:v:0','-an','-vf','fps=30,setsar=1','-c:v','libx264','-preset','fast','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',str(a.output_dir/'presenter.mp4')])
 first=cmd(['ffmpeg','-hide_banner','-i',str(a.source),'-vn','-af','highpass=f=75,loudnorm=I=-16:TP=-2:LRA=11:print_format=json','-f','null','-'])
 import re
 m=json.loads(re.search(r'\{\s*"input_i".*?\}',first.stderr,re.S).group(0))
 f=f"highpass=f=75,loudnorm=I=-16:TP=-2:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true:print_format=json"
 final=cmd(['ffmpeg','-hide_banner','-y','-i',str(a.source),'-vn','-af',f,'-ar','48000','-c:a','pcm_s16le',str(a.output_dir/'voice.wav')])
 (a.output_dir/'voice-measurements.json').write_text(json.dumps({'first_pass':m,'second_pass':json.loads(re.search(r'\{\s*"input_i".*?\}',final.stderr,re.S).group(0))},indent=2))
 print('Prepared video and two-pass voice master. No cuts or time stretch applied.')
if __name__=='__main__':main()
