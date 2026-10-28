import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('draft_cues', Path(__file__).parents[2] / 'archive' / 'draft_cues.py')
draft_cues = importlib.util.module_from_spec(spec)
spec.loader.exec_module(draft_cues)

# One word every 0.5 s; names at 4 s ("Pedri") and 12 s ("Flick's").
WORDS = [{'w': {8: 'Pedri', 24: "Flick's"}.get(i, 'word'), 's': i * 0.5, 'e': i * 0.5 + 0.4} for i in range(40)]
PLAN = {'duration': 20, 'hook': {'text': 'HOOK', 'until': 2}, 'cards': [{'a': 16, 'b': 17.5, 'lines': ['A', 'B']}],
        'entities': {'Pedri': ['pedri'], 'Flick': ['flick']}, 'generic': ['g1', 'g2']}


class DraftCueTests(unittest.TestCase):
    def setUp(self):
        self.cues, self.beats = draft_cues.draft(WORDS, PLAN)

    def test_cues_cover_the_take_without_gaps(self):
        self.assertEqual(self.cues[0]['a'], 0)
        self.assertEqual(self.cues[-1]['b'], 20)
        for prev, cur in zip(self.cues, self.cues[1:]):
            self.assertAlmostEqual(prev['b'], cur['a'])

    def test_names_cut_on_their_word(self):
        split = [c for c in self.cues if c['layout'] == 'split']
        starts = {s: t for c in split for t, s in zip(c['at'], c['shots'])}
        self.assertEqual(starts['pedri'], 4.0)   # snapped to the start of the word that names him
        self.assertEqual(starts['flick'], 12.0)
        self.assertEqual([b['a'] for b in self.beats], [4.0, 12.0])

    def test_fillers_keep_shots_short_and_never_repeat(self):
        for c in (c for c in self.cues if c['layout'] == 'split'):
            at = c['at'] + [c['b']]
            self.assertTrue(all(at[k + 1] - at[k] <= 3.2 + 1.4 for k in range(len(c['at']))))
            self.assertTrue(all(c['shots'][k] != c['shots'][k + 1] for k in range(len(c['shots']) - 1)))

    def test_beats_follow_names_only(self):
        self.assertEqual([b['shot'] for b in self.beats], ['pedri', 'flick'])


if __name__ == '__main__':
    unittest.main()
