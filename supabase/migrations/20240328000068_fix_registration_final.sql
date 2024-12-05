-- Drop existing trigger and function
DROP TRIGGER IF EXISTS handle_church_creation ON auth.users;
DROP FUNCTION IF EXISTS handle_church_creation();

-- Create improved church creation function with proper defaults
CREATE OR REPLACE FUNCTION handle_church_creation()
RETURNS TRIGGER AS $$
DECLARE
  church_id uuid;
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
    NEW.id,
    COALESCE(NEW.raw_user_metadata->>'name', ''),
    COALESCE(NEW.raw_user_metadata->>'slug', ''),
    COALESCE(NEW.raw_user_metadata->>'subdomain', ''),
    COALESCE(NEW.raw_user_metadata->>'primary_color', '#2563eb'),
    COALESCE(NEW.raw_user_metadata->>'button_text_color', '#FFFFFF'),
    COALESCE(NEW.raw_user_metadata->>'accent_color', '#FFFFFF'),
    COALESCE(NEW.raw_user_metadata->>'font_family', 'Inter'),
    NOW(),
    NOW()
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Failed to create church: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for church creation
CREATE TRIGGER handle_church_creation
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_church_creation();

-- Ensure proper defaults and constraints
ALTER TABLE public.churches
  ALTER COLUMN primary_color SET DEFAULT '#2563eb',
  ALTER COLUMN button_text_color SET DEFAULT '#FFFFFF',
  ALTER COLUMN accent_color SET DEFAULT '#FFFFFF',
  ALTER COLUMN font_family SET DEFAULT 'Inter',
  ALTER COLUMN primary_color SET NOT NULL,
  ALTER COLUMN button_text_color SET NOT NULL,
  ALTER COLUMN accent_color SET NOT NULL,
  ALTER COLUMN font_family SET NOT NULL;

-- Update any existing NULL values
UPDATE public.churches 
SET 
  primary_color = '#2563eb' WHERE primary_color IS NULL,
  button_text_color = '#FFFFFF' WHERE button_text_color IS NULL,
  accent_color = '#FFFFFF' WHERE accent_color IS NULL,
  font_family = 'Inter' WHERE font_family IS NULL;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO postgres, authenticated, anon;
GRANT ALL ON auth.users TO postgres;
GRANT ALL ON public.churches TO postgres;
GRANT SELECT ON public.churches TO authenticated, anon;