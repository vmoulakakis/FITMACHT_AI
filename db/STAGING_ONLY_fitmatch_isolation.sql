-- FITMATCH AI isolated namespace in shared VMDB, prepared 2026-10-21.
-- STAGING MIGRATION ONLY; not yet executed. Requires security review and rollback plan.
-- Does not alter existing SocialMarket tables/functions.
BEGIN;
CREATE TABLE IF NOT EXISTS public.fitmatch_verified_offers(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 program_id text NOT NULL,
 source_product_id text NOT NULL,
 merchant_name text NOT NULL,
 title text NOT NULL,
 normalized_category text NOT NULL CHECK(normalized_category IN ('walking-pad','treadmill','exercise-bike','adjustable-dumbbells','resistance-bands')),
 price_eur numeric(12,2) NOT NULL CHECK(price_eur>0),
 currency text NOT NULL DEFAULT 'EUR' CHECK(currency='EUR'),
 tracking_url text NOT NULL CHECK(tracking_url ~ '^https://'),
 image_url text,
 in_stock boolean NOT NULL DEFAULT false,
 last_seen_at timestamptz NOT NULL,
 verified_commission_eur numeric(12,2) NOT NULL CHECK(verified_commission_eur>=10),
 terms_source_url text NOT NULL CHECK(terms_source_url ~ '^https://'),
 terms_verified_at timestamptz NOT NULL,
 spec_evidence_url text NOT NULL CHECK(spec_evidence_url ~ '^https://'),
 specs_verified boolean NOT NULL DEFAULT false,
 approved boolean NOT NULL DEFAULT false,
 reviewed_at timestamptz,
 reviewer_note text,
 CONSTRAINT fitmatch_review_gate CHECK (NOT approved OR (specs_verified IS TRUE AND in_stock IS TRUE AND reviewed_at IS NOT NULL)),
 UNIQUE(program_id,source_product_id)
);
CREATE INDEX IF NOT EXISTS fitmatch_verified_active_idx ON public.fitmatch_verified_offers(normalized_category,last_seen_at DESC) WHERE approved IS TRUE;
ALTER TABLE public.fitmatch_verified_offers ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.fitmatch_verified_offers FROM PUBLIC,anon,authenticated;
GRANT SELECT ON TABLE public.fitmatch_verified_offers TO anon,authenticated;
DROP POLICY IF EXISTS fitmatch_public_verified_read ON public.fitmatch_verified_offers;
CREATE POLICY fitmatch_public_verified_read ON public.fitmatch_verified_offers
 FOR SELECT TO anon,authenticated USING(
  approved IS TRUE AND in_stock IS TRUE AND specs_verified IS TRUE
  AND verified_commission_eur>=10 AND currency='EUR'
  AND last_seen_at<=now() AND last_seen_at>now()-interval '7 days'
  AND terms_verified_at<=now() AND terms_verified_at>now()-interval '30 days'
 );
CREATE TABLE IF NOT EXISTS public.fitmatch_import_runs(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 created_at timestamptz NOT NULL DEFAULT now(),
 source_hash text NOT NULL,
 rows_seen bigint NOT NULL DEFAULT 0,
 rows_valid bigint NOT NULL DEFAULT 0,
 rows_quarantined bigint NOT NULL DEFAULT 0,
 rows_unchanged bigint NOT NULL DEFAULT 0,
 status text NOT NULL CHECK(status IN ('started','checked','failed')),
 notes text
);
ALTER TABLE public.fitmatch_import_runs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.fitmatch_import_runs FROM PUBLIC,anon,authenticated;
CREATE TABLE IF NOT EXISTS public.fitmatch_program_terms(
 program_id text NOT NULL,
 category_id text NOT NULL,
 terms_version text NOT NULL,
 evidence_url text NOT NULL,
 verified_at timestamptz NOT NULL,
 payout_basis text NOT NULL CHECK(payout_basis IN ('gross','net_ex_vat')),
 min_percent numeric(8,4),
 flat_eur numeric(12,2),
 cap_eur numeric(12,2),
 exclusions jsonb NOT NULL DEFAULT '[]'::jsonb,
 active boolean NOT NULL DEFAULT false,
 allowed_marketing boolean NOT NULL DEFAULT false,
 PRIMARY KEY(program_id,category_id,terms_version)
);
ALTER TABLE public.fitmatch_program_terms ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.fitmatch_program_terms FROM PUBLIC,anon,authenticated;
COMMIT;
