# 1988 — the year the Dream Team was assembled (source-aligned history episode)

## Authoritative content and inputs

| Role | File (Drive folder "Barca radar clip 4", 31 Oct 2026) | Facts |
|---|---|---|
| Presenter source | `Clip 4.mp4` | 720×720 HEVC 30 fps, AAC 44.1 kHz stereo, 155.92 s. Morti reading the supplied script to camera. |
| Insert | `Clip for 2_06_.mp4` | 1920×1080 H.264, 3.16 s, variable frame rate. Archive broadcast footage of Van Basten's volley in the Euro 88 final; the file name places it at 2:06 of the source. |
| Script | `Scenario 4.docx` | "Barça's Dream Team didn't start in Barcelona…", 1988 month by month. |
| Render source | `DREAM88-source.mp4` (made locally, uploaded by the user to Drive) | MP4 with three streams: presenter video and audio **stream-copied** from `Clip 4.mp4` (decoded audio and video MD5-identical to the original), insert as video track 2. SHA-256 `5eab18b5a344c4a7da86c6b62e56d0382fa6ac540d6f8ce364651922978c818c`, 115 557 985 bytes. |

The speech follows the script word for word apart from small slips; the ASR draft (faster-whisper small.en) was corrected only where the heard word is a near-homophone of the script word — see [caption-corrections.json](caption-corrections.json). The presenter's own ear check of those 11 spots is the remaining review item (`review.transcript = pending` → preview renders; release after confirmation).

Why a three-stream file: the render workflow downloads exactly one verified file from Drive. `tools/video/prepare_source.py` now writes every extra video track as `insert-N.mp4` next to `presenter.mp4` (cover art excluded; the cover still now maps the presenter track explicitly). The insert plays muted as an archive shot, so no broadcast audio or commentary is used; a short local crowd SFX sits under it.

## Editorial decisions

- **"Every photo here was taken in 1988."** The presenter says it, so every photograph on screen is dated 1988 (Nationaal Archief / Anefo, 20 files, all checked by date and description on Commons). Events from other years (Ajax's 1987 Cup Winners' Cup, Koeman's 1989 move, Wembley 1992) appear only as typographic cards, never as photos.
- No photo exists on Commons for Barcelona in April 1988 (the Hesperia searches return later buildings: Hesperia Tower opened 2006, Hesperia Presidente is another hotel). The April section is carried by cards and the presenter — nothing is faked.
- A person's name appears on a photo only when the Commons title/description names that person (rule from the Clásico packet). Ajax photos of 5 January 1988 show the chairman, trainers and a player during the conflict; they are labelled "AJAX · 5 JANUARY 1988", not as Cruyff.
- Archive style `documentary` (`barca-motion`): flash/leak cuts, one hard move per sentence, sound only on sentence starts, cards and the volley.

## Outputs

- `DREAM88-SOURCE-LONG` — 1920×1080, 155.9 s + 20 s end screen, 6 YouTube chapters (posting: [posting-long.en.md](posting-long.en.md)). The volley fills the whole frame (new `full` beat option).
- `DREAM88-SOURCE-ARCHIVE` — vertical 1080×1920 archive split (photos on top, presenter below, month cards), posting: [posting.en.md](posting.en.md).
- `DREAM88-SOURCE-COVER`, `DREAM88-SOURCE-THUMB` stills.

## Engine changes made for this episode (backward compatible)

- `SourceSpec.strap` / `thumbStrap` replace the hard-coded "TACTICAL ANALYSIS / BREAKDOWN" lines (defaults unchanged, so CLASICO renders as before).
- `beats[].full` — long-form only: the shot fills the 16:9 frame under the captions (archive footage, decisive moments).
- `prepare_source.py` — inserts from extra video tracks; explicit presenter map for the cover still.

## Files

[transcript.en.md](transcript.en.md) · [DREAM88-SOURCE.srt](DREAM88-SOURCE.srt) · [caption-corrections.json](caption-corrections.json) · [archive-manifest.json](archive-manifest.json) (+ queries and candidate sheets) · [review-notes.fa.md](review-notes.fa.md) · `build_spec.py` (writes spec + manifest from one scene list)

## Rendering

Actions → **Render source-aligned episode**: `episode=DREAM88-SOURCE`, `outputs=long,archive`, `mode=preview` (release after the ear check), `source_file_id=<Drive file ID of DREAM88-source.mp4>` (runtime input, masked in the log, never committed). Raw media is cached privately by SHA-256 and never uploaded as an artifact.
