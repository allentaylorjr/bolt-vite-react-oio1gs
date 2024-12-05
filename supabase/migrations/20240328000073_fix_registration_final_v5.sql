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
    COALESCE(NEW.raw_user_metadata->>'primary_color', '#2563eb'),
    '#FFFFFF',  -- Explicit default for button_text_color
    '#FFFFFF',  -- Explicit default for accent_color
    'Inter',    -- Explicit default for font_family
    NOW(),
    NOW()
  );

  -- Update user metadata with church_id
  UPDATE auth.users
  SET raw_user_metadata = raw_user_metadata || jsonb_build_object('church_id', NEW.id)
  WHERE id = NEW.id;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error and continue
  INSERT INTO public.registration_errors (
    user_id,
    error_message,
    error_details,
    created_at
  ) VALUES (
    NEW.id,
    SQLERRM,
    jsonb_build_object(
      'state', NEW.raw_user_metadata,
      'error', SQLERRM,
      'context', 'church_creation'
    ),
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
  primary_color = '#2563eb' WHERE primary_color IS NULL;
UPDATE public.churches SET
  button_text_color = '#FFFFFF' WHERE button_text_color IS NULL;
UPDATE public.churches SET
  accent_color = '#FFFFFF' WHERE accent_color IS NULL;
UPDATE public.churches SET
  font_family = 'Inter' WHERE font_family IS NULL;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO postgres, authenticated, anon;
GRANT ALL ON auth.users TO postgres;
GRANT ALL ON public.churches TO postgres;
GRANT SELECT ON public.churches TO authenticated, anon;