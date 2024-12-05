-- Add profile_picture_url column to speakers table
ALTER TABLE public.speakers
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;

-- Create storage bucket for speaker profile pictures
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'speaker-profiles',
  'speaker-profiles',
  true,
  12582912, -- 12MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create storage policies for speaker profile pictures
CREATE POLICY "Enable profile picture read"
ON storage.objects FOR SELECT
USING (bucket_id = 'speaker-profiles');

CREATE POLICY "Enable profile picture upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'speaker-profiles' AND
  auth.role() = 'authenticated'
);