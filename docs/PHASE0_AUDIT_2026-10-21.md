# FITMATCH AI / Phase 0 factual audit — 2026-10-21

Scope: READ ONLY queries on linked Supabase project vmdb (gqpbskssrvpfjtujwezc) plus GitHub source vmoulakakis/Socialmarket and FITMATCH PRD v1.0 dated 2026-10-20.

## Verified source facts
- public.commerce_feed_eligible_offers: 3,921 rows; 3,921 marked is_active.
- in_stock: true=0, false=1,542, NULL=2,379. Active flag MUST NOT mean available.
- last_seen_at: all observed rows dated 2026-09-17; 0 refreshed in the last 7 days as of 2026-10-21.
- Broad fuzzy fitness keywords across category_raw/product_name gave 145 possible results, but includes sportswear, shoes and unrelated sports.
- Narrow home-equipment regex covering walking pads, treadmills, exercise bikes, dumbbells, workout bands and gym benches gave 0 matches. This is not proof that the entire Linkwise network lacks them.
- public.linkwise_program_commissions contains 334 program-name rows; only 17 populated linkwise_program_id. All 334 have some commission fields; this is NOT proof of eligible merchant/product mappings.
- Sample sport-name merchant terms: Athlos Sport 10%, Mandellos Sports 8%, SportsPoint 8%. Program IDs missing in the sampled commission records; category/product exceptions and approval rules not yet validated.
- Existing upstream importer computes payout using a maximum in some cases and currently filters at EUR15. FITMATCH must use independently validated conservative EUR10 conditions.
- RLS denies anonymous/publishable-key catalog access from the isolated FITMATCH preview. No RLS policies or existing database tables modified.

## Policy and release blockers
1. Canonical fresh Linkwise programs-joined feed.csv and field/category IDs not yet verified.
2. Exact program/category commission join and net payout exclusions missing.
3. In-stock true and current price freshness missing across all 3,921 legacy imported offers.
4. Verified home-fitness product technical specifications and fit measurements missing.
5. Isolated read-only consumer contract must be approved; no service-role key recycling.
6. Product Design visual/browser QA, mobile e2e and GDPR/Linkwise compliance review not yet complete.

## Completed engineering evidence
- Next.js 15.5.28 staging preview READY with HTML route and /api/status HTTP 200.
- Automated GitHub Actions build and decision-engine tests pass, workflow /actions/runs/39574393998.
- No fabricated offers or affiliate conversion metrics in UI; no production deployment promoted.

## Follow-up specialists
- Affiliate analyst: inspect actual approved Linkwise program/category terms and product exceptions.
- Data engineer: implement streaming feed.csv, source counts, refresh, dedup, quarantine, run logs.
- AI/RAG engineer: evaluate multilingual-e5-small on vetted Greek specs, version scoring and citations.
- Product/UX: adaptive quiz and evidence-based product result compare.
- Frontend/QA/security: accessibility/mobile end-to-end, click-safety and GDPR.

Owner action after Phase 0: approve authoritative merchant data access/terms and staging-to-production only after acceptance.
