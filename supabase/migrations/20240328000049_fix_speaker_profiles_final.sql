-- Drop existing policies
DROP POLICY IF EXISTS "Enable storage read" ON storage.objects;
DROP POLICY IF EXISTS "Enable storage write" ON storage.objects;

-- Recreate storage bucket with correct settings
DELETE FROM storage.buckets WHERE id = 'speaker-profiles';

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'speaker-profiles',
  'speaker-profiles',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Create unified storage policies
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
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;

-- Update RLS policies for speakers table
DROP POLICY IF EXISTS "Enable read for users" ON public.speakers;
DROP POLICY IF EXISTS "Enable insert for users" ON public.speakers;
DROP POLICY IF EXISTS "Enable update for users" ON public.speakers;
DROP POLICY IF EXISTS "Enable delete for users" ON public.speakers;

CREATE POLICY "Enable read for users"
ON public.speakers FOR SELECT
USING (
  auth.role() = 'authenticated' AND
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

CREATE POLICY "Enable insert for users"
ON public.speakers FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

CREATE POLICY "Enable update for users"
ON public.speakers FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

CREATE POLICY "Enable delete for users"
ON public.speakers FOR DELETE
USING (
  auth.role() = 'authenticated' AND
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);