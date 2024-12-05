-- Create error logging table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.registration_errors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  message text NOT NULL,
  details jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better querying
CREATE INDEX IF NOT EXISTS idx_registration_errors_created_at 
  ON public.registration_errors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registration_errors_name 
  ON public.registration_errors(name);

-- Enable RLS
ALTER TABLE public.registration_errors ENABLE ROW LEVEL SECURITY;

-- Create policies for error logging
CREATE POLICY "enable_error_insert"
  ON public.registration_errors FOR INSERT
  WITH CHECK (true);

CREATE POLICY "enable_error_select"
  ON public.registration_errors FOR SELECT
  USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT INSERT ON public.registration_errors TO anon, authenticated;
GRANT SELECT ON public.registration_errors TO authenticated;