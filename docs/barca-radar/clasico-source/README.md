# El Clásico — source-aligned tactical Short

## Authoritative content

The user explicitly selected the **actual presenter recording**, not the previously supplied PSG or historical scripts. The 175-second square recording is the Short source. It opens “Losing El Clásico is always tough to swallow…” and discusses Madrid's press, Barcelona's high line, wide traps, injuries, a corner, substitutions and Gerard Martín's late block.

The uploaded Persian historical video (96.731s, 720×1280) is a **style reference only**. No footage or audio from it is included in this edit. It is not a presenter source, and the historical script is not used. The earlier PSG packet remains a separate archived planning exercise.

## Implementation

- Composition: `CLASICO-SOURCE-SHORT`, 1080×1920, 30fps, 5250 frames / 175s.
- Same speaking rate and timeline as the original; no automatic pause/retake removal.
- Original presenter framed below source-relevant motion plates, with semantic section changes and word-timed captions.
- Original schematic tactical illustrations, not measured match tracking. No invented date, result, xG or player-route measurements.
- Local licensed fonts; high-pass and two-pass voice normalization; original procedural underscore without external samples.
- Shared Drive download verified against SHA-256 before media preparation. Source ID is a runtime input, not committed in the workflow.

## Files

- [transcript.en.md](transcript.en.md): source-derived speech.
- [caption-corrections.json](caption-corrections.json): ASR spelling/recognition corrections and residual uncertainty.
- [CLASICO-SOURCE-SHORT.srt](CLASICO-SOURCE-SHORT.srt): source-timed sidecar captions.
- [posting.en.md](posting.en.md): posting title/description draft.
- [review-notes.fa.md](review-notes.fa.md): actual validation and items requiring human confirmation.
- [../../video-production/README.fa.md](../../video-production/README.fa.md): reusable production research and tools.

## Rendering

The dedicated **Render source-aligned Short** workflow prepares this source, renders the registered composition, checks full decode/encoding/audio, and packages the MP4, SRT, QC sheet and posting notes. The existing encrypted HK/HO workflow is not used for this recording. Raw footage is neither committed nor uploaded as a delivery artifact.

A workflow file is not a completed render. See review notes for actual run status and validation. The current rendering prepares a review candidate; uncertain spoken names require the presenter's final ear check before public posting.
