-- Drop all existing tables and policies
DROP TABLE IF EXISTS public.churches;
DROP TABLE IF EXISTS public.registration_errors;

-- Disable RLS on auth.users
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT ALL ON auth.users TO postgres;