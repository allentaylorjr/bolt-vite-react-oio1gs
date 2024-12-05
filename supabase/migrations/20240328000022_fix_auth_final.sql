-- Drop existing policies
DROP POLICY IF EXISTS "Enable sermon access" ON public.sermons;
DROP POLICY IF EXISTS "Enable sermon creation" ON public.sermons;
DROP POLICY IF EXISTS "Enable sermon updates" ON public.sermons;

-- Create new policies using raw_user_meta_data
CREATE POLICY "Enable sermon access"
ON public.sermons FOR SELECT
USING (
  church_id::text = (auth.jwt() -> 'user_metadata' ->> 'church_id')
);

CREATE POLICY "Enable sermon creation"
ON public.sermons FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  church_id::text = (auth.jwt() -> 'user_metadata' ->> 'church_id')
);

CREATE POLICY "Enable sermon updates"
ON public.sermons FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  church_id::text = (auth.jwt() -> 'user_metadata' ->> 'church_id')
);

-- Grant necessary permissions
GRANT ALL ON public.sermons TO authenticated;
GRANT SELECT ON public.sermons TO anon;

-- Ensure storage policies are correct
DROP POLICY IF EXISTS "Enable read access for all users" ON storage.objects;
DROP POLICY IF EXISTS "Enable upload for authenticated users" ON storage.objects;

CREATE POLICY "Enable read access for all users"
ON storage.objects FOR SELECT
USING (bucket_id IN ('sermon-videos', 'sermon-thumbnails'));

CREATE POLICY "Enable upload for authenticated users"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id IN ('sermon-videos', 'sermon-thumbnails')
  AND auth.role() = 'authenticated'
);