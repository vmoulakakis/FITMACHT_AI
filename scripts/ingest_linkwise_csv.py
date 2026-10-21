#!/usr/bin/env python3
"""FITMATCH AI: streaming, fail-closed Linkwise CSV audit and local staging upsert.
Does not publish offers, infer commissions or touch SocialMarket production.
Usage: python scripts/ingest_linkwise_csv.py --input feed.csv --db /tmp/fitmatch.sqlite --report report.json
"""
from __future__ import annotations
import argparse
import csv
import hashlib
import json
import re
import sqlite3
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlsplit

REQUIRED = {"product_id", "product_name", "price", "tracking_url"}
TRUE = {"true", "1", "yes", "y", "in stock", "instock"}
FALSE = {"false", "0", "no", "n", "out of stock", "outofstock"}
CATALOG_SCHEMA = """
CREATE TABLE IF NOT EXISTS staging_offers (
 source_key TEXT NOT NULL, program_id TEXT NOT NULL, product_id TEXT NOT NULL,
 content_hash TEXT NOT NULL, payload TEXT NOT NULL,
 last_seen_at TEXT NOT NULL, PRIMARY KEY (source_key, program_id, product_id)
);
CREATE TABLE IF NOT EXISTS quarantine (
 run_id TEXT NOT NULL, row_number INTEGER NOT NULL, reason TEXT NOT NULL,
 raw_excerpt TEXT NOT NULL
);
"""

def number(value: object) -> float | None:
    text = str(value or "").strip().replace("€", "").replace(" ", "")
    if not text:
        return None
    if "," in text and "." in text:
        text = text.replace(".", "").replace(",", ".") if text.rfind(",") > text.rfind(".") else text.replace(",", "")
    elif "," in text:
        text = text.replace(",", ".")
    try:
        parsed = float(text)
        return parsed if 0 < parsed < 10000000 else None
    except ValueError:
        return None

def stock(value: object) -> bool | None:
    v = str(value or "").strip().lower()
    if v in TRUE:
        return True
    if v in FALSE:
        return False
    return None

def url_status(value: str, hosts: set[str]) -> str:
    try:
        u = urlsplit(value)
        if u.scheme != "https" or not u.hostname or u.username or u.password or u.port:
            return "tracking_url_invalid"
        if not hosts or u.hostname.lower() not in hosts:
            return "tracking_host_unverified"
        return "allowed"
    except ValueError:
        return "tracking_url_invalid"

def load_verified_crosswalk(path: Path | None) -> dict[str, str]:
    """Only explicit, evidenced human-approved program IDs can map merchant names."""
    if path is None:
        return {}
    mapping: dict[str, str] = {}
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        if not {"program_name", "program_id", "approved", "evidence_url"}.issubset(set(reader.fieldnames or [])):
            raise ValueError("invalid_crosswalk_columns")
        for row in reader:
            if str(row.get("approved") or "").strip().lower() not in TRUE:
                continue
            name = str(row.get("program_name") or "").strip().casefold()
            program = str(row.get("program_id") or "").strip()
            source = str(row.get("evidence_url") or "").strip()
            if not name or not program or not source.startswith("https://"):
                raise ValueError("crosswalk_requires_approved_source")
            if name in mapping and mapping[name] != program:
                raise ValueError("conflicting_program_mapping")
            mapping[name] = program
    return mapping

