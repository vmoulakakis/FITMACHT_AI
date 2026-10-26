# FITMATCH AI — staging first

Greek-language evidence-first buying advisor for fitness equipment in small homes. Not an e-shop.

## Implemented
- Mobile-first landing; interactive six-stage adaptive-style consultation; category-first rules
- Cautious explanations, safety checks, no-login and no-email flow
- API recommendation route, status route, allowlisted outbound redirect
- Offer gates: real stock, real current price, verified product specs, verified EUR10 minimum commission, exact fitness taxonomy
- Optional read-only SocialMarket Supabase consumer of **public.fitmatch_verified_offers**; RLS + application policy fail closed unless approved, recent, evidence-backed and outbound-safe
- Decision regression tests and explicit zero-offers state; no invented merchant links
- Methodology, affiliate disclosure and staging privacy notice

## Run
Node 20 or newer. npm install && npm test && npm run build && npm run dev

## Configuration
See .env.example. No secrets or privileged SocialMarket credentials in this repository.
Source upstream: vmoulakakis/Socialmarket (existing independently operated app).
SocialMarket ingestion currently uses an EUR15 source-gate and a commission calculation that can use maximum terms; those estimates CANNOT automatically pass FITMATCH's separately verified EUR10 minimum.
The bridge reads only `public.fitmatch_verified_offers` through a publishable/read-only credential and its existing restrictive RLS SELECT policy. The raw `commerce_feed_eligible_offers` table is not exposed to anonymous FITMATCH requests. No direct database writes occur. The verified table currently contains zero approved records (audit 2026-10-26); the UI deliberately displays zero buy links until records are actually reviewed.

## Next stage before real offers
Audit actual Linkwise feed.csv taxonomy, merchant program terms per category, exclusions, approval rules and tracking URLs. Create independently namespaced audit tables and scheduled refresh. Map real verified specs and prices. Add documented ETL count/idempotence tests, full RAG evidence, consent-respecting analytics and attribution.

## Release
This repo is staging-only and deliberately NOINDEX. SEO launch requires `FITMATCH_PUBLIC_LAUNCH=true` plus valid `FITMATCH_PUBLIC_ORIGIN`; these are necessary but not sufficient to approve a release. Preview SSO remains enabled. Do not publish production without source-data audit, acceptance tests, Linkwise compliance review, security/privacy and explicit owner signoff.\n\nAutomated PR quality gate: `.github/workflows/quality.yml` runs tests, TypeScript and build. A lockfile is not committed yet; CI uses `npm install` until deterministic dependency resolution is added.