#!/usr/bin/env bash
# Copy ElevenLabs narration voiced in oldahvaz-reels into this repo (run from the repo root).
# usage: docs/barca-radar/narrated/import-narration.sh crest lamine
set -euo pipefail
SRC=ashkan244/oldahvaz-reels
for short in "$@"; do
  ep="nr-$short-el"
  mkdir -p studio/public/narrated studio/src/narrated/data
  gh api -H "Accept: application/vnd.github.raw" "repos/$SRC/contents/reels/public/audio/$ep.mp3" > "studio/public/narrated/$short.mp3"
  gh api -H "Accept: application/vnd.github.raw" "repos/$SRC/contents/reels/public/data/$ep.json" > "studio/src/narrated/data/$short.json"
  python3 - "$short" <<'EOF'
import json, sys
s = sys.argv[1]
d = json.load(open(f'studio/src/narrated/data/{s}.json', encoding='utf-8'))
assert d['id'] == s and d['audio'] == f'narrated/{s}.mp3' and d['scenes'], d.get('id')
print(s, d['engine'], f"{d['duration']:.1f}s", len(d['scenes']), 'scenes')
EOF
done