def ingest(source: Path, db: Path, report: Path, hosts: set[str], program_map: dict[str, str] | None = None) -> dict:
    run_id = datetime.now(timezone.utc).isoformat()
    counts = Counter()
    db.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db)
    try:
        conn.executescript(CATALOG_SCHEMA)
        with source.open("r", encoding="utf-8-sig", newline="") as handle:
            header = handle.read(8192)
            handle.seek(0)
            dialect = None
            try:
                dialect = csv.Sniffer().sniff(header, delimiters=",;\t|")
            except csv.Error:
                dialect = csv.excel
            reader = csv.DictReader(handle, dialect=dialect)
            names = set(reader.fieldnames or [])
            missing = sorted(REQUIRED - names)
            if missing:
                raise ValueError("missing_columns:" + ",".join(missing))
            for row_number, raw in enumerate(reader, 2):
                counts["rows"] += 1
                try:
                    pid = str(raw.get("product_id") or "").strip()
                    program = str(raw.get("program_id") or "").strip()
                    if not program:
                        merchant_name = str(raw.get("program_name") or raw.get("merchant_name") or "").strip().casefold()
                        program = (program_map or {}).get(merchant_name, "")
                        if not program:
                            raise ValueError("unresolved_program_identity")
                    title = str(raw.get("product_name") or "").strip()
                    link = str(raw.get("tracking_url") or "").strip()
                    price = number(raw.get("price"))
                    if not pid or not program or not title or price is None or not link:
                        raise ValueError("missing_or_invalid_required")
                    # Preserve original feed category; never guess normalized fitness taxonomy.
                    payload = {
                        "source_key": "linkwise_programs_joined",
                        "program_id": program, "product_id": pid, "title": title,
                        "category_raw": str(raw.get("category") or ""), "price_eur": price,
                        "in_stock": stock(raw.get("in_stock")),
                        "image_url": str(raw.get("image_url") or raw.get("thumb_url") or ""),
                        "tracking_url": link,
                        "tracking_status": url_status(link, hosts),
                        "commission_status": "UNVERIFIED",
                        "specification_status": "UNVERIFIED",
                        "monetization_eligible": False,
                    }
                    stable = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
                    digest = hashlib.sha256(stable.encode("utf-8")).hexdigest()
                    found = conn.execute("SELECT content_hash FROM staging_offers WHERE source_key=? AND program_id=? AND product_id=?",
                                         ("linkwise_programs_joined", program, pid)).fetchone()
                    if found and found[0] == digest:
                        counts["unchanged"] += 1
                    elif found:
                        counts["updated"] += 1
                    else:
                        counts["inserted"] += 1
                    conn.execute("""INSERT INTO staging_offers
                        (source_key,program_id,product_id,content_hash,payload,last_seen_at)
                        VALUES (?,?,?,?,?,?)
                        ON CONFLICT(source_key,program_id,product_id)
                        DO UPDATE SET content_hash=excluded.content_hash,payload=excluded.payload,last_seen_at=excluded.last_seen_at""",
                        ("linkwise_programs_joined", program, pid, digest, stable, run_id))
                    if payload["in_stock"] is True:
                        counts["feed_in_stock_true"] += 1
                    elif payload["in_stock"] is None:
                        counts["stock_unverified"] += 1
                    if payload["tracking_status"] != "allowed":
                        counts[payload["tracking_status"]] += 1
                except (ValueError, TypeError) as exc:
                    counts["quarantined"] += 1
                    conn.execute("INSERT INTO quarantine VALUES (?,?,?,?)",
                                 (run_id, row_number, str(exc)[:120], json.dumps(raw, ensure_ascii=False)[:500]))
                if counts["rows"] % 750 == 0:
                    conn.commit()
            conn.commit()
        counts["staged_total"] = conn.execute("SELECT count(*) FROM staging_offers").fetchone()[0]
        out = {"run_id": run_id, "source": str(source), "counts": dict(counts),
               "eligibility_policy": "all UNVERIFIED until per-category audited terms and specs",
               "published_offers": 0}
        report.parent.mkdir(parents=True, exist_ok=True)
        report.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
        return out
    finally:
        conn.close()

def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True, type=Path)
    p.add_argument("--db", required=True, type=Path)
    p.add_argument("--report", required=True, type=Path)
    p.add_argument("--allowed-tracking-host", action="append", default=[])
    p.add_argument("--approved-program-crosswalk", type=Path, default=None)
    args = p.parse_args()
    result = ingest(args.input, args.db, args.report,
                    {x.lower() for x in args.allowed_tracking_host},
                    load_verified_crosswalk(args.approved_program_crosswalk))
    print(json.dumps(result, ensure_ascii=False))
    return 0

if __name__ == "__main__":
    sys.exit(main())
