-- ============================================================================
-- MIGRATION 04: APPLICATIONS, LEASES & MAINTENANCE TICKETS
-- Project: HomiFind
-- Includes: Foreign keys, CHECK Constraints, Soft delete, Audit columns, Indexes & Triggers
-- ============================================================================

-- 1. RENTAL APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,
  renter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status public.application_status NOT NULL DEFAULT 'submitted',
  
  -- Applicant Disclosures & Details
  proposed_move_in_date DATE NOT NULL,
  occupants_count INT NOT NULL DEFAULT 1 CONSTRAINT check_app_occupants CHECK (occupants_count > 0),
  annual_income NUMERIC(12,2) NOT NULL CONSTRAINT check_app_income CHECK (annual_income >= 0),
  employment_status TEXT NOT NULL,
  credit_score_range TEXT,
  has_pets BOOLEAN DEFAULT FALSE,
  pet_details TEXT,
  background_check_consent BOOLEAN NOT NULL DEFAULT FALSE CONSTRAINT check_bg_consent CHECK (background_check_consent = TRUE),
  
  -- Attached File Storage Paths (e.g., Paystubs, ID Verification)
  document_paths TEXT[] DEFAULT '{}',
  notes TEXT,
  
  -- Audit & Soft Delete Columns
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Applications Triggers & Indexes
CREATE TRIGGER set_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_applications_property_id ON public.applications(property_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_applications_renter_id ON public.applications(renter_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_applications_status ON public.applications(status) WHERE deleted_at IS NULL;


-- 2. LEASES TABLE
CREATE TABLE IF NOT EXISTS public.leases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID UNIQUE REFERENCES public.applications(id) ON DELETE SET NULL,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,
  renter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  broker_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  status public.lease_status NOT NULL DEFAULT 'pending_signature',
  rent_amount NUMERIC(12,2) NOT NULL CONSTRAINT check_lease_rent CHECK (rent_amount > 0),
  security_deposit NUMERIC(12,2) NOT NULL DEFAULT 0.00 CONSTRAINT check_lease_deposit CHECK (security_deposit >= 0),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- E-Signature Metadata & Signed PDF Path
  lease_document_path TEXT,
  renter_signed_at TIMESTAMPTZ,
  owner_signed_at TIMESTAMPTZ,
  
  -- Audit & Soft Delete Columns
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL,

  CONSTRAINT check_lease_dates CHECK (end_date > start_date)
);

-- Leases Triggers & Indexes
CREATE TRIGGER set_leases_updated_at
  BEFORE UPDATE ON public.leases
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_leases_property_id ON public.leases(property_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_leases_renter_owner ON public.leases(renter_id, owner_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_leases_status ON public.leases(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_leases_dates ON public.leases(start_date, end_date) WHERE deleted_at IS NULL;


-- 3. MAINTENANCE TICKETS TABLE
CREATE TABLE IF NOT EXISTS public.maintenance_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  renter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_vendor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  title TEXT NOT NULL CONSTRAINT ticket_title_length CHECK (char_length(trim(title)) >= 3),
  description TEXT NOT NULL,
  priority public.ticket_priority NOT NULL DEFAULT 'medium',
  status public.ticket_status NOT NULL DEFAULT 'open',
  attachment_paths TEXT[] DEFAULT '{}',
  resolved_at TIMESTAMPTZ,
  
  -- Audit & Soft Delete Columns
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Maintenance Tickets Triggers & Indexes
CREATE TRIGGER set_maintenance_tickets_updated_at
  BEFORE UPDATE ON public.maintenance_tickets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_tickets_property_id ON public.maintenance_tickets(property_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_tickets_renter_id ON public.maintenance_tickets(renter_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_tickets_vendor_id ON public.maintenance_tickets(assigned_vendor_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_tickets_status_priority ON public.maintenance_tickets(status, priority) WHERE deleted_at IS NULL;
