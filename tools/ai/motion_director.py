#!/usr/bin/env python3
"""Motion director: Claude reads an episode's transcript, cues, shots and (optionally) photos, and proposes the motion
layer — transition per cut, card motion, shot camera, callouts — in the vocabulary of studio/src/production/motion.

The plan is written as a separate JSON file for review; `--apply` merges it into the spec. Nothing here invents facts:
the model only chooses *how* existing shots and cards move, and a callout tag may only repeat a shot's own label.

  python3 tools/ai/motion_director.py studio/src/episodes-source/clasico-source.spec.json --dry-run
  ANTHROPIC_API_KEY=... python3 tools/ai/motion_director.py <spec> [--images 12] [--effort high]
  python3 tools/ai/motion_director.py <spec> --apply <spec-dir>/<id>.motion.json

Requires `pip install anthropic` and ANTHROPIC_API_KEY for a real call. --dry-run needs neither.
"""
from __future__ import annotations

import argparse
import base64
import io
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / 'studio' / 'public'
SKILL = ROOT / '.agents' / 'skills' / 'barca-motion' / 'SKILL.md'
MODEL = 'claude-opus-5-5'

TRANSITIONS = ['cut', 'flash', 'whip', 'zoom', 'glitch', 'push', 'iris', 'wipe', 'leak', 'dip']
STYLES = ['energetic', 'documentary', 'clean']
CARD_MOTIONS = ['scale', 'slam', 'pop', 'type', 'count']
SHOT_MOTIONS = ['push', 'parallax', 'handheld', 'still']
DIRS = ['left', 'right', 'up', 'down']
D = 'default'  # "leave the engine default" — structured outputs need every field present


def _obj(props: dict) -> dict:
    return {'type': 'object', 'properties': props, 'required': list(props), 'additionalProperties': False}


_reason = {'type': 'string', 'description': 'Which spoken words motivate this choice (short).'}
PLAN_SCHEMA = _obj({
    'style': {'type': 'string', 'enum': STYLES},
    'hook_motion': {'type': 'string', 'enum': ['pop', 'slam', 'fade']},
    'hook_hot': {'type': 'array', 'items': {'type': 'string'}, 'description': 'At most 2 words of the hook to colour gold.'},
    'cues': {'type': 'array', 'description': 'Only cues that need an override; others follow the style.', 'items': _obj({
        'index': {'type': 'integer'},
        'transitions': {'type': 'array', 'items': {'type': 'string', 'enum': TRANSITIONS + [D]}, 'description': 'One per shot of a split cue, or one for full/card cues.'},
        'dir': {'type': 'string', 'enum': DIRS + [D]},
        'card_motion': {'type': 'string', 'enum': CARD_MOTIONS + [D]},
        'stamp': {'type': 'string', 'description': 'Verdict stamp for a card (e.g. CONFIRMED); empty for none.'},
        'punch': {'type': 'boolean'},
        'reason': _reason})},
    'shots': {'type': 'array', 'description': 'Only shots that need a non-default camera or a callout.', 'items': _obj({
        'id': {'type': 'string'},
        'motion': {'type': 'string', 'enum': SHOT_MOTIONS},
        'callout': {'type': 'boolean', 'description': 'Ring the detail the sentence is about (only on photos you were shown).'},
        'callout_x': {'type': 'number'}, 'callout_y': {'type': 'number'}, 'callout_r': {'type': 'number'},
        'reason': _reason})},
    'beats': {'type': 'array', 'items': _obj({'index': {'type': 'integer'}, 'transition': {'type': 'string', 'enum': TRANSITIONS}, 'reason': _reason})},
    'notes': {'type': 'string', 'description': 'Risks or places where a human should look.'},
})

TASK = """You are the motion editor for Barça Radar, a football analysis channel. The presenter's speech, captions and
shots are already approved; you only decide how cuts, cards and shots MOVE. Follow the motion skill above exactly
(its rules beat your taste). Work sentence by sentence through the transcript: mark sentence starts, names, numbers,
contradictions ("but", "however") and results, then choose. Prefer the style default and override only where the
words ask for it; at most one hard move (whip/zoom/glitch/wipe) per 2–3 seconds. Use `count` only when a card's first
line is a plain number. Callouts only on photos attached to this message, with x/y = centre of the detail in % of the
photo and r ≈ 8–16. Never add facts, names or text that are not already in the spec."""


def load(spec_path: Path) -> tuple[dict, dict | None]:
    spec = json.loads(spec_path.read_text())
    pages_path = spec_path.with_name(spec_path.name.replace('.spec.json', '.pages.json'))
    pages = json.loads(pages_path.read_text()) if pages_path.exists() else None
    return spec, pages


