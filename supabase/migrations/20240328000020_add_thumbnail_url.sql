-- Add thumbnail_url column to sermons table if it doesn't exist
ALTER TABLE public.sermons
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Ensure storage buckets exist with correct settings
DELETE FROM storage.buckets WHERE id IN ('sermon-videos', 'sermon-thumbnails');

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('sermon-videos', 'sermon-videos', true, 2147483648, ARRAY['video/*']),
  ('sermon-thumbnails', 'sermon-thumbnails', true, 5242880, ARRAY['image/*']);

-- Create unified storage policies
CREATE POLICY "Enable read access for all users"
ON storage.objects FOR SELECT
USING (bucket_id IN ('sermon-videos', 'sermon-thumbnails'));

CREATE POLICY "Enable upload for authenticated users"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id IN ('sermon-videos', 'sermon-thumbnails')
  AND auth.role() = 'authenticated'
);

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;

-- Update sermon policies to include thumbnail_url
DROP POLICY IF EXISTS "Enable sermon access" ON public.sermons;
DROP POLICY IF EXISTS "Enable sermon creation" ON public.sermons;
DROP POLICY IF EXISTS "Enable sermon updates" ON public.sermons;

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