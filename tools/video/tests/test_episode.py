import importlib.util,json,tempfile,unittest,hashlib
from pathlib import Path
BASE=Path(__file__).parents[1]
def load(name):
 s=importlib.util.spec_from_file_location(name,BASE/(name+'.py'));m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
episode=load('episode');photos=load('photos')
class CaptionTests(unittest.TestCase):
 def words(self,text):return [{'w':w,'s':i*.3,'e':i*.3+.28} for i,w in enumerate(text.split())]
 def test_name_not_split_across_pages(self):
  ps=episode.caption_pages(self.words('We watch the run of Frenkie de Jong today'),['Frenkie de Jong']);self.assertTrue(any('Frenkie de Jong' in p['text'] for p in ps))
 def test_srt_and_burned_pages_have_identical_text_and_times(self):
  ps=episode.caption_pages(self.words('This is clear. Next point matters.'));output=episode.srt(ps)
  self.assertEqual(len(output.strip().split('\n\n')),len(ps))
  self.assertTrue(all(p['text'] in output for p in ps));self.assertIn('00:00:00,000 -->',output)
 def test_bad_timing_and_oversized_phrase_fail(self):
  with self.assertRaises(ValueError):episode.caption_pages([{'w':'bad','s':1,'e':0}])
  with self.assertRaises(ValueError):episode.caption_pages(self.words('reallylongname'),['reallylongname'],max_chars=5)
 def test_pending_review_blocks_release_but_not_preview(self):
  m={'schemaVersion':1,'duration':2,'fps':30,'source':{'role':'short','sha256':'a'*64},'review':{'transcript':'pending','unresolved':['name']},'scenes':[{'a':0,'b':2,'cues':{'moveAt':1}}]}
  self.assertEqual(episode.validate(m),[]);self.assertTrue(episode.validate(m,'release'))
  m['review']={'transcript':'approved','unresolved':[]};self.assertEqual(episode.validate(m,'release'),[])
 def test_scene_photos_must_match_declared_assets(self):
  m={'schemaVersion':1,'duration':2,'fps':30,'source':{'role':'short','sha256':'a'*64},'review':{},'photoAssets':['pedri'],'scenes':[{'a':0,'b':2,'photoId':'yamal'}]}
  self.assertTrue(episode.validate(m));m['photoAssets']=['yamal'];self.assertEqual(episode.validate(m),[])
 def test_invalid_cues_and_scene_gaps_rejected(self):
  m={'schemaVersion':1,'duration':2,'fps':30,'source':{'role':'short','sha256':'a'*64},'review':{},'scenes':[{'a':.5,'b':2,'cues':{'moveAt':3}}]};self.assertEqual(len(episode.validate(m)),2)
class PhotoTests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup);self.root=Path(self.tmp.name);p=self.root/'studio/public/photos/x.jpg';p.parent.mkdir(parents=True);p.write_bytes(b'image')
  self.asset={'id':'x','src':'photos/x.jpg','sourcePage':'https://commons.wikimedia.org/wiki/File:X','creator':'Creator','license':'CC0-1.0','licenseUrl':'https://creativecommons.org/publicdomain/zero/1.0/','date':'1988','caption':'Context','sha256':hashlib.sha256(b'image').hexdigest(),'focus':[50,50],'usageNote':'Archive','rightsStatus':'verified','restrictions':''}
 def check(self):return photos.validate({'assets':[self.asset]},release=True,root=self.root)
 def test_verified_photo_and_hash(self):self.assertEqual(self.check(),[])
 def test_mutation_and_unknown_id_fail(self):
  self.asset['sha256']='0'*64;self.assertTrue(self.check());self.assertTrue(photos.validate({'assets':[]},['unknown'],root=self.root))
 def test_noncommercial_or_pending_cannot_pass_release(self):
  self.asset['license']='CC-BY-NC-4.0';self.assertTrue(self.check());self.asset['license']='CC0-1.0';self.asset['rightsStatus']='pending';self.assertTrue(self.check())
 def test_external_path_is_rejected(self):self.asset['src']='../../private.jpg';self.assertTrue(self.check())
if __name__=='__main__':unittest.main()
