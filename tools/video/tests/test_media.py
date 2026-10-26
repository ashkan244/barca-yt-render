import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('media', Path(__file__).parents[1] / 'media.py')
media = importlib.util.module_from_spec(spec)
spec.loader.exec_module(media)

class ScriptScreenTests(unittest.TestCase):
    def test_normalizes_accents_and_punctuation(self):
        d = media.compare_script('João Neves: TWO goals!', 'Joao Neves two goals')
        self.assertEqual(d['script_coverage'], 1)

    def test_rejects_wrong_episode_even_with_common_team_names(self):
        d = media.compare_script('Barcelona Catalonia language Sunyol Franco 1925 anthem history.', 'Barcelona pressed Madrid with a high defensive line and substitutions.')
        self.assertLess(d['script_coverage'], .65)

    def test_repeated_narration_is_visible_in_heard_coverage(self):
        d = media.compare_script('This is the opening.', 'This is the opening. This is the opening.')
        self.assertEqual(d['script_coverage'], 1)
        self.assertEqual(d['heard_coverage'], .5)

    def test_empty_transcript_is_not_success(self):
        with self.assertRaises(ValueError):media.compare_script('Actual script', '')

class DeliveryTests(unittest.TestCase):
    def fixture(self):
        return {'format':{'duration':'20'},'streams':[{'codec_type':'video','codec_name':'h264','width':1080,'height':1920,'avg_frame_rate':'30/1','pix_fmt':'yuv420p'},{'codec_type':'audio','codec_name':'aac'}]}

    def test_valid_delivery(self):self.assertEqual(media.validate_probe(self.fixture(),'vertical'),[])

    def test_rotated_low_resolution_source_is_not_valid_delivery(self):
        d=self.fixture();d['streams'][0].update(width=720,height=720,side_data_list=[{'rotation':90}])
        self.assertEqual(len(media.validate_probe(d,'vertical')),2)

    def test_missing_audio_fails(self):
        d=self.fixture();d['streams'].pop();self.assertIn('No audio stream.',media.validate_probe(d,'vertical'))

    def test_unknown_rate_and_zero_duration_fail(self):
        d=self.fixture();d['streams'][0]['avg_frame_rate']='0/0';d['format']['duration']='0'
        self.assertEqual(len(media.validate_probe(d,'vertical')),2)

if __name__=='__main__':unittest.main()
