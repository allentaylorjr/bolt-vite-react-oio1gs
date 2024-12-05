-- Drop existing storage policies
DROP POLICY IF EXISTS "Allow video access to church members" ON storage.objects;
DROP POLICY IF EXISTS "Allow video uploads by church members" ON storage.objects;

-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('sermon-videos', 'sermon-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Create new storage policies
CREATE POLICY "Enable read access for authenticated users"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'sermon-videos'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Enable upload for authenticated users"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'sermon-videos'
  AND auth.role() = 'authenticated'
);

-- Update sermon policies
DROP POLICY IF EXISTS "Allow sermon access to church members" ON public.sermons;
DROP POLICY IF EXISTS "Allow sermon creation by church members" ON public.sermons;

CREATE POLICY "Enable read access for church members"
ON public.sermons FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND (raw_user_meta_data->>'church_id')::uuid = church_id
  )
);

CREATE POLICY "Enable insert for church members"
ON public.sermons FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND (raw_user_meta_data->>'church_id')::uuid = church_id
  )
);