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
    NEW.id,
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
  ALTER COLUMN font_family SET DEFAULT 'Inter';

-- Add NOT NULL constraints
ALTER TABLE public.churches
  ALTER COLUMN primary_color SET NOT NULL,
  ALTER COLUMN button_text_color SET NOT NULL,
  ALTER COLUMN accent_color SET NOT NULL,
  ALTER COLUMN font_family SET NOT NULL;

-- Update any existing NULL values
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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO postgres;
GRANT ALL ON auth.users TO postgres;
GRANT ALL ON public.churches TO postgres;
GRANT SELECT ON public.churches TO authenticated, anon;

-- Enable RLS
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable public read access"
  ON public.churches FOR SELECT
  USING (true);

CREATE POLICY "Enable authenticated update"
  ON public.churches FOR UPDATE
  USING (auth.role() = 'authenticated' AND id = auth.uid());