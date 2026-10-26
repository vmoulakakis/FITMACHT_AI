# Repository Agent Instructions

Before changing code read project README, local security, design and existing architecture contracts. Preserve existing requirements, production permissions, and traceability.

## Agentic Development Lifecycle (ADLC) — required for substantive changes

Read `skills/agentic-development-lifecycle/SKILL.md` before new features, debugging, refactors, AI/agent or cloud/CI changes, data integrations, migrations and release/incident work. Use the traceable **intent → spec → plan → code/tests → independent review/approval → deployment → production signals** workflow, scaled to risk. This is a local adapter to the canonical MyAgenticTeam method; all existing product-specific skill contracts, security restrictions and deployment controls remain in force. No high-impact autonomous production action without explicit scoped authorization; do not claim GREEN without operational evidence.

## Mandatory design-engineering skills for all FitMatch frontend work
Every future UI, UX, interaction, motion, React component, accessibility or styling change MUST read and apply:
1. Canonical `vmoulakakis/Myagenticteam/skills/web-design-intelligence/SKILL.md`
2. Supporting `vmoulakakis/Myagenticteam/skills/ui-craft-quality/SKILL.md`
3. FitMatch's own `DESIGN.md`
4. `vmoulakakis/Myagenticteam/skills/solution-first-product/SKILL.md` for any recommendation/empty-state decision flow.

Retrieve the canonical skill content with the connected authenticated GitHub connector or a verified synced workspace copy before editing. A URL by itself is not an installed skill. If retrieval is unavailable, apply the self-contained local adapter in `skills/ui-craft-quality/SKILL.md` and record the gap. Always follow ADLC above.

FitMatch's explicit product UX: React + AJAX step transitions, no scroll-driven funnel, an optional demand-loaded Three.js room visual with accessible CSS fallback; never sacrifice keyboard/zoom/motion/mobile support merely to enforce a physical no-scroll rule. Do not change Linkwise gate, RLS, production configuration or affiliate attribution for visual reasons.
