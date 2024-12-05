-- Drop existing policies and functions
DROP POLICY IF EXISTS "Enable public signup" ON auth.users;
DROP POLICY IF EXISTS "Enable church creation" ON public.churches;
DROP FUNCTION IF EXISTS begin_transaction CASCADE;
DROP FUNCTION IF EXISTS commit_transaction CASCADE;
DROP FUNCTION IF EXISTS rollback_transaction CASCADE;

-- Create transaction management functions
CREATE OR REPLACE FUNCTION handle_registration()
RETURNS TRIGGER AS $$
BEGIN
  -- Create church record with defaults
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
    NEW.raw_user_metadata->>'name',
    NEW.raw_user_metadata->>'slug',
    NEW.raw_user_metadata->>'subdomain',
    COALESCE(NEW.raw_user_metadata->>'primary_color', '#2563eb'),
    COALESCE(NEW.raw_user_metadata->>'button_text_color', '#FFFFFF'),
    COALESCE(NEW.raw_user_metadata->>'accent_color', '#FFFFFF'),
    COALESCE(NEW.raw_user_metadata->>'font_family', 'Inter')
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for registration
DROP TRIGGER IF EXISTS on_registration ON auth.users;
CREATE TRIGGER on_registration
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_registration();

-- Update table permissions
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "enable_registration"
ON auth.users FOR INSERT
WITH CHECK (true);

CREATE POLICY "enable_church_creation"
ON public.churches FOR INSERT
WITH CHECK (true);

CREATE POLICY "enable_church_read"
ON public.churches FOR SELECT
USING (true);

CREATE POLICY "enable_church_update"
ON public.churches FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT INSERT ON auth.users TO anon;
GRANT ALL ON public.churches TO authenticated;
GRANT INSERT ON public.churches TO anon;
GRANT SELECT ON public.churches TO anon;

-- Ensure proper defaults on churches table
ALTER TABLE public.churches 
  ALTER COLUMN button_text_color SET DEFAULT '#FFFFFF',
  ALTER COLUMN accent_color SET DEFAULT '#FFFFFF',
  ALTER COLUMN font_family SET DEFAULT 'Inter',
  ALTER COLUMN primary_color SET DEFAULT '#2563eb';