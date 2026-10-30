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
