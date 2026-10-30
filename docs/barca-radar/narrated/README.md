# Narrated Shorts (faceless, English, ElevenLabs)

Vertical 1080×1920 Shorts in the style of the reference explainer reel (dark backgrounds, the crest and flags as
the main graphics, short bold captions, page name under a thin rule), narrated instead of presented.

| Composition | Script | Topic |
|---|---|---|
| `NR-CREST` | `studio/src/narrated/scripts/crest.json` | What each part of the Barça crest means |
| `NR-LAMINE` | `studio/src/narrated/scripts/lamine.json` | Lamine Yamal's third Kopa Trophy (Ballon d'Or night, 26 Oct 2026) and his path |

Every factual line is listed with its source in the script's `sources`. The crest, trophies, shirt and flags are
hand-drawn illustrations (no club or competition artwork); the Equatorial Guinea flag is simplified (no arms).

## Pipeline

1. **Voice (in `ashkan244/oldahvaz-reels`, where the `ELEVENLABS_API_KEY` secret lives).** The scripts are mirrored
   there as episodes `nr-crest` / `nr-lamine` with `"lang": "en"`; `tts/en_short.py` sends the whole script in one
   ElevenLabs `/with-timestamps` request (`eleven_v3`, fallback `eleven_multilingual_v2`; voices in order: Josh —
   teacher for kids `nzFihrBIvB34imQBuxub`, then George). Character timings give exact scene starts and word times.
   Run: `gh workflow run render.yml -R ashkan244/oldahvaz-reels -f comps=NR-CREST-EL,NR-LAMINE-EL` — the voice
   job commits `reels/public/audio/nr-*-el.mp3` and `reels/public/data/nr-*-el.json` (its render jobs for these
   ids fail by design: the compositions live here).
2. **Import:** copy them to `studio/public/narrated/<short>.mp3` and `studio/src/narrated/data/<short>.json`.
3. **Render (here):** Actions → **Render video**, `composition=NR-CREST` / `NR-LAMINE`, `code` empty, `chunks=1`
   (one chunk keeps the AAC stream unbroken), CRF 16. The concat job normalises to -14 LUFS.

If a script changes, edit it in both places (`studio/src/narrated/scripts/*.json` here and the matching episode in
oldahvaz-reels `reels/episodes.json`) and voice again.

Music: Kevin MacLeod (incompetech.com), CC BY 4.0 — credit it in the description. The bed ducks under the voice and
rises in pauses (computed from the word timings). SFX: `public/sfx/whoosh.wav`, `impact.wav`.
