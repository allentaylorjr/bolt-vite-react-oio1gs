-- Drop existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create improved church creation function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  church_id uuid;
BEGIN
  -- Generate new UUID for church
  church_id := gen_random_uuid();
  
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
    COALESCE(NEW.raw_user_metadata->>'name', ''),
    COALESCE(NEW.raw_user_metadata->>'slug', ''),
    '#2563eb',
    '#FFFFFF',
    '#FFFFFF',
    'Inter',
    NOW(),
    NOW()
  );

  -- Update user metadata with church_id
  UPDATE auth.users
  SET raw_user_metadata = jsonb_set(
    COALESCE(raw_user_metadata, '{}'::jsonb),
    '{church_id}',
    to_jsonb(church_id::text)
  )
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for church creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

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

-- Update existing users to have church_id if missing
DO $$
DECLARE
  user_record RECORD;
  new_church_id uuid;
BEGIN
  FOR user_record IN 
    SELECT * FROM auth.users 
    WHERE raw_user_metadata->>'church_id' IS NULL
  LOOP
    new_church_id := gen_random_uuid();
    
    -- Create church
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
      new_church_id,
      COALESCE(user_record.raw_user_metadata->>'name', ''),
      COALESCE(user_record.raw_user_metadata->>'slug', ''),
      '#2563eb',
      '#FFFFFF',
      '#FFFFFF',
      'Inter',
      NOW(),
      NOW()
    );

    -- Update user metadata
    UPDATE auth.users
    SET raw_user_metadata = jsonb_set(
      COALESCE(raw_user_metadata, '{}'::jsonb),
      '{church_id}',
      to_jsonb(new_church_id::text)
    )
    WHERE id = user_record.id;
  END LOOP;
END $$;

-- Grant necessary permissions
GRANT ALL ON public.churches TO postgres;
GRANT ALL ON auth.users TO postgres;