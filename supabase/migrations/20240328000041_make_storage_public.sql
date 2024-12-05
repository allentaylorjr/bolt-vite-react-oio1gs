-- Drop existing storage policies
DROP POLICY IF EXISTS "Enable storage read" ON storage.objects;
DROP POLICY IF EXISTS "Enable storage write" ON storage.objects;

-- Update buckets to be public
UPDATE storage.buckets 
SET public = true 
WHERE id IN ('sermon-videos', 'sermon-thumbnails');

-- Create public read policy
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id IN ('sermon-videos', 'sermon-thumbnails'));

-- Create upload policy for authenticated users
CREATE POLICY "Allow authenticated upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id IN ('sermon-videos', 'sermon-thumbnails')
  AND auth.role() = 'authenticated'
);

-- Grant permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;