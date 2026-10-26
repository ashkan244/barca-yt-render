#!/usr/bin/env python3
"""Local media intake, ASR and QC. ffmpeg/ffprobe required; ASR is optional."""
import argparse
import difflib
import hashlib
import json
import math
import re
import subprocess
import sys
import unicodedata
from fractions import Fraction
from pathlib import Path


def run(args):
    return subprocess.run(args, check=True, capture_output=True, text=True)


def number_rate(value):
    try:
        return float(Fraction(value))
    except (ValueError, ZeroDivisionError, TypeError):
        return None


def probe(path):
    data = json.loads(run(['ffprobe', '-v', 'error', '-show_format', '-show_streams', '-of', 'json', str(path)]).stdout)
    return data


def tokens(text):
    text = unicodedata.normalize('NFKD', text.casefold())
    text = ''.join(c for c in text if not unicodedata.combining(c))
    return re.findall(r"[^\W_]+(?:['’][^\W_]+)?", text, re.UNICODE)


def transcript_text(data):
    return ' '.join(s['text'] for s in data['segments'])


def compare_script(expected, heard):
    a, b = tokens(expected), tokens(heard)
    if not a or not b:
        raise ValueError('Script and transcript must both contain spoken words.')
    matcher = difflib.SequenceMatcher(None, a, b, autojunk=False)
    matches = sum(m.size for m in matcher.get_matching_blocks())
    missing = [{'script_words': ' '.join(a[i:j]), 'heard_words': ' '.join(b[k:l])}
               for tag, i, j, k, l in matcher.get_opcodes() if tag != 'equal']
    return {'script_word_count': len(a), 'heard_word_count': len(b),
            'script_coverage': matches / len(a), 'heard_coverage': matches / len(b),
            'sequence_similarity': matcher.ratio(), 'differences': missing,
            'caution': 'ASR/word-order screening only, not factual or lip-sync verification. Review names and every edit manually.'}


def validate_probe(data, profile):
    errors = []
    videos = [s for s in data['streams'] if s['codec_type'] == 'video']
    audios = [s for s in data['streams'] if s['codec_type'] == 'audio']
    if len(videos) != 1:
        errors.append('Expected exactly one video stream.')
    if not audios:
        errors.append('No audio stream.')
    if float(data.get('format', {}).get('duration', 0)) <= 0:
        errors.append('Missing or nonpositive duration.')
    if videos and profile != 'source':
        v = videos[0]
        dims = (1080, 1920) if profile == 'vertical' else (1920, 1080)
        if (v.get('width'), v.get('height')) != dims:
            errors.append(f'Expected {dims[0]}x{dims[1]}.')
        if v.get('codec_name') != 'h264':
            errors.append('Expected H.264 delivery video.')
        if v.get('pix_fmt') != 'yuv420p':
            errors.append('Expected yuv420p delivery pixel format.')
        if any(abs(float(s.get('rotation', 0))) > 0 for s in v.get('side_data_list', [])):
            errors.append('Delivery has a rotation transform; bake orientation into frames.')
        if number_rate(v.get('avg_frame_rate')) != 30:
            errors.append('Expected nominal average 30fps; use full decode to check integrity.')
        if audios and audios[0].get('codec_name') != 'aac':
            errors.append('Expected AAC delivery audio.')
    return errors


