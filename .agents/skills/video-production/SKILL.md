---
name: video-production
description: Produce source-aligned Barça Radar videos with reproducible intake, graphics, captions, sound, GitHub rendering and delivery QC.
---

# Source-aligned video production

Read `docs/video-production/README.fa.md`, `AGENTS.md` and the selected episode packet. User instructions override earlier plans. Use the existing isolated checkout; no worktree unless requested.

1. Inspect the input using `tools/video/media.py inspect`, with an explicit role. Probe orientation/fps/audio and extract a timecoded contact sheet. The filename and duration do not establish subject or completeness.
2. Transcribe the actual presenter source and compare with any supplied script. If they differ, clarify which governs while completing independent work. Never splice the wrong screenplay into an unrelated performance. Once answered, retain that choice in episode docs.
3. Read ASR as a draft. Compare difficult passages, flag proper names and align words. Do not convert plausible football knowledge into caption corrections without speech evidence. Distinguish machine timing, editorial spelling correction and human review.
4. Choose a format from `format-playbook.fa.md`. Build a source-timed shot map: statement → relevant visual → on-screen summary, written as `studio/src/episodes-source/<id>.spec.json` (see `clasico-source.spec.json`); the shared engine renders Short, long-form, cover and thumbnail from it. Preserve the speaker's viewpoint without manufacturing evidence.
5. Reuse local fonts and production components. Fit actual text, keep attention on one relationship, preserve attack direction and label schematics. Vertical layouts need independent framing.
6. Prepare normalized video/audio in ignored paths. Never change voice timing without updating the EDL, captions and video together. Select licensed/attributed material or original procedural assets. Preserve licenses.
7. Type-check, build and render representative frames/clips including transitions and long names. Inspect at phone scale. Check body/face crop and captions. Broader testing is warranted only for changed behavior or failures.
8. Push implementation and documentation if authorized. Run the appropriate Actions workflow (`render-source-short.yml` with `episode=<id>` for source-led episodes) with source supplied at runtime and verified by hash. Keep raw/decrypted media out of artifacts. Track the real run through completion, download the correct artifact and verify it. An unauthorized API operation is a concrete blocker, not a completed render.
9. Measure final audio, decode the full output, check dimensions/fps/codec and beginning/end, validate SRT, include posting metadata and review notes. Record residual uncertainty and do not label a review candidate as fully approved.
10. Retain research sources, experiment findings and exact next steps so another cloud session can continue. GitHub rendering and publishing a post are separate actions.
