-- Drop existing error logging table and recreate with better structure
DROP TABLE IF EXISTS public.registration_errors;

CREATE TABLE public.registration_errors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  message text NOT NULL,
  details jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better querying
CREATE INDEX idx_registration_errors_created_at 
  ON public.registration_errors(created_at DESC);
CREATE INDEX idx_registration_errors_name 
  ON public.registration_errors(name);

-- Enable RLS
ALTER TABLE public.registration_errors ENABLE ROW LEVEL SECURITY;

-- Create policies for error logging
CREATE POLICY "public_error_insert"
  ON public.registration_errors FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "public_error_select"
  ON public.registration_errors FOR SELECT
  TO public
  USING (true);

-- Grant permissions for error logging
GRANT ALL ON public.registration_errors TO public;