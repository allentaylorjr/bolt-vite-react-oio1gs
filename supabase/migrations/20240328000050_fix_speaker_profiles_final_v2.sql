-- Drop existing policies
DROP POLICY IF EXISTS "Enable read for users" ON public.speakers;
DROP POLICY IF EXISTS "Enable insert for users" ON public.speakers;
DROP POLICY IF EXISTS "Enable update for users" ON public.speakers;
DROP POLICY IF EXISTS "Enable delete for users" ON public.speakers;

-- Add profile_picture_url column if it doesn't exist
ALTER TABLE public.speakers
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;

-- Create simplified policies for speakers
CREATE POLICY "Enable read for users"
ON public.speakers FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for users"
ON public.speakers FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users"
ON public.speakers FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for users"
ON public.speakers FOR DELETE
USING (auth.role() = 'authenticated');

-- Ensure storage bucket exists with correct settings
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'speaker-profiles',
  'speaker-profiles',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create unified storage policies
DROP POLICY IF EXISTS "Enable storage read" ON storage.objects;
DROP POLICY IF EXISTS "Enable storage write" ON storage.objects;

CREATE POLICY "Enable storage read"
ON storage.objects FOR SELECT
USING (bucket_id IN ('sermon-videos', 'sermon-thumbnails', 'speaker-profiles'));

CREATE POLICY "Enable storage write"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id IN ('sermon-videos', 'sermon-thumbnails', 'speaker-profiles') AND
  auth.role() = 'authenticated'
);

-- Grant necessary permissions
GRANT ALL ON public.speakers TO authenticated;
GRANT SELECT ON public.speakers TO anon;
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;