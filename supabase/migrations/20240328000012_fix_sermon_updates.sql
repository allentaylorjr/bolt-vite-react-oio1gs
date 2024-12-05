-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS update_sermons_updated_at ON public.sermons;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Ensure updated_at column exists and has the correct default
ALTER TABLE public.sermons 
  DROP COLUMN IF EXISTS updated_at,
  ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Update existing rows to have an updated_at value
UPDATE public.sermons 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- Make updated_at NOT NULL
ALTER TABLE public.sermons 
  ALTER COLUMN updated_at SET NOT NULL;

-- Update RLS policies to allow updates
DROP POLICY IF EXISTS "Enable sermon updates" ON public.sermons;

CREATE POLICY "Enable sermon updates"
ON public.sermons
FOR UPDATE
USING (
  church_id = auth.current_user()->>'church_id'::uuid
)
WITH CHECK (
  church_id = auth.current_user()->>'church_id'::uuid
);