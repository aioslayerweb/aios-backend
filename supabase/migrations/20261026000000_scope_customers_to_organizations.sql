ALTER TABLE public.customers
    ADD COLUMN IF NOT EXISTS organization_id uuid
        REFERENCES public.organizations(id) ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS customers_organization_id_idx
    ON public.customers (organization_id);

DROP POLICY IF EXISTS "Anyone can read customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can insert customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can update customers" ON public.customers;
DROP POLICY IF EXISTS "Anyone can read kpi_metrics" ON public.kpi_metrics;
DROP POLICY IF EXISTS "Authenticated users can insert kpi_metrics" ON public.kpi_metrics;
DROP POLICY IF EXISTS "Authenticated users can update kpi_metrics" ON public.kpi_metrics;
DROP POLICY IF EXISTS "Anyone can read active ai_insights" ON public.ai_insights;
DROP POLICY IF EXISTS "Authenticated users can insert ai_insights" ON public.ai_insights;
DROP POLICY IF EXISTS "Authenticated users can update ai_insights" ON public.ai_insights;
DROP POLICY IF EXISTS "Anyone can view insights" ON public.insights;
DROP POLICY IF EXISTS "Authenticated users can update insights" ON public.insights;

CREATE OR REPLACE FUNCTION public.has_active_organization_membership(
    requested_organization_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.organization_memberships AS membership
        WHERE membership.user_id = (SELECT auth.uid())
          AND membership.organization_id = requested_organization_id
          AND membership.status = 'active'
    );
$$;

REVOKE ALL ON FUNCTION public.has_active_organization_membership(uuid)
    FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_active_organization_membership(uuid)
    TO authenticated;

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.customers FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.customers TO authenticated, service_role;
REVOKE ALL ON public.kpi_metrics FROM PUBLIC, anon, authenticated, service_role;
REVOKE ALL ON public.ai_insights FROM PUBLIC, anon, authenticated, service_role;
REVOKE ALL ON public.insights FROM PUBLIC, anon, authenticated, service_role;

CREATE POLICY "Active organization members can read customers"
    ON public.customers
    FOR SELECT
    TO authenticated
    USING (public.has_active_organization_membership(organization_id));
