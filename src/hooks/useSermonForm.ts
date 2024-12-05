import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { uploadToStorj } from '../lib/storj';
import { useAuth } from '../contexts/AuthContext';

export function useSermonForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, churchId } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user || !churchId) {
      setError('Authentication required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const videoFile = formData.get('video') as File;
      const videoUrl = formData.get('videoUrl') as string;

      let finalVideoUrl = videoUrl;

      // Handle file upload to Storj if a file is selected
      if (videoFile?.size) {
        try {
          finalVideoUrl = await uploadToStorj(videoFile, churchId);
        } catch (uploadError) {
          console.error('Storj upload error:', uploadError);
          throw new Error('Failed to upload video file');
        }
      }

      // Insert sermon record
      const { error: insertError } = await supabase
        .from('sermons')
        .insert({
          church_id: churchId,
          title: formData.get('title'),
          description: formData.get('description'),
          speaker_id: formData.get('speaker') || null,
          series_id: formData.get('series') || null,
          date: formData.get('date'),
          video_url: finalVideoUrl
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error('Failed to save sermon details');
      }

      // Reset form and close modal
      e.currentTarget.reset();
      window.location.reload();
    } catch (err) {
      console.error('Error submitting sermon:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload sermon');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting, error };
}