-- Drop existing sermon policies
DROP POLICY IF EXISTS "enable_sermon_read" ON public.sermons;
DROP POLICY IF EXISTS "enable_sermon_insert" ON public.sermons;
DROP POLICY IF EXISTS "enable_sermon_update" ON public.sermons;
DROP POLICY IF EXISTS "enable_sermon_delete" ON public.sermons;

-- Create simplified sermon policies
CREATE POLICY "enable_sermon_read"
  ON public.sermons FOR SELECT
  USING (true);

CREATE POLICY "enable_sermon_insert"
  ON public.sermons FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "enable_sermon_update"
  ON public.sermons FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "enable_sermon_delete"
  ON public.sermons FOR DELETE
  USING (auth.role() = 'authenticated');

-- Update storage policies
DROP POLICY IF EXISTS "enable_storage_read" ON storage.objects;
DROP POLICY IF EXISTS "enable_storage_insert" ON storage.objects;

CREATE POLICY "enable_storage_read"
  ON storage.objects FOR SELECT
  USING (true);

CREATE POLICY "enable_storage_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT ALL ON public.sermons TO authenticated;
GRANT SELECT ON public.sermons TO anon;
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;