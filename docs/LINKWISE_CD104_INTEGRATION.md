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
