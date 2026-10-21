"""Real parser smoke tests, synthetic records only. No network/production mutations."""
import importlib.util
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "ingest_linkwise_csv.py"
spec = importlib.util.spec_from_file_location("linkwise_ingest", SCRIPT)
ingest_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ingest_module)

class TestFeed(unittest.TestCase):
    def test_streaming_quarantine_and_idempotence(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source, db, report = root/"feed.csv", root/"staging.sqlite", root/"qa.json"
            source.write_text(
                'product_id,program_id,product_name,price,tracking_url,in_stock,category\n'
                'p1,42,"Διάδρομος, για σπίτι","350,00",https://affiliate.example/a,true,Fitness\n'
                'p2,42,"Μηχανάκι\nγυμναστικής",200,https://affiliate.example/b,false,Fitness\n'
                'bad,42,Λάθος,100,,true,Fitness\n', encoding="utf-8"
            )
            first = ingest_module.ingest(source, db, report, {"affiliate.example"})
            self.assertEqual(first["counts"].get("inserted"), 2)
            self.assertEqual(first["counts"].get("quarantined"), 1)
            self.assertEqual(first["counts"].get("staged_total"), 2)
            self.assertEqual(first["published_offers"], 0)
            second = ingest_module.ingest(source, db, report, {"affiliate.example"})
            self.assertEqual(second["counts"].get("unchanged"), 2)
            self.assertEqual(second["counts"].get("staged_total"), 2)

    def test_urls_are_fail_closed(self):
        self.assertEqual(ingest_module.url_status("https://affiliate.example/x", {"affiliate.example"}), "allowed")
        self.assertEqual(ingest_module.url_status("https://evil.example/x", {"affiliate.example"}), "tracking_host_unverified")
        self.assertEqual(ingest_module.url_status("http://affiliate.example/x", {"affiliate.example"}), "tracking_url_invalid")
        self.assertEqual(ingest_module.url_status("https://user:pw@affiliate.example/x", {"affiliate.example"}), "tracking_url_invalid")

    def test_price_normalization(self):
        self.assertEqual(ingest_module.number("1.234,56"), 1234.56)
        self.assertEqual(ingest_module.number("19,99"), 19.99)
        self.assertIsNone(ingest_module.number("not-a-price"))

    def test_rejects_missing_program_id_column(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root/"bad.csv"
            source.write_text("product_id,product_name,price,tracking_url\n1,A,150,https://example.org\n",encoding="utf-8")
            with self.assertRaisesRegex(ValueError,"missing_columns:program_id"):
                ingest_module.ingest(source,root/"db.sqlite",root/"qa.json",set())

if __name__ == "__main__":
    unittest.main()
