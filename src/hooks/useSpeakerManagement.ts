import { useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Speaker, SpeakerFormData } from '../types/speaker';
import { uploadSpeakerProfile } from '../services/storage/uploadService';

export function useSpeakerManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createSpeaker = async (data: SpeakerFormData): Promise<boolean> => {
    if (!user?.user_metadata?.church_id) {
      setError('Authentication required');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      let profile_picture_url = data.profile_picture_url;

      if (data.profilePicture) {
        profile_picture_url = await uploadSpeakerProfile(
          data.profilePicture,
          user.user_metadata.church_id
        );
      }

      const { error: insertError } = await supabase
        .from('speakers')
        .insert([{
          church_id: user.user_metadata.church_id,
          name: data.name,
          title: data.title,
          bio: data.bio,
          profile_picture_url
        }]);

      if (insertError) throw insertError;
      return true;
    } catch (err) {
      console.error('Error creating speaker:', err);
      setError(err instanceof Error ? err.message : 'Failed to create speaker');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSpeaker = async (speakerId: string, data: SpeakerFormData): Promise<boolean> => {
    if (!user?.user_metadata?.church_id) {
      setError('Authentication required');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const updateData: any = {
        name: data.name,
        title: data.title,
        bio: data.bio
      };

      if (data.profilePicture) {
        updateData.profile_picture_url = await uploadSpeakerProfile(
          data.profilePicture,
          user.user_metadata.church_id
        );
      }

      const { error: updateError } = await supabase
        .from('speakers')
        .update(updateData)
        .eq('id', speakerId)
        .eq('church_id', user.user_metadata.church_id);

      if (updateError) throw updateError;
      return true;
    } catch (err) {
      console.error('Error updating speaker:', err);
      setError(err instanceof Error ? err.message : 'Failed to update speaker');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSpeaker = async (speakerId: string): Promise<boolean> => {
    if (!user?.user_metadata?.church_id) {
      setError('Authentication required');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('speakers')
        .delete()
        .eq('id', speakerId)
        .eq('church_id', user.user_metadata.church_id);

      if (deleteError) throw deleteError;
      return true;
    } catch (err) {
      console.error('Error deleting speaker:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete speaker');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSpeaker,
    updateSpeaker,
    deleteSpeaker,
    loading,
    error
  };
}