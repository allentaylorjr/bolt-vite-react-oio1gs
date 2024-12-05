-- Drop existing policies
DROP POLICY IF EXISTS "enable_read" ON public.churches;
DROP POLICY IF EXISTS "enable_insert" ON public.churches;
DROP POLICY IF EXISTS "enable_update" ON public.churches;

-- Disable RLS temporarily
ALTER TABLE public.churches DISABLE ROW LEVEL SECURITY;

-- Ensure proper defaults and constraints
ALTER TABLE public.churches
  ALTER COLUMN primary_color SET DEFAULT '#2563eb',
  ALTER COLUMN button_text_color SET DEFAULT '#FFFFFF',
  ALTER COLUMN accent_color SET DEFAULT '#FFFFFF',
  ALTER COLUMN font_family SET DEFAULT 'Inter';

-- Add NOT NULL constraints
ALTER TABLE public.churches
  ALTER COLUMN primary_color SET NOT NULL,
  ALTER COLUMN button_text_color SET NOT NULL,
  ALTER COLUMN accent_color SET NOT NULL,
  ALTER COLUMN font_family SET NOT NULL;

-- Add unique constraint on slug
ALTER TABLE public.churches
  DROP CONSTRAINT IF EXISTS churches_slug_key;
ALTER TABLE public.churches
  ADD CONSTRAINT churches_slug_key UNIQUE (slug);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_churches_slug ON public.churches(slug);
CREATE INDEX IF NOT EXISTS idx_churches_id ON public.churches(id);

-- Grant necessary permissions
GRANT ALL ON public.churches TO authenticated;
GRANT SELECT, INSERT ON public.churches TO anon;
GRANT USAGE ON SCHEMA auth TO anon, authenticated;

-- Re-enable RLS with no policies (completely public access)
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;

-- Create basic policies
CREATE POLICY "public_select"
  ON public.churches FOR SELECT
  TO public
  USING (true);

CREATE POLICY "public_insert"
  ON public.churches FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "public_update"
  ON public.churches FOR UPDATE
  TO public
  USING (true);

-- Create error logging table
CREATE TABLE IF NOT EXISTS public.registration_errors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  message text NOT NULL,
  details jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for error logging
ALTER TABLE public.registration_errors ENABLE ROW LEVEL SECURITY;

-- Create policies for error logging
CREATE POLICY "public_error_insert"
  ON public.registration_errors FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "public_error_select"
  ON public.registration_errors FOR SELECT
  TO public
  USING (true);

-- Grant permissions for error logging
GRANT ALL ON public.registration_errors TO public;