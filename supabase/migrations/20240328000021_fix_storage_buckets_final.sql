-- First, create new buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('sermon-videos', 'sermon-videos', true, 2147483648, ARRAY['video/*']),
  ('sermon-thumbnails', 'sermon-thumbnails', true, 5242880, ARRAY['image/*'])
ON CONFLICT (id) DO UPDATE
SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON storage.objects;
DROP POLICY IF EXISTS "Enable upload for authenticated users" ON storage.objects;

-- Create unified policies for both buckets
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

-- Ensure the thumbnail_url column exists
ALTER TABLE public.sermons
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;