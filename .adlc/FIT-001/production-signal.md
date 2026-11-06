# FIT-001 — Production signals
No rollout. Existing production deployment fitmatch-ai-taupe.vercel.app remains separate and untouched by FIT-001.
Do not mark GREEN from CI/build or Vercel READY alone.
Before release: get accessible preview E2E, consent/privacy approval, model cost/rate limit protection, source-data audit, original 6-step and redirect regression, owner signoff. Once deployed, monitor API 400/422 rate, fallback frequency, latency, no-verified-offers rate and blocked out redirects without storing raw user descriptions.
