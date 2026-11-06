# FIT-001 — Intent
Status: branch implementation, draft review. Date: 2026-11-07.

## User job
A FitMatch visitor expresses a real movement/lifestyle/equipment problem in Greek and receives helpful, safe next steps before entering the existing shopping assessment.

## Baseline evidence
Observed code: six-stage equipment-only quiz, deterministic category selection, SocialMarket consumer with unverified catalog, Linkwise preview only, allowlisted /api/out redirects. Main GitHub project: vmoulakakis/FITMACHT_AI. MyAgenticTeam is governance, not the deployed application.

## Must change
Problem-first intake, actual input-to-plan mechanism, safe optional model routing, verified failure states and responsive art direction. Keep real affiliate conditions intact.

## Must preserve
No fake stock/prices/commission, no medical claims, no secrets in browser, no unapproved production deployment, no Awin; preserve existing routes and NOINDEX.

## Acceptance
1. 12-500-character Greek/English inputs yield a three-step plan; poor inputs are rejected.
2. Health-related concerns block equipment CTA regardless of model selection.
3. External model call requires explicit per-request consent and explicit server flags, and fails over to rules.
4. Existing /api/out commercial gate, six-stage quiz, /products and legal routes remain intact.
5. Tests/typecheck/build green; browser E2E and production remain separately verifiable.
