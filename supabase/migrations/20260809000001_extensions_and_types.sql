-- ============================================================================
-- MIGRATION 01: EXTENSIONS, ENUMS & CORE BASE FUNCTIONS
-- Project: HomiFind (Multi-role Real Estate Workspace)
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";      -- For AI pgvector semantic embeddings
CREATE EXTENSION IF NOT EXISTS "pg_trgm";     -- For fuzzy text search & indexing

-- 2. ENUMS & CUSTOM TYPES
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM (
      'renter',
      'owner',
      'broker',
      'vendor',
      'admin'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_type') THEN
    CREATE TYPE public.property_type AS ENUM (
      'apartment',
      'house',
      'condo',
      'townhouse',
      'studio',
      'commercial',
      'villa',
      'multi_family'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_status') THEN
    CREATE TYPE public.property_status AS ENUM (
      'draft',
      'available',
      'under_review',
      'leased',
      'archived'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
    CREATE TYPE public.application_status AS ENUM (
      'draft',
      'submitted',
      'under_review',
      'approved',
      'rejected',
      'cancelled'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lease_status') THEN
    CREATE TYPE public.lease_status AS ENUM (
      'pending_signature',
      'active',
      'expiring_soon',
      'terminated',
      'expired'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_priority') THEN
    CREATE TYPE public.ticket_priority AS ENUM (
      'low',
      'medium',
      'high',
      'urgent'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
    CREATE TYPE public.ticket_status AS ENUM (
      'open',
      'in_progress',
      'pending_vendor',
      'resolved',
      'closed'
    );
  END IF;
END $$;

-- 3. CORE TRIGGER & UTILITY FUNCTIONS

-- Function: Automatically set updated_at timestamp on record modification
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  IF (auth.uid() IS NOT NULL) THEN
    NEW.updated_by = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Helper to soft-delete a record
CREATE OR REPLACE FUNCTION public.soft_delete_record()
RETURNS TRIGGER AS $$
BEGIN
  NEW.deleted_at = NOW();
  IF (auth.uid() IS NOT NULL) THEN
    NEW.updated_by = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

