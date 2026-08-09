-- ============================================================================
-- MIGRATION 06: ROW LEVEL SECURITY (RLS), AUTH TRIGGERS, STORAGE & REALTIME
-- Project: HomiFind
-- ============================================================================

-- 1. ENABLE RLS ON ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 2. RLS POLICIES

-- PROFILES
CREATE POLICY "Profiles viewable by authenticated users"
  ON public.profiles FOR SELECT TO authenticated
  USING (deleted_at IS NULL);

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id AND deleted_at IS NULL)
  WITH CHECK (auth.uid() = id);

-- USER PREFERENCES
CREATE POLICY "Users view own preferences"
  ON public.user_preferences FOR SELECT TO authenticated
  USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users manage own preferences"
  ON public.user_preferences FOR ALL TO authenticated
  USING (auth.uid() = user_id AND deleted_at IS NULL)
  WITH CHECK (auth.uid() = user_id);

-- AGENCIES
CREATE POLICY "Agencies viewable by authenticated users"
  ON public.agencies FOR SELECT TO authenticated
  USING (deleted_at IS NULL);

CREATE POLICY "Agency owners manage agency"
  ON public.agencies FOR ALL TO authenticated
  USING (auth.uid() = owner_id AND deleted_at IS NULL)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Agency members view"
  ON public.agency_members FOR SELECT TO authenticated
  USING (deleted_at IS NULL);

-- PROPERTIES
CREATE POLICY "Available properties viewable by public"
  ON public.properties FOR SELECT
  USING (deleted_at IS NULL AND (status = 'available' OR auth.uid() = owner_id OR auth.uid() = broker_id));

CREATE POLICY "Owners and Brokers manage properties"
  ON public.properties FOR ALL TO authenticated
  USING (
    deleted_at IS NULL AND (
      auth.uid() = owner_id OR 
      auth.uid() = broker_id OR 
      public.get_user_role(auth.uid()) IN ('owner', 'broker', 'admin')
    )
  )
  WITH CHECK (
    auth.uid() = owner_id OR 
    auth.uid() = broker_id OR 
    public.get_user_role(auth.uid()) IN ('owner', 'broker', 'admin')
  );

-- PROPERTY EMBEDDINGS & MEDIA
CREATE POLICY "Property embeddings readable by authenticated users"
  ON public.property_embeddings FOR SELECT TO authenticated
  USING (deleted_at IS NULL);

CREATE POLICY "Property media readable by public"
  ON public.property_media FOR SELECT
  USING (deleted_at IS NULL);

CREATE POLICY "Property media managed by owner or broker"
  ON public.property_media FOR ALL TO authenticated
  USING (
    deleted_at IS NULL AND EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_media.property_id
        AND p.deleted_at IS NULL
        AND (p.owner_id = auth.uid() OR p.broker_id = auth.uid())
    )
  );

-- SAVED PROPERTIES
CREATE POLICY "Renters manage saved properties"
  ON public.saved_properties FOR ALL TO authenticated
  USING (auth.uid() = renter_id)
  WITH CHECK (auth.uid() = renter_id);

-- APPLICATIONS
CREATE POLICY "Applications viewable by applicant or property managers"
  ON public.applications FOR SELECT TO authenticated
  USING (
    deleted_at IS NULL AND (
      renter_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.properties p
        WHERE p.id = applications.property_id
          AND p.deleted_at IS NULL
          AND (p.owner_id = auth.uid() OR p.broker_id = auth.uid())
      )
    )
  );

CREATE POLICY "Renters create applications"
  ON public.applications FOR INSERT TO authenticated
  WITH CHECK (renter_id = auth.uid());

CREATE POLICY "Applicants or Property Managers update applications"
  ON public.applications FOR UPDATE TO authenticated
  USING (
    deleted_at IS NULL AND (
      renter_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.properties p
        WHERE p.id = applications.property_id
          AND p.deleted_at IS NULL
          AND (p.owner_id = auth.uid() OR p.broker_id = auth.uid())
      )
    )
  );

