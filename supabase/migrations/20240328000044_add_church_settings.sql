-- Add new columns to churches table
ALTER TABLE public.churches
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS primary_color TEXT,
ADD COLUMN IF NOT EXISTS accent_color TEXT,
ADD COLUMN IF NOT EXISTS font_family TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Update existing rows to have an updated_at value
UPDATE public.churches 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- Make updated_at NOT NULL
ALTER TABLE public.churches 
ALTER COLUMN updated_at SET NOT NULL;

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_churches_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_churches_updated_at
    BEFORE UPDATE ON public.churches
    FOR EACH ROW
    EXECUTE FUNCTION update_churches_updated_at();