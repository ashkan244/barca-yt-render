#!/usr/bin/env python3
"""Draft an Archive Split edit (archive.cues) and photo beats from reviewed word timings.

The plan (JSON) says which words trigger which shots; the presenter's speech decides the rhythm:
  - a named person / place / topic switches the B-roll on the word that names it,
  - between names the B-roll keeps moving with generic shots (never longer than --max-shot seconds,
    boards may run to --max-board because they animate),
  - hook, full-frame punch-ins and typographic cards are fixed ranges from the plan.
All times snap to word starts so cuts never land mid-word. The result is a draft for human review:
it never decides that a photo shows the right person — the plan's shot ids must already follow the
"Commons title names the person" rule.

Plan format:
{
  "duration": 175,
  "hook": {"text": "A TACTICAL LESSON", "until": 2.4},
  "full": [[9.9, 11.84, true], [53.6, 57.0, true]],            # [a, b, punch]
  "cards": [{"a": 11.84, "b": 13.4, "lines": ["RELENTLESS", "PRESSING"], "style": "dark"}],
  "entities": {"Mbappé": ["mbappe", "mbappe2"], "Flick": ["flick", "flick2"]},   # word -> shots (rotated)
  "topics": {"pressing": ["b_press"], "corner": ["corner_arc", "b_corner"]},     # lower priority
  "generic": ["madrid_cl", "culers_scarf", "cn_interior"]                         # fillers, rotated
}
"""
import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path


def key(word):
    return re.sub(r'[^a-z0-9]', '', unicodedata.normalize('NFKD', word).encode('ascii', 'ignore').decode().lower())


def triggers(words, table):
    """(time, shots) for each spoken word matching a trigger (prefix match handles possessives: Flick's)."""
    keys = sorted(((key(k), v) for k, v in table.items()), key=lambda kv: -len(kv[0]))
    out = []
    for w in words:
        k = key(w['w'])
        for t, shots in keys:
            if t and k.startswith(t):
                out.append((w['s'], shots)); break
    return out


def draft(words, plan, min_shot=1.4, max_shot=3.2, max_board=6.0, beat_len=1.8):
    duration = plan['duration']
    starts = sorted({round(w['s'], 2) for w in words})
    snap = lambda t: min(starts, key=lambda s: abs(s - t)) if starts else t

    fixed = []  # (a, b, cue)
    if plan.get('hook'):
        fixed.append((0, plan['hook']['until'], {'layout': 'full'}))
    for a, b, *punch in plan.get('full', []):
        fixed.append((a, b, {'layout': 'full', **({'punch': True} if punch and punch[0] else {})}))
    for c in plan.get('cards', []):
        fixed.append((c['a'], c['b'], {'layout': 'card', 'card': c['lines'], 'cardStyle': c.get('style', 'dark')}))
    fixed.sort()
    for (a1, b1, _), (a2, _, _) in zip(fixed, fixed[1:]):
        if a2 < b1 - 1e-6:
            raise ValueError(f'fixed ranges overlap at {a2}')

    named = triggers(words, plan.get('entities', {}))
    topical = triggers(words, plan.get('topics', {}))
    rot = {}
    def take(shots):  # rotate through a trigger's shots so repeats show a different photo
        i = rot.get(id(shots), 0); rot[id(shots)] = i + 1
        return shots[i % len(shots)]
    generic = plan.get('generic', [])
    g = {'i': 0}
    def filler(avoid):
        for _ in range(len(generic)):
            s = generic[g['i'] % len(generic)]; g['i'] += 1
            if s != avoid:
                return s
        return generic[0] if generic else avoid

    cues, beats, cursor = [], [], 0.0
    gaps = []
    for a, b, cue in fixed + [(duration, duration, None)]:
        if a - cursor > 1e-6:
            gaps.append((cursor, a))
        if cue:
            cues.append({'a': a, 'b': b, **cue})
        cursor = max(cursor, b)
    for a, b in gaps:
        events = sorted([(t, s, 'name') for t, s in named if a <= t < b] + [(t, s, 'topic') for t, s in topical if a <= t < b])
        seq = []  # (start, shot)
        limit = lambda shot: max_board if shot.startswith('b_') else max_shot
        def push(t, shot):
            if seq and seq[-1][1] == shot:
                return  # never restart the shot that is already on screen
            if seq and t - seq[-1][0] < min_shot:
                if len(seq) > 1 or t - a >= min_shot:
                    t = seq[-1][0] + min_shot
                else:
                    seq[-1] = (seq[-1][0], shot); return
            if t >= b - 0.6:
                return
            seq.append((t, shot))
        first_name = next((e for e in events if e[2] == 'name' and e[0] - a < 1.0), None)
        push(a, take(first_name[1]) if first_name else (take(events[0][1]) if events and events[0][0] - a < 1.0 else filler(None)))
        for t, shots, kind in events:
            if kind == 'topic' and any(abs(t - t2) < min_shot for t2, _, k2 in events if k2 == 'name'):
                continue
            # keep gaps short: fill with generic shots before the next trigger
            while seq and t - seq[-1][0] > limit(seq[-1][1]) + min_shot:
                n = len(seq); push(snap(seq[-1][0] + limit(seq[-1][1])), filler(seq[-1][1]))
                if len(seq) == n:
                    break
            push(max(a, snap(t - 0.1)), take(shots))
            if kind == 'name':
                cut = seq[-1][0]
                beats.append({'a': round(cut, 2), 'b': round(min(b, cut + beat_len), 2), 'shot': seq[-1][1]})
        while seq and b - seq[-1][0] > limit(seq[-1][1]) + 0.6:
            n = len(seq); push(snap(seq[-1][0] + limit(seq[-1][1])), filler(seq[-1][1]))
            if len(seq) == n:
                break
        seq = [(round(t, 2), s) for t, s in seq]
        seq[0] = (round(a, 2), seq[0][1])
        cues.append({'a': round(a, 2), 'b': round(b, 2), 'layout': 'split', 'shots': [s for _, s in seq], 'at': [t for t, _ in seq]})
    cues.sort(key=lambda c: c['a'])
    beats = [x for i, x in enumerate(beats) if not i or x['a'] >= beats[i - 1]['b']]
    return cues, beats


def stats(cues, duration):
    split = [c for c in cues if c['layout'] == 'split']
    lens = [((c['at'] + [c['b']])[k + 1] - t) for c in split for k, t in enumerate(c['at'])]
    return {'cues': len(cues), 'shots': len(lens), 'broll_share': round(sum(c['b'] - c['a'] for c in split) / duration, 2),
            'longest_shot_s': round(max(lens), 2) if lens else 0, 'median_shot_s': round(sorted(lens)[len(lens) // 2], 2) if lens else 0}


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('words', type=Path); p.add_argument('plan', type=Path); p.add_argument('--output', type=Path, required=True)
    p.add_argument('--min-shot', type=float, default=1.4); p.add_argument('--max-shot', type=float, default=3.2); p.add_argument('--max-board', type=float, default=6.0)
    a = p.parse_args()
    words = json.loads(a.words.read_text()); words = words.get('words', words)
    plan = json.loads(a.plan.read_text())
    cues, beats = draft(words, plan, a.min_shot, a.max_shot, a.max_board)
    out = {'hook': plan.get('hook'), 'cues': cues, 'beats': beats, 'stats': stats(cues, plan['duration'])}
    a.output.write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n')
    print(json.dumps(out['stats']))
    return 0


if __name__ == '__main__':
    sys.exit(main())
