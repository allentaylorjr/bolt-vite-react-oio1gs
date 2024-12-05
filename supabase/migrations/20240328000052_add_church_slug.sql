-- Add slug column to churches table
ALTER TABLE public.churches
ADD COLUMN slug TEXT UNIQUE;

-- Create index for faster slug lookups
CREATE INDEX idx_churches_slug ON public.churches(slug);

-- Update existing churches to have a slug based on their name
UPDATE public.churches
SET slug = LOWER(REGEXP_REPLACE(
  REGEXP_REPLACE(
    REGEXP_REPLACE(name, '[^a-zA-Z0-9\s-]', ''),
    '\s+', '-'
  ),
  '-+', '-'
));

-- Make slug column required
ALTER TABLE public.churches
ALTER COLUMN slug SET NOT NULL;

-- Add constraint for valid slug format
ALTER TABLE public.churches
ADD CONSTRAINT valid_slug_format 
CHECK (slug ~* '^[a-z0-9]+(?:-[a-z0-9]+)*$');