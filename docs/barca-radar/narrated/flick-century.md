# One Hundred Wins in 131 Games

**Composition:** `NR-FLICK-CENTURY` · **Format:** vertical narrated Short · **Runtime target:** 40–50 seconds  
**Visual family:** match dossier — editorial numbers, event timeline, and hand-drawn graphics; no match footage or player photography.

## Story and visual direction

The story moves from the milestone to the match that delivered it, then closes on the club record. Large numbers carry the opening and payoff; a compact match timeline makes the scoreline readable; one restrained statistic card explains the 15-pass opener without inventing player positions or a route. All scenes use the existing licensed fonts and Barça Radar palette, with an original vector treatment.

| Beat | Narration | Picture |
|---|---|---|
| 1 | 100 wins, reached in 131 games | Gold count-up and a fine circular milestone ring |
| 2 | Only Luis Enrique was faster (126) | Two-number comparison card |
| 3 | The Alavés match, 6–1 | Large scorecard and date |
| 4 | Response after PSG and Madrid defeats | Two restrained result rows, then a gold reset line |
| 5 | Four first-half goals, two after the break | Six-count timeline split at half-time |
| 6 | Opener: 15 passes, nine players | Abstract pulse rail and a nine-player count; no plotted positions |
| 7 | Fermín: one goal, two assists | Minimal contribution card |
| 8 | Brian Fariñas debut amid absences | Name, position and availability counts; no portrait |
| 9 | 76.33% win rate, club record | Oversized decimal with a short proof label |
| 10 | What comes next? | Return to 100 as the closing motif |

### Style frames

- **Opening:** near-black field, low gold halo, small Barça Radar kicker, a thin broken ring and the count-up “100 / WINS”. Keep the score and subtitles out of the headline’s negative space.
- **Core:** navy match dossier, white numerals, gold for Barça counts and garnet for opposition/defeat cues. Use one change per narration beat, with no decorative footage cuts.
- **Close:** isolated “76.33%” on a warm dark field, then resolve to the same ring and “100”; the repeated motif makes the story feel complete.

## Editorial checks

- All match facts below come from the club's 31 October 2026 reports. The 100th win, 76.33% rate, fastest-to-100 comparison, match score, scoring halves, opening-goal pass count, Fermín contribution and Brian Fariñas debut/defensive context are stated there.
- The 15-pass graphic is an abstract count, not an event map. The bar shapes do not encode who passed to whom.
- “Assisted twice” is a plain-language rendering of the official “two assists.”
- Narration is English and uses Kokoro voice `am_michael` through the existing `F100` Actions input. No human presenter source was supplied.
- Visuals are original code-drawn graphics. No game broadcast, club crest artwork, or player images are included.
- Music: Kevin MacLeod (incompetech.com), Creative Commons Attribution 4.0; preserve this credit in the post description.

## Posting copy

**Title:** Hansi Flick's 100 Barça Wins — in Just 131 Games

**Description:** Hansi Flick's 100th win as FC Barcelona manager came against Alavés on 31 October 2026. He reached the mark in 131 games, with a 76.33% win rate — the highest in club history.

Sources:  
- FC Barcelona, [Hansi Flick: Record-breaking 100 wins](https://www.fcbarcelona.com/en/football/first-team/news/4601449/hansi-flick-record-breaking-100-wins)  
- FC Barcelona, [FC Barcelona 6–1 Alavés: That's more like it!](https://www.fcbarcelona.com/en/football/first-team/news/4602177/fc-barcelona-6-1-alaves-thats-more-like-it)

Music: Kevin MacLeod (incompetech.com), licensed under CC BY 4.0.

**Hashtags:** #FCBarcelona #HansiFlick #BarcaRadar

## Render

Use GitHub Actions → **Render video** on the episode branch:

- composition: `NR-FLICK-CENTURY`
- code: `F100`
- chunks: `1` (keeps the audio stream continuous)
- CRF: `16`
- prep: empty

The workflow synthesizes the ten narration lines, renders the vertical MP4 and measures final output audio. Rendering does not publish to a social channel.
