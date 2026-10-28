---
name: video-production
description: Produce source-aligned Barça Radar videos with reproducible intake, graphics, captions, sound, GitHub rendering and delivery QC.
---

# Source-aligned video production

Start resumed work with `CLOUD_GUIDE.fa.md` and `docs/video-production/continuation-state.json`. Read `docs/video-production/README.fa.md`, `AGENTS.md` and the selected episode packet. User instructions override earlier plans. Use the existing isolated checkout; no worktree unless requested.

1. Inspect the input using `tools/video/media.py inspect`, with an explicit role. Probe orientation/fps/audio and extract a timecoded contact sheet. The filename and duration do not establish subject or completeness.
2. Transcribe the actual presenter source and compare with any supplied script. If they differ, clarify which governs while completing independent work. Never splice the wrong screenplay into an unrelated performance. Once answered, retain that choice in episode docs.
3. Read ASR as a draft. Compare difficult passages, flag proper names and align words. Do not convert plausible football knowledge into caption corrections without speech evidence. Distinguish machine timing, editorial spelling correction and human review.
4. Choose a format from `format-playbook.fa.md`. Build a source-timed shot map: statement → relevant visual → on-screen summary. Preserve the speaker's viewpoint without manufacturing evidence.
5. Reuse local fonts and production components. Fit actual text, keep attention on one relationship, preserve attack direction and label schematics. Vertical layouts need independent framing.
6. Prepare normalized video/audio in ignored paths. Never change voice timing without updating the EDL, captions and video together. Select licensed/attributed material or original procedural assets. Preserve licenses.
7. Type-check, build and render representative frames/clips including transitions and long names. Inspect at phone scale. Check body/face crop and captions. Broader testing is warranted only for changed behavior or failures.
8. Push implementation and documentation if authorized. Run the appropriate Actions workflow with source supplied at runtime and verified by hash. Keep raw/decrypted media out of artifacts. Track the real run through completion, download the correct artifact and verify it. An unauthorized API operation is a concrete blocker, not a completed render.
9. Measure final audio, decode the full output, check dimensions/fps/codec and beginning/end, validate SRT, include posting metadata and review notes. Record residual uncertainty and do not label a review candidate as fully approved.
10. Retain research sources, experiment findings and exact next steps so another cloud session can continue. GitHub rendering and publishing a post are separate actions.

## Current production additions

- Canonical code is in `barca-yt-render`; legacy sync now defaults to dry-run and only adds explicitly selected files. Existing render files are never replaced by that tool.
- Source manifest: `studio/src/episodes-source/clasico-source.manifest.json`. Build shared burned/SRT pages with `episode.py --build-captions`. Use preview for documented uncertainty and release only after actual resolution.
- Read `docs/video-production/photographic-production.fa.md` before photo discovery. `photos.py search` retrieves pending metadata only. Inspect images and capture dates, verify primary source/rights, register hashes and export attribution. Modern identity photos must not imply they show the match under analysis.
- The adaptive source composition and the horizontal/vertical photographic demos are separate deliverables. Re-render changed code and record evidence from the exact run. Build from `studio/` to retain local public assets.

For new visual formats, read the `barca-visual-direction` project skill and `docs/video-production/creative-integrations-2026-10-28.fa.md`. For player/data stories read `football-data-story`. Provider documentation and presets are proposals until connected and tested; Canva/Higgsfield research is in `canva-higgsfield-evaluation.fa.md`.
