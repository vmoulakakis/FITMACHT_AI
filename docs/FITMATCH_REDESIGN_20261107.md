# FitMatch AI · Corrective UI/UX Pro Max v2 · 2026-11-07

**Status:** code written in redesign/fitmatch-experience-20261107; CI build gates and Vercel preview per branch; production unchanged. Same draft PR #15.

## Problem severity
P0: The previous 3×3 quick FitCheck returned generic advice then sent the user to /equipment and discarded answers. Fixed using a validated direct warm-start, no repeat of questions 1 and 2.
P1: Previous hero promoted competing wellness/commerce destinations instead of one equipment-first user job. Replaced with a task-first interactive consultation.
P1: Abstract illustration and long marketing copy were not evidence of product value. Replaced hero art with functional evaluation controls and source-authentic catalog previews.
P1: Source candidates must not be presented as live purchasable items. Maintained strict historical/unverified labels and no direct checkout for them.
P2: Responsive nav, labels, tap targets, reduced motion, focus and honest progress were addressed in the UI code but need manual visual verification.

## Design direction comparison
1. Conventional fitness e-commerce grid: rejected because the product has not audited live stock or commission terms.
2. General wellness editorial portal: rejected as the primary home because it obscures equipment matching (existing /next is still available).
3. **Chosen — Personal Fit Lab:** expert-friendly interactive decision interface with clear step progression, dark brand hero, calm readable content and sober live-data disclosures.

## Stack and implementation
Next.js 15, React 19, TypeScript, existing Lucide icon library and plain CSS. No heavy motion framework, no new dependency, no LLM key or API modification.
- components/FitMatchHome.tsx: task-first hero, two labeled decision questions, rich explanation, authentic catalog previews, FAQ and optional service links.
- lib/fitcheck.ts: deterministic 9-state model; URL handoff and allowlist parser.
- app/page.tsx: sanitized real preview data (when available).
- app/equipment/page.tsx: validates incoming parameters; original Advisor remains.
- components/Advisor.tsx: receives only validated goal/space, starts at step 3; rest of journey untouched.
- app/home.css: responsive semantic tokens, mobile menu, 44+ px target sizing, reduced motion.
- tests/fitcheck.test.ts: nine states, changed advice, valid and invalid handoff.

## Evidence status
- GitHub Action run 42312805184: TypeScript, unit tests, build passed at commit cad4090.
- Later modifications require their own CI result. A Vercel READY build is not evidence of visual QA.
- Live public site was inspected with a browser, staging preview redirected to Vercel login. No unauthenticated inspection of updated staging is possible.

## Remaining gates (do not market as done)
- Screenshot QA and responsive layout at six widths.
- Keyboard-only and screen-reader exploratory test, 200% zoom and color contrast.
- Real browser exercise of the advisor handoff to recommendation / data error / no offers.
- Verification of current Linkwise program terms, prices, stock and spec evidence.
- Owner signoff before production merge/promote.

## Rollback
All modifications are on branch redesign/fitmatch-experience-20261107, draft PR #15. Do not merge to main or promote production until approved. Discard the draft PR if rejected; revert PR or roll back Vercel if deployed in the future.
