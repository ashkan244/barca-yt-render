# Local production fonts

Retrieved 2026-10-26 from the official [google/fonts](https://github.com/google/fonts) repository over verified HTTPS. Retain licenses when redistributing. Local files remove live font requests during rendering.

| Family | Upstream directory | License |
|---|---|---|
| Anton | ofl/anton | anton/OFL.txt |
| Inter variable | ofl/inter | inter/OFL.txt |
| Permanent Marker | apache/permanentmarker | permanentmarker/LICENSE.txt (Apache 2.0) |
| Montserrat variable | ofl/montserrat | montserrat/OFL.txt |
| Playfair Display variable | ofl/playfairdisplay | playfairdisplay/OFL.txt |

`src/production/fonts.ts` loads these through `@remotion/fonts`. Missing files fail the render. Font changes affect wrapping; check affected compositions.
