-- ============================================================================
-- MIGRATION 10: OWNER <-> BROKER PROPERTY MANAGEMENT
-- A broker manages a property on behalf of its owner; ownership never changes.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.property_broker_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  broker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  agency_id UUID REFERENCES public.agencies(id) ON DELETE SET NULL,
  role_in_listing TEXT NOT NULL DEFAULT 'agent'
    CHECK (role_in_listing IN ('agent', 'manager')),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('pending', 'active', 'revoked')),
  permissions JSONB NOT NULL DEFAULT '{"edit_listing":true,"manage_leads":true,"manage_visits":true,"manage_applications":true}'::jsonb,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT property_broker_owner_distinct CHECK (owner_id <> broker_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_active_property_broker
  ON public.property_broker_assignments(property_id, broker_id)
  WHERE status IN ('pending', 'active') AND deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_property_broker_assignments_property
  ON public.property_broker_assignments(property_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_property_broker_assignments_owner
  ON public.property_broker_assignments(owner_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_property_broker_assignments_broker
  ON public.property_broker_assignments(broker_id) WHERE deleted_at IS NULL;

CREATE OR REPLACE TRIGGER set_property_broker_assignment_updated_at
  BEFORE UPDATE ON public.property_broker_assignments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Keep the legacy denormalized broker_id field in sync for fast discovery.
CREATE OR REPLACE FUNCTION public.sync_property_broker_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' AND NEW.deleted_at IS NULL THEN
    UPDATE public.properties
    SET broker_id = NEW.broker_id,
        agency_id = COALESCE(NEW.agency_id, agency_id),
        updated_at = NOW()
    WHERE id = NEW.property_id AND owner_id = NEW.owner_id;
  ELSIF (NEW.status IN ('revoked') OR NEW.deleted_at IS NOT NULL)
        AND NOT EXISTS (
          SELECT 1 FROM public.property_broker_assignments pba
          WHERE pba.property_id = NEW.property_id
            AND pba.status = 'active'
            AND pba.deleted_at IS NULL
            AND pba.id <> NEW.id
        ) THEN
    UPDATE public.properties
    SET broker_id = NULL, updated_at = NOW()
    WHERE id = NEW.property_id AND owner_id = NEW.owner_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS sync_property_broker_id_trigger ON public.property_broker_assignments;
CREATE TRIGGER sync_property_broker_id_trigger
  AFTER INSERT OR UPDATE ON public.property_broker_assignments
  FOR EACH ROW EXECUTE FUNCTION public.sync_property_broker_id();

ALTER TABLE public.property_broker_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners view their broker assignments"
  ON public.property_broker_assignments FOR SELECT TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Brokers view their assignments"
  ON public.property_broker_assignments FOR SELECT TO authenticated
  USING (broker_id = auth.uid());

CREATE POLICY "Owners create broker assignments"
  ON public.property_broker_assignments FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners manage broker assignments"
  ON public.property_broker_assignments FOR UPDATE TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Existing properties remain owner-owned. If broker_id already exists, create an
-- active management record so the new relationship model is backward-compatible.
INSERT INTO public.property_broker_assignments (property_id, owner_id, broker_id, agency_id, status)
SELECT p.id, p.owner_id, p.broker_id, p.agency_id, 'active'
FROM public.properties p
WHERE p.broker_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.property_broker_assignments a
    WHERE a.property_id = p.id AND a.broker_id = p.broker_id AND a.deleted_at IS NULL
  );