def episode_brief(spec: dict, pages: dict | None) -> str:
    ar = spec.get('archive', {})
    lines = [f"EPISODE {spec['id']} — {spec.get('label', '')} — {spec['duration']} s", '', 'TRANSCRIPT (s → text):']
    for p in (pages or {}).get('pages', []):
        lines.append(f"{p['s']:6.2f}–{p['e']:6.2f}  {p['text']}")
    if ar.get('hook'):
        lines += ['', f"HOOK (until {ar['hook']['until']} s): {ar['hook']['text']}"]
    lines += ['', 'ARCHIVE CUES (index, seconds, layout, shots or card text):']
    for i, c in enumerate(ar.get('cues', [])):
        what = ', '.join(c.get('shots') or ([c['shot']] if c.get('shot') else [])) or ' / '.join(c.get('card', []))
        lines.append(f"{i:3d}  {c['a']:6.2f}–{c['b']:6.2f}  {c['layout']:5s}  {what}" + ('  [punch]' if c.get('punch') else ''))
    lines += ['', 'SHOTS (id: kind, label):']
    for sid, sh in ar.get('shots', {}).items():
        lines.append(f"{sid}: {sh.get('kind', 'image')}{', ' + sh['label'] if sh.get('label') else ''}{', board ' + sh['board'] if sh.get('board') else ''}")
    if spec.get('beats'):
        lines += ['', 'PHOTO BEATS in Short/Long (index, seconds, shot):']
        lines += [f"{i:3d}  {b['a']:6.2f}–{b['b']:6.2f}  {b['shot']}" for i, b in enumerate(spec['beats'])]
    return '\n'.join(lines)


def photo_blocks(spec: dict, limit: int) -> tuple[list[dict], list[str]]:
    """Downscaled image blocks for photo shots present locally (archive media is fetched at render time)."""
    if limit <= 0:
        return [], []
    try:
        from PIL import Image
    except ImportError:
        return [], []
    blocks, ids = [], []
    for sid, sh in spec.get('archive', {}).get('shots', {}).items():
        src = PUBLIC / sh.get('src', '')
        if sh.get('kind', 'image') != 'image' or not src.is_file():
            continue
        im = Image.open(src).convert('RGB')
        im.thumbnail((768, 768))
        buf = io.BytesIO()
        im.save(buf, 'JPEG', quality=80)
        blocks += [{'type': 'text', 'text': f'Photo for shot "{sid}":'},
                   {'type': 'image', 'source': {'type': 'base64', 'media_type': 'image/jpeg', 'data': base64.standard_b64encode(buf.getvalue()).decode()}}]
        ids.append(sid)
        if len(ids) >= limit:
            break
    return blocks, ids


def build_request(spec: dict, pages: dict | None, images: int, effort: str) -> tuple[dict, list[str]]:
    blocks, shown = photo_blocks(spec, images)
    system = [{'type': 'text', 'text': SKILL.read_text() + '\n\n' + TASK, 'cache_control': {'type': 'ephemeral'}}]
    content = [{'type': 'text', 'text': episode_brief(spec, pages)}, *blocks,
               {'type': 'text', 'text': f"Photos shown: {', '.join(shown) or 'none'} (callouts only on these). Return the motion plan."}]
    return {'model': MODEL, 'max_tokens': 32000, 'system': system, 'messages': [{'role': 'user', 'content': content}],
            'output_config': {'effort': effort, 'format': {'type': 'json_schema', 'schema': PLAN_SCHEMA}}}, shown


def call_claude(request: dict) -> dict:
    import anthropic  # imported here so --dry-run and --apply work without the SDK
    client = anthropic.Anthropic()
    with client.messages.stream(**request) as stream:
        message = stream.get_final_message()
    if message.stop_reason == 'refusal':
        sys.exit(f'model refused: {getattr(message, "stop_details", None)}')
    if message.stop_reason == 'max_tokens':
        sys.exit('plan was cut off at max_tokens; rerun with fewer cues or lower effort')
    text = next(b.text for b in message.content if b.type == 'text')
    u = message.usage
    print(f'usage: in={u.input_tokens} cache_read={u.cache_read_input_tokens} out={u.output_tokens} request={message._request_id}', file=sys.stderr)
    return json.loads(text)


