-- Drop existing thumbnail policies
DROP POLICY IF EXISTS "Enable thumbnail access" ON storage.objects;
DROP POLICY IF EXISTS "Enable thumbnail upload" ON storage.objects;

-- Ensure the sermon-thumbnails bucket exists with correct settings
INSERT INTO storage.buckets (id, name, public)
VALUES ('sermon-thumbnails', 'sermon-thumbnails', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Create new storage policies for thumbnails
CREATE POLICY "Enable thumbnail read access"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'sermon-thumbnails'
);

CREATE POLICY "Enable thumbnail upload access"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'sermon-thumbnails' AND
  auth.role() = 'authenticated'
);

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;