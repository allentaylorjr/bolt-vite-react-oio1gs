import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useChurchData } from '../hooks/useChurchData';
import { useTabContent } from '../hooks/useTabContent';
import { ChurchThemeProvider } from '../contexts/ChurchThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import HeroSection from '../components/church/HeroSection';
import TabNavigation from '../components/church/TabNavigation';
import SearchSortControls from '../components/SearchSortControls';
import SermonCard from '../components/SermonCard';
import SeriesSection from '../components/SeriesSection';
import SpeakerSection from '../components/SpeakerSection';
import LoadMoreButton from '../components/LoadMoreButton';

const ChurchSermonPage = () => {
  const { churchSlug } = useParams();
  const { church, sermons, series, speakers, loading, error } = useChurchData(churchSlug);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');

  const {
    activeTab,
    setActiveTab,
    visibleSermons,
    hasMoreSermons,
    loadMoreSermons,
    visibleSeries,
    hasMoreSeries,
    loadMoreSeries,
    visibleSpeakers,
    hasMoreSpeakers,
    loadMoreSpeakers
  } = useTabContent({
    sermons,
    series,
    speakers,
    searchQuery,
    sortOrder
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!church || !sermons.length) return <ErrorMessage message="No content found" />;

  const featuredSermon = sermons[0];

  return (
    <ChurchThemeProvider churchId={church.id}>
      <div className="min-h-screen bg-gray-50">
        <HeroSection sermon={featuredSermon} churchSlug={churchSlug || ''} church={church} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
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
                    churchSlug={churchSlug || ''}
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
                {visibleSeries.map((series) => (
                  <SeriesSection
                    key={series.id}
                    series={series}
                    sermons={sermons.filter(sermon => sermon.series?.id === series.id)}
                    churchSlug={churchSlug || ''}
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
                {visibleSpeakers.map(({ speaker, sermons }) => (
                  <SpeakerSection
                    key={speaker.id}
                    speaker={speaker}
                    sermons={sermons}
                    churchSlug={churchSlug || ''}
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
    </ChurchThemeProvider>
  );
};

export default ChurchSermonPage;