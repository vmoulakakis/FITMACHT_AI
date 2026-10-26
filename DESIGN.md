# FitMatch AI — DESIGN.md
Version: provisional 1.0 — 2026-10-26
Owner: FitMatch product/frontend. Source: Myagenticteam web-design-intelligence + ui-craft-quality.

## Outcome
Greek consumer decision tool (not a shop). One primary action per viewport: describe problem -> six-step qualification -> category recommendation -> verified offers or practical self-help alternative. Priority: trustworthy fit, accessibility and affiliate compliance over visual spectacle.

## Art direction
"Quiet engineered confidence": restrained evergreen, lime accents, warm pale surfaces, precise Greek copy, clear price/evidence treatment; no generic AI gradients, fictitious inventory, countdown urgency, fake social proof or unexplained animations.
Tokens already in app/globals.css: --ink, --muted, --green, --lime, --cream, --line. Type DM Sans / Manrope with Arial fallback; verify Greek glyph reflow at 200% zoom.

## Navigation and components
Viewport app shell, three home tabs (Αρχική, Πώς λειτουργεί, Γιατί FitMatch), six sequential decision steps, results tabs (Η σωστή λύση / Ελεγμένα προϊόντα). React state changes and fetch('/api/recommend') update in place; no scroll-driven journey or forced full-page reload. Overflow is permitted *inside current view* at short viewport heights, on phones and under 200% zoom so text and controls never clip. Keyboard focus, readable labels, 44px targets for major actions, disabled/loading/error state.
- Product cards only when eligibility, current price, stock, independently evidenced commission and verified outbound tracking all pass.
- If none: show the reason in consumer language, a useful checklist/alternative and no fake CTA.
- Outbound transfers must transparently disclose merchant/affiliate nature.

## Spatial artwork
Optional Three.js schematic exercise-space scene activated by user only, lazy loaded on demand on supported non-reduced-motion devices; no third-party 3D assets, no precise size claims. CSS illustration stays as fallback. Library three@0.186.1 MIT. No WebGL in critical decision path.

## Verification/release
Run npm test; npm run typecheck; npm run build; inspect 390px, 768px, 1440px, 200% zoom, keyboard, reduced motion, loading/empty/error, network and layout overflow before approving. Release remains NOINDEX and no production promotion until source audit, stage E2E, legal/privacy and owner signoff. Browser screenshots and field Web Vitals not yet collected.
