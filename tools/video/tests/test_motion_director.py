import copy
import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('motion_director', Path(__file__).parents[2] / 'ai' / 'motion_director.py')
md = importlib.util.module_from_spec(spec)
spec.loader.exec_module(md)

SPEC = {'id': 'T', 'duration': 10, 'beats': [{'a': 1, 'b': 2, 'shot': 'p1'}],
        'archive': {'hook': {'text': 'THE PRESS BROKE MADRID', 'until': 2}, 'shots': {
            'p1': {'src': 'x.jpg', 'label': 'PEDRI'}, 'p2': {'src': 'y.jpg'}, 'v1': {'src': 'v.mp4', 'kind': 'video'}},
            'cues': [{'a': 0, 'b': 2, 'layout': 'full'}, {'a': 2, 'b': 6, 'layout': 'split', 'shots': ['p1', 'p2', 'v1']},
                     {'a': 6, 'b': 8, 'layout': 'card', 'card': ['12', 'OFFSIDES']}, {'a': 8, 'b': 10, 'layout': 'card', 'card': ['HIGH', 'LINE']}]}}
CUE = {'dir': 'default', 'card_motion': 'default', 'stamp': '', 'punch': False, 'reason': ''}
SHOT = {'callout_x': 50, 'callout_y': 30, 'callout_r': 10, 'reason': ''}


class MotionDirectorTests(unittest.TestCase):
    def plan(self, **kw):
        base = {'style': 'documentary', 'hook_motion': 'slam', 'hook_hot': ['madrid', 'barcelona'], 'cues': [], 'shots': [], 'beats': [], 'notes': ''}
        return {**base, **kw}

    def test_schema_is_strict_everywhere(self):
        def walk(node):
            if isinstance(node, dict):
                if node.get('type') == 'object':
                    self.assertFalse(node['additionalProperties'])
                    self.assertEqual(sorted(node['required']), sorted(node['properties']))
                for v in node.values():
                    walk(v)
            elif isinstance(node, list):
                for v in node:
                    walk(v)
        walk(md.PLAN_SCHEMA)

    def test_hot_words_must_be_in_the_hook(self):
        plan, _ = md.validate(self.plan(), SPEC)
        self.assertEqual(plan['hook_hot'], ['madrid'])

    def test_transition_count_must_match_shots(self):
        plan, warn = md.validate(self.plan(cues=[{**CUE, 'index': 1, 'transitions': ['whip', 'flash']}]), SPEC)
        self.assertEqual(plan['cues'][0]['transitions'], ['whip', 'default', 'default'])
        self.assertTrue(warn)
        out = md.apply(plan, copy.deepcopy(SPEC))
        self.assertEqual(out['archive']['cues'][1]['transition'], ['whip', 'whip', 'whip'])

    def test_count_only_on_numbers_and_unknown_cues_dropped(self):
        plan, warn = md.validate(self.plan(cues=[{**CUE, 'index': 2, 'transitions': ['default'], 'card_motion': 'count'},
                                                 {**CUE, 'index': 3, 'transitions': ['default'], 'card_motion': 'count'},
                                                 {**CUE, 'index': 9, 'transitions': []}]), SPEC)
        out = md.apply(plan, copy.deepcopy(SPEC))
        self.assertEqual(out['archive']['cues'][2]['cardMotion'], 'count')
        self.assertNotIn('cardMotion', out['archive']['cues'][3])
        self.assertEqual(len(warn), 2)

    def test_callout_tag_only_repeats_the_shot_label(self):
        plan, _ = md.validate(self.plan(shots=[{**SHOT, 'id': 'p1', 'motion': 'parallax', 'callout': True},
                                               {**SHOT, 'id': 'p2', 'motion': 'push', 'callout': True},
                                               {**SHOT, 'id': 'v1', 'motion': 'parallax', 'callout': True}]), SPEC, shown=['p1', 'p2'])
        out = md.apply(plan, copy.deepcopy(SPEC))['archive']['shots']
        self.assertEqual(out['p1']['callout']['label'], 'PEDRI')
        self.assertEqual(out['p1']['motion'], 'parallax')
        self.assertNotIn('label', out['p2']['callout'])
        self.assertNotIn('callout', out['v1'])
        self.assertNotIn('motion', out['v1'])

    def test_callout_needs_a_photo_the_model_saw(self):
        plan, warn = md.validate(self.plan(shots=[{**SHOT, 'id': 'p2', 'motion': 'push', 'callout': True}]), SPEC, shown=[])
        self.assertFalse(plan['shots'][0]['callout'])
        self.assertTrue(warn)

    def test_style_hook_and_beats_applied(self):
        plan, _ = md.validate(self.plan(beats=[{'index': 0, 'transition': 'iris', 'reason': ''}, {'index': 5, 'transition': 'iris', 'reason': ''}]), SPEC)
        out = md.apply(plan, copy.deepcopy(SPEC))
        self.assertEqual(out['archive']['style'], 'documentary')
        self.assertEqual(out['archive']['hook']['motion'], 'slam')
        self.assertEqual(out['beats'][0]['transition'], 'iris')

    def test_brief_lists_cues_and_shots(self):
        brief = md.episode_brief(SPEC, {'pages': [{'s': 0, 'e': 1.5, 'text': 'Losing El Clásico'}]})
        self.assertIn('Losing El Clásico', brief)
        self.assertIn('split  p1, p2, v1', brief)
        self.assertIn('p1: image, PEDRI', brief)


if __name__ == '__main__':
    unittest.main()
