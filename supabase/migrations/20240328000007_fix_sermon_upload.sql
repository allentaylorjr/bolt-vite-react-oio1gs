-- Drop existing sermon policies
DROP POLICY IF EXISTS "Sermons viewable by church members" ON public.sermons;
DROP POLICY IF EXISTS "Sermons insertable by church members" ON public.sermons;

-- Create new, simplified sermon policies
CREATE POLICY "Public sermons access"
ON public.sermons FOR SELECT USING (true);

CREATE POLICY "Enable sermon uploads"
ON public.sermons FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'church_id' = sermons.church_id::text
  )
);

-- Update storage policies
DROP POLICY IF EXISTS "Videos accessible by church members" ON storage.objects;
DROP POLICY IF EXISTS "Videos uploadable by church members" ON storage.objects;

CREATE POLICY "Public video access"
ON storage.objects FOR SELECT
USING (bucket_id = 'sermon-videos');

CREATE POLICY "Enable video uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'sermon-videos'
  AND auth.role() = 'authenticated'
);