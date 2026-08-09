-- ============================================================================
-- MIGRATION 09: USER WORKSPACES
-- A single HomiFind account can use more than one product experience.
-- profiles.role remains the primary/default role for backward compatibility.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_workspaces (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  workspace public.user_role NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  PRIMARY KEY (user_id, workspace),
  CONSTRAINT user_workspaces_allowed_roles
    CHECK (workspace IN ('renter', 'owner', 'broker'))
);

CREATE INDEX IF NOT EXISTS idx_user_workspaces_user
  ON public.user_workspaces(user_id)
  WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_user_workspaces_workspace
  ON public.user_workspaces(workspace)
  WHERE is_active = TRUE;

DROP TRIGGER IF EXISTS set_user_workspaces_updated_at ON public.user_workspaces;
CREATE TRIGGER set_user_workspaces_updated_at
  BEFORE UPDATE ON public.user_workspaces
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.user_workspaces ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users can read their workspaces" ON public.user_workspaces;
CREATE POLICY "users can read their workspaces"
  ON public.user_workspaces
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users can create their workspaces" ON public.user_workspaces;
CREATE POLICY "users can create their workspaces"
  ON public.user_workspaces
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users can update their workspaces" ON public.user_workspaces;
CREATE POLICY "users can update their workspaces"
  ON public.user_workspaces
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Backfill the existing primary role so current users immediately have a workspace.
INSERT INTO public.user_workspaces (user_id, workspace)
SELECT id, role
FROM public.profiles
WHERE role IN ('renter', 'owner', 'broker')
ON CONFLICT (user_id, workspace) DO NOTHING;
