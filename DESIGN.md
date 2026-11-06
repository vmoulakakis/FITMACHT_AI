# FITMATCH AI — DESIGN.md (v2 · 2026-11-07)

## Authority / visual thesis
**Product truth:** FitMatch AI is an evidence-first fitness equipment buying advisor, not an e-shop and not a substitute for clinical advice. / is the equipment-first entry point. /next and /next/360 remain optional separate lifestyle journeys.
**North Star:** a person identifies a suitably justified equipment category for their own constraints without repeating answers.
**Visual thesis:** "Personal Fit Lab". A confident editorial dark teal interface contrasted with a live, useful consultation card, not decorative AI claims or generic gym stock images.

## Design tokens
- Fjord #102F37: primary brand/hero background.
- Ink #163942: headings, dark surface.
- Lime #D9F6AB: primary action/highlight.
- Coral #EE947A: restrained markers and keyboard-focus adjunct.
- Paper #FAFBF8: readable foundation.
- Mint #EAF3EB: educational surfaces.
- Muted #5C7374, lines #DCE6E0: supporting neutrals.
- Main typography: Greek-coverage Noto Sans; brand Latin font Manrope with system fallback.
- Card radius 12–25px; rounded primary CTA. No fake gradients over images.

## Hierarchy
Header (logo / Fit / how / products / methodology) -> dark hero with one direct interactive consultation -> methodology in 3 stages -> real catalog previews or honest empty state -> decision evidence -> optional movement/360 services -> FAQ -> conversion CTA -> footer.
No more competing equal-priority 2-path choice at the top.

## Interaction
- Two visible, explicit decisions (goal, available space) at first touch. No hidden defaults.
- 9 deterministic explanations but no invented percentages, confidence or recommendations.
- Once answered, direct warm-start to the existing advisor at /equipment?start=1&goal=...&space=..., **step 3 of 6**, with server-side allowlist validation.
- Continue in original advisor with movement type, noise, budget and storage. Original API logic remains unchanged.
- Semantic fieldsets, aria-pressed, progressbar with honest completion, aria-live updates, menu aria-expanded, skip link, focus-visible.
- Failed/absent catalog: noncommercial empty state, no fake products.
- Existing safety/product eligibility fail-closed.

## Responsive and motion
Target 320, 360, 390, 768, 1024, 1440px. Dark editorial split hero on desktop; form stacks on mobile. >=44px tap targets, no horizontal scroll (visual QA still required). Original product images have explicit dimensions and contain fitting. CSS-only motion in decorative circles, reduced-motion disables animation and transitions; safe-area side padding.

## Evidence boundaries
No made-up product rating, price, availability, social proof, SEO ranking, live AI agent or medical claims. Raw Linkwise previews get no checkout link. Verified offers only through existing gated /api routes. No live commercial attribution is promised.

## Release
Staging PR only; GitHub CI typecheck, tests and build required. Browser QA in authenticated Vercel preview is not yet verified. Production domain unchanged. See docs/FITMATCH_REDESIGN_20261107.md.

---
## Legacy /next visual contract (unchanged)
## Creative brief
Greek-first human movement and function platform, not a sports e-shop or an AI physiotherapist. Create dignity and autonomy for adults with diverse abilities, ages and motivations. Every recommendation is useful even without a purchase.

## Identity / visual source
- Signature: humane editorial typography, no full-screen generic gym renders, with a custom vector movement motif, kinetic concentric circles and tactile selection cards.
- Palette: Fjord Ink #173745, Offwhite #F9FAF7, Coral #EC785F, Sky #E9F2F2, Peach #F8EEE8, Lilac #F0EDF4, Mint #E9F1E9.
- Typography: Manrope display (Greek-coverage verify), DM Sans body; fall back to sans-serif; generous readable leading.
- Interaction: CSS-native state transitions and reduced-motion override; do not enable heavy WebGL without evidence that it helps a task.
- Real merchant photos must be shown unchanged with object-fit:contain, never composited as AI-generated product proof.
- Responsive 4→2 cards, 3→1 result solutions. Mobile touch targets >=44px; keyboard focus visible.
- Information hierarchy: Goal / Barrier / Available time / Safety / Three types of support. No forced purchase.
- White space and tint blocks should create confidence, not infantilize adults or medicalize everyday behaviour.

## Production design boundaries
- /next remains noindex preview. Proposed / replacement is isolated on the new redesign branch, while the original advisor is preserved at /equipment. All commerce APIs unchanged. No production deploy without explicit approval.
- No claim of clinical efficacy; clinical routes display education/referral rather than autonomous rehab prescriptions.
- Historical products are labelled historical, without checkout buttons.
- Current commission verification remains a separate canonical gate in the existing API.
- Staging publication requires visual QA at 320, 375, 430, 768, 1440, 1920 viewport widths, reduced motion, keyboard and screen reader.
- Later production launch requires safety, accessibility, privacy and regulatory review by qualified professionals.
