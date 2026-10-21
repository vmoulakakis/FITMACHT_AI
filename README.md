# FITMATCH AI — staging first

Greek-language evidence-first buying advisor for fitness equipment in small homes. Not an e-shop.

## Implemented
- Mobile-first landing; interactive six-stage adaptive-style consultation; category-first rules
- Cautious explanations, safety checks, no-login and no-email flow
- API recommendation route, status route, allowlisted outbound redirect
- Offer gates: real stock, real current price, verified product specs, verified EUR10 minimum commission, exact fitness taxonomy
- Optional read-only SocialMarket Supabase consumer, FAIL CLOSED if restricted or unknown
- Decision regression tests and explicit zero-offers state; no invented merchant links
- Methodology, affiliate disclosure and staging privacy notice

## Run
Node 20 or newer. npm install && npm test && npm run build && npm run dev

## Configuration
See .env.example. No secrets or privileged SocialMarket credentials in this repository.
Source upstream: vmoulakakis/Socialmarket (existing independently operated app).
SocialMarket ingestion currently uses an EUR15 source-gate and a commission calculation that can use maximum terms; those estimates CANNOT automatically pass FITMATCH's separately verified EUR10 minimum.
The bridge reads only with an approved public/read-only credential if RLS allows it. All records start UNVERIFIED pending manual source and terms audit. No direct database writes occur.

## Next stage before real offers
Audit actual Linkwise feed.csv taxonomy, merchant program terms per category, exclusions, approval rules and tracking URLs. Use the already-created private fitmatch review views and public.fitmatch_verified_offers RLS table; add validated refresh and approval workers. Map real verified specs and prices. Add documented ETL count/idempotence tests, full RAG evidence, consent-respecting analytics and attribution.

## Release
This repo is staging-only and deliberately NOINDEX. Do not publish production without source-data audit, acceptance tests, Linkwise compliance review, security/privacy and explicit owner signoff.
## 2026-10-21 corrective release

- Supabase private fitmatch schema applied with 334 source merchant commission candidates (17 ID-mappable, 317 require verified crosswalk). No merchant approval gate bypassed.
- Public fitmatch_verified_offers table created with RLS; no approved offers are published until genuine stock, product evidence and terms satisfy all gates.
- /readiness is a timestamped operational data-readiness dashboard; /api/readiness exposes snapshot vs live verified catalog separately.
- CSV importer now quarantines records whose program ID is absent rather than rejecting the entire feed. Only an explicitly approved, attributed merchant crosswalk may resolve ambiguous names; still no monetization.
- Historical Vercel failure on f9f4609 was a missing import path @/lib/flow; subsequent builds succeeded. Use atomic complete commits to avoid partial-build emails.

## Conversational funnel v2 — two questions
- 1. Goal. 2. Budget + space with optional quiet/storage/running toggles and optional free-text context.
- Every valid combination returns primary actionable path plus two alternatives; practical no-purchase guidance is a solution, not a fake offer.
- Local Greek/Greeklish contextual matching and category scoring operate without paid inference.
- Optional environment HF_TOKEN supports explicit-consent Qwen/Qwen3-4B-Instruct-2507 for contextual cue extraction only. Open weights do not guarantee free provider quota; failure gracefully falls back.
- ML does not determine stock, price, medical advice or commercial eligibility. Release remains blocked until verified products exist.
