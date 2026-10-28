#!/usr/bin/env python3
"""Verify curated photographic assets and export attribution; discover Commons metadata."""
import argparse,hashlib,json,urllib.request,urllib.parse
from datetime import datetime,timezone
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
CATALOG=ROOT/'studio/src/production/photo-catalog.json'

def validate(catalog,used=None,release=False,root=ROOT):
 errors=[];seen=set();assets=catalog.get('assets',[]);available={a.get('id') for a in assets}
 if used is not None:
  errors += [f'Unknown photo asset: {id}' for id in set(used)-available]
  assets=[a for a in assets if a.get('id') in used]
 for a in assets:
  id=a.get('id')
  if not id or id in seen:errors.append('Missing/duplicate asset ID.')
  seen.add(id)
  for field in ['sourcePage','creator','license','licenseUrl','date','caption','sha256','focus','usageNote']:
   if not a.get(field):errors.append(f'{id}: missing {field}')
  path=(root/'studio/public'/a.get('src','')).resolve()
  if not path.is_relative_to((root/'studio/public/photos').resolve()):errors.append(f'{id}: path escapes public/photos');continue
  if not path.is_file():errors.append(f'{id}: file missing');continue
  with path.open('rb') as f:
   if hashlib.file_digest(f,'sha256').hexdigest()!=a.get('sha256'):errors.append(f'{id}: hash changed; re-review image')
  focus=a.get('focus',[])
  if len(focus)!=2 or any(not isinstance(v,(float,int)) or not 0<=v<=100 for v in focus):errors.append(f'{id}: invalid crop focus')
  if release and (a.get('rightsStatus')!='verified' or a.get('license') not in ['CC0-1.0','CC-BY-4.0','CC-BY-3.0','CC-BY-2.0']):errors.append(f'{id}: release rights not cleared by current policy; review separately')
  if release and a.get('restrictions'):errors.append(f'{id}: restrictions require review')
 return errors

def credits(catalog,used):
 rows=[]
 for a in catalog['assets']:
  if used is None or a['id'] in used:rows.append(f"- {a['caption']} ({a['date']}) — {a['creator']}. [{a['license']}]({a['licenseUrl']}). [Original source]({a['sourcePage']}). Changes: {a['modifications']}")
 return '# Image credits\n\n'+'\n\n'.join(rows)+'\n'

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('command',choices=['verify','credits','commons','search']);p.add_argument('--catalog',type=Path,default=CATALOG);p.add_argument('--used',action='append');p.add_argument('--release',action='store_true');p.add_argument('--title');p.add_argument('--query');p.add_argument('--limit',type=int,default=12);p.add_argument('--output',type=Path);a=p.parse_args()
 if a.command in ['commons','search']:
  if not a.output:p.error('--output required')
  params={'action':'query','format':'json','prop':'imageinfo','iiprop':'url|extmetadata|size|timestamp'}
  if a.command=='commons':
   if not a.title:p.error('--title required')
   params['titles']=a.title if a.title.startswith('File:') else 'File:'+a.title
  else:
   if not a.query or not 1<=a.limit<=50:p.error('--query and --limit between 1 and 50 required')
   params.update(generator='search',gsrsearch=a.query,gsrnamespace=6,gsrlimit=a.limit)
  query=urllib.parse.urlencode(params)
  request=urllib.request.Request('https://commons.wikimedia.org/w/api.php?'+query,headers={'User-Agent':'BarcaRadarProduction/1.0 (https://github.com/ashkan244/barca-yt-render)'})
  data=json.load(urllib.request.urlopen(request,timeout=30));a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps({'review':'pending','retrievedAt':datetime.now(timezone.utc).isoformat(),'requestUrl':request.full_url,'dateNote':'Inspect DateTimeOriginal for capture date. Upload timestamp and search rank do not establish recency.','metadata':data},ensure_ascii=False,indent=2)+'\n');print('Candidate metadata only; no release approval or image download performed.');return
 catalog=json.loads(a.catalog.read_text());errors=validate(catalog,a.used,a.release)
 if errors:p.exit(2,'\n'.join(errors)+'\n')
 if a.command=='credits':
  if not a.output:p.error('--output required')
  a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(credits(catalog,a.used))
 print('Photo catalog verified'+(' for release policy.' if a.release else '.'))
if __name__=='__main__':main()
