#!/usr/bin/env python3
"""Episode preflight and a single caption-page definition for burned text and SRT."""
import argparse,hashlib,json,math,re,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]

def checked_path(relative,base=ROOT):
 path=(base/relative).resolve()
 if not path.is_relative_to(base.resolve()):raise ValueError(f'Path escapes project: {relative}')
 return path

def caption_pages(words,protected=(),max_words=5,max_chars=42,max_seconds=2.2):
 if not words:raise ValueError('No caption words.')
 previous=-1
 for w in words:
  if not isinstance(w['w'],str) or not w['w'].strip() or not all(math.isfinite(w[k]) for k in ['s','e']) or w['s']<previous or w['e']<=w['s']:raise ValueError(f'Invalid/nonmonotonic word: {w}')
  previous=w['s']
 def norm(s):return re.sub(r'[^\w]','',s.casefold())
 phrases=sorted([p.split() for p in protected],key=len,reverse=True);units=[];i=0
 while i<len(words):
  n=1
  for phrase in phrases:
   if [norm(w['w']) for w in words[i:i+len(phrase)]]==[norm(x) for x in phrase]:n=len(phrase);break
  units.append(words[i:i+n]);i+=n
 pages=[];cur=[]
 def flush():
  if cur:pages.append({'s':cur[0]['s'],'e':max(w['e'] for w in cur),'text':' '.join(w['w'] for w in cur),'tokens':list(cur)})
 for unit in units:
  if len(' '.join(w['w'] for w in unit))>max_chars:raise ValueError('Protected phrase exceeds caption width budget; edit page policy explicitly.')
  new=cur+unit
  if cur and (len(new)>max_words or len(' '.join(w['w'] for w in new))>max_chars or new[-1]['e']-new[0]['s']>max_seconds or unit[0]['s']-cur[-1]['e']>.4):flush();cur=[]
  cur+=unit
  if re.search(r'[.!?;]$',unit[-1]['w']):flush();cur=[]
 flush();return pages

def srt(pages):
 def stamp(t):
  n=round(t*1000);return f'{n//3600000:02}:{n//60000%60:02}:{n//1000%60:02},{n%1000:03}'
 return '\n\n'.join(f'{i+1}\n{stamp(p["s"])} --> {stamp(p["e"])}\n{p["text"]}' for i,p in enumerate(pages))+'\n'

def validate(manifest,mode='preview'):
 errors=[]
 try:
  if manifest['schemaVersion']!=1:errors.append('Unsupported episode schema.')
  if manifest['source']['role'] not in ['short','long']:errors.append('Explicit presenter role required.')
  if manifest['duration']<=0 or manifest['fps']<=0:errors.append('Positive duration/fps required.')
  if not re.fullmatch(r'[a-f0-9]{64}',manifest['source']['sha256']):errors.append('Expected source SHA-256 required.')
  if mode=='release' and (manifest['review']['transcript']!='approved' or manifest['review']['unresolved']):errors.append('Release blocked by transcript review/unresolved terms; preview is available.')
  declared=set(manifest.get("photoAssets",[]));referenced={s["photoId"] for s in manifest["scenes"] if s.get("photoId")}
  if referenced!=declared:errors.append("Scene photo references must match the episode photoAssets list.")
  last=0
  for scene in manifest['scenes']:
   if abs(scene['a']-last)>.04 or scene['b']<=scene['a']:errors.append('Scene gap/overlap or nonpositive duration.')
   for cue in scene.get('cues',{}).values():
    if not scene['a']<=cue<=scene['b']:errors.append('Cue outside its scene.')
   last=scene['b']
  if abs(last-manifest['duration'])>.04:errors.append('Scenes do not cover source duration.')
 except (KeyError,TypeError,ValueError) as e:errors.append(f'Malformed manifest: {e}')
 return errors

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('manifest',type=Path);p.add_argument('--mode',choices=['preview','release'],default='preview');p.add_argument('--check-media',action='store_true');p.add_argument('--source',type=Path);p.add_argument('--build-captions',action='store_true');a=p.parse_args()
 m=json.loads(a.manifest.read_text());errors=validate(m,a.mode)
 from photos import validate as validate_photos
 photo_catalog=json.loads((ROOT/'studio/src/production/photo-catalog.json').read_text())
 errors.extend(validate_photos(photo_catalog,m.get('photoAssets',[]),a.mode=='release'))
 words=json.loads(checked_path(m['wordsFile']).read_text())['words']
 try:
  pages=caption_pages(words,m.get('protectedPhrases',[]))
  if any(w['e']>m['duration']+.04 for w in words):errors.append('Caption extends beyond source duration.')
 except ValueError as e:errors.append(str(e));pages=[]
 if a.source:
  if not a.source.is_file():errors.append('Source missing.')
  else:
   with a.source.open('rb') as f:
    if hashlib.file_digest(f,'sha256').hexdigest()!=m['source']['sha256']:errors.append('Source hash mismatch.')
 if a.check_media:
  for key in ['video','voice','score','cover']:
   media=checked_path(m['media'][key],ROOT/'studio/public')
   if not media.is_file():errors.append(f'Missing runtime media: {key}')
   elif key in ['video','voice','score']:
    duration=float(json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','json',str(media)]))['format']['duration'])
    if abs(duration-m['duration'])>.1:errors.append(f'{key} duration differs from episode.')
 if errors:p.exit(2,'\n'.join(errors)+'\n')
 if a.build_captions:
  for name,data in [(m['captionsFile'],json.dumps({'episode':m['id'],'pages':pages},ensure_ascii=False,indent=2)+'\n'),(m['srtFile'],srt(pages))]:
   out=checked_path(name);out.parent.mkdir(parents=True,exist_ok=True);out.write_text(data)
 print(f'{m["id"]}: {a.mode} checks passed; {len(pages)} shared caption pages.')
if __name__=='__main__':main()
