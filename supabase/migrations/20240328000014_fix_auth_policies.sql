-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for church members" ON public.sermons;
DROP POLICY IF EXISTS "Enable insert for church members" ON public.sermons;
DROP POLICY IF EXISTS "Enable update for church members" ON public.sermons;

-- Create simplified policies for sermons
CREATE POLICY "Allow sermon access"
ON public.sermons FOR SELECT
USING (
  auth.uid() IS NOT NULL AND
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

CREATE POLICY "Allow sermon creation"
ON public.sermons FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

CREATE POLICY "Allow sermon updates"
ON public.sermons FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

-- Update storage policies
DROP POLICY IF EXISTS "Enable read access for church members" ON storage.objects;
DROP POLICY IF EXISTS "Enable upload for church members" ON storage.objects;

CREATE POLICY "Allow storage access"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'sermon-videos' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Allow storage upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'sermon-videos' AND
  auth.uid() IS NOT NULL
);