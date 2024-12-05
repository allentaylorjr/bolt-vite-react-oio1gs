-- Update sermons table to use proper foreign key relationships
ALTER TABLE public.sermons
DROP COLUMN speaker,
DROP COLUMN series,
ADD COLUMN speaker_id uuid REFERENCES public.speakers(id),
ADD COLUMN series_id uuid REFERENCES public.series(id);

-- Add indexes for the new foreign keys
CREATE INDEX idx_sermons_speaker_id ON public.sermons(speaker_id);
CREATE INDEX idx_sermons_series_id ON public.sermons(series_id);