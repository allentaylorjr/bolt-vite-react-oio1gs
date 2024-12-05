-- Add updated_at column to sermons table
ALTER TABLE public.sermons
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sermons_updated_at
    BEFORE UPDATE ON public.sermons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();