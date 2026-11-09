# Hansi Flick's 100 Barça wins

**Composition:** `NR-FLICK-CENTURY` · vertical narrated Short · Kokoro `am_michael` (fp32, speed 1.0, line silences trimmed), code `F100` · about 47 s

Rebuild (10 Nov 2026) of the first GPT/Codex version, which ran 59.5 s on near-black text cards with labels too small
for a phone, reveals that ignored the voice, and garnet (the defeat colour) on Barça's own goals. Script and facts:
`studio/src/narrated/scripts/flick.json`; scenes: `studio/src/narrated/FlickScenes.tsx`.

## Beats

| Scene | Narration | Picture (each reveal lands on the word in bold) |
|---|---|---|
| `f-hook` | Only one coach in Barça history hit a hundred wins **faster** than **Hansi** Flick. | Crest, gold 100 WINS on blaugrana rays, pill "only one coach got there faster", HANSI FLICK |
| `f-race` | **Luis** Enrique took 126 games. **Flick**, 131. | Podium: 1st Luis Enrique 126, 2nd Hansi Flick 131 (counters roll up) |
| `f-rate` | But no Barça coach has **ever** won more often: **seventy-six** percent. | Gold ring gauge to 76.33 %, "highest of any Barça manager" |
| `f-slump` | Win one hundred came straight after defeats to **PSG** and **Real** Madrid. | Two L tiles, then a pulsing dashed W "win Nº 100?" |
| `f-score` | Barça answered with a **six-one** win over Alavés. | Scoreboard (crest v a plain blue/white roundel), 6 and 1 slam in, 31 Oct 2026 · 53,523 fans |
| `f-move` | The opener took fifteen **passes** and nine **players**. | Pass and player counters; schematic pitch plotting only the final ball the club describes (Pedri → Fermín down the left → Raphinha) |
| `f-goals` | **Four** goals by **half-time**. **Two** more after the **break**. | Goal ledger 8' 23' 41' 45+' / half-time / 65' 81', Mariano 84' in grey |
| `f-raphinha` | Raphinha scored **twice**: **fifteen** league goals in **eleven** games, matching **César** Rodríguez and **Messi**. | Two balls, 15 counter, 11 game tiles, "= César Rodríguez", "= Messi" |
| `f-duo` | **Lamine** Yamal scored **twice** too. **Fermín** López: a **goal** and two **assists**. | Two player cards: Lamine 2 goals (45+', 65'), Fermín 1 goal + 2 assists |
| `f-outro` | Where does Flick rank among Barça's coaches? **Tell** us below. | Crest, pills 100 WINS · 131 GAMES · 76.33 %, question, "comment below" |

## Editorial checks

- Sources: FC Barcelona, *Hansi Flick: Record-breaking 100 wins* and *FC Barcelona 6-1 Alavés: That's more like it!*
  (both 31 Oct 2026), re-read on 10 Nov 2026. Goal minutes, scorers, assists and the 53,523 crowd are from the match report.
- 76.33 % is said as "seventy-six percent" and shown exactly.
- The pass graphic is a count; the pitch plots only the final three touches named in the report, as a schematic.
- Crest: `studio/src/production/source/CrestArt.tsx` (the accurate crest drawn for CREST-HISTORY-LONG). No Alavés
  crest, player photos or match footage.
- Music: Kevin MacLeod (incompetech.com), CC BY 4.0, "Volatile Reaction"; credit it in the description.

## Render

Actions → **Render video** on `feat/flick-century-short`: composition `NR-FLICK-CENTURY`, code `F100`, chunks `1`,
CRF `16`, prep empty. If GitHub skips the concat job, re-run the workflow; QC: -14 LUFS, 48 kHz, frames at each scene.

## Posting copy

**Title:** Hansi Flick's 100 Barça Wins — Only One Coach Was Faster #shorts

**Description:**
Hansi Flick reached 100 wins as FC Barcelona manager in 131 games — only Luis Enrique (126) got there faster — and
his 76.33% win rate is the best in club history. Win number 100: a 6–1 against Alavés, with doubles for Raphinha and
Lamine Yamal.

Where does Flick rank among Barça's coaches? 👇

Sources: FC Barcelona — "Hansi Flick: Record-breaking 100 wins" and "FC Barcelona 6-1 Alavés: That's more like it!"
(31 Oct 2026).
Music: "Volatile Reaction" Kevin MacLeod (incompetech.com), licensed under CC BY 4.0.

#FCBarcelona #HansiFlick #Barça #Raphinha #LamineYamal #BarçaRadar
