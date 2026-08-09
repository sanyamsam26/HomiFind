-- HomiFind property media storage policies
-- Frontend uploads directly to Supabase Storage using the authenticated user's JWT.
-- Backend then registers the uploaded object in public.property_media.

CREATE POLICY "property_media_owner_select"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'property-media'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "property_media_owner_insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'property-media'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "property_media_owner_update"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'property-media'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'property-media'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "property_media_owner_delete"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'property-media'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
