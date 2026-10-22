import importlib.util
import json
import sqlite3
import tempfile
import unittest
from pathlib import Path
FILE=Path(__file__).resolve().parents[1]/"scripts"/"ingest_linkwise_json.py"
spec=importlib.util.spec_from_file_location("linkwise_json_ingest",FILE)
mod=importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
class JsonImportTests(unittest.TestCase):
 def test_streaming_json_nested_and_idempotent(self):
  with tempfile.TemporaryDirectory() as root:
   p=Path(root)
   rows=[
    {"product_id":"1","product_name":"Walking pad 2-in-1","category":"Fitness","program":{"name":"Merchant X"},"price":"299,90 €","availability":"in stock","tracking_url":"https://go.linkwi.se/click-a","image_url":"https://example.com/a.png","description":{"complex":[1,2]}},
    {"product_id":"2","product_name":"Ποδήλατο γυμναστικής","category":"fitness","program":{"name":"Merchant X"},"price":200,"availability":"y","tracking_url":"https://go.linkwi.se/click-b"},
    {"product_id":"3","product_name":"Λάστιχο αντίστασης","category":"fitness","program":{"name":"Merchant X"},"price":8,"availability":"y","tracking_url":"https://malicious.example/click"},
    {"product_id":"4","product_name":"Υπηρεσία εγκατάστασης θερμοσίφωνα διαδρομή","category":"services","program":{"name":"Merchant X"},"price":100,"availability":"y","tracking_url":"https://go.linkwi.se/click"}
   ]
   inp=p/"feed.json";inp.write_text(json.dumps(rows,ensure_ascii=False),encoding="utf-8")
   db=p/"staging.sqlite";report=p/"qa.json"
   result=mod.run(inp,db,report,{"go.linkwi.se"})
   self.assertEqual(result["source_rows"],4)
   self.assertEqual(result["fitness_detected"],3)
   self.assertEqual(result["quarantined"],1)
   self.assertEqual(result["published_offers"],0)
   self.assertEqual(result["staged_rows"],2)
   result2=mod.run(inp,db,report,{"go.linkwi.se"})
   conn=sqlite3.connect(db)
   self.assertEqual(conn.execute("select count(*) from source_fitness_candidates").fetchone()[0],2)
   self.assertEqual(conn.execute("select count(*) from source_fitness_candidates where review_status='UNVERIFIED'").fetchone()[0],2)
   self.assertEqual(result2["published_offers"],0)
 def test_price_and_stock_validation(self):
  self.assertEqual(mod.money("1.299,90€"),1299.90)
  self.assertEqual(mod.stock("παράδοση σε 24 ώρες"),"unknown")
  self.assertEqual(mod.classify("ΥΠΗΡΕΣΙΑ ΕΓΚΑΤΑΣΤΑΣΗΣ ΘΕΡΜΟΣΙΦΩΝΑ ΔΙΑΔΡΟΜΗ","Services"),None)
