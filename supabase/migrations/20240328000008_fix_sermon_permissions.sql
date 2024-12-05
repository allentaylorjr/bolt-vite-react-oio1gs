-- Drop existing policies
DROP POLICY IF EXISTS "Public sermons access" ON public.sermons;
DROP POLICY IF EXISTS "Enable sermon uploads" ON public.sermons;

-- Create new policies for sermons
CREATE POLICY "Allow sermon access to church members"
ON public.sermons FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND (raw_user_meta_data->>'church_id')::uuid = sermons.church_id
  )
);

CREATE POLICY "Allow sermon creation by church members"
ON public.sermons FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND (raw_user_meta_data->>'church_id')::uuid = sermons.church_id
  )
);

-- Update storage policies
DROP POLICY IF EXISTS "Public video access" ON storage.objects;
DROP POLICY IF EXISTS "Enable video uploads" ON storage.objects;

CREATE POLICY "Allow video access to church members"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'sermon-videos'
  AND EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND (raw_user_meta_data->>'church_id')::uuid = (storage.foldername(name))[1]::uuid
  )
);

CREATE POLICY "Allow video uploads by church members"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'sermon-videos'
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND (raw_user_meta_data->>'church_id')::uuid = (storage.foldername(name))[1]::uuid
  )
);