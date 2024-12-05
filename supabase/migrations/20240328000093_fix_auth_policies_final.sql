-- First, drop all existing policies
DROP POLICY IF EXISTS "enable_signup" ON auth.users;
DROP POLICY IF EXISTS "enable_update_own_user" ON auth.users;
DROP POLICY IF EXISTS "enable_insert_for_signup" ON public.churches;
DROP POLICY IF EXISTS "enable_read_for_all" ON public.churches;
DROP POLICY IF EXISTS "enable_update_for_owner" ON public.churches;

-- Disable RLS temporarily
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.churches DISABLE ROW LEVEL SECURITY;

-- Create churches table policies
CREATE POLICY "churches_read"
  ON public.churches FOR SELECT
  USING (true);

CREATE POLICY "churches_insert"
  ON public.churches FOR INSERT
  WITH CHECK (true);

CREATE POLICY "churches_update"
  ON public.churches FOR UPDATE
  USING (auth.uid() = id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT USAGE ON SCHEMA auth TO anon, authenticated;

GRANT ALL ON public.churches TO authenticated;
GRANT SELECT, INSERT ON public.churches TO anon;

GRANT SELECT ON auth.users TO authenticated;
GRANT INSERT ON auth.users TO anon;
GRANT UPDATE ON auth.users TO authenticated;

-- Re-enable RLS
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;

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