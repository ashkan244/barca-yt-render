#!/usr/bin/env python3
"""Writes dream88-source.spec.json and dream88-source.manifest.json from one scene list (run from the repo root).
Times are source seconds taken from the reviewed word timings (dream88-source.words.json): every scene, chapter,
beat and archive cue starts on a spoken word. Edit here, run, then `npx tsc --noEmit` in studio/."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
DUR = 155.9

# a, b, title, sub, cards (first line, second line); boundaries = sentence starts
SCENES = [
    (0.00, 8.52, "WHERE THE DREAM TEAM BEGAN", "BARÇA HISTORY · 1988", [["1988", "ONE YEAR"], ["THE NETHERLANDS", "MOSTLY"]]),
    (8.52, 18.74, "THE 1988 ALBUM", "MONTH BY MONTH", [["EVERY PHOTO", "TAKEN IN 1988"], ["THE PIECES", "ONE BY ONE"]]),
    (18.74, 32.26, "CRUYFF LEAVES AJAX", "JANUARY 1988 · AMSTERDAM", [["JANUARY", "CRUYFF OUT AT AJAX"], ["THE PLAYERS", "IN SHOCK"]]),
    (32.26, 44.12, "WHO IS IN CHARGE?", "AJAX · THE BOARD VS THE COACH", [["1987", "CUP WINNERS' CUP WITH AJAX"], ["COACH VS BOARD", "NO AGREEMENT"]]),
    (44.12, 56.26, "MUTINY AT THE HESPERIA", "APRIL 1988 · BARCELONA", [["APRIL", "THE SQUAD AGAINST THE PRESIDENT"], ["HOTEL HESPERIA", "'RESIGN'"]]),
    (56.26, 61.46, "THE CALL", "BARÇA'S PRESIDENT · CRUYFF", [["THE PRESIDENT", "NEEDS A SOLUTION"], ["THE CALL", "JOHAN CRUYFF"]]),
    (61.46, 76.70, "A HUGE RISK", "WHAT CRUYFF WANTED", [["3 YEARS", "AS A COACH"], ["THE DEAL", "CONTROL OF THE FOOTBALL"]]),
    (76.70, 88.74, "KOEMAN & CRUYFF", "MAY 1988 · EINDHOVEN · BARCELONA", [["RONALD KOEMAN", "EUROPEAN CUP WITH PSV"], ["JOHAN CRUYFF", "BARÇA'S NEW COACH"]]),
    (88.74, 100.00, "PENALTIES AGAINST BENFICA", "EUROPEAN CUP FINAL · 25 MAY 1988", [["PSV 0–0 BENFICA", "6–5 ON PENALTIES"], ["FIRST DUTCH WINNER", "SINCE AJAX 1973"]]),
    (100.00, 108.82, "CHAMPIONS OF EUROPE", "JUNE 1988 · WEST GERMANY", [["RINUS MICHELS", "CRUYFF'S OLD TEACHER"], ["BARÇA COACH", "1971–75 · 1976–78"]]),
    (108.82, 117.08, "THE PIECES", "THE NETHERLANDS · EURO 88", [["DEFENCE", "RONALD KOEMAN"], ["ATTACK", "MARCO VAN BASTEN"]]),
    (117.08, 131.82, "THE VOLLEY", "FINAL · NETHERLANDS 2–0 SOVIET UNION", [["MUNICH", "25 JUNE 1988"], ["VAN BASTEN", "THE IMPOSSIBLE ANGLE"]]),
    (131.82, 140.26, "WHAT 1988 GAVE BARÇA", "THE DREAM TEAM'S FIRST PIECES", [["A FREE COACH", "JOHAN CRUYFF"], ["TOTAL CONTROL", "OF THE FOOTBALL"]]),
    (140.26, 149.62, "WEMBLEY, 1992", "FOUR YEARS LATER", [["1989", "KOEMAN JOINS CRUYFF"], ["1992", "BARÇA'S FIRST EUROPEAN CUP"]]),
    (149.62, DUR, "YOUR TURN", "BARÇA'S MOST IMPORTANT YEAR?", [["WHICH YEAR?", "MATTERED MOST"], ["COMMENTS", "TELL US BELOW"]]),
]

CHAPTERS = [(0, "1988: the album"), (18.74, "January: Cruyff leaves Ajax"), (44.12, "April: Barcelona in crisis"),
            (76.70, "May: Koeman and Cruyff"), (100.00, "June: Euro 88"), (131.82, "What 1988 gave Barça")]

A = "archive/DREAM88/"
SHOTS = {
    "cruyff_1988": {"src": A + "cruyff_1988.jpg", "label": "JOHAN CRUYFF · 1988", "focus": [50, 30], "grade": "bw"},
    "cruyff_to_barcelona": {"src": A + "cruyff_to_barcelona.jpg", "label": "CRUYFF · SCHIPHOL, 1988", "focus": [52, 32], "grade": "bw"},
    "cruyff_to_barcelona2": {"src": A + "cruyff_to_barcelona2.jpg", "label": "JOHAN CRUYFF · 1988", "focus": [35, 42], "grade": "bw"},
    "ajax_conflict_chair": {"src": A + "ajax_conflict_chair.jpg", "label": "AJAX · 5 JANUARY 1988", "focus": [32, 40], "grade": "bw"},
    "ajax_conflict_player": {"src": A + "ajax_conflict_player.jpg", "label": "AJAX · 5 JANUARY 1988", "focus": [42, 38], "grade": "bw"},
    "ajax_conflict_trainers": {"src": A + "ajax_conflict_trainers.jpg", "label": "AJAX · 5 JANUARY 1988", "focus": [56, 40], "grade": "bw"},
    "koeman_1988": {"src": A + "koeman_1988.jpg", "label": "RONALD KOEMAN · 1988", "focus": [58, 22], "grade": "bw"},
    "koeman_psv_training": {"src": A + "koeman_psv_training.jpg", "label": "KOEMAN · PSV TRAINING, APRIL 1988", "focus": [62, 58], "grade": "bw"},
    "psv_cup_hiddink": {"src": A + "psv_cup_hiddink.jpg", "label": "PSV · EUROPEAN CUP, MAY 1988", "focus": [58, 34], "grade": "bw"},
    "psv_cup_arrival": {"src": A + "psv_cup_arrival.jpg", "label": "PSV · EINDHOVEN, 26 MAY 1988", "focus": [48, 62], "grade": "bw"},
    "psv_bernabeu_semi": {"src": A + "psv_bernabeu_semi.jpg", "label": "PSV · SEMI-FINAL, BERNABÉU", "focus": [50, 40], "grade": "bw"},
    "michels_1988": {"src": A + "michels_1988.jpg", "label": "RINUS MICHELS · 1988", "focus": [50, 30], "grade": "bw"},
    "michels_euro_bench": {"src": A + "michels_euro_bench.jpg", "label": "RINUS MICHELS · EURO 88", "focus": [70, 42], "grade": "bw"},
    "ireland_lineup": {"src": A + "ireland_lineup.jpg", "label": "NETHERLANDS · EURO 88", "focus": [55, 45], "grade": "bw"},
    "vanbasten_england": {"src": A + "vanbasten_england.jpg", "label": "MARCO VAN BASTEN · EURO 88", "focus": [76, 42], "grade": "bw"},
    "gullit_lifts_vanbasten": {"src": A + "gullit_lifts_vanbasten.jpg", "label": "GULLIT & VAN BASTEN · 1988", "focus": [57, 45], "grade": "bw"},
    "volley": {"src": "host/DREAM88/insert-1.mp4", "kind": "video", "label": "VAN BASTEN · EURO 88 FINAL", "focus": [55, 50], "motion": "still", "grade": "none"},
    "parade_michels": {"src": A + "parade_michels.jpg", "label": "AMSTERDAM · 26 JUNE 1988", "focus": [45, 22], "grade": "bw"},
    "parade_gullit_cup": {"src": A + "parade_gullit_cup.jpg", "label": "AMSTERDAM · 26 JUNE 1988", "focus": [55, 28], "grade": "bw"},
    "parade_canal": {"src": A + "parade_canal.jpg", "focus": [50, 55], "grade": "bw"},
    "parade_crowd": {"src": A + "parade_crowd.jpg", "focus": [50, 50], "grade": "bw"},
}

# photo beats (Short/long panels): while a person or moment is named. `full` = whole 16:9 frame in the long version.
BEATS = [
    (6.42, 8.40, "parade_canal"), (10.84, 14.30, "parade_crowd"),
    (20.08, 22.70, "cruyff_1988"), (22.86, 25.30, "ajax_conflict_chair"), (25.42, 28.20, "ajax_conflict_player"),
    (38.68, 43.40, "ajax_conflict_trainers"),
    (59.34, 61.40, "cruyff_to_barcelona"), (63.88, 69.60, "cruyff_to_barcelona2"),
    (77.14, 79.80, "koeman_psv_training"), (79.88, 81.70, "psv_cup_hiddink"), (81.72, 84.00, "koeman_1988"),
    (85.64, 88.70, "cruyff_1988"), (88.74, 92.90, "psv_cup_arrival"), (93.14, 99.00, "psv_bernabeu_semi"),
    (100.54, 103.20, "parade_gullit_cup"), (103.30, 107.40, "michels_1988"),
    (108.82, 110.90, "ireland_lineup"), (110.96, 116.00, "vanbasten_england"), (117.08, 120.10, "gullit_lifts_vanbasten"),
    (126.00, 129.20, "volley", {"full": True, "transition": "flash", "sfx": "crowd"}),
    (129.30, 131.70, "parade_michels"),
    (134.26, 136.80, "cruyff_to_barcelona"), (140.26, 144.30, "koeman_1988"),
]

# vertical archive split: split = photo on top / presenter below; full = presenter; card = typographic card
CUES = [
    (0.00, 3.08, "full", {}),
    (3.08, 8.52, "split", {"shots": ["parade_crowd", "parade_canal"], "at": [3.08, 6.42]}),
    (8.52, 10.84, "card", {"card": ["THE 1988", "ALBUM"], "cardStyle": "dark"}),
    (10.84, 18.74, "split", {"shots": ["ireland_lineup", "psv_cup_arrival", "michels_1988"], "at": [10.84, 13.58, 16.0]}),
    (18.74, 20.08, "card", {"card": ["JANUARY"], "cardStyle": "gold", "cardMotion": "slam"}),
    (20.08, 27.56, "split", {"shots": ["cruyff_1988", "ajax_conflict_chair", "ajax_conflict_player"], "at": [20.08, 22.86, 25.42]}),
    (27.56, 32.26, "full", {"punch": True}),
    (32.26, 38.68, "split", {"shots": ["ajax_conflict_trainers"]}),
    (38.68, 44.12, "full", {}),
    (44.12, 48.72, "card", {"card": ["MEANWHILE,", "IN BARCELONA"], "cardStyle": "dark"}),
    (48.72, 51.52, "card", {"card": ["APRIL"], "cardStyle": "gold", "cardMotion": "slam"}),
    (51.52, 56.26, "card", {"card": ["HOTEL", "HESPERIA"], "cardStyle": "light", "stamp": "RESIGN!"}),
    (56.26, 59.34, "full", {}),
    (59.34, 63.88, "split", {"shots": ["cruyff_to_barcelona"], "transition": "whip"}),
    (63.88, 66.58, "card", {"card": ["3", "YEARS AS A COACH"], "cardStyle": "dark", "cardMotion": "count"}),
    (66.58, 70.68, "split", {"shots": ["cruyff_to_barcelona2"]}),
    (70.68, 76.70, "card", {"card": ["CONTROL OF", "THE FOOTBALL"], "cardStyle": "dark", "cardMotion": "slam"}),
    (76.70, 77.96, "card", {"card": ["MAY"], "cardStyle": "gold", "cardMotion": "slam"}),
    (77.96, 84.00, "split", {"shots": ["koeman_psv_training", "psv_cup_hiddink", "koeman_1988"], "at": [77.96, 79.88, 81.72]}),
    (84.00, 88.74, "split", {"shots": ["cruyff_1988"], "transition": "whip"}),
    (88.74, 93.14, "split", {"shots": ["psv_cup_arrival"]}),
    (93.14, 100.00, "card", {"card": ["FIRST DUTCH", "EUROPEAN CUP", "SINCE 1973"], "cardStyle": "light"}),
    (100.00, 101.42, "card", {"card": ["JUNE"], "cardStyle": "gold", "cardMotion": "slam"}),
    (101.42, 108.82, "split", {"shots": ["parade_gullit_cup", "michels_1988", "michels_euro_bench"], "at": [101.42, 103.3, 106.0]}),
    (108.82, 117.08, "split", {"shots": ["ireland_lineup", "vanbasten_england", "gullit_lifts_vanbasten"], "at": [108.82, 110.96, 113.56]}),
    (117.08, 126.00, "full", {"punch": True}),
    (126.00, 129.20, "split", {"shots": ["volley"], "transition": "flash", "sfx": "crowd"}),
    (129.20, 131.82, "split", {"shots": ["parade_michels"]}),
    (131.82, 134.26, "card", {"card": ["WHAT 1988", "GAVE BARÇA"], "cardStyle": "dark"}),
    (134.26, 136.88, "split", {"shots": ["cruyff_to_barcelona"]}),
    (136.88, 140.26, "card", {"card": ["TOTAL", "CONTROL"], "cardStyle": "dark", "cardMotion": "slam"}),
    (140.26, 144.42, "split", {"shots": ["koeman_1988"]}),
    (144.42, 149.62, "card", {"card": ["1992", "WEMBLEY"], "cardStyle": "dark", "cardMotion": "slam", "stamp": "FIRST EUROPEAN CUP"}),
    (149.62, DUR, "full", {"punch": True}),
]


def main():
    scenes = [{"a": a, "b": b, "title": t, "sub": s, "cards": c} for a, b, t, s, c in SCENES]
    beats = []
    for row in BEATS:
        a, b, shot = row[:3]
        beats.append({"a": a, "b": b, "shot": shot, **(row[3] if len(row) > 3 else {})})
    cues = [{"a": a, "b": b, "layout": lay, **extra} for a, b, lay, extra in CUES]
    spec = {
        "id": "DREAM88-SOURCE", "media": "host/DREAM88", "docs": "docs/barca-radar/dream88-source",
        "manifest": "studio/src/episodes-source/dream88-source.manifest.json",
        "duration": DUR, "label": "BARÇA HISTORY · 1988", "presenter": "MORTI", "opponent": "",
        "strap": "BARÇA HISTORY · 1988", "thumbStrap": "CRUYFF · KOEMAN · VAN BASTEN",
        "source": {"sha256": "5eab18b5a344c4a7da86c6b62e56d0382fa6ac540d6f8ce364651922978c818c", "bytes": 115557985,
                   "note": "Clip 4.mp4 (presenter, stream-copied, bit-identical decode) + Clip for 2_06_.mp4 as video track 2 (insert-1)."},
        "punch": [[27.56, 32.26], [61.46, 63.88], [117.08, 120.22], [149.62, DUR]],
        "boards": {}, "scenes": scenes,
        "chapters": [{"at": a, "title": t} for a, t in CHAPTERS],
        "cover": {"kicker": "BARÇA HISTORY · 1988", "lines": ["THE YEAR", "THAT BUILT", "THE DREAM TEAM"]},
        "long": {"endSeconds": 20, "endKicker": "MORE BARÇA HISTORY · WATCH NEXT"},
        "captions": {"emphasis": ["Cruyff", "Koeman", "Michels", "Basten", "Ajax", "PSV", "Benfica", "Feyenoord", "Hesperia"]},
        "beats": beats,
        "archive": {"style": "documentary",
                    "hook": {"text": "THE DREAM TEAM\nWAS BORN IN 1988", "until": 3.08, "motion": "slam"},
                    "cta": {"at": 151.6, "text": "WHICH YEAR? COMMENT ↓"},
                    "shots": SHOTS, "cues": cues},
    }
    out = ROOT / "studio/src/episodes-source"
    (out / "dream88-source.spec.json").write_text(json.dumps(spec, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    manifest = {
        "schemaVersion": 1, "id": "DREAM88-SOURCE", "duration": DUR, "fps": 30,
        "source": {"role": "long", "sha256": spec["source"]["sha256"]},
        "media": {"video": "host/DREAM88/presenter.mp4", "voice": "host/DREAM88/voice.wav", "score": "host/DREAM88/score.wav", "cover": "host/DREAM88/cover.jpg"},
        "wordsFile": "studio/src/episodes-source/dream88-source.words.json",
        "captionsFile": "studio/src/episodes-source/dream88-source.pages.json",
        "srtFile": "docs/barca-radar/dream88-source/DREAM88-SOURCE.srt",
        "protectedPhrases": ["Johan Cruyff", "Ronald Koeman", "Rinus Michels", "Marco van Basten", "European Cup", "Soviet Union", "Dream Team"],
        "review": {"transcript": "pending", "unresolved": ["Presenter ear check of the 11 script-based ASR corrections (caption-corrections.json)"]},
        "photoAssets": [],
        "scenes": [{"a": a, "b": b, "title": t, "sub": s, "mode": "cards", "cards": c, "layout": "presenter", "cues": {}} for a, b, t, s, c in SCENES],
    }
    (out / "dream88-source.manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print("spec:", len(scenes), "scenes,", len(beats), "beats,", len(cues), "cues,", len(CHAPTERS), "chapters")


if __name__ == "__main__":
    main()
