# Spec — FITMATCH-UI-20261107
Implementation: new client component EditorialHome, scoped stylesheet and minimal hook-up to existing Advisor; do not modify backend offer gate.
Contract: onStart begins unchanged questionnaire; onStartGoal sets initial goal before showing same six stages. Preserve /api/recommend, /api/out, /products, /methodology, /privacy and /mikromove. Use no new runtime dependencies.
Trust: all featured candidates are labelled historical, non-clickable; if no data, show verification-empty state. All dimensions in floor-plan concept are illustrative only.
Privacy/security: no new telemetry, persistence, login, PII, external inference or changes to secrets.
Accessible: native mobile navigation, button affordances, aria-pressed goal selection, focus and reduced motion styles.
