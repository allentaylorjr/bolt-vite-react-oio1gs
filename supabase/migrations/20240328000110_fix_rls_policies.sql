-- Drop existing policies
DROP POLICY IF EXISTS "enable_public_read" ON public.churches;
DROP POLICY IF EXISTS "enable_public_insert" ON public.churches;
DROP POLICY IF EXISTS "enable_auth_update" ON public.churches;
DROP POLICY IF EXISTS "enable_error_insert" ON public.registration_errors;
DROP POLICY IF EXISTS "enable_error_select" ON public.registration_errors;

-- Enable RLS for both tables
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_errors ENABLE ROW LEVEL SECURITY;

-- Create simplified church policies
CREATE POLICY "allow_read"
  ON public.churches FOR SELECT
  USING (true);

CREATE POLICY "allow_insert"
  ON public.churches FOR INSERT
  WITH CHECK (true);

CREATE POLICY "allow_update"
  ON public.churches FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create simplified error logging policies
CREATE POLICY "allow_error_insert"
  ON public.registration_errors FOR INSERT
  WITH CHECK (true);

CREATE POLICY "allow_error_select"
  ON public.registration_errors FOR SELECT
  USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT ALL ON public.churches TO authenticated;
GRANT SELECT, INSERT ON public.churches TO anon;
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT INSERT ON public.registration_errors TO anon, authenticated;
GRANT SELECT ON public.registration_errors TO authenticated;