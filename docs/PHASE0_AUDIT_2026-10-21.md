# FITMATCH AI — Phase 0 audit / 2026-10-21

Observed using the connected GitHub SocialMarket source and read-only SQL on VMDB Supabase, not modeled estimates:

| Metric | Verified value |
|---|---:|
| commerce_feed_eligible_offers | 3,921 rows |
| active AND in_stock | 0 |
| last seen at source | 2026-09-17 11:42 UTC |
| loose category text matching fitness/sports terms | 145 |
| linkwise_program_commissions | 334 rows |
| commission rows with linkwise_program_id | 17 |
| merchant_product_discovery_eligible | 0 rows |
| ai_product_specifications | 0 rows |
| product_feed_items | 0 rows |

Most of the 145 loose sports matches are sports shoes, tennis and padel; this is NOT the home-fitness catalog from the PRD.

## Blocking findings

1. The upstream feed is stale and all imported offers have no positive confirmed stock.
2. The existing Linkwise ingest source has a 15 EUR minimum and chooses a max amount from flat/percent terms in some cases. FITMATCH requires a separately verified conservative 10 EUR floor.
3. Raw SocialMarket commerce_feed_eligible_offers is protected by RLS. The published FITMATCH site must never bypass existing RLS or copy the service-role key.
4. The canonical Linkwise feed.csv has not yet been imported in full with validated taxonomy IDs. The local Python streaming CSV tool is a fail-closed staging audit, not a replacement for Postgres production ETL.
5. An independent FITMATCH reviewed-offers table has been specified and its read-only client is coded, but the migration remains unapplied until an isolated staging database/security review is available.

## What is implemented

Greek mobile-first page, 6-stage quiz, category-first deterministic advisor, safe zero-product state, server redirect with allowlisted hosts, RLS-oriented catalog consumer, source ingestion audit to local SQLite, independently conservative commission verifier, GitHub CI and Vercel preview.

## Free AI boundary

MIT multilingual-e5-small model, Greek-supported and available from Hugging Face. Optional offline indexer in scripts/ml. Embedding inference has NOT yet been executed or benchmarked in this environment. AI never determines financial terms or product specs.

## Release blockers

Need current fitness feed, verified category mapping, approved per-category Linkwise merchant terms, up-to-date price/stock, evidence of dimensions/specs, validated click tracking, reviewed isolated staging migration, security/privacy review, actual mobile/browser screenshot acceptance, owner production signoff.

No SocialMarket records were changed by this audit; no production deployment was promoted.
