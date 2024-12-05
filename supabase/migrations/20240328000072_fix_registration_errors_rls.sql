-- Enable RLS for registration_errors table
ALTER TABLE public.registration_errors ENABLE ROW LEVEL SECURITY;

-- Create policies for registration_errors
CREATE POLICY "Enable insert for service role"
  ON public.registration_errors
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Enable select for service role"
  ON public.registration_errors
  FOR SELECT
  TO service_role
  USING (true);

-- Ensure proper permissions
GRANT USAGE ON SCHEMA public TO service_role;
GRANT INSERT, SELECT ON public.registration_errors TO service_role;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registration_errors_user_id 
  ON public.registration_errors(user_id);
CREATE INDEX IF NOT EXISTS idx_registration_errors_created_at 
  ON public.registration_errors(created_at DESC);

-- Add cascade delete when user is deleted
ALTER TABLE public.registration_errors
  DROP CONSTRAINT IF EXISTS registration_errors_user_id_fkey,
  ADD CONSTRAINT registration_errors_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;