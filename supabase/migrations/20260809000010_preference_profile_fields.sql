-- ============================================================================
-- MIGRATION 10: RENTER AI ONBOARDING FIELDS
-- Aligns persistence with the HomiFind preference journey while preserving
-- the normalized search fields already present in user_preferences.
-- ============================================================================

ALTER TABLE public.user_preferences
  ADD COLUMN IF NOT EXISTS min_budget NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS max_budget NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS workplace TEXT,
  ADD COLUMN IF NOT EXISTS travel_mode TEXT,
  ADD COLUMN IF NOT EXISTS lifestyle TEXT,
  ADD COLUMN IF NOT EXISTS custom_description TEXT,
  ADD COLUMN IF NOT EXISTS has_completed_onboarding BOOLEAN NOT NULL DEFAULT FALSE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'check_pref_budget_range'
      AND conrelid = 'public.user_preferences'::regclass
  ) THEN
    ALTER TABLE public.user_preferences
      ADD CONSTRAINT check_pref_budget_range
      CHECK (max_budget IS NULL OR min_budget IS NULL OR max_budget >= min_budget);
  END IF;
END $$;
