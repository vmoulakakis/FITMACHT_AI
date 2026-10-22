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


## Image-approved October 22 Top Five studio (owner override of PRD v1.0)
- The latest user-approved reference specifies three parallel Top Five context lanes: cardio, strength and compact-space, with six buyer pains and an agent workflow.
- Original PRD limited monetized results to a maximum of three. The new user direction explicitly tests up to five eligible offers per context lane, while retaining hard evidence criteria.
- A five-slot lane contains at most five verified purchasable offers; if insufficient, genuine researched source candidates remain visually distinguished as UNVERIFIED, and the remaining positions are practical no-purchase advice. Never label those substitutes affiliate-ready.
- All goal x space x noise x budget x preference combinations have five distinct useful slots. No claim that five current SKUs pass a constrained environment without verified fit/dimensions.
- CI must include 390px mobile and 1440px desktop screenshot acceptance and tests for budget 0, research-only cards, payout hard gate, live user controls, and no /api/out link for unverified items.
- GitHub agent + skills definitions in .github/agents and .github/skills are repository instructions, NOT provisioned/active cloud agents. GitHub default-branch and entitlement controls govern activation.
