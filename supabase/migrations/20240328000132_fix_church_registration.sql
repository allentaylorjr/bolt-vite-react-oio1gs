-- Create function to handle church creation on user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create church record with defaults
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
    NEW.id,
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
    raw_user_metadata,
    '{church_id}',
    to_jsonb(NEW.id::text)
  )
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION handle_new_user() TO postgres;