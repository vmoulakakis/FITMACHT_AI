# FITMATCH NEXT — DESIGN.md
Version: 2026-10-30 · Branch: feat/fitmatch-next-human-movement-20261030
Owner: FITMATCH AI · Review PR staging only.

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
- Preview lives at /next, noindex. Legacy / and commerce APIs unchanged.
- No claim of clinical efficacy; clinical routes display education/referral rather than autonomous rehab prescriptions.
- Historical products are labelled historical, without checkout buttons.
- Current commission verification remains a separate canonical gate in the existing API.
- Staging publication requires visual QA at 320, 375, 430, 768, 1440, 1920 viewport widths, reduced motion, keyboard and screen reader.
- Later production launch requires safety, accessibility, privacy and regulatory review by qualified professionals.
