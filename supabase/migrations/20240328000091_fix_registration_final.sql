-- Drop existing policies
DROP POLICY IF EXISTS "allow_public_read" ON public.churches;
DROP POLICY IF EXISTS "allow_public_insert" ON public.churches;
DROP POLICY IF EXISTS "allow_auth_update" ON public.churches;

-- Enable RLS
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;

-- Create simplified policies
CREATE POLICY "enable_public_read"
  ON public.churches FOR SELECT
  USING (true);

CREATE POLICY "enable_public_insert"
  ON public.churches FOR INSERT
  WITH CHECK (true);

CREATE POLICY "enable_auth_update"
  ON public.churches FOR UPDATE
  USING (auth.role() = 'authenticated');

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
  ADD CONSTRAINT churches_slug_key UNIQUE (slug);

-- Grant necessary permissions
GRANT ALL ON public.churches TO authenticated;
GRANT SELECT, INSERT ON public.churches TO anon;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_churches_slug ON public.churches(slug);
CREATE INDEX IF NOT EXISTS idx_churches_id ON public.churches(id);

-- Enable auth policies
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create auth policies
CREATE POLICY "Enable public signup"
  ON auth.users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable users to update own record"
  ON auth.users FOR UPDATE
  USING (auth.uid() = id);

-- Grant auth permissions
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT SELECT ON auth.users TO authenticated;
GRANT INSERT ON auth.users TO anon;
GRANT UPDATE ON auth.users TO authenticated;