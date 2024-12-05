-- Add thumbnail_url column to sermons table
ALTER TABLE public.sermons
ADD COLUMN thumbnail_url TEXT;

-- Update storage policies for thumbnails bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('sermon-thumbnails', 'sermon-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Add policies for thumbnail bucket
CREATE POLICY "Enable thumbnail access"
ON storage.objects FOR SELECT
USING (bucket_id = 'sermon-thumbnails');

CREATE POLICY "Enable thumbnail upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'sermon-thumbnails' AND
  auth.uid() IS NOT NULL
);