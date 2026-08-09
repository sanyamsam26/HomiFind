-- ============================================================================
-- MIGRATION 03: PROPERTIES, EMBEDDINGS & MEDIA
-- Project: HomiFind
-- Includes: Foreign keys, CHECK Constraints, pgvector HNSW index, Full-text index, Soft delete & Audit fields
-- ============================================================================

-- 1. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  broker_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  agency_id UUID REFERENCES public.agencies(id) ON DELETE SET NULL,
  
  title TEXT NOT NULL CONSTRAINT prop_title_length CHECK (char_length(trim(title)) >= 5),
  description TEXT,
  property_type public.property_type NOT NULL DEFAULT 'apartment',
  status public.property_status NOT NULL DEFAULT 'draft',
  
  -- Financial Details & Constraints
  rent_price NUMERIC(12,2) NOT NULL CONSTRAINT check_prop_rent_price CHECK (rent_price > 0),
  deposit_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CONSTRAINT check_prop_deposit CHECK (deposit_amount >= 0),
  utilities_included BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Physical Attributes & Constraints
  bedrooms INT NOT NULL DEFAULT 1 CONSTRAINT check_prop_bedrooms CHECK (bedrooms >= 0),
  bathrooms NUMERIC(3,1) NOT NULL DEFAULT 1.0 CONSTRAINT check_prop_bathrooms CHECK (bathrooms >= 0),
  square_feet INT CONSTRAINT check_prop_sqft CHECK (square_feet IS NULL OR square_feet > 0),
  year_built INT CONSTRAINT check_prop_year CHECK (year_built IS NULL OR (year_built >= 1800 AND year_built <= EXTRACT(YEAR FROM CURRENT_DATE) + 1)),
  is_pet_friendly BOOLEAN DEFAULT FALSE,
  is_furnished BOOLEAN DEFAULT FALSE,
  amenities TEXT[] DEFAULT '{}',
  
  -- Location & Geographic Coordinates
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  latitude DOUBLE PRECISION CONSTRAINT check_prop_lat CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90)),
  longitude DOUBLE PRECISION CONSTRAINT check_prop_lng CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180)),
  
  -- Stats & Flags
  featured BOOLEAN DEFAULT FALSE,
  view_count INT DEFAULT 0 CONSTRAINT check_prop_views CHECK (view_count >= 0),
  
  -- Audit & Soft Delete Columns
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Properties Triggers & Indexes
CREATE TRIGGER set_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Foreign Key & Filter B-Tree Indexes
CREATE INDEX idx_properties_owner_id ON public.properties(owner_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_broker_id ON public.properties(broker_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_agency_id ON public.properties(agency_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_status ON public.properties(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_city_state ON public.properties(city, state) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_rent_price ON public.properties(rent_price) WHERE deleted_at IS NULL;

-- Full-Text Search GIN Index for Title & Description
CREATE INDEX idx_properties_fulltext ON public.properties 
  USING gin (to_tsvector('english', title || ' ' || COALESCE(description, '')))
  WHERE deleted_at IS NULL;


-- 2. PROPERTY EMBEDDINGS TABLE (pgvector for AI Semantic Match)
CREATE TABLE IF NOT EXISTS public.property_embeddings (
  property_id UUID PRIMARY KEY REFERENCES public.properties(id) ON DELETE CASCADE,
  embedding vector(1536) NOT NULL, -- Supports Gemini text-embedding-004 & OpenAI embeddings
  search_document TEXT NOT NULL,
  
  -- Audit Columns
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Property Embeddings Triggers & Vector Index
CREATE TRIGGER set_property_embeddings_updated_at
  BEFORE UPDATE ON public.property_embeddings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- High-Speed Cosine Distance HNSW Index for pgvector
CREATE INDEX idx_property_embeddings_hnsw 
  ON public.property_embeddings 
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);


-- 3. PROPERTY MEDIA TABLE
CREATE TABLE IF NOT EXISTS public.property_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image' CONSTRAINT check_media_type CHECK (media_type IN ('image', 'video', 'floorplan', '3d_tour')),
  caption TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INT NOT NULL DEFAULT 0 CONSTRAINT check_media_order CHECK (display_order >= 0),
  
  -- Audit & Soft Delete Columns
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TRIGGER set_property_media_updated_at
  BEFORE UPDATE ON public.property_media
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_property_media_property_id ON public.property_media(property_id, display_order) WHERE deleted_at IS NULL;


-- 4. SAVED PROPERTIES TABLE (Favorites)
CREATE TABLE IF NOT EXISTS public.saved_properties (
  renter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  
  -- Audit Columns
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  PRIMARY KEY (renter_id, property_id)
);

CREATE INDEX idx_saved_properties_renter ON public.saved_properties(renter_id);
