-- Create storage buckets with proper configurations
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('church-logos', 'church-logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('sermon-videos', 'sermon-videos', true, 2147483648, ARRAY['video/mp4', 'video/webm', 'video/quicktime']),
  ('sermon-thumbnails', 'sermon-thumbnails', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('speaker-profiles', 'speaker-profiles', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('series-thumbnails', 'series-thumbnails', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE
SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create storage policies
CREATE POLICY "Enable public read access"
  ON storage.objects FOR SELECT
  USING (bucket_id IN (
    'church-logos',
    'sermon-videos',
    'sermon-thumbnails',
    'speaker-profiles',
    'series-thumbnails'
  ));

CREATE POLICY "Enable authenticated upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id IN (
      'church-logos',
      'sermon-videos',
      'sermon-thumbnails',
      'speaker-profiles',
      'series-thumbnails'
    ) AND
    auth.role() = 'authenticated'
  );

-- Grant storage permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;