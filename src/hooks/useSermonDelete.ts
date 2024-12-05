import { useState } from 'react';
import { deleteSermon } from '../services/sermons/sermonService';
import { useAuth } from '../contexts/AuthContext';

export function useSermonDelete() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleDelete = async (sermonId: string): Promise<boolean> => {
    if (!user?.user_metadata?.church_id) {
      setError('Authentication required');
      return false;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteSermon(sermonId, user.user_metadata.church_id);
      return true;
    } catch (err) {
      console.error('Error deleting sermon:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete sermon');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteSermon: handleDelete,
    isDeleting,
    error
  };
}