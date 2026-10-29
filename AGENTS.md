# Barça Radar production work

For resumed research/production, start at `CLOUD_GUIDE.fa.md` and `docs/video-production/continuation-state.json`. For video tasks, then read `docs/video-production/README.fa.md` and the active episode packet before editing. The reusable workflow is `.agents/skills/video-production/SKILL.md`.

- Existing cloud tasks are isolated. Use existing checkouts; do not create a worktree unless the user requests one.
- The latest user direction selects the content. For `CLASICO-SOURCE-SHORT`, the 175s presenter recording is authoritative. Historical and PSG scripts from the conversation are separate material and must not be inserted into that edit.
- Distinguish reference video, presenter source, script, preview and delivery. Record source role, checksum and duration. Inspect speech before assigning a topic.
- Keep raw media, cookies, secrets, local models and caches out of Git. Shared Drive links are runtime inputs, not committed credentials.
- Match package versions across Remotion packages. Use the lockfile and local licensed fonts. Never disable TLS or font checks to make rendering pass.
- Keep source timing and lip sync when replacing speech/video. Approximate ASR and index-clamping are not verification. Report uncertain names; never invent facts or match events.
- A schematic board is not match tracking. Label it. Do not invent statistics, exact player routes or dates to fill visual space.
- Verify a representative rendered sequence, transitions, actual captions, final audio, encoding and artifact. Do not equate type checks, a PID or an Actions dispatch with a completed delivery.
- Publishing to YouTube/social media is separate from preparing a video. Execute GitHub renders when authorized; record real run status and URL. If credentials cannot dispatch a workflow, report that operation precisely without claiming success or extracting another identity.
- Keep production research and decisions in the repository. Separate what was implemented, tested, proposed, blocked and deferred.
- `barca-yt-render` is canonical for production code. The other repo's sync is an explicit additive import; do not restore destructive mirroring.
- Read `docs/video-production/photographic-production.fa.md` for current images and rights. A search result is pending; verify the actual photo, capture date and primary source before cataloging. A player identity image from another game is not match evidence.
- Edit the episode manifest for source scenes/media/cues/photo IDs. Generate caption pages and SRT together using `episode.py --build-captions`; do not independently repartition them. Pending names block release, while preview remains possible.
- Historical `delivery.json` and old Actions artifacts describe their exact render commit. New source, captions, photos or layout require new render evidence; do not relabel old measurements as new results.
- For transitions, camera moves, kinetic cards, callouts and their sound roles, use `.agents/skills/barca-motion/SKILL.md` (library `studio/src/production/motion/`, reference composition `MOTION-LIBRARY`).
- For a new visual format, use `.agents/skills/barca-visual-direction/SKILL.md`; for data-led football content also read `.agents/skills/football-data-story/SKILL.md`. See the creative-integration report for researched versus connected tools. Canva Design MCP differs from Canva Dev MCP; some Higgsfield workflows require a separately connected After Effects environment.
