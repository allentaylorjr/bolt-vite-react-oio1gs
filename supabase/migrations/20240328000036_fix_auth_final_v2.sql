-- Drop existing policies
DROP POLICY IF EXISTS "Enable read for users" ON public.sermons;
DROP POLICY IF EXISTS "Enable insert for users" ON public.sermons;
DROP POLICY IF EXISTS "Enable update for users" ON public.sermons;
DROP POLICY IF EXISTS "Enable storage read" ON storage.objects;
DROP POLICY IF EXISTS "Enable storage write" ON storage.objects;

-- Create new policies with proper auth checks
CREATE POLICY "Enable read for users"
ON public.sermons FOR SELECT
USING (
  auth.role() = 'authenticated' AND
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

CREATE POLICY "Enable insert for users"
ON public.sermons FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

CREATE POLICY "Enable update for users"
ON public.sermons FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

-- Ensure storage buckets exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('sermon-videos', 'sermon-videos', true),
  ('sermon-thumbnails', 'sermon-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Enable storage read"
ON storage.objects FOR SELECT
USING (bucket_id IN ('sermon-videos', 'sermon-thumbnails'));

CREATE POLICY "Enable storage write"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id IN ('sermon-videos', 'sermon-thumbnails') AND
  auth.role() = 'authenticated'
);

-- Grant necessary permissions
GRANT ALL ON public.sermons TO authenticated;
GRANT SELECT ON public.sermons TO anon;
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;

-- Ensure RLS is enabled
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sermons_church_id ON public.sermons(church_id);
CREATE INDEX IF NOT EXISTS idx_sermons_date ON public.sermons(date DESC);