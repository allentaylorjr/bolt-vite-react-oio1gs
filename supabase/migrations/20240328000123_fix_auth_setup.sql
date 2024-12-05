-- Reset everything first
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Grant usage on public schema
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Grant anon and authenticated access to auth schema
GRANT USAGE ON SCHEMA auth TO anon, authenticated;

-- Enable RLS on auth.users
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create auth policies
CREATE POLICY "Enable public signup"
  ON auth.users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable users to update own record"
  ON auth.users
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Enable users to read own record"
  ON auth.users
  FOR SELECT
  USING (auth.uid() = id);

-- Grant necessary permissions
GRANT SELECT ON auth.users TO authenticated;
GRANT INSERT ON auth.users TO anon;
GRANT UPDATE ON auth.users TO authenticated;

-- Enable email auth
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;