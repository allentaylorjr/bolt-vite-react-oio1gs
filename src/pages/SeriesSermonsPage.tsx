import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useChurchData } from '../hooks/useChurchData';
import { ChurchThemeProvider } from '../contexts/ChurchThemeContext';
import { supabase } from '../services/supabase';
import SermonCard from '../components/SermonCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import LoadMoreButton from '../components/LoadMoreButton';
import { usePaginatedContent } from '../hooks/usePaginatedContent';
import SearchSortControls from '../components/SearchSortControls';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const SeriesContent: React.FC = () => {
  const { churchSlug, seriesId } = useParams();
  const { sermons, series, church, loading, error } = useChurchData(churchSlug);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');

  // Get filtered sermons and current series
  const currentSeries = series.find(s => s.id === seriesId);
  const seriesSermons = sermons.filter(sermon => sermon.series?.id === seriesId);

  // Set up pagination
  const {
    visibleItems: visibleSermons,
    hasMore,
    loadMore
  } = usePaginatedContent(seriesSermons, 6, searchQuery, sortOrder, 'sermons');

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!currentSeries || !church) return <ErrorMessage message="Series not found" />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#EEEEEE]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header with Logo and Website Button */}
          <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
            <div className="flex items-center">
              {church.logo_url ? (
                <img
                  src={church.logo_url}
                  alt={church.name}
                  className="h-16 w-auto object-contain"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="h-16 w-16 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {church.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to={`/${churchSlug}`}
                className="inline-flex items-center px-8 py-3 text-base font-medium rounded-lg bg-white hover:bg-gray-50 text-gray-900 shadow-sm transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Sermons
              </Link>
              {church.website && (
                <a
                  href={church.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-3 text-base font-medium rounded-lg bg-white hover:bg-gray-50 text-gray-900 shadow-sm transition-colors"
                >
                  Visit Website
                  <ExternalLink className="ml-2 h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Series Thumbnail */}
          <div className="grid lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto">
            <div className="lg:col-span-7 relative w-full max-w-[860px] mx-auto">
              <div className="aspect-video">
                <div className="absolute inset-0 rounded-lg overflow-hidden shadow-[24px_24px_52px_0px_rgba(0,0,0,0.24)]">
                  {currentSeries.thumbnail_url ? (
                    <img
                      src={currentSeries.thumbnail_url}
                      alt={currentSeries.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white opacity-50">{currentSeries.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-5 lg:pl-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">{currentSeries.name}</h1>
              {currentSeries.description && (
                <p className="text-gray-600 text-lg mb-6">{currentSeries.description}</p>
              )}
              <div className="text-gray-500">
                {seriesSermons.length} {seriesSermons.length === 1 ? 'sermon' : 'sermons'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Sermons in this Series</h2>
          <SearchSortControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleSermons.map((sermon) => (
            <SermonCard
              key={sermon.id}
              sermon={sermon}
              churchSlug={churchSlug || ''}
            />
          ))}
        </div>

        {hasMore && (
          <div className="mt-12">
            <LoadMoreButton onClick={loadMore} />
          </div>
        )}
      </div>
    </div>
  );
};

const SeriesSermonsPage: React.FC = () => {
  const { churchSlug } = useParams();
  const [churchId, setChurchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChurchId = async () => {
      if (!churchSlug) return;

      try {
        const { data, error } = await supabase
          .from('churches')
          .select('id')
          .eq('slug', churchSlug)
          .single();

        if (error) throw error;
        if (data) {
          setChurchId(data.id);
        }
      } catch (err) {
        console.error('Error fetching church:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChurchId();
  }, [churchSlug]);

  if (loading) return <LoadingSpinner />;
  if (!churchId) return <ErrorMessage message="Church not found" />;
  
  return (
    <ChurchThemeProvider churchId={churchId}>
      <SeriesContent />
    </ChurchThemeProvider>
  );
};

export default SeriesSermonsPage;
