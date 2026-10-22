# FITMATCH AI — implementation evidence · 2026-10-22
Source: the owner's FITMATCH PRD v1.0 dated 2026-10-20 and the authorized GitHub, Vercel, Supabase, Linkwise source connection.

## Implemented
- The staging landing uses an original generated HD cinematic home-gym hero asset hosted on a stable CDN, with gradient overlays, slow camera effect and reduced-motion alternative.
- Buyer starts with a recognizable pain gap or free text; goal, space, budget and noise preferences can adjust contextual planning.
- Buyer agent orchestrates understanding -> solution alternatives -> independent SKU filtering, returns independent merchant matches for EACH equipment route.
- Commerce results only come from public.fitmatch_verified_offers with RLS + release gate; user-fit scores do not benefit from higher affiliate payouts.
- Products can display image, last-seen timestamp, merchant, evidence source and safe direct-to-merchant affiliate outbound redirect after URL allowlist.
- Staging CI executes Python importer tests, TS/Node tests, typecheck, Next production build, Chromium desktop and mobile E2E screenshots.

## Actual sources
- 2026-10-22: Full owner-provided Linkwise feed JSON returned HTTP 200. Short feed.csv endpoint from the PRD returned 404.
- program is an object with name; availability may be 'y' or 'in stock', not a uniform boolean. Prices can be localized strings.
- Selected category IDs are broad mixtures: 3/27 include sports, 67 includes apparel; 119 includes gym accessories. Do not equate top-level sports feed with home fitness.
- 36 SOURCE rows imported into private fitmatch.offer_candidates: 29 Mybrand.shoes + 7 Z-mall, as of audited snapshot. All 36 had positive stock signal; 10 had price >= 150 EUR.
- Private QA view fitmatch.commercial_review_queue joins historical minimum affiliate rates: Mybrand.shoes 8%, Z-mall 6%, imported Sept 17. **10 appear above indicative EUR10 on a VAT-excluded estimate; NONE has verified program ID/terms, category exclusions, specs or approval**.
- Published fitmatch_verified_offers: 0. Agent cannot promise a purchasable offer while the merchant commercial source remains unverified.

## Supabase changes
Only additive private fitmatch objects applied:
- fitmatch.offer_candidates (RLS enabled, no anonymous access),
- fitmatch.feed_audit_observations (RLS enabled, no anonymous access),
- fitmatch.commercial_review_queue (security_invoker and no anonymous grants).
Historical SocialMarket tables were not overwritten.

## Remaining blockers
1. Real program ID crosswalk for Mybrand.shoes, Z-mall and new merchants, with proof.
2. Current, applicable Linkwise approved commission terms (caps/exclusions, attribution permissions), not the historical estimates.
3. Verified product specs and merchant evidence URLs.
4. Scheduled, credential-protected full ingestion job, idempotent reconciliation, feed taxonomy map, failure monitoring.
5. Privacy-compliant outbound analytics and conversion reconciliation; automatic winner ranking requires real conversions.
6. End-to-end merchant purchase and tracking acceptance; explicit production approval.

## Operational cautions
- Preview feed-health and candidate scan endpoints are for authorized staging diagnostics only; secrets stay in branch-scoped Vercel env.
- Never copy the Supabase service-role key into a browser. The linked environment currently has only publishable read-only Supabase access.
- HF_TOKEN is not configured: contextual fallback works; do not claim live LLM reasoning / full RAG.
- Visual prototypes do not represent actual available products or verified prices. No production promotion performed.
