# FitMatch AI — Design and interaction contract

Updated: 2026-11-07 · Scope: staging-only FitCheck decision-studio increment.

## Product truth
Greek-first problem-solving guide for movement, small-home fitness and careful equipment selection. A recommendation is not a medical diagnosis. Affiliate conversion is secondary to the user's actionable next step. Linkwise/CD104 previews are **not** verified live offers. Purchase links remain behind the separate verified-offer gate.

## Visual thesis
A human-scale editorial **Decision Studio**, not another card-heavy ecommerce storefront. Signature: the dark-forest / warm-paper two-panel FitCheck workspace, with a singular amber signal marker and an explicit trust state on the response. No fabricated "AI confidence" meters, testimonials, performance claims or stock status.

## Tokens and type
- Ink / deep forest: `#193629` / `#12392c` — navigation and the editorial panel.
- Background / paper: `#f8faf5` / `#fffdf7` — clear reading surfaces.
- Sage / lime: `#bde787` — supporting highlights and active state.
- Clay / coral: `#e8a07b` — warm CTA emphasis, only where clarity improves.
- Border: `#e3eae1`, text-muted: `#627366`; verify contrast in the rendered browser.
- Manrope for headlines, DM Sans for utility text, with sans-serif Greek fallback.
- No mandatory WebGL, no scroll hijacking. Preserve sensible reduced-motion fallback.

## Interaction state matrix
| Component | Default | Working | Success | Failure | Keyboard / mobile |
|---|---|---|---|---|---|
| FitCheck text form | empty examples, consent unchecked | CTA disabled, no duplicate submit | 3-step plan, question, provenance | inline alert, retry preserves input | labelled input, native submit, touch >=44px |
| AI classifier | no consent => deterministic | single bounded server call | controlled enum only | safe rules fallback | no UI dependency |
| Health guard | detects concerns | deterministic override | no shopping CTA and professional-care caveat | never bypassed by model | language-safe |
| Six-stage equipment quiz | prior working flow | async recommendation | verified offers or clearly labelled previews | retry/error notice | focus states and ARIA selection |
| Affiliate redirect | server-resolved verified ID | eligibility checked | allowlisted host only | deny invalid or stale record | no raw tracking URL in DOM |

## Responsive and quality gates
Review 320, 360, 390, 768, 1024, 1440 CSS px, 200% zoom, keyboard, screenreader names, reduced motion, loading, empty, API error, and actual affiliate/preview distinction. CI typecheck/test/build are mandatory; live browser and model/provider verification separately required. No production publishing without owner signoff, feed verification and gateway cost/rate limits.

## Existing routes/behaviour that must remain
`/`, `/products`, `/methodology`, `/privacy`, `/mikromove`, `/api/recommend`, `/api/out`, `/api/status`; non-indexed staging, fail-closed feed/commission/spec gates, existing Linkwise branding and affiliate rules.
