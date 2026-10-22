import importlib.util
import json
import tempfile
import unittest
from pathlib import Path
P=Path(__file__).resolve().parents[1]/"scripts"/"ingest_linkwise_json.py"
spec=importlib.util.spec_from_file_location("linkwise_json_program_hint",P)
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class ProgramHintTests(unittest.TestCase):
 def test_linkwise_click_path_hint_is_not_approval(self):
  self.assertEqual(m.tracking_program_hint("https://go.linkwi.se/z/11706-0/CD104/?lnkurl=https%3A%2F%2Fexample.com"),"11706")
  self.assertEqual(m.tracking_program_hint("https://go.linkwi.se/z/100-0/CD104/?lnkurl=https%3A%2F%2Fexample.com"),"100")
  self.assertIsNone(m.tracking_program_hint("https://go.linkwi.se/z/11706-0/CDOTHER/"))
  self.assertIsNone(m.tracking_program_hint("https://evil.com/z/11706-0/CD104/"))
  self.assertIsNone(m.tracking_program_hint("http://go.linkwi.se/z/11706-0/CD104/"))
  self.assertIsNone(m.tracking_program_hint("https://go.linkwi.se.evil.com/z/11706-0/CD104/"))
 def test_import_reports_candidate_identity_only(self):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d)
   data=[
     {"product_id":"1","product_name":"Walking pad treadmill","category":"Fitness","program":{"name":"Mybrand.shoes"},"price":300,"availability":"in stock","tracking_url":"https://go.linkwi.se/z/11706-0/CD104/?lnkurl=test"},
     {"product_id":"2","product_name":"Ρυθμιζόμενοι αλτήρες","category":"Fitness","program":{"name":"Mybrand.shoes"},"price":200,"availability":"y","tracking_url":"https://go.linkwi.se/z/11706-0/CD104/?lnkurl=test"},
     {"product_id":"3","product_name":"Λάστιχο αντίστασης","category":"Fitness","program":{"name":"Z-mall"},"price":18,"availability":"y","tracking_url":"https://go.linkwi.se/z/100-0/CD104/?lnkurl=test"}
   ]
   src=p/"feed.json";src.write_text(json.dumps(data,ensure_ascii=False),encoding="utf-8")
   out=m.run(src,p/"tmp.sqlite",p/"report.json",{"go.linkwi.se"})
   self.assertEqual(out["program_identity_candidates"]["Mybrand.shoes"]["link_number_candidates"],{"11706":2})
   self.assertEqual(out["program_identity_candidates"]["Z-mall"]["link_number_candidates"],{"100":1})
   self.assertFalse(out["program_identity_candidates"]["Mybrand.shoes"]["program_id_confirmed"])
   self.assertEqual(out["program_ids_approved"],0)
   self.assertEqual(out["published_offers"],0)
