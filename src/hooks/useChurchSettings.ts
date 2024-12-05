import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ChurchSettings } from '../services/settings/types';
import { updateChurchSettings } from '../services/settings/settingsService';

export function useChurchSettings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const updateSettings = async (settings: ChurchSettings, logoFile?: File): Promise<boolean> => {
    if (!user) {
      setError('Authentication required');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await updateChurchSettings(settings, logoFile);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update settings');
      }

      return true;
    } catch (err) {
      console.error('Error updating settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update settings');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateSettings,
    loading,
    error
  };
}