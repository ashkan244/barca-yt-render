# Barça Radar production work

For video tasks, read `docs/video-production/README.fa.md` and the active episode packet before editing. The reusable workflow is `.agents/skills/video-production/SKILL.md`.

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
