import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Speaker } from '../types/speaker';
import { useAuth } from '../contexts/AuthContext';

export function useSpeakers() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchSpeakers = async () => {
    if (!user?.user_metadata?.church_id) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('speakers')
        .select('*')
        .eq('church_id', user.user_metadata.church_id)
        .order('name');

      if (fetchError) throw fetchError;
      setSpeakers(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching speakers:', err);
      setError('Failed to load speakers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakers();
  }, [user?.user_metadata?.church_id]);

  return { speakers, loading, error, refetch: fetchSpeakers };
}