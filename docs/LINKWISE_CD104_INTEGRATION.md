# Linkwise CD104 -> FitMatch AI (staging import)

## Scope
This is the exact **Linkwise CD104, programs-all, JSON** feed supplied by the project owner. It is a **candidate-discovery source**, not proof of merchant permission, live stock, product dimensions or commission. Nothing here connects to Awin.

**Current facts:** The live response was not sampled successfully: a content extractor returned `content_too_large`, and an anonymous web fetch could not inspect the JSON body. The column list includes `product_id,model_name,product_name,description,category,brand_name,tracking_url,thumb_url,image_url,in_stock,availability,valid_from,valid_to,on_sale,currency,price,full_price,discount,city,times_bought,longitude,latitude,address,size,colour,custom,extra_images`, but **not** `program_id` or `program_name`. Never invent the program or merchant from brand.

## Import (trusted worker/local only)
1. Check that the user is authorized to process the feed and display product images.
2. Set `LINKWISE_FITMATCH_FEED_URL` to the **exact supplied URL**, in a secure local environment or secret store. Do not commit its value, paste it into a public `NEXT_PUBLIC_*` variable or expose it to browsers.
3. `npm install && npm run linkwise:audit`
4. Inspect counts in the CLI output and the private `.fitmatch-private/linkwise-cd104-candidates.jsonl.meta.json`.
5. Use `npm run dev` and complete the consultant to see **up to three clearly UNVERIFIED staging previews**. The preview reads a private on-disk file, max 30 MB, not browser-side JSON. It never returns `trackingUrl` or adds purchase CTAs.

The import handles very large feeds as streaming JSON, buffers one array item at a time, captures only a bounded number of category candidates, de-duplicates (program + product ID), and writes an atomic, gitignored 0600 private snapshot. It rejects non-HTTPS source URLs, unexpected redirects, invalid price/currency/expired rows, oversized item objects and truncated data. Large snapshots must be processed outside serverless request lifecycles; there is **no automatic background schedule or deployment** in this PR.

## Accepted candidate categories
- Walking pads
- Treadmills for running
- Exercise bikes
- Adjustable dumbbells
- Resistance bands

This classifier is intentionally conservative, excludes obvious parts/accessories, and does **not** validate product specifications. Human-review the category mapping, false positives/negatives and exact SKU identity before production.

## What remains gated
- Confirm merchant program IDs and per-program permissions: the selected source feed currently omits required fields; request a new feed column selection including program IDs or join via a trusted approved mapping.
- Validate retailer identity, source permissions, actual stock, current price, specs, dimensions, image usage rights and tracking URL allowlist.
- Approved product projections should remain owned by `vmoulakakis/Socialmarket`. Only approved records flow to FitMatch's existing `eligible()` and `/api/out` purchase path.
- Do not treat `times_bought` as a review rating or `in_stock` as guaranteed stock; do not derive commissions from raw price or unknown terms.
- FitSpace 3D fit verdict remains unavailable until verified dimensions and spatial calibration are provided.
- The GitHub staging app is not proven to back the user's live ChatGPT Site. This PR does **not** update that site, add secrets, or publish production.

## QA plan
`npm test && npm run typecheck && npm run build` and verify small fixture, large stream, UTF-8 chunk boundaries, wrapped JSON arrays, expired data, duplicates, malicious URL, unavailable feed and empty preview. Check desktop and mobile previews, no unverified merchant links, reduced-motion behavior and anonymous access before approving release.

Status: **IMPLEMENTED IN REVIEW BRANCH, NOT PRODUCTION VERIFIED**.

## Permanent preview catalog / production contract (2026-10-29)

Isolated table `public.fitmatch_feed_candidates` is created in the existing Supabase vmdb project and protected by RLS. Only `preview_state='preview'`, in-stock, younger-than-48h product preview rows are readable by public publishable-key clients. Raw tracking URLs, merchant terms and private keys are **not stored** here.

Vercel project `fitmatch-ai` uses the **publishable** key via `FITMATCH_PUBLIC_CATALOG_URL` and `FITMATCH_PUBLIC_CATALOG_KEY` in preview/production; the code does not allow privileged writes from the website.

