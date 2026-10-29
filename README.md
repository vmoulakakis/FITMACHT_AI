# FITMATCH AI — deployed advisor, verified commerce gated

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
Audit actual Linkwise feed.csv taxonomy, merchant program terms per category, exclusions, approval rules and tracking URLs. Create independently namespaced audit tables and scheduled refresh. Map real verified specs and prices. Add documented ETL count/idempotence tests, full RAG evidence, consent-respecting analytics and attribution.

## Release
This repo is staging-only and deliberately NOINDEX. Do not publish production without source-data audit, acceptance tests, Linkwise compliance review, security/privacy and explicit owner signoff.
## Linkwise CD104 feed (review-only)
A server-side streaming JSON importer is available for the **owner-supplied CD104 feed**. Run `npm run linkwise:audit` with the private `LINKWISE_FITMATCH_FEED_URL` configured, then inspect the local candidate previews in staging. This does not automatically approve products or connect the separate live ChatGPT Site. See [integration and verification instructions](docs/LINKWISE_CD104_INTEGRATION.md). No Awin integration is included.

## Persistent Linkwise candidates (2026-10-29)
The production advisor can read fresh, sanitized, **UNVERIFIED** product previews from the isolated RLS-protected table `public.fitmatch_feed_candidates` on the connected Supabase instance. This table does **not** contain tracking URLs or commission estimates. Vercel uses a publishable key. Trusted feed workers must first run `npm run linkwise:audit` and then **explicitly** run `npm run linkwise:publish-previews` with a service-role key in a worker (never Vercel). The publisher has not been confirmed to run on the full original feed and the production table may remain empty. The recommendation and purchase gates remain fail-closed. Details in docs/LINKWISE_CD104_INTEGRATION.md.
