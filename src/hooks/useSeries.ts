import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Series } from '../types/series';
import { useAuth } from '../contexts/AuthContext';

export function useSeries() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchSeries = async () => {
    if (!user?.user_metadata?.church_id) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('series')
        .select('*')
        .eq('church_id', user.user_metadata.church_id)
        .order('name');

      if (fetchError) throw fetchError;
      setSeries(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching series:', err);
      setError('Failed to load series');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, [user?.user_metadata?.church_id]);

  return { series, loading, error, refetch: fetchSeries };
}