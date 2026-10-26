# Specification — CHG-20261026-FITMATCH-RELEASE

## Trust boundaries
- External SocialMarket products: UNVERIFIED unless each fact has auditable evidence.
- Outbound URL never accepted from query string: offer ID is resolved server side from the approved catalog.
- FITMATCH_LINKWISE_HOSTS is an exact host allowlist, not wildcard or suffix matching; accepts HTTPS only, no credentials/nondefault port.
- One shared URL validator enforces the same outbound policy in recommendation and redirect paths.
- Decision eligibility remains a separate gate for currency, price, stock, verified commission, specs, freshness.

## SEO and release
- FITMATCH_PUBLIC_LAUNCH defaults off.
- FITMATCH_PUBLIC_ORIGIN must be an HTTPS origin with no path, query, credentials or port.
- With gate off: metadata noindex/nofollow, robots disallow, empty sitemap.
- With gate on: metadata index/follow, canonical root and sitemap URLs are published.
- Changing environment variables alone is NOT approval to release: privacy copy, offer audit and legal/compliance checks must pass before flag is set.

## API
POST /api/recommend: only eligible AND outbound-safe offers (max 3), no redirects created from untrusted client URLs.
GET /api/out?id=<id>: fail closed on unknown offer, absent allowlist or invalid host.
GET /api/status: derive monetizedOffers from real eligible + outbound-safe catalog entries, no secrets or full records.

## Rollback
Revert PR/commit; unset FITMATCH_PUBLIC_LAUNCH; retain Vercel deployment protection. No database migrations.
