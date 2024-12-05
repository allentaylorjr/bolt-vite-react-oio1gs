-- Drop existing error logging table and recreate with proper structure
DROP TABLE IF EXISTS public.registration_errors;

CREATE TABLE public.registration_errors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text,
  name text NOT NULL, -- Error name/type
  message text NOT NULL, -- Error message
  details jsonb, -- Additional error details
  stack_trace text,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create indexes for better querying
CREATE INDEX idx_registration_errors_created_at 
  ON public.registration_errors(created_at DESC);
CREATE INDEX idx_registration_errors_name 
  ON public.registration_errors(name);
CREATE INDEX idx_registration_errors_email 
  ON public.registration_errors(email);

-- Enable RLS
ALTER TABLE public.registration_errors ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable insert for authenticated"
  ON public.registration_errors
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable select for authenticated"
  ON public.registration_errors
  FOR SELECT
  TO authenticated
  USING (true);

-- Grant permissions
GRANT ALL ON public.registration_errors TO authenticated;
GRANT SELECT ON public.registration_errors TO anon;