import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Series {
  id: string;
  name: string;
  description?: string;
}

export function useSermonSeries() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { churchId } = useAuth();

  useEffect(() => {
    async function fetchSeries() {
      if (!churchId) return;

      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('series')
          .select('*')
          .eq('church_id', churchId)
          .order('name');

        if (fetchError) throw fetchError;
        setSeries(data || []);
      } catch (err) {
        console.error('Error fetching series:', err);
        setError('Failed to load series');
      } finally {
        setLoading(false);
      }
    }

    fetchSeries();
  }, [churchId]);

  return { series, loading, error };
}