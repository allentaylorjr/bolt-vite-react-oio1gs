-- First, ensure no policies exist
DROP POLICY IF EXISTS "Enable sermon access" ON public.sermons;
DROP POLICY IF EXISTS "Enable sermon creation" ON public.sermons;
DROP POLICY IF EXISTS "Enable sermon updates" ON public.sermons;
DROP POLICY IF EXISTS "Enable storage read" ON storage.objects;
DROP POLICY IF EXISTS "Enable storage write" ON storage.objects;

-- Create temporary table without path_tokens column
CREATE TEMP TABLE temp_objects AS
SELECT 
  id,
  bucket_id,
  name,
  owner,
  created_at,
  updated_at,
  last_accessed_at,
  metadata,
  version
FROM storage.objects 
WHERE bucket_id IN ('sermon-videos', 'sermon-thumbnails');

-- Delete existing objects
DELETE FROM storage.objects 
WHERE bucket_id IN ('sermon-videos', 'sermon-thumbnails');

-- Now safe to delete buckets
DELETE FROM storage.buckets 
WHERE id IN ('sermon-videos', 'sermon-thumbnails');

-- Create buckets with correct settings
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('sermon-videos', 'sermon-videos', true, 2147483648, ARRAY['video/*']),
  ('sermon-thumbnails', 'sermon-thumbnails', true, 5242880, ARRAY['image/*']);

-- Restore objects (path_tokens will be automatically generated)
INSERT INTO storage.objects (
  id,
  bucket_id,
  name,
  owner,
  created_at,
  updated_at,
  last_accessed_at,
  metadata,
  version
)
SELECT * FROM temp_objects;

-- Drop temporary table
DROP TABLE temp_objects;

-- Create simplified storage policies
CREATE POLICY "Enable storage read"
ON storage.objects FOR SELECT
USING (bucket_id IN ('sermon-videos', 'sermon-thumbnails'));

CREATE POLICY "Enable storage write"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id IN ('sermon-videos', 'sermon-thumbnails') AND
  auth.uid() IS NOT NULL
);

-- Create sermon policies
CREATE POLICY "Enable sermon access"
ON public.sermons FOR SELECT
USING (
  auth.uid() IS NOT NULL AND
  church_id::text = (auth.jwt() -> 'user_metadata' ->> 'church_id')
);

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

-- Grant permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;
GRANT ALL ON public.sermons TO authenticated;
GRANT SELECT ON public.sermons TO anon;

-- Ensure RLS is enabled
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;