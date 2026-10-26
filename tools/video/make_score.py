#!/usr/bin/env python3
"""Generate an original unobtrusive tonal bed; no external samples or music."""
import argparse,math,wave,array
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('output',type=Path);p.add_argument('--duration',type=float,required=True);a=p.parse_args()
if a.duration<=0:p.error('duration must be positive')
a.output.parent.mkdir(parents=True,exist_ok=True);sr=48000
with wave.open(str(a.output),'wb') as out:
 out.setparams((1,2,sr,0,'NONE','not compressed'))
 for second in range(math.ceil(a.duration)):
  block=array.array('h')
  for i in range(min(sr,int(a.duration*sr)-second*sr)):
   t=second+i/sr;fade=min(1,t/3,(a.duration-t)/4);pulse=.65+.35*math.sin(math.tau*t/8)**2
   value=(math.sin(math.tau*65.406*t)*.4+math.sin(math.tau*98*t)*.22+math.sin(math.tau*130.813*t)*.12)*.13*pulse*fade
   block.append(int(32767*value))
  out.writeframes(block.tobytes())
print(a.output)
