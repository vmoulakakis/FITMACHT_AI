# FITMATCH AI — Unified Experience Redesign

Change: UI-20261107 · Status: staging review · Production untouched

## Objective
One coherent, Greek-first fitness intelligence experience. A visitor should immediately know where to go:
1. Find equipment suitable for their use / space / noise / budget — /equipment.
2. Explore supportive, non-clinical movement guidance — /next.
3. Explore optional 360° lifestyle planning and PDF — /next/360.

## Routes (no breaking moves)
| Route | Purpose |
| --- | --- |
| / | New design-led navigation, educational FitCheck (components/FitMatchHome.tsx, app/home.css) |
| /equipment | Original six-step equipment matching journey, intact |
| /next | Existing movement guidance, untouched |
| /next/360 | Existing plan and PDF studio, untouched |
| /products | Historical feed review catalog, untouched |
| /methodology | Product/affiliate disclosures, untouched |
| /privacy | Privacy notice, untouched |
| /api/recommend, /api/360/offers, /api/360/email | Existing business logic and safeguards, untouched |

## Art direction
**Concept:** Space intelligence / human choice. The dark editorial landing hero uses an original SVG isometric space diagram, communicating FIT rather than fake AI holograms or stock gym photos.
- Background navy #102F37; dark teal #15363D; lime #D6F7A8; coral #EF9276; warm paper #FAFBF7; muted sage #EAF3ED.
- Typography: Noto Sans with Greek coverage for body and editorial heads; Manrope for Latin branding; system fallbacks.
- Layout: 1370px shell, 1256px content; desktop asymmetrical hero and two intent cards; stacked mobile layout.
- Motion: CSS orbit and hover only; reduced-motion media query disables both.
- Trust: no invented user testimonials, scores, live prices, availability or medical claims.

## Quick FitCheck — interaction states
Client-only and educational. State goal = cardio | strength | mobility; space = compact | medium | open. Each combination selects an explicit deterministic category-level explanation and a practical safety/spec check.
- Controls are buttons with aria-pressed inside labeled fieldsets.
- Result uses aria-live polite; updates as choices change.
- CTA transfers users to the full six-step advisor, which obtains additional answers.
- **Not** a verified product recommendation, diagnosis, or LLM agent.
- No tracking, authentication or persistence of FitCheck answers.

## AI boundary and commerce
A Linkwise feed preview is not proof of stock, fresh price, accurate specs or guaranteed affiliate commission. The unchanged /api/recommend and /api/360/offers apply existing verified gates. No LLM API key was found among the checked Vercel environment variable names; do not advertise a generative conversational advisor as active. A real agent requires credentials, rate limits, input safety and tool-level source verification before activation.

## Acceptance criteria (release blockers)
- [ ] npm run typecheck
- [ ] npm test
- [ ] npm run build
- [ ] Desktop/mobile screenshots inspected at 320, 360, 390, 768, 1024, 1440.
- [ ] Keyboard navigation, focus-visible, 200% zoom, no horizontal scroll.
- [ ] Reduced motion, accessibility verification.
- [ ] Functional path: / -> /equipment -> recommendation, / -> /next/360 -> PDF.
- [ ] No unverified checkout links.
- [ ] Source-data/compliance review and owner approval before production rollout.

## Rollback
Release lives on redesign/fitmatch-experience-20261107, created from feat/fitmatch-next-human-movement-20261030. Until merge/deploy, the public domain is unchanged. To reject version, close the PR. If later deployed, revert PR or roll Vercel back to a confirmed previous deployment.

## Follow-up
Second phase: tool-grounded observable AI advisor using verified merchants. MyAgenticTeam/ADLC gates: intent -> implementation -> tests -> review -> approval -> production signals.
