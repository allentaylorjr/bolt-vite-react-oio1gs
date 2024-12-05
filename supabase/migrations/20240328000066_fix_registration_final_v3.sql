-- Drop existing policies and functions
DROP POLICY IF EXISTS "allow_public_signup" ON auth.users;
DROP POLICY IF EXISTS "allow_church_creation" ON public.churches;
DROP POLICY IF EXISTS "allow_church_read" ON public.churches;
DROP POLICY IF EXISTS "allow_church_update" ON public.churches;
DROP TRIGGER IF EXISTS create_church_on_signup ON auth.users;
DROP FUNCTION IF EXISTS create_church_for_user();

-- Create function to handle church creation
CREATE OR REPLACE FUNCTION handle_church_creation()
RETURNS TRIGGER AS $$
DECLARE
  church_id uuid;
BEGIN
  -- Generate new UUID for church
  church_id := gen_random_uuid();
  
  -- Update user metadata with church_id
  UPDATE auth.users
  SET raw_user_metadata = jsonb_set(
    raw_user_metadata,
    '{church_id}',
    to_jsonb(church_id::text)
  )
  WHERE id = NEW.id;

  -- Create church record
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
    church_id,
    COALESCE(NEW.raw_user_metadata->>'name', ''),
    COALESCE(NEW.raw_user_metadata->>'slug', ''),
    COALESCE(NEW.raw_user_metadata->>'subdomain', ''),
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

-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;

-- Create policies for auth.users
CREATE POLICY "enable_signup"
ON auth.users FOR INSERT
WITH CHECK (true);

CREATE POLICY "enable_read_own_user"
ON auth.users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "enable_update_own_user"
ON auth.users FOR UPDATE
USING (auth.uid() = id);

-- Create policies for public.churches
CREATE POLICY "enable_church_read"
ON public.churches FOR SELECT
USING (true);

CREATE POLICY "enable_church_insert"
ON public.churches FOR INSERT
WITH CHECK (true);

CREATE POLICY "enable_church_update"
ON public.churches FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT ALL ON auth.users TO anon;
GRANT ALL ON public.churches TO anon, authenticated;

-- Set default values for churches table
ALTER TABLE public.churches
  ALTER COLUMN button_text_color SET DEFAULT '#FFFFFF',
  ALTER COLUMN accent_color SET DEFAULT '#FFFFFF',
  ALTER COLUMN font_family SET DEFAULT 'Inter',
  ALTER COLUMN primary_color SET DEFAULT '#2563eb';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_churches_slug ON public.churches(slug);
CREATE INDEX IF NOT EXISTS idx_users_email ON auth.users(email);