import importlib.util
import tempfile
import unittest
from pathlib import Path
MODULE=Path(__file__).resolve().parents[1]/"scripts"/"ingest_linkwise_csv.py"
spec=importlib.util.spec_from_file_location("fitmatch_import",MODULE)
mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)

class IdentityCrosswalkTests(unittest.TestCase):
 def test_csv_without_program_id_is_quarantined_not_aborted(self):
  with tempfile.TemporaryDirectory() as d:
   base=Path(d);f=base/"feed.csv";db=base/"db.sqlite";report=base/"report.json"
   f.write_text('product_id,program_name,product_name,price,tracking_url,in_stock\np1,Merchant X,"Walking pad",300,https://trusted.example/a,true\n',encoding="utf-8")
   result=mod.ingest(f,db,report,{"trusted.example"})
   self.assertEqual(result["counts"]["quarantined"],1)
   self.assertEqual(result["counts"]["staged_total"],0)
   self.assertEqual(result["published_offers"],0)
 def test_human_verified_crosswalk_allows_staging_without_publishing(self):
  with tempfile.TemporaryDirectory() as d:
   base=Path(d);f=base/"feed.csv";mapfile=base/"crosswalk.csv"
   f.write_text('product_id,program_name,product_name,price,tracking_url,in_stock\np1,Merchant X,"Walking pad",300,https://trusted.example/a,true\n',encoding="utf-8")
   mapfile.write_text('program_name,program_id,approved,evidence_url\nMerchant X,42,true,https://merchant.example/proof\n',encoding="utf-8")
   mapping=mod.load_verified_crosswalk(mapfile)
   self.assertEqual(mapping,{"merchant x":"42"})
   data=mod.ingest(f,base/"db.sqlite",base/"report.json",{"trusted.example"},mapping)
   self.assertEqual(data["counts"]["inserted"],1)
   self.assertEqual(data["published_offers"],0)
 def test_missing_approved_source_never_maps(self):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d)/"map.csv"
   p.write_text("program_name,program_id,approved,evidence_url\nX,42,true,\n",encoding="utf-8")
   with self.assertRaisesRegex(ValueError,"crosswalk_requires_approved_source"):
    mod.load_verified_crosswalk(p)
