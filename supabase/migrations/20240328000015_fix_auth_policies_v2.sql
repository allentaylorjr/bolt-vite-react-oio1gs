-- Drop existing policies
DROP POLICY IF EXISTS "Allow sermon access" ON public.sermons;
DROP POLICY IF EXISTS "Allow sermon creation" ON public.sermons;
DROP POLICY IF EXISTS "Allow sermon updates" ON public.sermons;
DROP POLICY IF EXISTS "Allow storage access" ON storage.objects;
DROP POLICY IF EXISTS "Allow storage upload" ON storage.objects;

-- Create simplified policies for sermons
CREATE POLICY "Enable sermon access"
ON public.sermons FOR SELECT
USING (true);

CREATE POLICY "Enable sermon creation"
ON public.sermons FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  church_id::text = (auth.jwt() -> 'user_metadata' ->> 'church_id')
);

CREATE POLICY "Enable sermon updates"
ON public.sermons FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND
  church_id::text = (auth.jwt() -> 'user_metadata' ->> 'church_id')
);

-- Update storage policies
CREATE POLICY "Enable storage access"
ON storage.objects FOR SELECT
USING (bucket_id = 'sermon-videos');

CREATE POLICY "Enable storage upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'sermon-videos' AND
  auth.uid() IS NOT NULL
);

-- Grant necessary permissions
GRANT SELECT ON public.sermons TO anon, authenticated;
GRANT INSERT, UPDATE ON public.sermons TO authenticated;
GRANT SELECT ON storage.objects TO anon, authenticated;
GRANT INSERT ON storage.objects TO authenticated;