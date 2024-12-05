-- Drop existing policies
DROP POLICY IF EXISTS "Enable sermon access" ON public.sermons;
DROP POLICY IF EXISTS "Enable sermon creation" ON public.sermons;
DROP POLICY IF EXISTS "Enable sermon updates" ON public.sermons;
DROP POLICY IF EXISTS "Enable storage read" ON storage.objects;
DROP POLICY IF EXISTS "Enable storage write" ON storage.objects;

-- Create new policies for sermons with simplified auth checks
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

-- Grant necessary permissions
GRANT ALL ON public.sermons TO authenticated;
GRANT SELECT ON public.sermons TO anon;

-- Ensure storage buckets exist with correct settings
DELETE FROM storage.buckets WHERE id IN ('sermon-videos', 'sermon-thumbnails');

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('sermon-videos', 'sermon-videos', true, 2147483648, ARRAY['video/*']),
  ('sermon-thumbnails', 'sermon-thumbnails', true, 5242880, ARRAY['image/*']);

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

-- Grant storage permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;

-- Add RLS to sermons table
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;