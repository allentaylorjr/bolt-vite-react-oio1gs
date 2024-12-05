-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read for authenticated users" ON public.sermons;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.sermons;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.sermons;

-- Create simplified policies for sermons
CREATE POLICY "Enable read for users"
ON public.sermons FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for users"
ON public.sermons FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  church_id = auth.jwt() -> 'user_metadata' ->> 'church_id'
);

CREATE POLICY "Enable update for users"
ON public.sermons FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  church_id = auth.jwt() -> 'user_metadata' ->> 'church_id'
);

-- Grant necessary permissions
GRANT ALL ON public.sermons TO authenticated;
GRANT SELECT ON public.sermons TO anon;

-- Ensure storage buckets exist with correct settings
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('sermon-videos', 'sermon-videos', true),
  ('sermon-thumbnails', 'sermon-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Create simple storage policies
CREATE POLICY "Enable storage read"
ON storage.objects FOR SELECT
USING (bucket_id IN ('sermon-videos', 'sermon-thumbnails'));

CREATE POLICY "Enable storage write"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id IN ('sermon-videos', 'sermon-thumbnails') AND
  auth.role() = 'authenticated'
);

-- Grant storage permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;