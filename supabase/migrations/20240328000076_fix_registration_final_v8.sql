-- Drop existing trigger and function
DROP TRIGGER IF EXISTS handle_church_creation ON auth.users;
DROP FUNCTION IF EXISTS handle_church_creation();

-- Create improved church creation function
CREATE OR REPLACE FUNCTION handle_church_creation()
RETURNS TRIGGER AS $$
BEGIN
  -- Create church record with guaranteed defaults
  INSERT INTO public.churches (
    id,
    name,
    slug,
    subdomain,
    primary_color,
    button_text_color,
    accent_color,
    font_family,
    created_at,
    updated_at
  )
  VALUES (
    (NEW.raw_user_metadata->>'church_id')::uuid,
    COALESCE(NEW.raw_user_metadata->>'name', ''),
    COALESCE(NEW.raw_user_metadata->>'slug', ''),
    COALESCE(NEW.raw_user_metadata->>'subdomain', ''),
    '#2563eb',  -- Explicit default for primary_color
    '#FFFFFF',  -- Explicit default for button_text_color
    '#FFFFFF',  -- Explicit default for accent_color
    'Inter',    -- Explicit default for font_family
    NOW(),
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for church creation
CREATE TRIGGER handle_church_creation
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_church_creation();

-- Drop existing policies
DROP POLICY IF EXISTS "Enable public read access" ON public.churches;
DROP POLICY IF EXISTS "Enable authenticated update" ON public.churches;
DROP POLICY IF EXISTS "Enable public signup" ON auth.users;

-- Create simplified policies
CREATE POLICY "allow_public_read"
  ON public.churches FOR SELECT
  USING (true);

CREATE POLICY "allow_authenticated_update"
  ON public.churches FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO postgres, authenticated, anon;
GRANT ALL ON auth.users TO postgres;
GRANT ALL ON public.churches TO postgres;
GRANT SELECT ON public.churches TO authenticated, anon;
GRANT UPDATE ON public.churches TO authenticated;

-- Enable RLS
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;