-- Drop existing auth policies
DROP POLICY IF EXISTS "Enable read for users" ON auth.users;
DROP POLICY IF EXISTS "Enable insert for signup" ON auth.users;
DROP POLICY IF EXISTS "Enable update for users" ON auth.users;

-- Allow public access to auth endpoints
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create policies for auth operations
CREATE POLICY "Enable signup"
ON auth.users FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable read own user data"
ON auth.users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Enable update own user data"
ON auth.users FOR UPDATE
USING (auth.uid() = id);

-- Ensure churches table has correct policies
DROP POLICY IF EXISTS "churches_select" ON public.churches;
DROP POLICY IF EXISTS "churches_insert" ON public.churches;
DROP POLICY IF EXISTS "churches_update" ON public.churches;

CREATE POLICY "Enable church creation on signup"
ON public.churches FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable church read"
ON public.churches FOR SELECT
USING (true);

CREATE POLICY "Enable church update by owner"
ON public.churches FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  id = (auth.jwt() -> 'user_metadata' ->> 'church_id')::uuid
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT SELECT ON auth.users TO authenticated;
GRANT INSERT ON auth.users TO anon;
GRANT UPDATE ON auth.users TO authenticated;

-- Ensure church creation trigger works
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
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
    gen_random_uuid(),
    NEW.raw_user_metadata->>'name',
    NEW.raw_user_metadata->>'slug',
    NEW.raw_user_metadata->>'subdomain',
    NEW.raw_user_metadata->>'primary_color',
    NEW.raw_user_metadata->>'button_text_color',
    NEW.raw_user_metadata->>'accent_color',
    NEW.raw_user_metadata->>'font_family'
  );
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();