ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS ai_processing_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (ai_processing_status IN ('pending','processing','ready','failed','needs_review')),
  ADD COLUMN IF NOT EXISTS ai_quality_score NUMERIC(5,2)
    CHECK (ai_quality_score IS NULL OR (ai_quality_score >= 0 AND ai_quality_score <= 100)),
  ADD COLUMN IF NOT EXISTS ai_last_processed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ai_processing_error TEXT;

CREATE INDEX IF NOT EXISTS idx_properties_ai_processing_status
  ON public.properties(ai_processing_status)
  WHERE deleted_at IS NULL;
