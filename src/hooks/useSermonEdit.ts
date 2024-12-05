import { useState } from 'react';
import { updateSermon as updateSermonService } from '../services/sermons/sermonService';
import { useAuth } from '../contexts/AuthContext';
import { SermonFormData, Sermon } from '../types/sermon';

export function useSermonEdit() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const updateSermon = async (
    sermonId: string,
    formData: SermonFormData,
    originalSermon: Sermon
  ): Promise<boolean> => {
    if (!user?.user_metadata?.church_id) {
      setError('Authentication required');
      return false;
    }

    setIsUpdating(true);
    setError(null);

    try {
      await updateSermonService(
        sermonId,
        formData,
        user.user_metadata.church_id
      );
      return true;
    } catch (err) {
      console.error('Error updating sermon:', err);
      setError(err instanceof Error ? err.message : 'Failed to update sermon');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateSermon,
    isUpdating,
    error
  };
}