#!/usr/bin/env python3
"""Find and fetch freely licensed archive media from Wikimedia Commons, keeping license metadata.

search   queries.json -> candidates.json + labelled contact sheets (one per query) for picking shots
fetch    manifest.json -> media files + licenses.tsv + CREDITS.md in an output directory

Only files whose Commons license is public domain, CC0, CC BY or CC BY-SA are accepted; anything else is
reported and skipped. A license on Commons is a claim by the uploader: keep the source URL, author and
license for every file, and credit CC BY / CC BY-SA authors in the video description.
"""
import argparse
import html
import io
import json
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

API = 'https://commons.wikimedia.org/w/api.php'
UA = 'BarcaRadarArchiveTool/1.0 (https://github.com/ashkan244/barca-yt-render)'
FREE = re.compile(r'^(cc0|public domain|pd\b|pd-|cc by(-sa)? \d|cc-by(-sa)?-\d)', re.I)
IMAGE_MIME = {'image/jpeg', 'image/png', 'image/webp', 'image/tiff'}
VIDEO_MIME = {'video/webm', 'application/ogg', 'video/ogg', 'video/mpeg', 'video/mp4'}


def get(params, retries=4):
    url = API + '?' + urllib.parse.urlencode({**params, 'format': 'json', 'formatversion': 2})
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60) as r:
                return json.load(r)
        except OSError:
            if attempt == retries - 1:
                raise
            time.sleep(2 ** attempt)


def download(url, path, retries=4):
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=120) as r:
                path.write_bytes(r.read())
                return
        except OSError:
            if attempt == retries - 1:
                raise
            time.sleep(2 ** attempt)


def text(meta, key):
    value = meta.get(key, {}).get('value', '')
    return html.unescape(re.sub(r'<[^>]+>', '', str(value))).strip()


def describe(page):
    info = (page.get('imageinfo') or [{}])[0]
    meta = info.get('extmetadata', {})
    lic = text(meta, 'LicenseShortName')
    return {
        'title': page['title'], 'page': info.get('descriptionurl', ''), 'mime': info.get('mime', ''),
        'width': info.get('width'), 'height': info.get('height'), 'duration': info.get('duration'),
        'url': info.get('url', ''), 'thumb': info.get('thumburl', ''),
        'license': lic, 'license_url': text(meta, 'LicenseUrl'), 'free': bool(FREE.match(lic)),
        'author': text(meta, 'Artist')[:200], 'credit': text(meta, 'Credit')[:200],
        'date': text(meta, 'DateTimeOriginal')[:40], 'description': text(meta, 'ImageDescription')[:300],
    }


def info_props(width):
    return {'prop': 'imageinfo', 'iiprop': 'url|size|mime|extmetadata', 'iiurlwidth': width,
            'iiextmetadatafilter': 'LicenseShortName|LicenseUrl|Artist|Credit|DateTimeOriginal|ImageDescription'}


def search(query, limit, kind):
    filetype = {'image': ' filetype:bitmap', 'video': ' filetype:video'}.get(kind, '')
    data = get({'action': 'query', 'generator': 'search', 'gsrnamespace': 6, 'gsrlimit': limit,
                'gsrsearch': query + filetype, **info_props(480)})
    pages = sorted(data.get('query', {}).get('pages', []), key=lambda p: p.get('index', 0))
    return [describe(p) for p in pages if p.get('imageinfo')]


