-- Property verification workflow.
CREATE TABLE IF NOT EXISTS public.property_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewer_notes TEXT,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  UNIQUE(property_id)
);

CREATE INDEX IF NOT EXISTS idx_property_verifications_status ON public.property_verifications(status);
CREATE INDEX IF NOT EXISTS idx_property_verifications_property ON public.property_verifications(property_id);

ALTER TABLE public.property_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owners_view_own_verification"
ON public.property_verifications FOR SELECT TO authenticated
USING (requested_by = auth.uid());

CREATE POLICY "owners_create_own_verification"
ON public.property_verifications FOR INSERT TO authenticated
WITH CHECK (requested_by = auth.uid());
