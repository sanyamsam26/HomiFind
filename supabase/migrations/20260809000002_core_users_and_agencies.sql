-- ============================================================================
-- MIGRATION 02: CORE USERS, PROFILES & AGENCY WORKSPACES
-- Project: HomiFind
-- Includes: Foreign keys, Constraints, Soft delete, Audit columns, Indexes & Triggers
-- ============================================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role NOT NULL DEFAULT 'renter',
  full_name TEXT NOT NULL CONSTRAINT profiles_full_name_check CHECK (char_length(trim(full_name)) >= 2),
  email TEXT NOT NULL UNIQUE CONSTRAINT profiles_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  company_name TEXT,              -- For owners/brokers
  license_number TEXT,            -- For registered real estate brokers
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Audit & Soft Delete Columns
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Profiles Triggers & Indexes
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_profiles_role ON public.profiles(role) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_email ON public.profiles(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_deleted_at ON public.profiles(deleted_at) WHERE deleted_at IS NOT NULL;

-- Function: Retrieve user role safely
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS public.user_role AS $$
  SELECT role FROM public.profiles WHERE id = user_id AND deleted_at IS NULL;
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- 2. USER PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  min_price NUMERIC(12,2) CONSTRAINT check_pref_min_price CHECK (min_price IS NULL OR min_price >= 0),
  max_price NUMERIC(12,2) CONSTRAINT check_pref_max_price CHECK (max_price IS NULL OR max_price >= 0),
  preferred_cities TEXT[] DEFAULT '{}',
  preferred_types public.property_type[] DEFAULT '{}',
  min_bedrooms INT DEFAULT 0 CONSTRAINT check_pref_min_bedrooms CHECK (min_bedrooms >= 0),
  min_bathrooms INT DEFAULT 0 CONSTRAINT check_pref_min_bathrooms CHECK (min_bathrooms >= 0),
  amenities TEXT[] DEFAULT '{}',
  pet_friendly BOOLEAN DEFAULT FALSE,
  preference_vector vector(1536), -- Vector embedding of user lifestyle/needs
  
  -- Audit & Soft Delete Columns
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL,

  CONSTRAINT check_pref_price_range CHECK (max_price IS NULL OR min_price IS NULL OR max_price >= min_price)
);

-- User Preferences Triggers & Indexes
CREATE TRIGGER set_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id) WHERE deleted_at IS NULL;


-- 3. AGENCIES TABLE (Broker workspace groups)
CREATE TABLE IF NOT EXISTS public.agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CONSTRAINT agency_name_length CHECK (char_length(trim(name)) >= 2),
  license_id TEXT UNIQUE,
  logo_url TEXT,
  address TEXT,
  contact_email TEXT CONSTRAINT agency_email_check CHECK (contact_email IS NULL OR contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  contact_phone TEXT,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  
  -- Audit & Soft Delete Columns
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Agencies Triggers & Indexes
CREATE TRIGGER set_agencies_updated_at
  BEFORE UPDATE ON public.agencies
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_agencies_owner_id ON public.agencies(owner_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_agencies_license_id ON public.agencies(license_id) WHERE deleted_at IS NULL;


-- 4. AGENCY MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.agency_members (
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  broker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_in_agency TEXT NOT NULL DEFAULT 'agent' CONSTRAINT check_agency_role CHECK (role_in_agency IN ('owner', 'manager', 'agent')),
  
  -- Audit & Soft Delete Columns
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  
  PRIMARY KEY (agency_id, broker_id)
);

-- Agency Members Triggers & Indexes
CREATE TRIGGER set_agency_members_updated_at
  BEFORE UPDATE ON public.agency_members
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_agency_members_broker_id ON public.agency_members(broker_id) WHERE deleted_at IS NULL;
