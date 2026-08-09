-- ============================================================================
-- MIGRATION 07: PGVECTOR SEMANTIC MATCHING RPC FUNCTION
-- Project: HomiFind
-- ============================================================================

CREATE OR REPLACE FUNCTION public.match_properties(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.3,
  match_count int DEFAULT 10,
  filter_min_price numeric DEFAULT NULL,
  filter_max_price numeric DEFAULT NULL,
  filter_bedrooms int DEFAULT NULL,
  filter_city text DEFAULT NULL,
  filter_type public.property_type DEFAULT NULL
)
RETURNS TABLE (
  property_id UUID,
  title TEXT,
  description TEXT,
  property_type public.property_type,
  rent_price NUMERIC(12,2),
  bedrooms INT,
  bathrooms NUMERIC(3,1),
  city TEXT,
  state TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id AS property_id,
    p.title,
    p.description,
    p.property_type,
    p.rent_price,
    p.bedrooms,
    p.bathrooms,
    p.city,
    p.state,
    (1 - (pe.embedding <=> query_embedding))::FLOAT AS similarity
  FROM public.property_embeddings pe
  JOIN public.properties p ON p.id = pe.property_id
  WHERE p.deleted_at IS NULL
    AND pe.deleted_at IS NULL
    AND p.status = 'available'
    AND (1 - (pe.embedding <=> query_embedding)) >= match_threshold
    AND (filter_min_price IS NULL OR p.rent_price >= filter_min_price)
    AND (filter_max_price IS NULL OR p.rent_price <= filter_max_price)
    AND (filter_bedrooms IS NULL OR p.bedrooms >= filter_bedrooms)
    AND (filter_city IS NULL OR LOWER(p.city) = LOWER(filter_city))
    AND (filter_type IS NULL OR p.property_type = filter_type)
  ORDER BY pe.embedding <=> query_embedding ASC
  LIMIT match_count;
END;
$$;
