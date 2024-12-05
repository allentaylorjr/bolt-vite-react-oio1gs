-- Drop all existing policies and RLS
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;

-- Drop existing tables
DROP TABLE IF EXISTS public.churches;
DROP TABLE IF EXISTS public.registration_errors;

-- Create simplified error logging
CREATE TABLE IF NOT EXISTS public.registration_errors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text,
  error_message text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for error logging
CREATE INDEX IF NOT EXISTS idx_registration_errors_created_at 
  ON public.registration_errors(created_at DESC);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT ALL ON auth.users TO postgres;
GRANT ALL ON public.registration_errors TO postgres;
GRANT INSERT ON public.registration_errors TO anon;
GRANT SELECT ON public.registration_errors TO authenticated;