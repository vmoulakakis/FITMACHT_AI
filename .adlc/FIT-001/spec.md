# FIT-001 — Specification
Trace: intent.md → spec.md → plan.md → code/tests → review.md → production-signal.md.

## Interfaces
- `POST /api/fitcheck` input `{ issue: string, consentToModel: boolean }`.
- 12..500 chars; return `{plan, processing, commerce, disclaimer}` or JSON error with HTTP 400/413/422.
- Plan has bounded enum `intent`, 3 steps, question, caution, optional goal and an equipmentAllowed flag.

## Architecture
Client FitCheck form → bounded API → deterministic health guard → optional consented OpenAI intent classifier (single call, max output, 4.5s deadline, no persistence) → deterministic plan template → existing six-stage equipment advisor. The model cannot approve commerce or override deterministic health guard.

## Privacy and trust
No direct database writes or custom raw-text logging. No secret in client. User input may reach external provider only with consent and an approved runtime configuration. Browser states must truthfully label whether processing used a model or rules. Deployment gateway must enforce rate and cost limits before enabling public model usage.

## Failure modes
Missing model, invalid model text, timeout or external 5xx → guided rules. Invalid input → structured client error. No verified products → advice and honest preview/no purchase buttons.

## Alternatives and rejection
No open-ended autonomous medical advisor, no fabricated 'AI score', no catalog ingestion from frontend, no generic scraper agents or unvalidated external tracking URLs.
