# FITMATCH NEXT — UX-CONTRACT.md
## Screen transitions
home -> barrier -> duration -> safety -> result. Backwards navigation preserves current answers. Reset clears answers, commitments and verified-offer response. No free-text medical input.
## Safety state
urgent -> ONLY emergency callout, no habit actions or product previews. professional -> no automatic activity instructions, no commercial equipment. wellness -> informational habit assistance and optionally existing verified-offer API.
## Data
No health-related answers persisted or sent to API. Existing /api/recommend receives only generic fitness goal, space, noise, activity, price budget, fold flag, not pain or clinical state.
Preview catalog fetch is read-only; historical records carry no purchase links or current-price claims. Offers API is fail-closed in its existing eligibility gates.
## Failure states
If offer API fails or returns no items, show no-purchase statement. User may reset. No empty fake product cards.
## Accessibility / privacy
Semantic nav, buttons, headings, labels, text alternatives, focus visibility, reduced motion, keyboard support. No analytics consent assumption. No treatment or diagnostic claim.
## Acceptance
- Stable hydration; verified responsive layouts.
- All transitions reachable with keyboard.
- No clinical/commercial leakage.
- No public indexing of preview route.
- Test red-path and compound barrier cases.
- No changes to production home/old APIs until reviewed.

## FITMATCH 360 funnel and reports
Existing /next journey carries need, barrier, minutes and safety to /next/360. Route asks only movement environment, general dietary preference, and optional product budget. The new report always has distinct movement/nutrition/product sections, but in clinical routes does not invent trainer-approved exercise or registered-dietitian medical diets. Product lane shows 3–5 live verified offers when supply exists, no historical candidates as available offers. User chooses a single featured offer; the PDF may list up to five verified offers.
PDF A4 is rendered client-side with original source photos only where CORS permits, linked image and real QR code targeting the exact verified HTTPS tracking URL. Absent verified URL means NO QR or purchase CTA. Users may download without email.
Email delivery is opt-in and wellness-only, with Turnstile verification, verified sending domain, server-side Resend API secret, bounded PDF size and NO marketing consent inferred. GDPR health-data cases are blocked from email transmission pending professional/legal review.
Canva is the editable design/reference master, whereas dynamic per-user export uses a separate runtime graphics renderer until a licensed Canva autofill/export integration has been validated. Do not misrepresent the runtime PDF as an official rendered Canva file.
