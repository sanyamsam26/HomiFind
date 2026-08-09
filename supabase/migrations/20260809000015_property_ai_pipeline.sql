ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS ai_processing_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (ai_processing_status IN ('pending','processing','ready','failed','needs_review')),
  ADD COLUMN IF NOT EXISTS ai_quality_score NUMERIC(5,2)
    CHECK (ai_quality_score IS NULL OR (ai_quality_score >= 0 AND ai_quality_score <= 100)),
  ADD COLUMN IF NOT EXISTS ai_last_processed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ai_processing_error TEXT;

CREATE INDEX IF NOT EXISTS idx_properties_ai_processing_status
  ON public.properties(ai_processing_status, updated_at);

CREATE TABLE IF NOT EXISTS public.ai_property_processing_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  stage TEXT NOT NULL CHECK (stage IN ('analysis','embedding','verification','publish')),
  status TEXT NOT NULL CHECK (status IN ('started','completed','failed','needs_review')),
  model_version TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_property_processing_events_property
  ON public.ai_property_processing_events(property_id, created_at DESC);

ALTER TABLE public.ai_property_processing_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_property_processing_owner_read"
ON public.ai_property_processing_events FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.properties p
  WHERE p.id = property_id AND p.owner_id = auth.uid()
));
