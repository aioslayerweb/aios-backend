CREATE TABLE public.organization_memberships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    status text NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'active', 'suspended', 'revoked')),
    role text NOT NULL
        CHECK (role IN ('org_admin', 'member')),
    created_by uuid,
    updated_by uuid,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT organization_memberships_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT organization_memberships_organization_id_fkey
        FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE RESTRICT,
    CONSTRAINT organization_memberships_created_by_fkey
        FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT organization_memberships_updated_by_fkey
        FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT organization_memberships_user_organization_key
        UNIQUE (user_id, organization_id)
);

CREATE INDEX organization_memberships_user_status_idx
    ON public.organization_memberships (user_id, status);

ALTER TABLE public.organization_memberships ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.organization_memberships FROM PUBLIC, anon, authenticated, service_role;
GRANT SELECT ON public.organization_memberships TO service_role;

CREATE TABLE public.organization_membership_audit (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    membership_id uuid,
    user_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    actor_user_id uuid,
    event_type text NOT NULL
        CHECK (event_type IN ('created', 'status_changed', 'role_changed', 'status_and_role_changed')),
    previous_status text,
    new_status text NOT NULL,
    previous_role text,
    new_role text NOT NULL,
    changed_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT organization_membership_audit_membership_id_fkey
        FOREIGN KEY (membership_id)
        REFERENCES public.organization_memberships(id)
        ON DELETE SET NULL,
    CONSTRAINT organization_membership_audit_actor_user_id_fkey
        FOREIGN KEY (actor_user_id) REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX organization_membership_audit_user_changed_idx
    ON public.organization_membership_audit (user_id, changed_at DESC);

ALTER TABLE public.organization_membership_audit ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.organization_membership_audit FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.organization_membership_audit FROM service_role;
GRANT SELECT ON public.organization_membership_audit TO service_role;

CREATE FUNCTION public.set_organization_membership_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.set_organization_membership_updated_at() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER organization_memberships_set_updated_at
    BEFORE UPDATE ON public.organization_memberships
    FOR EACH ROW
    EXECUTE FUNCTION public.set_organization_membership_updated_at();

CREATE FUNCTION public.audit_organization_membership_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
DECLARE
    actor_id uuid;
    change_type text;
BEGIN
    IF TG_OP = 'INSERT' THEN
        actor_id := COALESCE(auth.uid(), NEW.created_by);
        change_type := 'created';

        IF actor_id IS NULL THEN
            RAISE EXCEPTION 'Membership creation requires an audit actor';
        END IF;

        INSERT INTO public.organization_membership_audit (
            membership_id,
            user_id,
            organization_id,
            actor_user_id,
            event_type,
            new_status,
            new_role
        ) VALUES (
            NEW.id,
            NEW.user_id,
            NEW.organization_id,
            actor_id,
            change_type,
            NEW.status,
            NEW.role
        );
        RETURN NEW;
    END IF;

    IF OLD.status IS DISTINCT FROM NEW.status
        OR OLD.role IS DISTINCT FROM NEW.role THEN
        actor_id := COALESCE(auth.uid(), NEW.updated_by);

        IF actor_id IS NULL THEN
            RAISE EXCEPTION 'Membership changes require an audit actor';
        END IF;

        IF OLD.status IS DISTINCT FROM NEW.status
            AND OLD.role IS DISTINCT FROM NEW.role THEN
            change_type := 'status_and_role_changed';
        ELSIF OLD.status IS DISTINCT FROM NEW.status THEN
            change_type := 'status_changed';
        ELSE
            change_type := 'role_changed';
        END IF;

        INSERT INTO public.organization_membership_audit (
            membership_id,
            user_id,
            organization_id,
            actor_user_id,
            event_type,
            previous_status,
            new_status,
            previous_role,
            new_role
        ) VALUES (
            NEW.id,
            NEW.user_id,
            NEW.organization_id,
            actor_id,
            change_type,
            OLD.status,
            NEW.status,
            OLD.role,
            NEW.role
        );
    END IF;

    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.audit_organization_membership_change() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER organization_memberships_audit_changes
    AFTER INSERT OR UPDATE ON public.organization_memberships
    FOR EACH ROW
    EXECUTE FUNCTION public.audit_organization_membership_change();
