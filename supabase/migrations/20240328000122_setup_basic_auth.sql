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

-- Enable basic auth operations
ALTER TABLE auth.users SECURITY DEFINER;

-- Create auth policies
CREATE POLICY "Enable signup" ON auth.users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update for users based on email" ON auth.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Grant necessary permissions
GRANT SELECT ON auth.users TO authenticated;
GRANT INSERT ON auth.users TO anon;
GRANT UPDATE ON auth.users TO authenticated;

-- Enable postgrest authentication
ALTER DATABASE postgres SET "auth.jwt.claims.email" TO 'email';