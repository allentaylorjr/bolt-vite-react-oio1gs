import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Church } from '../types/church';
import { Sermon } from '../types/sermon';
import { Series } from '../types/series';
import { Speaker } from '../types/speaker';

export function useChurchData(churchSlug: string | undefined) {
  const [church, setChurch] = useState<Church | null>(null);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!churchSlug) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch church details
        const { data: churchData, error: churchError } = await supabase
          .from('churches')
          .select('*')
          .eq('slug', churchSlug)
          .single();

        if (churchError) throw churchError;
        if (!churchData) throw new Error('Church not found');

        setChurch(churchData);

        // Fetch sermons
        const { data: sermonsData, error: sermonsError } = await supabase
          .from('sermons')
          .select(`
            *,
            speaker:speakers(id, name),
            series:series(id, name)
          `)
          .eq('church_id', churchData.id)
          .order('date', { ascending: false });

        if (sermonsError) throw sermonsError;
        setSermons(sermonsData || []);

        // Fetch series
        const { data: seriesData, error: seriesError } = await supabase
          .from('series')
          .select('*')
          .eq('church_id', churchData.id)
          .order('name');

        if (seriesError) throw seriesError;
        setSeries(seriesData || []);

        // Fetch speakers
        const { data: speakersData, error: speakersError } = await supabase
          .from('speakers')
          .select('*')
          .eq('church_id', churchData.id)
          .order('name');

        if (speakersError) throw speakersError;
        setSpeakers(speakersData || []);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [churchSlug]);

  return { church, sermons, series, speakers, loading, error };
}