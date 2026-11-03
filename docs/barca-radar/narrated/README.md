# Narrated Shorts (faceless, English, ElevenLabs/Kokoro)

Vertical 1080×1920 Shorts in the style of the reference explainer reel (dark backgrounds, the crest and flags as
the main graphics, short bold captions, page name under a thin rule, page mark top right), narrated instead of presented.

| Composition | Script | Topic |
|---|---|---|
| `NR-CREST` | `studio/src/narrated/scripts/crest.json` | What each part of the Barça crest means |
| `NR-LAMINE` | `studio/src/narrated/scripts/lamine.json` | Lamine Yamal's third Kopa Trophy and his path |
| `NR-FLICK-CENTURY` | `studio/src/narrated/scripts/flick.json` | Hansi Flick's 100th Barça win and the 6–1 over Alavés |

The Flick episode uses original hand-drawn data cards and no match footage. Its event counts are reported in the
linked script sources and its pass visual is deliberately schematic.

## Pipeline

For the source and rights record, story, style frames and posting copy, see [flick-century.md](flick-century.md).

- Composition + script + Kokoro data live in this repository.
- Input code: `F100`, file `studio/src/episodes/narration/F100.json`; the existing Render video workflow creates timed audio on its runner.
- GitHub Actions → **Render video**: composition `NR-FLICK-CENTURY`, code `F100`, chunks `1`, CRF `16`.
- The workflow produces a 1080×1920 MP4 and a delivery metadata artifact. This step renders only; it does not post.

Music: Kevin MacLeod (incompetech.com), CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/).
