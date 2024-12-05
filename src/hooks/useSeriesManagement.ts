import { useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Series, SeriesFormData } from '../types/series';
import { uploadSeriesThumbnail } from '../services/storage/uploadService';

export function useSeriesManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createSeries = async (data: SeriesFormData): Promise<boolean> => {
    if (!user?.user_metadata?.church_id) {
      setError('Authentication required');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      let thumbnail_url = data.thumbnail_url;

      if (data.thumbnailFile) {
        thumbnail_url = await uploadSeriesThumbnail(data.thumbnailFile, user.user_metadata.church_id);
      }

      const { error: insertError } = await supabase
        .from('series')
        .insert([{
          church_id: user.user_metadata.church_id,
          name: data.name,
          description: data.description,
          thumbnail_url
        }]);

      if (insertError) throw insertError;
      return true;
    } catch (err) {
      console.error('Error creating series:', err);
      setError(err instanceof Error ? err.message : 'Failed to create series');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSeries = async (seriesId: string, data: SeriesFormData): Promise<boolean> => {
    if (!user?.user_metadata?.church_id) {
      setError('Authentication required');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const updateData: any = {
        name: data.name,
        description: data.description
      };

      if (data.thumbnailFile) {
        updateData.thumbnail_url = await uploadSeriesThumbnail(
          data.thumbnailFile,
          user.user_metadata.church_id
        );
      }

      const { error: updateError } = await supabase
        .from('series')
        .update(updateData)
        .eq('id', seriesId)
        .eq('church_id', user.user_metadata.church_id);

      if (updateError) throw updateError;
      return true;
    } catch (err) {
      console.error('Error updating series:', err);
      setError(err instanceof Error ? err.message : 'Failed to update series');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSeries = async (seriesId: string): Promise<boolean> => {
    if (!user?.user_metadata?.church_id) {
      setError('Authentication required');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('series')
        .delete()
        .eq('id', seriesId)
        .eq('church_id', user.user_metadata.church_id);

      if (deleteError) throw deleteError;
      return true;
    } catch (err) {
      console.error('Error deleting series:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete series');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSeries,
    updateSeries,
    deleteSeries,
    loading,
    error
  };
}