CREATE TABLE IF NOT EXISTS public.ai_feedback_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('impression','view','save','unsave','visit_request','application','dismiss','share')),
  source TEXT NOT NULL DEFAULT 'recommendation',
  context JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_feedback_user_time ON public.ai_feedback_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_feedback_property ON public.ai_feedback_events(property_id, created_at DESC);

ALTER TABLE public.ai_feedback_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_feedback_own_insert" ON public.ai_feedback_events FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "ai_feedback_own_read" ON public.ai_feedback_events FOR SELECT TO authenticated USING (user_id = auth.uid());
