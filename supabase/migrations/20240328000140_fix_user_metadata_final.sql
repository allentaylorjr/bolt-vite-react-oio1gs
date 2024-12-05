-- Drop existing trigger and function
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
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'slug', ''),
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for church creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Update existing users to have church_id if missing
DO $$
DECLARE
  user_record RECORD;
  new_church_id uuid;
BEGIN
  FOR user_record IN 
    SELECT * FROM auth.users 
    WHERE raw_user_meta_data->>'church_id' IS NULL
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
      COALESCE(user_record.raw_user_meta_data->>'name', ''),
      COALESCE(user_record.raw_user_meta_data->>'slug', ''),
      '#2563eb',
      '#FFFFFF',
      '#FFFFFF',
      'Inter',
      NOW(),
      NOW()
    );

    -- Update user metadata
    UPDATE auth.users
    SET raw_user_meta_data = jsonb_set(
      COALESCE(raw_user_meta_data, '{}'::jsonb),
      '{church_id}',
      to_jsonb(new_church_id::text)
    )
    WHERE id = user_record.id;
  END LOOP;
END $$;

-- Update sermon policies to use correct metadata field
DROP POLICY IF EXISTS "enable_sermon_read" ON public.sermons;
DROP POLICY IF EXISTS "enable_sermon_insert" ON public.sermons;
DROP POLICY IF EXISTS "enable_sermon_update" ON public.sermons;
DROP POLICY IF EXISTS "enable_sermon_delete" ON public.sermons;

CREATE POLICY "enable_sermon_read"
  ON public.sermons FOR SELECT
  USING (true);

CREATE POLICY "enable_sermon_insert"
  ON public.sermons FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    church_id = (auth.jwt() -> 'user_meta_data' ->> 'church_id')::uuid
  );

CREATE POLICY "enable_sermon_update"
  ON public.sermons FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    church_id = (auth.jwt() -> 'user_meta_data' ->> 'church_id')::uuid
  );

CREATE POLICY "enable_sermon_delete"
  ON public.sermons FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    church_id = (auth.jwt() -> 'user_meta_data' ->> 'church_id')::uuid
  );

-- Grant necessary permissions
GRANT ALL ON public.churches TO postgres;
GRANT ALL ON auth.users TO postgres;
GRANT ALL ON public.sermons TO authenticated;
GRANT SELECT ON public.sermons TO anon;