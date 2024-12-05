-- Drop existing foreign key constraints
ALTER TABLE public.sermons
DROP CONSTRAINT IF EXISTS sermons_church_id_fkey;

-- Update the foreign key to reference churches instead of users
ALTER TABLE public.sermons
ADD CONSTRAINT sermons_church_id_fkey
  FOREIGN KEY (church_id)
  REFERENCES public.churches(id)
  ON DELETE CASCADE;

-- Update sermon policies to use church_id from user metadata
DROP POLICY IF EXISTS "enable_sermon_read" ON public.sermons;
DROP POLICY IF EXISTS "enable_sermon_insert" ON public.sermons;
DROP POLICY IF EXISTS "enable_sermon_update" ON public.sermons;
DROP POLICY IF EXISTS "enable_sermon_delete" ON public.sermons;

CREATE POLICY "enable_sermon_read"
  ON public.sermons FOR SELECT
  USING (true);

CREATE POLICY "enable_sermon_insert"
  ON public.sermons FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
  );

CREATE POLICY "enable_sermon_update"
  ON public.sermons FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
  );

CREATE POLICY "enable_sermon_delete"
  ON public.sermons FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
  );

-- Grant necessary permissions
GRANT ALL ON public.sermons TO authenticated;
GRANT SELECT ON public.sermons TO anon;