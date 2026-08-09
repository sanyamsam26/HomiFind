-- ============================================================================
-- MIGRATION 10: RENTER AI ONBOARDING FIELDS
-- Aligns the persistence model with the HomiFind preference journey.
-- ============================================================================

ALTER TABLE public.user_preferences
  ADD COLUMN IF NOT EXISTS workplace TEXT,
  ADD COLUMN IF NOT EXISTS travel_mode TEXT,
  ADD COLUMN IF NOT EXISTS lifestyle TEXT,
  ADD COLUMN IF NOT EXISTS custom_description TEXT,
  ADD COLUMN IF NOT EXISTS has_completed_onboarding BOOLEAN NOT NULL DEFAULT FALSE;
