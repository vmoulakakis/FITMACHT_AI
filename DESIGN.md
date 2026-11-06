# FITMATCH NEXT — DESIGN.md
Version: 2026-10-30 · Branch: feat/fitmatch-next-human-movement-20261030
Owner: FITMATCH AI · Review PR staging only.

## 2026-11-07 integrated-home addendum
Release candidate on redesign/fitmatch-experience-20261107. The original / buying advisor is preserved at /equipment; the public-home replacement is staging-only and requires explicit release review. The /next and /next/360 journeys remain present and unchanged.
Design system for the new home: deep navy #102F37, dark teal #15363D, lime #D6F7A8, coral #EF9276, warm paper #FAFBF7, muted sage #EAF3ED; Noto Sans Greek-capable text and Manrope brand. Original SVG isometric room illustration, educational FitCheck with 9 deterministic states, accessible selection controls and responsive 320–1440px layout. See docs/FITMATCH_REDESIGN_20261107.md.
No LLM is represented as active; trust and data gates remain explicit.

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
