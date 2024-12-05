-- Drop all existing policies and RLS
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.churches DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_errors DISABLE ROW LEVEL SECURITY;

-- Drop existing tables to start fresh
DROP TABLE IF EXISTS public.registration_errors;
DROP TABLE IF EXISTS public.churches;

-- Create simplified error logging
CREATE TABLE IF NOT EXISTS public.registration_errors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text,
  error_message text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT ALL ON auth.users TO postgres;
GRANT ALL ON public.registration_errors TO postgres;
GRANT INSERT ON public.registration_errors TO anon;
GRANT SELECT ON public.registration_errors TO authenticated;