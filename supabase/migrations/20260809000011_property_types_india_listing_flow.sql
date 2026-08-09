-- HomiFind listing types used by the product UX.
-- Keep the existing enum values backward compatible and add India-first formats.
ALTER TYPE public.property_type ADD VALUE IF NOT EXISTS 'private_room';
ALTER TYPE public.property_type ADD VALUE IF NOT EXISTS 'pg';
ALTER TYPE public.property_type ADD VALUE IF NOT EXISTS 'hostel';
