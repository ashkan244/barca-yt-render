# Research sources and inspection scope

Retrieved/reviewed on 2026-10-26. These sources informed production design; they are not sources confirming the match result, goals, lineup or xGOT numbers in the narration. No claims about GitHub stars, benchmarking results or audience retention were made.

| Source | Material actually inspected | Takeaway for this project |
|---|---|---|
| [remotion-dev/template-tiktok](https://github.com/remotion-dev/template-tiktok) | README, src/CaptionedVideo/Page.tsx and index.tsx | Fit text to width; time-token emphasis and caption pagination. Check compatibility with our lockfile before adopting APIs. |
| [mplsoccer](https://github.com/andrewRowlinson/mplsoccer) | README; examples/pitch_plots/plot_pass_network.py, plot_sb360_frame.py, plot_animation.py; quick_start images | Distinguish pass averages, event freeze frames and tracking. Use charts that answer the stated question. Example Python scripts were read, not executed. |
| [Motion Canvas](https://github.com/motion-canvas/motion-canvas) | README; packages/examples/src/scenes/tweening-save-restore.tsx and transition examples | Revisit a saved state to explain what changed. Reuse the idea in Remotion; no engine migration recommended. |
| [Robust Video Matting](https://github.com/PeterL1n/RobustVideoMatting) | README and the project's existing tools/host/matte.py integration | Already in this repository. Improve edge quality and compositing rather than claiming a new capability. Review licensing before independently distributing code/weights. |
| [StatsBomb Open Data](https://github.com/statsbomb/open-data) | README and data/competitions.json | At inspection, latest listed La Liga season was 2020/2021; do not assume current match coverage. Respect attribution terms. |
| [socceraction](https://github.com/ML-KULeuven/socceraction) | README | Methodological reference for xT/VAEP; not required for two videos and not a data-access guarantee. |
| [kloppy](https://github.com/PySport/kloppy) | README fetched for background | Coordinate/data interoperability reference only; not installed or part of selected implementation. |
| [remotion-dev/trailer](https://github.com/remotion-dev/trailer) | README | Background reference; linked YouTube trailer was not watched. No visual conclusions depend on it. |

## Local code inspected

- studio/src/radar/RadarStory.tsx: word/line timing, presenter modes, captions, music and end screen.
- studio/src/radar/HOTitle.tsx and HKTitle.tsx: existing long-form scene design.
- studio/src/radar/Tactics.tsx: token, ball, arrows, zones, tethers and coordinates.
- studio/src/radar/RadarShorts.tsx, HKShorts.tsx and HKShortPro.tsx: cut remapping and vertical compositions.
- studio/src/explainer/Clasico.tsx: separate historical explainer, not the new match analysis.
- tools/host/radar-edit.mjs, prep-cut.mjs, matte.py; studio/scripts/qc-radar.mjs.
- .github/workflows/render.yml: manual cloud-render workflow and artifact conditions.

Full online reference videos and the final rendered Radar episodes were not watched in this research stage. Presenter input was downloaded and probed later; this does not establish content alignment or visual/audio QC. The storyboard is an original illustrative design study, not a reproduction of a verified match frame.

## Archive and current decisions

[initial-visual-research.fa.md](initial-visual-research.fa.md) records the initial El Clásico brief. The user subsequently chose the PSG script as the basis. Use [../production-plan.fa.md](../production-plan.fa.md) for current decisions. Suggested narration changes in older analysis remain suggestions; the user has not requested that they be applied.

Third-party repository downloads, models, source archives and third-party example images are not vendored into this production packet. Links point to upstream materials; local research copies remain outside the checkout. Only original planning, the original schematic storyboard and its screenshots are included here.
