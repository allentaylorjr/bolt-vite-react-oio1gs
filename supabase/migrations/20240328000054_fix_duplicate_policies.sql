-- First drop all existing policies
DROP POLICY IF EXISTS "Enable sermon access" ON public.sermons;
DROP POLICY IF EXISTS "Enable sermon creation" ON public.sermons;
DROP POLICY IF EXISTS "Enable sermon updates" ON public.sermons;
DROP POLICY IF EXISTS "Enable series access" ON public.series;
DROP POLICY IF EXISTS "Enable series creation" ON public.series;
DROP POLICY IF EXISTS "Enable series updates" ON public.series;
DROP POLICY IF EXISTS "Enable speakers access" ON public.speakers;
DROP POLICY IF EXISTS "Enable speakers creation" ON public.speakers;
DROP POLICY IF EXISTS "Enable speakers updates" ON public.speakers;

-- Create new policies with unique names
CREATE POLICY "sermons_select" ON public.sermons
  FOR SELECT USING (
    church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
  );

CREATE POLICY "sermons_insert" ON public.sermons
  FOR INSERT WITH CHECK (
    church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
  );

CREATE POLICY "sermons_update" ON public.sermons
  FOR UPDATE USING (
    church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
  );

CREATE POLICY "series_select" ON public.series
  FOR SELECT USING (
    church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
  );

CREATE POLICY "series_insert" ON public.series
  FOR INSERT WITH CHECK (
    church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
  );

CREATE POLICY "series_update" ON public.series
  FOR UPDATE USING (
    church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
  );

CREATE POLICY "speakers_select" ON public.speakers
  FOR SELECT USING (
    church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
  );

CREATE POLICY "speakers_insert" ON public.speakers
  FOR INSERT WITH CHECK (
    church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
  );

CREATE POLICY "speakers_update" ON public.speakers
  FOR UPDATE USING (
    church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
  );

-- Ensure RLS is enabled
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON public.sermons TO authenticated;
GRANT ALL ON public.series TO authenticated;
GRANT ALL ON public.speakers TO authenticated;