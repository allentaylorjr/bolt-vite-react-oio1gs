import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { ChurchThemeProvider } from '../../contexts/ChurchThemeContext';
import { useChurchTheme } from '../../contexts/ChurchThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import SearchSortControls from '../../components/SearchSortControls';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import LoadMoreButton from '../../components/LoadMoreButton';
import TabNavigation from '../../components/embed/TabNavigation';
import { usePaginatedContent } from '../../hooks/usePaginatedContent';
import { Sermon } from '../../types/sermon';
import { Series } from '../../types/series';
import { Speaker } from '../../types/speaker';
import SermonCard from '../../components/embed/SermonCard';
import SeriesCard from '../../components/embed/SeriesCard';
import SpeakerCarousel from '../../components/embed/SpeakerCarousel';
import HeroSection from '../../components/embed/HeroSection';
import EmbedContentWrapper from '../../components/embed/EmbedContentWrapper';

type TabType = 'sermons' | 'series' | 'speakers';

const CollectionContent = () => {
  const { theme } = useChurchTheme();
  const colors = useThemeColors();
  const { churchId } = useParams();
  const navigate = useNavigate();
  const sermonsTabRef = React.useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('sermons');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');

  React.useEffect(() => {
    const fetchData = async () => {
      if (!churchId) {
        setError('Invalid church ID');
        setLoading(false);
        return;
      }

      try {
        const [sermonsResponse, seriesResponse, speakersResponse] = await Promise.all([
          supabase
            .from('sermons')
            .select(`
              *,
              speaker:speakers(id, name),
              series:series(id, name)
            `)
            .eq('church_id', churchId)
            .order('date', { ascending: false }),
          supabase
            .from('series')
            .select('*')
            .eq('church_id', churchId)
            .order('created_at', { ascending: false }),
          supabase
            .from('speakers')
            .select('*')
            .eq('church_id', churchId)
            .order('created_at', { ascending: false })
        ]);

        if (sermonsResponse.error) throw sermonsResponse.error;
        if (seriesResponse.error) throw seriesResponse.error;
        if (speakersResponse.error) throw speakersResponse.error;

        setSermons(sermonsResponse.data || []);
        setSeries(seriesResponse.data || []);
        setSpeakers(speakersResponse.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [churchId]);

  const handleSermonClick = (sermon: Sermon) => {
    navigate(`/embed/${churchId}/sermon/${sermon.id}`);
  };

  const handleBrowseSermons = () => {
    setActiveTab('sermons');
    sermonsTabRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const {
    visibleItems: visibleSermons,
    hasMore: hasMoreSermons,
    loadMore: loadMoreSermons
  } = usePaginatedContent(sermons, 6, searchQuery, sortOrder, 'sermons');

  const {
    visibleItems: visibleSeries,
    hasMore: hasMoreSeries,
    loadMore: loadMoreSeries
  } = usePaginatedContent(series, 6, searchQuery, sortOrder, 'series');

  const {
    visibleItems: visibleSpeakers,
    hasMore: hasMoreSpeakers,
    loadMore: loadMoreSpeakers
  } = usePaginatedContent(speakers, 6, searchQuery, sortOrder, 'speakers');

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!sermons.length) return <ErrorMessage message="No sermons found" />;

  const featuredSermon = sermons[0];

  return (
    <EmbedContentWrapper>
      <div className="min-h-screen" style={{ backgroundColor: theme.backgroundColor }}>
        <HeroSection 
          sermon={featuredSermon} 
          onClick={handleSermonClick}
          onBrowseSermons={handleBrowseSermons}
        />

        <div className="pt-40 pb-16" ref={sermonsTabRef} style={{ backgroundColor: theme.backgroundColor }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <TabNavigation 
                activeTab={activeTab} 
                onTabChange={(tab) => setActiveTab(tab)} 
              />
              <SearchSortControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
              />
            </div>

            {activeTab === 'sermons' && (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {visibleSermons.map((sermon) => (
                    <SermonCard
                      key={sermon.id}
                      sermon={sermon}
                      onClick={() => handleSermonClick(sermon)}
                      variant="grid"
                    />
                  ))}
                </div>
                {hasMoreSermons && (
                  <div className="mt-12">
                    <LoadMoreButton onClick={loadMoreSermons} />
                  </div>
                )}
              </>
            )}

            {activeTab === 'series' && (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {visibleSeries.map((item) => (
                    <SeriesCard
                      key={item.id}
                      series={item}
                      sermons={sermons.filter(sermon => sermon.series?.id === item.id)}
                    />
                  ))}
                </div>
                {hasMoreSeries && (
                  <div className="mt-12">
                    <LoadMoreButton onClick={loadMoreSeries} />
                  </div>
                )}
              </>
            )}

            {activeTab === 'speakers' && (
              <>
                <div className="space-y-12">
                  {visibleSpeakers.map((speaker) => (
                    <SpeakerCarousel
                      key={speaker.id}
                      speaker={speaker}
                      sermons={sermons.filter(sermon => sermon.speaker?.id === speaker.id)}
                      onSermonClick={handleSermonClick}
                    />
                  ))}
                </div>
                {hasMoreSpeakers && (
                  <div className="mt-12">
                    <LoadMoreButton onClick={loadMoreSpeakers} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </EmbedContentWrapper>
  );
};

const SermonCollectionEmbed = () => {
  const { churchId } = useParams();
  
  return (
    <ChurchThemeProvider churchId={churchId}>
      <CollectionContent />
    </ChurchThemeProvider>
  );
};

export default SermonCollectionEmbed;