def sheet(items, path, label):
    from PIL import Image, ImageDraw
    cell_w, cell_h, cols = 300, 260, 6
    rows = max(1, (len(items) + cols - 1) // cols)
    canvas = Image.new('RGB', (cell_w * cols, 40 + cell_h * rows), '#111')
    draw = ImageDraw.Draw(canvas)
    draw.text((10, 12), label, fill='#f2c230')
    for i, item in enumerate(items):
        x, y = (i % cols) * cell_w, 40 + (i // cols) * cell_h
        try:
            raw = urllib.request.urlopen(urllib.request.Request(item['thumb'], headers={'User-Agent': UA}), timeout=60).read()
            im = Image.open(io.BytesIO(raw)).convert('RGB'); im.thumbnail((cell_w - 10, cell_h - 50))
            canvas.paste(im, (x + 5, y + 5))
        except Exception as e:  # noqa: BLE001 - a broken thumbnail must not stop the sheet
            draw.text((x + 10, y + 60), f'thumb failed: {e}'[:40], fill='#f55')
        draw.text((x + 5, y + cell_h - 42), f"#{i} {item['license'][:22]} {'' if item['free'] else 'NOT FREE'}", fill='#fff' if item['free'] else '#f55')
        draw.text((x + 5, y + cell_h - 26), item['title'][5:45], fill='#aaa')
    canvas.save(path, quality=82)


def cmd_search(args):
    spec = json.loads(args.queries.read_text())
    args.out.mkdir(parents=True, exist_ok=True)
    result = {}
    for i, q in enumerate(spec['queries']):
        items = search(q['q'], q.get('limit', 18), q.get('kind', 'image'))
        result[q['id']] = {'query': q['q'], 'kind': q.get('kind', 'image'), 'items': items}
        sheet(items, args.out / f"{i:02d}-{q['id']}.jpg", f"{q['id']}: {q['q']}")
        print(f"{q['id']}: {len(items)} results, {sum(x['free'] for x in items)} free")
    (args.out / 'candidates.json').write_text(json.dumps(result, ensure_ascii=False, indent=1) + '\n')


def cmd_fetch(args):
    manifest = json.loads(args.manifest.read_text())
    args.out.mkdir(parents=True, exist_ok=True)
    rows, credits, failed = [], [], []
    for item in manifest['items']:
        data = get({'action': 'query', 'titles': item['title'], **info_props(args.width)})
        pages = data.get('query', {}).get('pages', [])
        if not pages or not pages[0].get('imageinfo'):
            failed.append(f"{item['id']}: not found ({item['title']})"); continue
        d = describe(pages[0])
        if not d['free']:
            failed.append(f"{item['id']}: license '{d['license']}' not accepted"); continue
        if d['mime'] in IMAGE_MIME:
            target = args.out / f"{item['id']}.jpg"
            download(d['thumb'] or d['url'], target)
            if target.read_bytes()[:4] == b'\x89PNG' or d['mime'] != 'image/jpeg':
                subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(target), '-q:v', '3', str(target.with_suffix('.tmp.jpg'))], check=True)
                target.with_suffix('.tmp.jpg').replace(target)
        elif d['mime'] in VIDEO_MIME:
            raw = args.out / f"{item['id']}.source"
            download(d['url'], raw)
            target = args.out / f"{item['id']}.mp4"
            trim = ['-ss', str(item['from']), '-t', str(item['seconds'])] if 'from' in item else []
            subprocess.run(['ffmpeg', '-v', 'error', '-y', *trim, '-i', str(raw), '-an', '-vf', 'scale=-2:min(1080\\,ih),fps=30,setsar=1',
                            '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(target)], check=True)
            raw.unlink()
        else:
            failed.append(f"{item['id']}: unsupported type {d['mime']}"); continue
        rows.append([target.name, d['page'], d['license'], d['author'], d['date'], d['description'].replace('\t', ' ')[:200]])
        if not re.match(r'^(cc0|public domain|pd)', d['license'], re.I):
            credits.append(f"- {d['title'][5:]} — {d['author'] or 'unknown author'}, {d['license']} ({d['page']})")
        print(f"{item['id']}: {d['license']} {target.name}")
    (args.out / 'licenses.tsv').write_text('file\tsource\tlicense\tauthor\tdate\tdescription\n' + ''.join('\t'.join(map(str, r)) + '\n' for r in rows))
    (args.out / 'CREDITS.md').write_text('Archive media (Wikimedia Commons):\n' + ('\n'.join(credits) if credits else '- Public domain / CC0 only; no attribution required.') + '\n')
    if failed:
        print('Not fetched:\n  ' + '\n  '.join(failed), file=sys.stderr)
        if args.strict:
            return 2
    return 0


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest='command', required=True)
    s = sub.add_parser('search'); s.add_argument('queries', type=Path); s.add_argument('--out', type=Path, required=True)
    f = sub.add_parser('fetch'); f.add_argument('manifest', type=Path); f.add_argument('--out', type=Path, required=True)
    f.add_argument('--width', type=int, default=1920); f.add_argument('--strict', action='store_true')
    args = p.parse_args()
    return cmd_search(args) if args.command == 'search' else cmd_fetch(args)


if __name__ == '__main__':
    sys.exit(main())