def validate(plan: dict, spec: dict, shown: list[str] | None = None) -> tuple[dict, list[str]]:
    """Drop anything that does not fit the spec; return the cleaned plan and warnings."""
    ar = spec.get('archive', {})
    cues, shots, beats = ar.get('cues', []), ar.get('shots', {}), spec.get('beats', [])
    warn: list[str] = []
    out = {k: plan[k] for k in ('style', 'hook_motion', 'hook_hot', 'notes') if k in plan}
    out['hook_hot'] = [w for w in plan.get('hook_hot', []) if ar.get('hook') and w.lower() in ar['hook']['text'].lower()][:2]
    out['cues'] = []
    for c in plan.get('cues', []):
        i = c.get('index')
        if not isinstance(i, int) or not 0 <= i < len(cues):
            warn.append(f'cue {i}: no such cue'); continue
        cue = cues[i]
        n = len(cue.get('shots') or ([cue['shot']] if cue.get('shot') else [])) if cue['layout'] == 'split' else 1
        tr = [t for t in c.get('transitions', []) if t in TRANSITIONS + [D]]
        if tr and len(tr) != n:
            warn.append(f'cue {i}: {len(tr)} transitions for {n} shots — kept only the first'); tr = tr[:1] + [D] * (n - 1)
        if c.get('card_motion') == 'count' and not (cue.get('card') and cue['card'][0].replace(',', '').replace('.', '').lstrip('+-').isdigit()):
            warn.append(f'cue {i}: count needs a numeric first line'); c = {**c, 'card_motion': D}
        out['cues'].append({**c, 'transitions': tr, 'stamp': c.get('stamp', '') if cue['layout'] == 'card' else ''})
    out['shots'] = []
    for s in plan.get('shots', []):
        sh = shots.get(s.get('id'))
        if not sh:
            warn.append(f"shot {s.get('id')}: unknown"); continue
        s = dict(s)
        if s.get('callout') and (sh.get('kind', 'image') != 'image' or (shown is not None and s['id'] not in shown)):
            warn.append(f"shot {s['id']}: callout dropped (photo not seen)"); s['callout'] = False
        if s.get('motion') == 'parallax' and sh.get('kind') in ('video', 'board'):
            s['motion'] = 'push'
        out['shots'].append(s)
    out['beats'] = [b for b in plan.get('beats', []) if isinstance(b.get('index'), int) and 0 <= b['index'] < len(beats) and b.get('transition') in TRANSITIONS]
    return out, warn


def apply(plan: dict, spec: dict) -> dict:
    """Merge a validated plan into the spec (in place) using the engine's field names."""
    ar = spec['archive']
    ar['style'] = plan.get('style', ar.get('style', 'energetic'))
    if ar.get('hook'):
        ar['hook']['motion'] = plan.get('hook_motion', ar['hook'].get('motion', 'pop'))
        if plan.get('hook_hot'):
            ar['hook']['hot'] = plan['hook_hot']
    for c in plan.get('cues', []):
        cue = ar['cues'][c['index']]
        tr = c.get('transitions') or []
        if any(t != D for t in tr):
            if len(tr) == 1:
                cue['transition'] = tr[0]
            elif all(t != D for t in tr):
                cue['transition'] = tr
            else:  # the engine takes one name or a full list; fill the gaps with the first explicit choice
                first = next(t for t in tr if t != D)
                cue['transition'] = [t if t != D else first for t in tr]
        if c.get('dir', D) != D:
            cue['dir'] = c['dir']
        if c.get('card_motion', D) != D and cue['layout'] == 'card':
            cue['cardMotion'] = c['card_motion']
        if c.get('stamp'):
            cue['stamp'] = c['stamp']
        if c.get('punch'):
            cue['punch'] = True
    for s in plan.get('shots', []):
        sh = ar['shots'][s['id']]
        if s.get('motion', 'push') != 'push':
            sh['motion'] = s['motion']
        if s.get('callout'):
            # The tag may only repeat the shot's own (title-verified) label; otherwise the ring stands alone.
            sh['callout'] = {'x': round(s['callout_x'], 1), 'y': round(s['callout_y'], 1), 'r': round(s.get('callout_r') or 12, 1),
                             **({'label': sh['label']} if sh.get('label') else {})}
    for b in plan.get('beats', []):
        spec['beats'][b['index']]['transition'] = b['transition']
    return spec


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('spec', type=Path)
    ap.add_argument('--images', type=int, default=12, help='photo shots to show the model (0 = none)')
    ap.add_argument('--effort', default='high', choices=['low', 'medium', 'high', 'xhigh', 'max'])
    ap.add_argument('--dry-run', action='store_true', help='print the brief and request size; no API call')
    ap.add_argument('--apply', type=Path, metavar='PLAN', help='merge a reviewed plan file into the spec')
    ap.add_argument('--out', type=Path)
    a = ap.parse_args()
    spec, pages = load(a.spec)
    if 'archive' not in spec:
        sys.exit('spec has no archive section')
    if a.apply:
        plan, warn = validate(json.loads(a.apply.read_text()), spec)
        for w in warn:
            print('warn:', w, file=sys.stderr)
        a.spec.write_text(json.dumps(apply(plan, spec), ensure_ascii=False, indent=2) + '\n')
        print(f'applied {a.apply} → {a.spec}; now run: cd studio && npx tsc --noEmit && npm run stills -- <dir> {spec["id"]}-ARCHIVE <frames>')
        return
    request, shown = build_request(spec, pages, a.images, a.effort)
    if a.dry_run:
        print(request['messages'][0]['content'][0]['text'])
        print(f"\n--- model {MODEL}, effort {a.effort}, system {len(request['system'][0]['text'])} chars, photos {len(shown)}: {', '.join(shown) or 'none'}")
        return
    plan, warn = validate(call_claude(request), spec, shown)
    out = a.out or a.spec.with_name(a.spec.name.replace('.spec.json', '.motion.json'))
    out.write_text(json.dumps({'model': MODEL, 'effort': a.effort, 'warnings': warn, **plan}, ensure_ascii=False, indent=2) + '\n')
    for w in warn:
        print('warn:', w, file=sys.stderr)
    print(f'plan → {out} (review it, then --apply {out})')


if __name__ == '__main__':
    main()
