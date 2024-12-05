-- Drop existing policies
DROP POLICY IF EXISTS "sermons_select" ON public.sermons;
DROP POLICY IF EXISTS "sermons_insert" ON public.sermons;
DROP POLICY IF EXISTS "sermons_update" ON public.sermons;
DROP POLICY IF EXISTS "series_select" ON public.series;
DROP POLICY IF EXISTS "series_insert" ON public.series;
DROP POLICY IF EXISTS "series_update" ON public.series;
DROP POLICY IF EXISTS "speakers_select" ON public.speakers;
DROP POLICY IF EXISTS "speakers_insert" ON public.speakers;
DROP POLICY IF EXISTS "speakers_update" ON public.speakers;

-- Create policies for sermons
CREATE POLICY "sermons_select" ON public.sermons
  FOR SELECT USING (true);

CREATE POLICY "sermons_insert" ON public.sermons
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
  );

CREATE POLICY "sermons_update" ON public.sermons
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND
    church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
  );

-- Create policies for series
CREATE POLICY "series_select" ON public.series
  FOR SELECT USING (true);

CREATE POLICY "series_insert" ON public.series
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
  );

CREATE POLICY "series_update" ON public.series
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND
    church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
  );

-- Create policies for speakers
CREATE POLICY "speakers_select" ON public.speakers
  FOR SELECT USING (true);

CREATE POLICY "speakers_insert" ON public.speakers
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
  );

CREATE POLICY "speakers_update" ON public.speakers
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND
    church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
  );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Ensure RLS is enabled
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;