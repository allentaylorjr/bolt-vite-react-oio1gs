-- Drop existing policies
DROP POLICY IF EXISTS "allow_read" ON public.churches;
DROP POLICY IF EXISTS "allow_insert" ON public.churches;
DROP POLICY IF EXISTS "allow_update" ON public.churches;
DROP POLICY IF EXISTS "allow_error_insert" ON public.registration_errors;
DROP POLICY IF EXISTS "allow_error_select" ON public.registration_errors;

-- Disable RLS temporarily
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.churches DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_errors DISABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT ALL ON auth.users TO postgres;
GRANT ALL ON public.churches TO postgres;
GRANT ALL ON public.registration_errors TO postgres;

-- Grant public permissions
GRANT SELECT ON public.churches TO anon;
GRANT INSERT ON public.churches TO anon;
GRANT ALL ON public.churches TO authenticated;
GRANT INSERT ON public.registration_errors TO anon;
GRANT ALL ON public.registration_errors TO authenticated;