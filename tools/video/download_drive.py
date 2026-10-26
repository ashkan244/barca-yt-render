#!/usr/bin/env python3
"""Download a user-supplied shared Drive file, verifying its expected SHA-256.
No authentication extraction, cookies, scraping of private files, or TLS overrides.
"""
import argparse
import hashlib
from html.parser import HTMLParser
from pathlib import Path
import re
import urllib.parse
import urllib.request

class Form(HTMLParser):
    def __init__(self):super().__init__(); self.action=''; self.values={}
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if tag=='form' and d.get('action')=='https://drive.usercontent.google.com/download':self.action=d['action']
        if tag=='input' and d.get('name'):self.values[d['name']]=d.get('value','')

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('file_id');p.add_argument('output',type=Path);p.add_argument('--sha256',required=True);a=p.parse_args()
    if not re.fullmatch(r'[\w-]{10,100}',a.file_id):p.error('Invalid file ID.')
    if not re.fullmatch(r'[a-fA-F0-9]{64}',a.sha256):p.error('Expected SHA-256 is required.')
    url='https://drive.google.com/uc?'+urllib.parse.urlencode({'export':'download','id':a.file_id})
    response=urllib.request.urlopen(url,timeout=60)
    if 'text/html' in response.headers.get('Content-Type',''):
        form=Form();form.feed(response.read(2_000_000).decode());response.close()
        if not form.action:raise RuntimeError('Drive did not return a downloadable shared file.')
        response=urllib.request.urlopen(form.action+'?'+urllib.parse.urlencode(form.values),timeout=60)
    a.output.parent.mkdir(parents=True,exist_ok=True);temp=a.output.with_suffix(a.output.suffix+'.part');digest=hashlib.sha256();size=0
    try:
        with response,temp.open('wb') as out:
            while chunk:=response.read(1024*1024):
                size+=len(chunk)
                if size>512*1024*1024:raise RuntimeError('File exceeds 512 MiB intake limit.')
                digest.update(chunk);out.write(chunk)
        if digest.hexdigest()!=a.sha256.lower():raise RuntimeError('Source checksum mismatch; file not accepted.')
        temp.replace(a.output);print(f'Verified source: {size} bytes; SHA-256 matches.')
    finally:
        temp.unlink(missing_ok=True)

if __name__=='__main__':main()
