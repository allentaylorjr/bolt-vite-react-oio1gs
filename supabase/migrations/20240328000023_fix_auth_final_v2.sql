-- Drop existing policies
DROP POLICY IF EXISTS "Enable sermon access" ON public.sermons;
DROP POLICY IF EXISTS "Enable sermon creation" ON public.sermons;
DROP POLICY IF EXISTS "Enable sermon updates" ON public.sermons;

-- Create new policies with simplified auth checks
CREATE POLICY "Enable sermon access"
ON public.sermons FOR SELECT
USING (true);

CREATE POLICY "Enable sermon creation"
ON public.sermons FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable sermon updates"
ON public.sermons FOR UPDATE
USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT ALL ON public.sermons TO authenticated;
GRANT SELECT ON public.sermons TO anon;

-- Ensure storage buckets and policies are correct
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('sermon-videos', 'sermon-videos', true, 2147483648, ARRAY['video/*']),
  ('sermon-thumbnails', 'sermon-thumbnails', true, 5242880, ARRAY['image/*'])
ON CONFLICT (id) DO UPDATE
SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Update storage policies
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

-- Grant storage permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;