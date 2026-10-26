# Intent — CHG-20261026-FITMATCH-RELEASE

Date: 2026-10-26

## Baseline (confirmed in GitHub/Vercel)
- Vercel project fitmatch-ai: latest deployment READY does not prove public access.
- Vercel SSO enabled for all except custom domains; 401 from external probe reported, cause needs independent HTTP validation.
- Product remains staging-only and NOINDEX per README; GitHub main must not be implicitly published.
- Catalog imports SocialMarket offers as unverified; affiliate evidence, taxonomy and specs have not been certified.
- Recommendation API can list an otherwise eligible offer whose tracking domain the outbound endpoint rejects.
- /api/status hardcodes monetizedOffers:0; it can drift from actual eligibility in future.
- Historical reports of 35 links and 82 tests are unverified in this audit.

## Objective
Close preventable consistency and SEO-release gaps without exposing production, changing user privacy, inventing offers, or weakening affiliate verification.

## Explicitly excluded
- Changing Vercel SSO, production aliases or public visibility before release acceptance.
- Publishing/merging, Linkwise feed ingestion, merchant-term approval or real commission claims.
- Changing the existing main-branch >=10 EUR commission threshold pending policy reconciliation with newer staging >=20 EUR evidence.
- Changing ranking policy or claiming audited product count.

## Acceptance criteria
1. Only exact configured HTTPS affiliate hosts can be displayed/clicked.
2. Missing host allowlist never leaks offers into recommendations.
3. /api/status counts only genuinely eligible outbound-safe offers, without exposing tracking URLs.
4. Staging crawlers remain blocked; public indexing requires explicit launch flag + valid canonical HTTPS origin.
5. Unit tests and build/typecheck must pass before merge.
6. Public anonymous HTTP journey and checkout redirect validation remain release blockers until observed on deployed target.

Risk: standard code changes, high-risk production publication explicitly blocked.
