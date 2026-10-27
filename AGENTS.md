# Repository Agent Instructions

Before changing code read project README, local security, design and existing architecture contracts. Preserve existing requirements, production permissions, and traceability.

## Agentic Development Lifecycle (ADLC) — required for substantive changes

Read `skills/agentic-development-lifecycle/SKILL.md` before new features, debugging, refactors, AI/agent or cloud/CI changes, data integrations, migrations and release/incident work. Use the traceable **intent → spec → plan → code/tests → independent review/approval → deployment → production signals** workflow, scaled to risk. This is a local adapter to the canonical MyAgenticTeam method; all existing product-specific skill contracts, security restrictions and deployment controls remain in force. No high-impact autonomous production action without explicit scoped authorization; do not claim GREEN without operational evidence.

## Universal Creation — cross-agent entrypoint (2026-10-27)
For creation, building, redesign, audit and release, read `.agents/skills/universal-creation-orchestrator/SKILL.md` (or the native Claude skill), then project-specific skills and DESIGN.md. This is a scoped router, not authority to change unrelated code, bypass security/ADLC rules, install tools or deploy. Verify the real result before claiming success.
