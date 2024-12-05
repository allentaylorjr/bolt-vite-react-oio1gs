-- Create error logging table
CREATE TABLE IF NOT EXISTS public.registration_errors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  email text,
  error_code text NOT NULL,
  error_message text NOT NULL,
  error_details jsonb,
  stack_trace text,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create indexes for better querying
CREATE INDEX IF NOT EXISTS idx_registration_errors_created_at 
  ON public.registration_errors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registration_errors_error_code 
  ON public.registration_errors(error_code);
CREATE INDEX IF NOT EXISTS idx_registration_errors_email 
  ON public.registration_errors(email);

-- Enable RLS
ALTER TABLE public.registration_errors ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Grant permissions
GRANT USAGE ON SCHEMA public TO service_role;
GRANT INSERT, SELECT ON public.registration_errors TO service_role;