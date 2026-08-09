-- ============================================================================
-- MIGRATION 09: APPLICATION SCHEMA ALIGNMENT
-- Keeps the database contract aligned with the current HomiFind product flow.
-- ============================================================================

-- Multi-workspace accounts: one auth user can enable renter/owner/broker workspaces.
CREATE TABLE IF NOT EXISTS public.user_workspaces (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  workspace TEXT NOT NULL CHECK (workspace IN ('renter', 'owner', 'broker')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, workspace)
);

CREATE INDEX IF NOT EXISTS idx_user_workspaces_user ON public.user_workspaces(user_id, is_active);

ALTER TABLE public.user_workspaces ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own workspaces" ON public.user_workspaces;
CREATE POLICY "Users manage own workspaces"
  ON public.user_workspaces FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP TRIGGER IF EXISTS set_user_workspaces_updated_at ON public.user_workspaces;
CREATE TRIGGER set_user_workspaces_updated_at
  BEFORE UPDATE ON public.user_workspaces
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- The onboarding UI stores these richer renter preferences.
ALTER TABLE public.user_preferences
  ADD COLUMN IF NOT EXISTS profile_type TEXT,
  ADD COLUMN IF NOT EXISTS min_budget NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS max_budget NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS workplace TEXT,
  ADD COLUMN IF NOT EXISTS travel_mode TEXT,
  ADD COLUMN IF NOT EXISTS lifestyle TEXT,
  ADD COLUMN IF NOT EXISTS custom_description TEXT,
  ADD COLUMN IF NOT EXISTS has_completed_onboarding BOOLEAN NOT NULL DEFAULT FALSE;

-- Keep the structured budget columns useful for future service-side matching.
UPDATE public.user_preferences
SET min_budget = COALESCE(min_budget, min_price),
    max_budget = COALESCE(max_budget, max_price)
WHERE min_budget IS NULL OR max_budget IS NULL;

-- The current owner upload flow stores a primary image URL on the listing.
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS primary_image_url TEXT;

CREATE INDEX IF NOT EXISTS idx_properties_available_rent_city
  ON public.properties(city, rent_price)
  WHERE deleted_at IS NULL AND status = 'available';
