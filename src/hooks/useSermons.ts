import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { Sermon } from '../types/sermon';
import { useAuth } from '../contexts/AuthContext';

export function useSermons() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchSermons = useCallback(async () => {
    if (!user?.user_metadata?.church_id) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('sermons')
        .select(`
          *,
          speaker:speakers(id, name),
          series:series(id, name)
        `)
        .eq('church_id', user.user_metadata.church_id)
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;
      setSermons(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching sermons:', err);
      setError('Failed to load sermons');
    } finally {
      setLoading(false);
    }
  }, [user?.user_metadata?.church_id]);

  useEffect(() => {
    fetchSermons();
  }, [fetchSermons]);

  return { sermons, loading, error, refetch: fetchSermons };
}