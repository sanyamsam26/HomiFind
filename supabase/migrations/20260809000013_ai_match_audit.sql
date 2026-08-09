CREATE TABLE IF NOT EXISTS public.ai_match_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  scoring_version TEXT NOT NULL,
  match_score NUMERIC(5,2) NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  component_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  tradeoffs JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_match_events_user_created
  ON public.ai_match_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_match_events_property
  ON public.ai_match_events(property_id);

ALTER TABLE public.ai_match_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_match_events_own_read"
ON public.ai_match_events FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "ai_match_events_own_insert"
ON public.ai_match_events FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());
