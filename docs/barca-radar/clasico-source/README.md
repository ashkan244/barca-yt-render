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

## Actual rendered previews

These are local browser-rendered review images, not the uploaded historical reference and not proof of a completed GitHub artifact.

[Cover preview](previews/cover.png) · [Selected-frame review sheet](previews/review-sheet.png)

![Cover preview](previews/cover.png)

## Verified delivery

[Download the GitHub output packet](https://github.com/ashkan244/barca-yt-render/actions/runs/40317053776/artifacts/12648532181) · [Successful render run](https://github.com/ashkan244/barca-yt-render/actions/runs/40317053776) · [Delivery measurements](delivery.json)

The downloaded master passed full decode and structural checks: 1080×1920, 30fps, H.264/yuv420p/BT.709, 48kHz AAC, 175.019s. Measured master loudness is −16.02LUFS / −2.86dBTP. Audio matched the prepared source at three sampled windows with zero measured offset. Retained artifact expires on 2026-11-09; download it before expiration.

Current status is a **rendered review candidate**. Confirmation of the spoken Bernardo/Bernal name is pending. Do not treat an unanswered clarification as approved subtitles. No social-media post was published.

## Development after that delivery

The current manifest adds shared 108-page captions/SRT and verified player identity photographs; `CLASICO-SOURCE-ADAPTIVE` changes the presenter/board/photo layout. See [implementation status](../../video-production/implementation-2026-10-28.fa.md). The previously linked 175s artifact and delivery measurements describe commit `d52a6d8`, not this changed code or SRT. Do not present the historical artifact as an adaptive-layout render. Modern player photos are from September 2025 international football and do not show this El Clásico. Transcript uncertainty still blocks release; preview remains supported.
