-- Drop existing policies and functions
DROP POLICY IF EXISTS "enable_registration" ON auth.users;
DROP POLICY IF EXISTS "enable_church_creation" ON public.churches;
DROP POLICY IF EXISTS "enable_church_read" ON public.churches;
DROP POLICY IF EXISTS "enable_church_update" ON public.churches;
DROP TRIGGER IF EXISTS on_registration ON auth.users;
DROP FUNCTION IF EXISTS handle_registration();

-- Create simplified church creation function
CREATE OR REPLACE FUNCTION create_church_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.churches (
    id,
    name,
    slug,
    subdomain,
    primary_color,
    button_text_color,
    accent_color,
    font_family
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_metadata->>'name', ''),
    COALESCE(NEW.raw_user_metadata->>'slug', ''),
    COALESCE(NEW.raw_user_metadata->>'subdomain', ''),
    COALESCE(NEW.raw_user_metadata->>'primary_color', '#2563eb'),
    COALESCE(NEW.raw_user_metadata->>'button_text_color', '#FFFFFF'),
    COALESCE(NEW.raw_user_metadata->>'accent_color', '#FFFFFF'),
    COALESCE(NEW.raw_user_metadata->>'font_family', 'Inter')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for church creation
CREATE TRIGGER create_church_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_church_for_user();

-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;

-- Create simple policies
CREATE POLICY "allow_public_signup"
ON auth.users FOR INSERT
WITH CHECK (true);

CREATE POLICY "allow_church_creation"
ON public.churches FOR INSERT
WITH CHECK (true);

CREATE POLICY "allow_church_read"
ON public.churches FOR SELECT
USING (true);

CREATE POLICY "allow_church_update"
ON public.churches FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  id = auth.uid()
);

-- Grant permissions
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT ALL ON auth.users TO anon;
GRANT ALL ON public.churches TO anon, authenticated;

-- Set default values
ALTER TABLE public.churches
  ALTER COLUMN button_text_color SET DEFAULT '#FFFFFF',
  ALTER COLUMN accent_color SET DEFAULT '#FFFFFF',
  ALTER COLUMN font_family SET DEFAULT 'Inter',
  ALTER COLUMN primary_color SET DEFAULT '#2563eb';