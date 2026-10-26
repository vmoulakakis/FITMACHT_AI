# Specification — CHG-20261026-FITMATCH-UX-CONNECTION
- Source: public.fitmatch_verified_offers only; RLS and authenticated evidence requirements unchanged.
- HTTP REST: apikey header for modern sb_publishable_, optional legacy anon Bearer fallback; never use secret/service_role.
- Navigation: state-based home panels, React 6-step advisor, result tabs and AJAX POST /api/recommend; no scroll-bound input. Allow internal overflow at 200% zoom and on short/mobile devices.
- Three.js: opt-in lazy import, 3D schematic room only, no implied actual product fit. Free GPU memory and animation frames on unmount; obey reduced motion.
- Error/zero-result: actionable fit guidance, no internal infrastructure jargon in public interface, no fabricated products.
- Security/rollback: no DB writes, no prod env changes. Revert feature branch and remove scoped preview env variables if required.
