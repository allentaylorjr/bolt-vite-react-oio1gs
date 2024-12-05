-- First, ensure we can modify the tables
ALTER TABLE public.churches DISABLE ROW LEVEL SECURITY;

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS handle_church_creation ON auth.users;
DROP FUNCTION IF EXISTS handle_church_creation();

-- Update existing records to have default values
UPDATE public.churches SET
  primary_color = '#2563eb',
  button_text_color = '#FFFFFF',
  accent_color = '#FFFFFF',
  font_family = 'Inter'
WHERE 
  primary_color IS NULL OR
  button_text_color IS NULL OR
  accent_color IS NULL OR
  font_family IS NULL;

-- Add constraints and defaults
ALTER TABLE public.churches
  ALTER COLUMN primary_color SET DEFAULT '#2563eb',
  ALTER COLUMN button_text_color SET DEFAULT '#FFFFFF',
  ALTER COLUMN accent_color SET DEFAULT '#FFFFFF',
  ALTER COLUMN font_family SET DEFAULT 'Inter';

ALTER TABLE public.churches
  ALTER COLUMN primary_color SET NOT NULL,
  ALTER COLUMN button_text_color SET NOT NULL,
  ALTER COLUMN accent_color SET NOT NULL,
  ALTER COLUMN font_family SET NOT NULL;

-- Create improved church creation function
CREATE OR REPLACE FUNCTION handle_church_creation()
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
    font_family,
    created_at,
    updated_at
  )
  SELECT
    NEW.id,
    COALESCE(NEW.raw_user_metadata->>'name', ''),
    COALESCE(NEW.raw_user_metadata->>'slug', ''),
    COALESCE(NEW.raw_user_metadata->>'subdomain', ''),
    COALESCE(NEW.raw_user_metadata->>'primary_color', '#2563eb'),
    COALESCE(NEW.raw_user_metadata->>'button_text_color', '#FFFFFF'),
    COALESCE(NEW.raw_user_metadata->>'accent_color', '#FFFFFF'),
    COALESCE(NEW.raw_user_metadata->>'font_family', 'Inter'),
    NOW(),
    NOW();

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in handle_church_creation: %', SQLERRM;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for church creation
CREATE TRIGGER handle_church_creation
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_church_creation();

-- Re-enable RLS with proper policies
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable public read"
  ON public.churches
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable authenticated update"
  ON public.churches
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO authenticated, anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;