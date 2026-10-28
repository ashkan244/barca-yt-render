---
name: football-data-story
description: Turn licensed football data into source-backed scouting, match or transfer visual stories without mixing definitions, fabricated tracking or unsupported live coverage.
---

# Football data stories

Use with `video-production`, `barca-visual-direction`, `AGENTS.md` and the selected episode. This is an editorial/data workflow; no paid API or live feed is enabled by its existence.

1. Define the question and unit of analysis: one match, a player role, a defined competition/season or a transfer claim. For a source-aligned edit, choose evidence relevant to the actual recorded statement. Do not insert a statistic just because a chart component exists.
2. Select a provider whose actual coverage and usage terms match the deliverable. Read exact season/match availability and the license, not only a GitHub README. StatsBomb Open Data's checked agreement forbids commercial exploitation of data or derived analysis (§1.2.2); it is not automatically cleared for a monetized channel. Keep research-only sources separate from publication-cleared inputs.
3. Preserve a source record: provider, endpoint/report URL, retrieved time, match ID/date, competition/season, units, metric definition, license/status and raw-input hash. Keep restricted raw responses and keys out of public Git. Normalize into a small local adapter output; the rendering scene should not call a live provider while producing frames.
4. Validate data types, ranges, required fields and missing values. Missing is not zero. xG is not xGOT; event locations are not continuous tracking. Provider coordinates and attack direction must be normalized explicitly. A few events or a partial season are not complete coverage.
5. Compare like with like: per-90 rates, minutes threshold, comparable role/competition and a stated period. Distinguish percentile rank from an absolute value, count from rate, and reported fee from estimated valuation. Carry units, sample size and source into the visible chart.
6. Build one claim per chart. Use a sourced shot map, pass network, event timeline, role comparison or economic flow when the inputs support it. Label generated/schematic demonstrations. Avoid invented heatmaps, player routes, salary figures or live scores.
7. Freeze the validated data snapshot for reproducible rendering. Check displayed endpoints and decimals against source values; annotate uncertainty rather than silently imputing a favorable value.
8. Review representative frames on mobile and against the narration. Record unresolved source/licensing/definition questions separately from render failures. Only use publication-cleared inputs for a release; produce research findings and independently clear visual prototypes while unresolved data remains excluded.

Deliver a question, source/rights ledger, normalized dataset contract, chart storyboard and exact verification status. No provider is connected and no output is published merely by following this skill.
