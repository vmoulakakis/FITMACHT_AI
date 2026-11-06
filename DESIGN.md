# FitMatch AI — Editorial Performance Design Contract
Version: 2026-11-07. Status: design implementation in review branch.

## Product job
Help a Greek shopper discover the **category** of equipment suited to their stated goals, home constraints and budget, while refusing to imply that historical Linkwise candidates are verified live offers.

## Creative directions considered
1. Neon/gym-tech dashboard — rejected: loud, noisy, undermines consumer trust and Greek reading.
2. Minimal marketplace cards — rejected: duplicates undifferentiated affiliate catalogs.
3. **Editorial fitness planning studio — selected:** the brand feels like an independent advisor, not a store.

## Visual language
- Warm chalk `#f6f5ee`; midnight forest `#142d29`; deep surface `#15362e`; ink-muted `#66736b`; electric botanical `#d4f178`; stroke `#d9dfd4`.
- Use Greek-supporting Noto Sans and Noto Serif (italics) for large, considered editorial headlines.
- Grid: 1280px max with generous section spacing, compact rectilinear modules; 4px surface radius.
- Brand visual: annotated floor-plan studio **explicitly marked as a concept**, not product sizing evidence.
- No generic stock-photo human testimonials, made-up scores, counts, urgency or purchasing claims.

## Information architecture
Hero/one CTA → choose a goal → six-step questionnaire → category recommendation + reasons, cautions and evidence checks → verified offer if any; otherwise historical preview or truthful empty state. Secondary catalog and methodology remain separate. Keep legal, privacy, affiliate pages and the independent MikroMove section untouched.

## State & interaction matrix
| Area | Initial | Interaction | Loading/Empty/Error |
|---|---|---|---|
| Goal cards | walking | keyboard/button selects and highlights one; CTA initializes questionnaire goal | static descriptions; no fake result |
| Questionnaire | step 1 of 6 | back/next and selected radio-like choices | API pending, error message and retry |
| Recommendation | none | read category, reasons, checks, potential offers | historical/unverified distinctly labelled; no invented buy links |
| Product catalog | all | query, category, price filters, pagination | empty results shown |
| Navigation | top links desktop | accessible native details on mobile | all destinations reachable |

## Accessibility & responsive
Widths: 320, 360, 390, 768, 1024, 1440. Mobile menu via native details+summary. Touch targets >=44px on primary actions and navigation; visible keyboard focus; semantic buttons, landmarks and aria-pressed goal choices. Text is Greek-first. Avoid text within imagery; honor reduced motion. The illustrative room visual has explanatory text rather than alleged measurements.

## Data/trust boundaries
Keep `/api/recommend`, `/api/out`, strict offer eligibility, safe outbound allowlist, private feeds and publishing controls. Staging is robots NOINDEX. No LLM credentials configured in existing Vercel environments; call the engine an evidence-based guided advisor, not an autonomous generative AI agent. Human/source validation is still required for affiliate exposure.

## Verification & release gate
Run test, typecheck and Next build, GitHub CI and Vercel preview; review real layouts/interaction if browser tooling is available. Production promotion requires signed-off offer/terms/privacy audit and explicit owner authorization. Status is not Production Verified until production probes pass.