def write(path, data):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    p = sub.add_parser('inspect'); p.add_argument('media', type=Path); p.add_argument('--role', required=True, choices=['reference', 'short', 'long', 'delivery']); p.add_argument('--output', required=True, type=Path)
    p = sub.add_parser('contact-sheet'); p.add_argument('media', type=Path); p.add_argument('--output', required=True, type=Path); p.add_argument('--interval', type=float, default=5)
    p = sub.add_parser('cuts'); p.add_argument('media', type=Path); p.add_argument('--output', required=True, type=Path); p.add_argument('--threshold', type=float, default=.3)
    p = sub.add_parser('transcribe'); p.add_argument('media', type=Path); p.add_argument('--language', required=True); p.add_argument('--model', default='small'); p.add_argument('--models-dir', type=Path, default=Path('/workspace/.cache/video-models')); p.add_argument('--threads', type=int, default=4); p.add_argument('--output', required=True, type=Path)
    p = sub.add_parser('check-script'); p.add_argument('script', type=Path); p.add_argument('transcript', type=Path); p.add_argument('--min-coverage', type=float, default=.65); p.add_argument('--output', required=True, type=Path)
    p = sub.add_parser('qc'); p.add_argument('media', type=Path); p.add_argument('--profile', choices=['source', 'vertical', 'landscape'], default='source'); p.add_argument('--output', required=True, type=Path); p.add_argument('--decode', action='store_true'); p.add_argument('--loudness', action='store_true')
    args = parser.parse_args()
    if args.command == 'check-script':
        result = compare_script(args.script.read_text(), transcript_text(json.loads(args.transcript.read_text())))
        result['screening_passed'] = min(result['script_coverage'], result['heard_coverage']) >= args.min_coverage
        write(args.output, result)
        print(json.dumps({k: result[k] for k in ['script_coverage', 'heard_coverage', 'screening_passed']}))
        return 0 if result['screening_passed'] else 2
    if not args.media.is_file():
        raise ValueError(f'Media file does not exist: {args.media}')
    if args.command == 'inspect':
        data = probe(args.media)
        with args.media.open('rb') as source:
            digest = hashlib.file_digest(source, 'sha256').hexdigest()
        write(args.output, {'role': args.role, 'filename': args.media.name, 'bytes': args.media.stat().st_size,
                            'sha256': digest, 'content_verified': False, 'probe': data})
    elif args.command == 'contact-sheet':
        if args.interval <= 0:
            raise ValueError('Interval must be positive.')
        duration = float(probe(args.media)['format']['duration'])
        interval = max(args.interval, duration / 64)
        count = max(1, min(64, math.ceil(duration / interval)))
        columns = min(6, count); rows = math.ceil(count / columns)
        font = next((f for f in ('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', '/usr/share/fonts/dejavu/DejaVuSans.ttf') if Path(f).exists()), None)
        font = f"fontfile={font}:" if font else ''  # static ffmpeg builds may lack a fontconfig default
        filters = f"fps=1/{interval},scale=240:-2,drawtext={font}text='%{{pts\\:hms}}':x=6:y=6:fontcolor=white:box=1:boxcolor=black@0.7:fontsize=14,tile={columns}x{rows}"
        args.output.parent.mkdir(parents=True, exist_ok=True)
        run(['ffmpeg', '-v', 'error', '-y', '-i', str(args.media), '-vf', filters, '-frames:v', '1', str(args.output)])
    elif args.command == 'cuts':
        if not 0 < args.threshold < 1:
            raise ValueError('Threshold must be between zero and one.')
        result = run(['ffmpeg', '-hide_banner', '-i', str(args.media), '-vf', f"select='gt(scene,{args.threshold})',showinfo", '-an', '-f', 'null', '-'])
        times = [float(t) for t in re.findall(r'pts_time:([\d.]+)', result.stderr)]
        write(args.output, {'threshold': args.threshold, 'candidate_cut_seconds': times, 'note': 'Scene-score candidates; flashes/camera motion can cause false cuts.'})
    elif args.command == 'transcribe':
        from faster_whisper import WhisperModel
        model = WhisperModel(args.model, device='cpu', compute_type='int8', cpu_threads=args.threads, download_root=str(args.models_dir))
        segments, info = model.transcribe(str(args.media), language=args.language, word_timestamps=True, vad_filter=True, beam_size=5)
        result = []
        for s in segments:
            result.append({'s': s.start, 'e': s.end, 'text': s.text, 'words': [{'w': w.word.strip(), 's': w.start, 'e': w.end, 'p': w.probability} for w in (s.words or [])]})
        write(args.output, {'language': info.language, 'model': args.model, 'reviewed': False, 'segments': result})
    elif args.command == 'qc':
        data = probe(args.media); errors = validate_probe(data, args.profile)
        result = {'profile': args.profile, 'errors': errors, 'decode_checked': False, 'probe': data}
        if args.decode:
            try:
                run(['ffmpeg', '-v', 'error', '-xerror', '-i', str(args.media), '-f', 'null', '-'])
                result['decode_checked'] = True
            except subprocess.CalledProcessError as e:
                errors.append('Full decode failed: ' + e.stderr[-1500:])
        if args.loudness:
            r = run(['ffmpeg', '-hide_banner', '-i', str(args.media), '-vn', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'])
            measurements = re.search(r'\{\s*"input_i".*?\}', r.stderr, re.S)
            if not measurements:
                errors.append('No loudness measurements found.')
            else:
                result['loudness'] = json.loads(measurements.group(0))
                result['loudness_note'] = 'input_* describes source measurement, not normalized output. Targets require editorial judgement; no master was written.'
        result['passed'] = not errors
        write(args.output, result)
        return 0 if result['passed'] else 2
    print(args.output)
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        print(f'ERROR: {error}', file=sys.stderr)
        if isinstance(error, subprocess.CalledProcessError):
            print(error.stderr[-1500:] if error.stderr else '', file=sys.stderr)
        sys.exit(1)
