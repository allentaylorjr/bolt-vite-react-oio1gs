import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { ChurchThemeProvider } from '../../contexts/ChurchThemeContext';
import { Series } from '../../types/series';
import { Sermon } from '../../types/sermon';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SearchSortControls from '../../components/SearchSortControls';
import LoadMoreButton from '../../components/LoadMoreButton';
import { usePaginatedContent } from '../../hooks/usePaginatedContent';
import EmbedContentWrapper from '../../components/embed/EmbedContentWrapper';
import SermonThumbnail from '../../components/embed/SermonThumbnail';

const SeriesContent: React.FC = () => {
  const { churchId, seriesId } = useParams();
  const [series, setSeries] = useState<Series | null>(null);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');

  useEffect(() => {
    const fetchData = async () => {
      if (!churchId || !seriesId) {
        setError('Invalid URL');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: seriesData, error: seriesError } = await supabase
          .from('series')
          .select('*')
          .eq('id', seriesId)
          .eq('church_id', churchId)
          .single();

        if (seriesError) throw seriesError;
        if (!seriesData) throw new Error('Series not found');

        setSeries(seriesData);

        const { data: sermonsData, error: sermonsError } = await supabase
          .from('sermons')
          .select(`
            *,
            speaker:speakers(id, name),
            series:series(id, name)
          `)
          .eq('series_id', seriesId)
          .eq('church_id', churchId);

        if (sermonsError) throw sermonsError;
        setSermons(sermonsData || []);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [churchId, seriesId]);

  const {
    visibleItems,
    hasMore,
    loadMore
  } = usePaginatedContent(sermons, 6, searchQuery, sortOrder, 'sermons');

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!series) return <ErrorMessage message="Series not found" />;

  return (
    <EmbedContentWrapper>
      <div className="min-h-screen bg-white">
        <div className="bg-white pb-16 pt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to={`/embed/${churchId}/collection`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Sermons
            </Link>
            <div className="relative -mb-32">
              <div className="max-w-[850px] mx-auto rounded-xl overflow-hidden shadow-[24px_24px_52px_0px_rgba(0,0,0,0.24)]">
                {series.thumbnail_url ? (
                  <img
                    src={series.thumbnail_url}
                    alt={series.name}
                    className="w-full aspect-video object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white opacity-50">{series.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{series.name}</h1>
              {series.description && (
                <p className="text-gray-600">{series.description}</p>
              )}
            </div>
            <SearchSortControls
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleItems.map((sermon) => (
              <div
                key={sermon.id}
                onClick={() => window.location.href = `/embed/${churchId}/sermon/${sermon.id}`}
                className="bg-[#F2F2F2] rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <SermonThumbnail thumbnailUrl={sermon.thumbnail_url} showPlayIcon={false} />
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 text-lg mb-2">{sermon.title}</h4>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    {sermon.speaker && (
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1.5" />
                        {sermon.speaker.name}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      {new Date(sermon.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="mt-12">
              <LoadMoreButton onClick={loadMore} />
            </div>
          )}
        </div>
      </div>
    </EmbedContentWrapper>
  );
};

const SeriesDetailsEmbed: React.FC = () => {
  const { churchId } = useParams();
  
  return (
    <ChurchThemeProvider churchId={churchId}>
      <SeriesContent />
    </ChurchThemeProvider>
  );
};

export default SeriesDetailsEmbed;