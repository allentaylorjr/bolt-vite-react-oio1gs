-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Enable thumbnail read access" ON storage.objects;
DROP POLICY IF EXISTS "Enable thumbnail upload access" ON storage.objects;
DROP POLICY IF EXISTS "Enable storage access" ON storage.objects;
DROP POLICY IF EXISTS "Enable storage upload" ON storage.objects;

-- Ensure both buckets exist with correct settings
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('sermon-videos', 'sermon-videos', true),
  ('sermon-thumbnails', 'sermon-thumbnails', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Create unified policies for both buckets
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (
  bucket_id IN ('sermon-videos', 'sermon-thumbnails')
);

CREATE POLICY "Allow authenticated upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id IN ('sermon-videos', 'sermon-thumbnails')
  AND auth.role() = 'authenticated'
);

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;

-- Ensure the updated_at column exists on sermons
ALTER TABLE public.sermons
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Update existing rows to have an updated_at value if needed
UPDATE public.sermons 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- Make updated_at NOT NULL
ALTER TABLE public.sermons 
ALTER COLUMN updated_at SET NOT NULL;