Two-stage import (trusted worker only):
1. `npm run linkwise:audit` using `LINKWISE_FITMATCH_FEED_URL` privately; inspect parse counts and category relevance before any publication.
2. `npm run linkwise:publish-previews` using a short-lived, **server-only**, authorized `FITMATCH_IMPORT_SUPABASE_URL` and `FITMATCH_IMPORT_SUPABASE_SERVICE_ROLE_KEY`. **Never add this key to the website's Vercel variables, GitHub source or any browser.** Only sanitized unverified discovery metadata is upserted.
3. Run the public `/api/status` smoke. Fresh RLS data must be present for preview items to show; the app cannot conjure it from an empty or stale database.

The supplied Linkwise URL currently omits program_id and merchant identity. Product previews must not be promoted to verified purchase CTAs without authoritative identity, dimension specs, currency, stock, permissions and verified program terms. Source snapshots expire naturally at 48h in RLS.

**Known remaining issue:** No completed full-feed snapshot or populated fresh preview table has been verified in this session. A successful Vercel build alone does not make the source ingestion operational. Also this Vercel deployment is independent of the ChatGPT Site `fitmatch-home-advisor.vmoulakakis.chatgpt.site`.


## Niche coverage audit (29 October 2026)
The previous FitMatch UI published **14 / 36** stored fitness candidates, not the entire Linkwise affiliate network. The existing Supabase sources have separate populations:
- `commerce_feed_eligible_offers`: 3,921 legacy records, 2,036 with `expected_commission_eur >= 10`, last observed 17 September 2026; these are predominantly home furnishings, not home-fitness items. This estimate is **not** verified payout.
- `ai_product_offers`: 1,466 AliExpress offers, 481 with `expected_commission_eur >= 10`, overwhelmingly unrelated categories.
- `fitmatch.offer_candidates`: 36 actual fitness SKUs observed 22 October 2026; all have `review_status=needs_commission`. Mybrand.shoes historical 8% applies to 29 rows, Z-mall historical 6% to 7. Both lack verified Linkwise program-ID crosswalk and current category-specific terms.
- `fitmatch.source_readiness`: 0 verified specs, 0 legacy active-in-stock offers, 17 program IDs present in a different global source, 334 merchant commission records, but none establishes approved individual FitMatch payout.
Therefore **do not turn expected_commission_eur into verifiedCommissionEur** and never present 2,036 broad-category estimated payouts as 2,036 home fitness products.

### Immediate inventory repair
The isolated public historical projection now includes **32 true home-fitness SKUs** across six categories: resistance bands, stationary bikes, treadmills, adjustable and fixed dumbbells, and weight benches. Four ambiguous/irrelevant SKUs remain excluded. All retain the 22 October 2026 timestamp; stock and commission are unverified.
A new `/products` browser enables category, budget and text search in paginated cards with real product imagery; the guided advice remains the primary purchase decision experience.

### Dedicated bulk ingestion
The `.github/workflows/fitmatch-feed-sync.yml` GitHub Actions worker streams the owner-provided large CD104 feed on a dedicated runner (not Supabase Edge or Vercel Lambda). It reads **GitHub encrypted secrets**, not browser configuration:
- `FITMATCH_LINKWISE_FEED_URL` (full owner-authorized URL; never commit it in the repo)
- `FITMATCH_IMPORT_SUPABASE_SERVICE_ROLE_KEY` (only available to the runner)
- GitHub Actions variable `FITMATCH_IMPORT_SUPABASE_URL` pointing to the owned vmdb Supabase project
- Set GitHub Actions variable `FITMATCH_FEED_SYNC_ENABLED=true` after an initial successful reviewed manual run to enable scheduled sync.
No secret values are presently confirmed as configured for this GitHub workflow, so **scheduled ingestion is opt-in and not yet active**. The pipeline rejects an empty candidate set or an exceeded candidate cap; partial feeds may never be labeled complete. Preview records do not contain tracking links or commission evidence.

### What is still required for true 10+ EUR monetized offers
Current Linkwise membership per merchant, program ID, category terms, exclusions, VAT/commission basis, fresh stock/price and product dimensions/weight specifications must be verified. A tracked link alone is not proof of an approved commission. The user-facing /api/out stays closed to unapproved products.
