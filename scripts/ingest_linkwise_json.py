#!/usr/bin/env python3
"""FITMATCH Linkwise JSON feed intake — offline, streaming, and FAIL CLOSED.

Reads the owner's downloaded Linkwise feed JSON array and retains ONLY candidate
fitness listings in local SQLite. NEVER publishes offers, trusts commission rates,
or alters SocialMarket. Requires manual commercial/source evidence audit.
"""
import argparse
import collections
import json
import re
import sqlite3
from pathlib import Path
from urllib.parse import urlparse

def stream_array(path: Path):
    decoder=json.JSONDecoder()
    with path.open("r",encoding="utf-8-sig") as f:
        buf="";done=False
        while True:
            chunk=f.read(32768)
            if not chunk and not buf.strip():
                break
            buf+=chunk
            pos=0
            if not done:
                start=buf.find("[")
                if start<0:
                    if len(buf)>1000 or not chunk:
                        raise ValueError("expected_json_array")
                    continue
                buf=buf[start+1:]
                done=True
            while True:
                pos=0
                while pos<len(buf) and buf[pos] in " \t\r\n,":
                    pos+=1
                if pos==len(buf):
                    buf=""
                    break
                if buf[pos]=="]":
                    return
                try:
                    entry,end=decoder.raw_decode(buf,pos)
                except json.JSONDecodeError:
                    if not chunk or len(buf)>1500000:
                        raise ValueError("malformed_or_oversized_json_entry")
                    buf=buf[pos:]
                    break
                if isinstance(entry,dict):
                    yield entry
                buf=buf[end:]
            if not chunk:
                raise ValueError("unterminated_json_array")

def money(value):
    if isinstance(value,(int,float)):
        return round(value,2) if 0<float(value)<=100000 else None
    if not isinstance(value,str):return None
    v=re.sub(r"(?:EUR|€|\s)","",value.strip(),flags=re.I)
    if not re.fullmatch(r"[0-9.,]+",v):return None
    if "," in v and "." in v:
        v=v.replace(".","").replace(",",".") if v.rfind(",")>v.rfind(".") else v.replace(",","")
    elif "," in v:
        v=v.replace(",",".") if re.search(r",\d{1,2}$",v) else v.replace(",","")
    elif v.count(".")>1 and re.search(r"\.\d{3}$",v):
        v=v.replace(".","")
    try:n=float(v)
    except ValueError:return None
    return round(n,2) if 0<n<=100000 else None

def stock(value):
    v=str(value or "").strip().lower()
    if v in {"true","1","y","yes","available","in stock","διαθέσιμο","σε απόθεμα"}:return "in_stock"
    if v in {"false","0","n","no","unavailable","out of stock","εξαντλημένο"}:return "out_of_stock"
    return "unknown"

def classify(title,category):
    text=(title+" "+category).casefold()
    # A journey called 'διαδρομή' is not a treadmill.
    if re.search(r"θερμοσιφ|δρομολογ|ταξιδ|διαδρομή|υπηρεσία",text):
        return None
    terms=(
      ("walking-pad",r"walking.?pad"),
      ("treadmill",r"treadmill|διάδρομος.{0,25}(τρέξ|γυμναστικ)|διάδρομοι.{0,25}γυμναστικ"),
      ("exercise-bike",r"exercise.?bike|spin.?bike|ποδήλατο.{0,25}γυμναστικ"),
      ("adjustable-dumbbells",r"adjustable.?dumbbell|ρυθμιζόμεν.{0,20}αλτήρ"),
      ("fixed-dumbbells",r"dumbbell|βαράκ|αλτήρ"),
      ("resistance-bands",r"resistance.?band|λάστιχ.{0,22}(γυμναστ|αντίστασ)|gymtube"),
      ("weight-bench",r"πάγκος.{0,22}γυμναστικ|weight.?bench")
    )
    for kind,pat in terms:
        if re.search(pat,text,re.I):
            return kind
    return None

def run(src:Path,db_path:Path,report_path:Path,allowed_hosts:set[str]):
    conn=sqlite3.connect(db_path)
    conn.execute("""CREATE TABLE IF NOT EXISTS source_fitness_candidates(
    source TEXT NOT NULL,program_name TEXT NOT NULL,source_product_id TEXT NOT NULL,
    title TEXT NOT NULL,source_category TEXT NOT NULL,normalized_category TEXT NOT NULL,
    price_eur REAL NOT NULL,stock_status TEXT NOT NULL,image_url TEXT,tracking_url TEXT,
    review_status TEXT NOT NULL DEFAULT 'UNVERIFIED',
    PRIMARY KEY(source,program_name,source_product_id))""")
    counts=collections.Counter()
    categories=collections.Counter()
    try:
        with conn:
            for row in stream_array(src):
                counts["source_rows"]+=1
                title=str(row.get("product_name") or "").strip()
                category=str(row.get("category") or "").strip()
                mapped=classify(title,category)
                if not mapped:continue
                counts["fitness_detected"]+=1
                program=row.get("program")
                name=str((program or {}).get("name") or "").strip() if isinstance(program,dict) else str(row.get("program_name") or program or "").strip()
                product_id=str(row.get("product_id") or "").strip()
                price=money(row.get("price"))
                link=str(row.get("tracking_url") or "").strip()
                parsed=urlparse(link)
                if not (title and product_id and name and price and parsed.scheme=="https" and parsed.hostname in allowed_hosts and not parsed.username and not parsed.password):
                    counts["quarantined"]+=1
                    continue
                image=str(row.get("image_url") or "").strip()
                image=image if image.startswith("https://") else None
                availability=stock(row.get("in_stock",row.get("availability")))
                conn.execute("""INSERT INTO source_fitness_candidates(
                    source,program_name,source_product_id,title,source_category,normalized_category,
                    price_eur,stock_status,image_url,tracking_url,review_status
                  ) VALUES(?,?,?,?,?,?,?,?,?,?,'UNVERIFIED')
                  ON CONFLICT(source,program_name,source_product_id) DO UPDATE SET
                    title=excluded.title,source_category=excluded.source_category,
                    normalized_category=excluded.normalized_category,price_eur=excluded.price_eur,
                    stock_status=excluded.stock_status,image_url=excluded.image_url,
                    tracking_url=excluded.tracking_url
                    -- Never upgrade commission or publication status automatically.
                """,("linkwise",name,product_id,title[:300],category[:350],mapped,price,availability,image,link))
                counts["staged_rows"]+=1
                categories[mapped]+=1
    finally:
        conn.close()
    result={"source_rows":counts["source_rows"],"fitness_detected":counts["fitness_detected"],
        "staged_rows":counts["staged_rows"],"quarantined":counts["quarantined"],
        "published_offers":0,"normalized_categories":dict(categories),"status":"STAGING_ONLY_UNVERIFIED"}
    report_path.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding="utf-8")
    return result

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--feed",type=Path,required=True)
    parser.add_argument("--database",type=Path,required=True)
    parser.add_argument("--report",type=Path,required=True)
    parser.add_argument("--allowed-tracking-host",action="append",default=["go.linkwi.se"])
    args=parser.parse_args()
    print(json.dumps(run(args.feed,args.database,args.report,set(args.allowed_tracking_host)),ensure_ascii=False))
