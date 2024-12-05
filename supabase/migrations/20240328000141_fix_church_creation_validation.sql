-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create function to generate a valid slug
CREATE OR REPLACE FUNCTION generate_valid_slug(input_text text)
RETURNS text AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 1;
BEGIN
  -- Convert to lowercase and replace spaces/special chars with hyphens
  base_slug := lower(regexp_replace(input_text, '[^a-zA-Z0-9]+', '-', 'g'));
  -- Remove leading/trailing hyphens
  base_slug := trim(both '-' from base_slug);
  -- Ensure slug is not empty
  IF base_slug = '' OR base_slug IS NULL THEN
    base_slug := 'church';
  END IF;
  
  -- Try the base slug first
  final_slug := base_slug;
  
  -- Add numbers until we find a unique slug
  WHILE EXISTS (SELECT 1 FROM public.churches WHERE slug = final_slug) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Create improved church creation function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  church_id uuid;
  church_name text;
  church_slug text;
BEGIN
  -- Generate church ID
  church_id := gen_random_uuid();
  
  -- Get church name from metadata or generate default
  church_name := COALESCE(NEW.raw_user_meta_data->>'name', 'My Church');
  
  -- Generate valid slug
  church_slug := generate_valid_slug(
    COALESCE(NEW.raw_user_meta_data->>'slug', church_name)
  );
  
  -- Create church record
  INSERT INTO public.churches (
    id,
    name,
    slug,
    primary_color,
    button_text_color,
    accent_color,
    font_family,
    created_at,
    updated_at
  )
  VALUES (
    church_id,
    church_name,
    church_slug,
    '#2563eb',
    '#FFFFFF',
    '#FFFFFF',
    'Inter',
    NOW(),
    NOW()
  );

  -- Update user metadata with church_id
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{church_id}',
    to_jsonb(church_id::text)
  )
  WHERE id = NEW.id;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error and continue
  RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for church creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Update existing churches with empty slugs
DO $$
DECLARE
  church_record RECORD;
BEGIN
  FOR church_record IN 
    SELECT id, name, slug 
    FROM public.churches 
    WHERE slug IS NULL OR slug = ''
  LOOP
    UPDATE public.churches
    SET slug = generate_valid_slug(
      COALESCE(church_record.name, 'church')
    )
    WHERE id = church_record.id;
  END LOOP;
END $$;

-- Add NOT NULL constraint to slug
ALTER TABLE public.churches
  ALTER COLUMN slug SET NOT NULL;

-- Add check constraint for valid slug format
ALTER TABLE public.churches
  ADD CONSTRAINT valid_slug_format 
  CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');

-- Grant necessary permissions
GRANT ALL ON public.churches TO postgres;
GRANT ALL ON auth.users TO postgres;