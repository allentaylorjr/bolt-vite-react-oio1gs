-- Add button_text_color column to churches table
ALTER TABLE public.churches
ADD COLUMN IF NOT EXISTS button_text_color TEXT;

-- Set default value for existing rows
UPDATE public.churches
SET button_text_color = '#FFFFFF'
WHERE button_text_color IS NULL;

-- Make button_text_color NOT NULL
ALTER TABLE public.churches
ALTER COLUMN button_text_color SET NOT NULL;