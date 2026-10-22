---
name: affiliate-evidence-gates
description: Perform Linkwise / SocialMarket affiliate contract, stock, product-source, payout and conversion safety review before showing purchasable FITMATCH offers.
---
# Affiliate source validation
Use for all catalog, feed import, commission, ranking, outbound redirect and merchant changes.

1. Stream whole feed into private staging with dedup and quarantine; never ship raw feed to browser.
2. Normalize structured program, Greek price and stock codes and record observation timestamp.
3. Linkwise tracking-path program numbers are UNCONFIRMED until API/dashboard joined-program proof.
4. Check approved publisher property, allowed channels, current rate by category, caps, VAT base, exclusions, reversals and eligible commission >=10 EUR. Unknown means UNVERIFIED.
5. Confirm physical fit from primary merchant specs (dimensions and noise ONLY when measured), live stock and accurate price.
6. Publish to RLS-protected verified-offer table only after independent review. No implicit eligibility from high price, historic rates or model guesses.
7. Guard server redirect and attribution; test malicious URL, stale terms, zero results and false stock.
8. Commercial tie-break only between comparably suitable products, never use commission to maximize the buyer-fit score.

Finish with traceable evidence, QA counts and no fabricated product recommendations.
