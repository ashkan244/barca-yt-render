# Barça Radar — production and rendering

**برای ادامه با Claude، Codex یا Cloud، از [راهنمای اصلی](CLOUD_GUIDE.fa.md) شروع کنید.** وضعیت اجراها و کارهای بعدی در [continuation-state.json](docs/video-production/continuation-state.json) ثبت می‌شود.

This repository is the canonical production codebase for an unofficial FC Barcelona fan channel. It includes Remotion compositions, source-aligned media tools, licensed photographic assets, research and GitHub rendering workflows. It is not affiliated with FC Barcelona.

- [Cloud continuation and operational guide](CLOUD_GUIDE.fa.md)
- [Video research, formats and tooling](docs/video-production/README.fa.md)
- [Active source-aligned El Clásico Short](docs/barca-radar/clasico-source/README.md)
- [Verified horizontal/vertical photo demos](docs/video-production/photo-demo-delivery.fa.md)
- [Creative Skills and MCP research](docs/video-production/creative-integrations-2026-10-28.fa.md)
- [Canva and Higgsfield assessment](docs/video-production/canva-higgsfield-evaluation.fa.md)
- [Open-source editor investigation](docs/video-production/open-source-editors-2026-10-28.fa.md)

The active presenter edit follows the actual175s El Clásico recording. The [PSG packet](docs/barca-radar/psg-4-2/README.md) and historical script are separate planning material. A recorded review candidate is not automatically approved for posting; consult the active episode's review state and exact render commit.

Photographs have per-file rights, including CC0 and CC BY4.0. See [photo credits](docs/video-production/photo-credits.md) and the production photo catalog; older folder TSVs are not the complete current catalog. Raw presenter media, local models, credentials and output movies stay out of Git.

GitHub rendering uses the workflow appropriate to the deliverable: `render-source-short.yml` for source-aligned presenter output, `render-visual-models.yml` for the photographic studies. Read actual inputs and runtime-media requirements before dispatching. Push/dispatch alone is not a verified delivery.
