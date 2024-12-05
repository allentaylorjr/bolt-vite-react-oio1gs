-- Drop all existing policies and RLS
ALTER TABLE public.churches DISABLE ROW LEVEL SECURITY;
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;

-- Ensure proper defaults for churches
ALTER TABLE public.churches
  ALTER COLUMN primary_color SET DEFAULT '#2563eb',
  ALTER COLUMN button_text_color SET DEFAULT '#FFFFFF',
  ALTER COLUMN accent_color SET DEFAULT '#FFFFFF',
  ALTER COLUMN font_family SET DEFAULT 'Inter';

-- Add unique constraint on slug
ALTER TABLE public.churches
  DROP CONSTRAINT IF EXISTS churches_slug_key;
ALTER TABLE public.churches
  ADD CONSTRAINT churches_slug_key UNIQUE (slug);

-- Create error logging table
CREATE TABLE IF NOT EXISTS public.registration_errors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  message text NOT NULL,
  details jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Grant necessary permissions
GRANT ALL ON public.churches TO authenticated;
GRANT SELECT, INSERT ON public.churches TO anon;
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT ALL ON public.registration_errors TO authenticated;
GRANT INSERT ON public.registration_errors TO anon;