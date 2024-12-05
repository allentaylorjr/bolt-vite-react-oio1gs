import { useState } from 'react';
import { createSermon } from '../services/sermons/sermonService';
import { useAuth } from '../contexts/AuthContext';
import { SermonFormData } from '../types/sermon';

export function useSermonUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const uploadSermon = async (formData: SermonFormData): Promise<boolean> => {
    if (!user?.user_metadata?.church_id) {
      setError('Authentication required');
      return false;
    }

    setIsUploading(true);
    setError(null);

    try {
      await createSermon(formData, user.user_metadata.church_id);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload sermon';
      setError(message);
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadSermon,
    isUploading,
    error
  };
}