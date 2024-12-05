-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Enable upload for authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Enable read access for church members" ON public.sermons;
DROP POLICY IF EXISTS "Enable insert for church members" ON public.sermons;

-- Create simplified policies for sermons
CREATE POLICY "Allow sermon access"
ON public.sermons FOR SELECT
USING (true);

CREATE POLICY "Allow sermon creation"
ON public.sermons FOR INSERT
WITH CHECK (true);

-- Create simplified policies for storage
CREATE POLICY "Allow storage access"
ON storage.objects FOR SELECT
USING (bucket_id = 'sermon-videos');

CREATE POLICY "Allow storage upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'sermon-videos'
  AND auth.role() = 'authenticated'
);