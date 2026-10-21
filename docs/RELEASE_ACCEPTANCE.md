# FITMATCH release acceptance — actual gate
Last verified: 2026-10-21 UTC.

## Status: FAIL / NOT PRODUCTION READY
- Github CI and Chromium desktop/mobile journeys pass in staging.
- Merchant source pool: 334 Linkwise commission records; just 17 currently have mapped program IDs. These are CANDIDATES, not approved merchants.
- Legacy merchant review view: 0 of 16 approved/tracking-verified; do not auto-change flags.
- Legacy feed: 3,921 records last seen 2026-09-17; 0 active confirmed in-stock.
- Source candidate hardware specs: 0 verified; 6,698 listing metadata facts do not constitute verified fitness product specifications.
- Public FITMATCH approved/offers: 0.
- New isolated Supabase objects were applied and verified, not just drafted.
- The old f9f4609 preview failed due to missing lib/flow. Fix landed in later commits, with green CI and READY preview.

## Required green gates
1. Canonical fresh fitness feed with program ID or explicit approved merchant crosswalk and count reconciliation.
2. Current stock, EUR price and validated thumbnail + tracking host on a per-SKU basis.
3. Merchant program, channel permission, payout base, minimum expected commission >=10 EUR, caps and exclusions with source provenance.
4. Fitness taxonomy mapping for walking pads, treadmills, indoor bikes, adjustable dumbbells, resistance bands.
5. Product technical specs with source URLs and review timestamps; do not infer specs from model prose.
6. Independently reviewed and approved SKU records in public.fitmatch_verified_offers.
7. Analytics, E2E SKU-to-merchant attribution, accessibility and regression suite.
8. User's explicit go-live approval. Until then, keep production unavailable and noindex staging.

## Operator endpoints
- /readiness: dated snapshot and current publication-state feedback.
- /api/readiness: JSON with snapshot vs live values separated.
- /api/status: releaseReady=false until verified commerce is integrated.
- github.com/vmoulakakis/FITMACHT_AI/actions: CI/E2E reports.

Migration executed on VMDB: fitmatch_isolated_source_review_and_verified_offer_rls_20261021 (private fitmatch schema and RLS-protected public.fitmatch_verified_offers). The repo's db/STAGING_ONLY_fitmatch_isolation.sql is an earlier design draft and MUST NOT be blindly run over the applied schema.

# FITMATCH two-question advisor acceptance (staging)
- Purpose: for every buyer input return three actionable, distinct solution paths even without verified affiliate offers.
- UI: only 2 core questions. Step 1: goal. Step 2: budget + space, optional noise/storage/running and free-text.
- Natural-language cue processing works locally with transparent rules. Optional HF open-weight provider processes free text only after explicit consent, if credentials and quota are available; fallback guaranteed.
- Never manufacture merchant products, affiliate rates, stock or fitness specifications to populate results.
- Shopper paths are not live purchasable SKUs: commerce stays gated by the existing verified-offer RLS table.
- Release is still blocked pending genuine merchant approval, specs and current stock; this funnel UI can be previewed independently.
- Regression suite exhausts budget=0, low budget, 4 goals, 3 spaces, 2 noise states, 2 storage preferences and free-text cues.
