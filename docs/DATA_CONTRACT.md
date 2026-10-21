# FITMATCH / SocialMarket Source Contract
Source files audited 2026-10-21: Socialmarket/supabase/functions/linkwise-feed-ingest/index.ts, product-ranking-gateway/index.ts, agents/skills/product-commercial-gate/SKILL.md.

Existing upstream: commerce_feed_eligible_offers and merchant_product_discovery_eligible. Upstream feed gateway is JSON-specific and uses a 15 EUR threshold. Actual FITMATCH PRD canonical feed is Linkwise programs-joined feed.csv and threshold 10 EUR, so do not reuse its commercial PASS without independent validation.

Critical: Upstream commission() may choose maximum flat/percentage; do not use this to claim a verified minimum. In the current connector every upstream offer is mapped to category=unmapped, commissionEvidence=false, specsVerified=false until corroborated. No live outbound links.

Data contract for audited future FITMATCH tables: fitmatch_merchant_terms(program_id,category_id,effective_from,min_verified_commission,payout_basis,caps,exclusions,approved_channels,terms_source,review_status); fitmatch_products(program_id,source_product_id,canonical_key,verified_category,spec_evidence,reviewed_at); fitmatch_offers(source_product_id,price,last_seen,in_stock,tracking_url,content_hash); fitmatch_sync_runs(rows_seen,rows_invalid,rows_duplicate,rows_active,rows_stale); fitmatch_events(anonymous_id,event,offer_id,consent_basis,created_at).

Source data ownership remains SocialMarket. New tables must be created under a separate prefix or isolated schema, with validated permissions/RLS and independent migrations. Do not copy secret keys from other Vercel projects into public variables.

Recommended later semantic retrieval: intfloat/multilingual-e5-small, MIT license, for embedding cited vetted specs and guides. Deterministic eligibility and arithmetic remain authoritative; model inference must be benchmarked, and no claim of free unlimited hosted inference is made.

Progress checklist: [x] repo and PRD audit [x] deterministic engine [x] UI [x] read-only bridge code [ ] authoritative category mapping [ ] verified commission terms [ ] live product QA [ ] full streaming CSV ETL [ ] metrics [ ] production acceptance.