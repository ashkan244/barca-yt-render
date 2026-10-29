---
name: barca-motion
description: Choose and wire motion for Barça Radar edits — transitions, shot camera moves, kinetic cards, callouts, draw-on arrows, overlays and the sound role of each — using the motion library in studio/src/production/motion. Use when editing an episode spec's archive cues/beats, building a new format, or asking "make this edit more dynamic".
---

# Barça Radar motion vocabulary

Library: `studio/src/production/motion/` (`index.ts` exports everything). Reference reel: composition `MOTION-LIBRARY`
(every primitive labelled with its spec name). Engines that use it: `source/ArchiveShort.tsx` (cues), `source/SourceEpisode.tsx` (beats), `source/Shot.tsx` (shot motion + callout).

## Rules (why the library looks like this)

1. **Motion follows meaning.** A move marks a new sentence, place, person or result. Inside one sentence, photos change with light, silent cuts. Never pick motion to fill time.
2. **Three sound roles only** (blueprint 2026-10-29): chapter/sentence change, a relationship moving, a result landing. No whoosh per photo. The engine enforces it: a cue's first shot plays its transition's sound, inner shots and beats are silent unless `sfx` is set, cards land on `impact`.
3. **Deterministic.** Every primitive is a pure function of a frame offset; randomness only via seeded `noise2D`. No `Math.random`, no state, so chunked parallel renders match.
4. **Headless-safe.** No WebGL (`@remotion/light-leaks` was dropped for a procedural CSS leak). All `@remotion/*` packages pinned to the exact `remotion` version (4.0.535).
5. **Evidence stays honest.** Parallax/handheld only move and blur pixels; they never invent content. A callout tag names a person only if the asset's title names them (same rule as shot labels).
6. **Phone first.** Text ≥ 50 px at 1080 wide; one focal point per frame; hold 1.5 s+ on anything that must be read.

## Spec vocabulary

Archive (`spec.archive`):
- `style`: `energetic` (default) | `documentary` | `clean` — rotation of cue-start (`cue`) and inner-shot (`inner`) transitions, see `TRANSITION_STYLES`.
- cue `transition`: one name (first shot of the cue) or an array (one per shot). `dir`: `left|right|up|down` for whip/push.
- cue `cardMotion`: `scale` (default) | `slam` | `pop` | `type` | `count` (first line is the number, rest is the label). `stamp`: e.g. `CONFIRMED`, `RUMOUR`.
- cue `punch: true` now also shakes the presenter on the cut.
- `hook.motion`: `pop` (default) | `slam` (lines split by `\n`) | `fade`; `hook.hot`: words in gold.

Shots (`archive.shots.<id>`): `motion`: `push` (default Ken Burns) | `parallax` (clear subject in front of a background) | `handheld` (presenter/board energy) | `still`;
`callout: {x, y, r?, label?, at?}` — ring + tag on the detail the sentence names (x/y % of the frame, r % of width, `at` frames into the shot).

Beats (`spec.beats[]`, Short/Long panels): `transition` (default `zoom`), `sfx` (optional).

## Transition table

| name | frames | sound | use for |
|---|---|---|---|
| cut | 0 | — | same place, continuous thought |
| flash | 5 | shutter | photo-to-photo inside a sentence; layout changes |
| whip | 9 | whoosh | new place/time; energetic sentence start |
| zoom | 10 | hit | "look closer" — a name, a detail, a beat panel |
| glitch | 8 | tick | archive→now jump, contradiction, "but…" |
| push | 12 | — | sequence/continuation (next step of a move) |
| iris | 14 | — | focus on one person from a group |
| wipe | 14 | whoosh | before/after, then/now |
| leak | 22 | — | nostalgic archive, slow documentary |
| dip | 10 | — | chapter break, end of an argument |

Text/overlay primitives for new formats: `Slam`, `WordPop`, `Typewriter`, `Counter`, `Highlight`, `Shine`, `Stamp`, `LowerThird`, `DrawPath` (board arrows; `d` in % of the box), `Callout`, `LightLeak`, `ScanLines`, `Sheen`, `Vignette`, `Handheld`, `Shake`, `Parallax`.

## Workflow

1. Read the transcript/caption pages; mark sentence starts, names, results. Choose `style` per episode genre (data/analysis → `clean`, archive story → `documentary`, hype/news → `energetic`).
2. Override only where meaning asks (a `glitch` on "but", a `count` card on a number, a `callout` on the player named). Keep ≤ 1 hard move per 2–3 s.
3. `cd studio && npx tsc --noEmit` — validators in `episodes-source/index.ts` reject unknown transitions or a transition array whose length differs from the shots.
4. Preview stills without a full render: `node scripts/stills.mjs <out-dir> <COMPOSITION-ID> <frame> [frame…]` (bundles once). Check transitions at frames 2–6 after the cut.
5. Render only when the user asks; release renders go through `.github/workflows/render-source-short.yml`.

If the official Remotion plugin is installed (`remotion-best-practices`, `remotion-captions`, …), use it for Remotion API questions; this skill owns Barça Radar's taste and rules.
