-- Drop existing trigger and function
DROP TRIGGER IF EXISTS handle_church_creation ON auth.users;
DROP FUNCTION IF EXISTS handle_church_creation();

-- Create improved church creation function
CREATE OR REPLACE FUNCTION handle_church_creation()
RETURNS TRIGGER AS $$
BEGIN
  -- Create church record with defaults and metadata
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

-- Create trigger for church creation
CREATE TRIGGER handle_church_creation
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_church_creation();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO postgres;
GRANT ALL ON auth.users TO postgres;
GRANT ALL ON public.churches TO postgres;

-- Ensure proper defaults on churches table
ALTER TABLE public.churches 
  ALTER COLUMN button_text_color SET DEFAULT '#FFFFFF',
  ALTER COLUMN accent_color SET DEFAULT '#FFFFFF',
  ALTER COLUMN font_family SET DEFAULT 'Inter',
  ALTER COLUMN primary_color SET DEFAULT '#2563eb';

-- Add NOT NULL constraints
ALTER TABLE public.churches
  ALTER COLUMN button_text_color SET NOT NULL,
  ALTER COLUMN accent_color SET NOT NULL,
  ALTER COLUMN font_family SET NOT NULL,
  ALTER COLUMN primary_color SET NOT NULL;