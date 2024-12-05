-- Drop existing policies
DROP POLICY IF EXISTS "Enable read for users" ON public.sermons;
DROP POLICY IF EXISTS "Enable insert for users" ON public.sermons;
DROP POLICY IF EXISTS "Enable update for users" ON public.sermons;
DROP POLICY IF EXISTS "Enable read for users" ON public.series;
DROP POLICY IF EXISTS "Enable insert for users" ON public.series;
DROP POLICY IF EXISTS "Enable update for users" ON public.series;
DROP POLICY IF EXISTS "Enable read for users" ON public.speakers;
DROP POLICY IF EXISTS "Enable insert for users" ON public.speakers;
DROP POLICY IF EXISTS "Enable update for users" ON public.speakers;

-- Create policies for sermons
CREATE POLICY "Enable sermon access"
ON public.sermons FOR SELECT
USING (
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

CREATE POLICY "Enable sermon creation"
ON public.sermons FOR INSERT
WITH CHECK (
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

CREATE POLICY "Enable sermon updates"
ON public.sermons FOR UPDATE
USING (
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

-- Create policies for series
CREATE POLICY "Enable series access"
ON public.series FOR SELECT
USING (
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

CREATE POLICY "Enable series creation"
ON public.series FOR INSERT
WITH CHECK (
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

CREATE POLICY "Enable series updates"
ON public.series FOR UPDATE
USING (
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

-- Create policies for speakers
CREATE POLICY "Enable speakers access"
ON public.speakers FOR SELECT
USING (
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

CREATE POLICY "Enable speakers creation"
ON public.speakers FOR INSERT
WITH CHECK (
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

CREATE POLICY "Enable speakers updates"
ON public.speakers FOR UPDATE
USING (
  church_id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

-- Ensure RLS is enabled for all tables
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON public.sermons TO authenticated;
GRANT ALL ON public.series TO authenticated;
GRANT ALL ON public.speakers TO authenticated;