-- LEASES
CREATE POLICY "Bound parties view leases"
  ON public.leases FOR SELECT TO authenticated
  USING (
    deleted_at IS NULL AND (
      renter_id = auth.uid() OR
      owner_id = auth.uid() OR
      broker_id = auth.uid()
    )
  );

CREATE POLICY "Owners and brokers manage leases"
  ON public.leases FOR ALL TO authenticated
  USING (deleted_at IS NULL AND (owner_id = auth.uid() OR broker_id = auth.uid() OR renter_id = auth.uid()));

-- MAINTENANCE TICKETS
CREATE POLICY "Tickets viewable by involved parties"
  ON public.maintenance_tickets FOR SELECT TO authenticated
  USING (
    deleted_at IS NULL AND (
      renter_id = auth.uid() OR
      assigned_vendor_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.properties p
        WHERE p.id = maintenance_tickets.property_id
          AND p.deleted_at IS NULL
          AND (p.owner_id = auth.uid() OR p.broker_id = auth.uid())
      )
    )
  );

CREATE POLICY "Renters create tickets"
  ON public.maintenance_tickets FOR INSERT TO authenticated
  WITH CHECK (renter_id = auth.uid());

CREATE POLICY "Involved parties update tickets"
  ON public.maintenance_tickets FOR UPDATE TO authenticated
  USING (
    deleted_at IS NULL AND (
      renter_id = auth.uid() OR
      assigned_vendor_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.properties p
        WHERE p.id = maintenance_tickets.property_id
          AND p.deleted_at IS NULL
          AND (p.owner_id = auth.uid() OR p.broker_id = auth.uid())
      )
    )
  );

-- MESSAGING & CONVERSATIONS
CREATE POLICY "Participants view conversations"
  ON public.conversations FOR SELECT TO authenticated
  USING (
    deleted_at IS NULL AND EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = id AND cp.user_id = auth.uid() AND cp.deleted_at IS NULL
    )
  );

CREATE POLICY "Participants view message history"
  ON public.messages FOR SELECT TO authenticated
  USING (
    deleted_at IS NULL AND EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = messages.conversation_id AND cp.user_id = auth.uid() AND cp.deleted_at IS NULL
    )
  );

CREATE POLICY "Participants send messages"
  ON public.messages FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid() AND cp.deleted_at IS NULL
    )
  );

-- ACTIVITY LOGS
CREATE POLICY "Users view own activity logs"
  ON public.activity_logs FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.get_user_role(auth.uid()) = 'admin');

-- 3. AUTOMATIC USER SIGNUP TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role public.user_role;
BEGIN
  assigned_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::public.user_role,
    'renter'::public.user_role
  );

  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    avatar_url,
    phone,
    created_by,
    updated_by
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    assigned_role,
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'phone',
    NEW.id,
    NEW.id
  );

  IF assigned_role = 'renter' THEN
    INSERT INTO public.user_preferences (user_id, created_by, updated_by)
    VALUES (NEW.id, NEW.id, NEW.id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. STORAGE BUCKETS & STORAGE POLICIES
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('property-images', 'property-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']),
  ('user-avatars', 'user-avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('application-documents', 'application-documents', false, 20971520, ARRAY['application/pdf', 'image/jpeg', 'image/png']),
  ('lease-documents', 'lease-documents', false, 20971520, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Objects Policies
CREATE POLICY "Public property images view"
  ON storage.objects FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY "Property managers upload images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Public user avatar view"
  ON storage.objects FOR SELECT USING (bucket_id = 'user-avatars');

CREATE POLICY "Users upload avatar"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'user-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Private document access"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id IN ('application-documents', 'lease-documents'));

-- 5. REALTIME PUBLICATION
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.maintenance_tickets;
EXCEPTION WHEN OTHERS THEN NULL; END $$;
