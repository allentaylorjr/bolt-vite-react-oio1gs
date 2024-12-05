-- Drop existing policies
DROP POLICY IF EXISTS "sermons_select" ON public.sermons;
DROP POLICY IF EXISTS "sermons_insert" ON public.sermons;
DROP POLICY IF EXISTS "sermons_update" ON public.sermons;
DROP POLICY IF EXISTS "sermons_delete" ON public.sermons;
DROP POLICY IF EXISTS "series_select" ON public.series;
DROP POLICY IF EXISTS "series_insert" ON public.series;
DROP POLICY IF EXISTS "series_update" ON public.series;
DROP POLICY IF EXISTS "series_delete" ON public.series;
DROP POLICY IF EXISTS "speakers_select" ON public.speakers;
DROP POLICY IF EXISTS "speakers_insert" ON public.speakers;
DROP POLICY IF EXISTS "speakers_update" ON public.speakers;
DROP POLICY IF EXISTS "speakers_delete" ON public.speakers;
DROP POLICY IF EXISTS "churches_select" ON public.churches;
DROP POLICY IF EXISTS "churches_update" ON public.churches;

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

CREATE POLICY "sermons_delete" ON public.sermons
  FOR DELETE USING (
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

CREATE POLICY "series_delete" ON public.series
  FOR DELETE USING (
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

CREATE POLICY "speakers_delete" ON public.speakers
  FOR DELETE USING (
    auth.role() = 'authenticated' AND
    church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
  );

-- Create policies for churches
CREATE POLICY "churches_select" ON public.churches
  FOR SELECT USING (true);

CREATE POLICY "churches_update" ON public.churches
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND
    id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
  );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Ensure RLS is enabled
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;

-- Create function to handle user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.churches (id, name, slug, subdomain)
  VALUES (
    NEW.raw_user_metadata->>'church_id',
    NEW.raw_user_metadata->>'name',
    NEW.raw_user_metadata->>'slug',
    NEW.raw_user_metadata->>'subdomain'
  );
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();