import { useState, useMemo } from 'react';
import { Sermon } from '../types/sermon';
import { Series } from '../types/series';
import { Speaker } from '../types/speaker';
import { usePagination } from './usePagination';

interface UseTabContentProps {
  sermons: Sermon[];
  series: Series[];
  speakers: Speaker[];
  searchQuery: string;
  sortOrder: 'recent' | 'oldest';
}

export function useTabContent({
  sermons,
  series,
  speakers,
  searchQuery,
  sortOrder
}: UseTabContentProps) {
  const [activeTab, setActiveTab] = useState<'sermons' | 'series' | 'speakers'>('sermons');

  // Filter and sort sermons
  const filteredSermons = useMemo(() => {
    return sermons
      .filter(sermon => {
        const searchLower = searchQuery.toLowerCase();
        return (
          sermon.title.toLowerCase().includes(searchLower) ||
          sermon.description?.toLowerCase().includes(searchLower) ||
          sermon.speaker?.name.toLowerCase().includes(searchLower) ||
          sermon.series?.name.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'recent' ? dateB - dateA : dateA - dateB;
      });
  }, [sermons, searchQuery, sortOrder]);

  // Filter and sort series
  const filteredSeries = useMemo(() => {
    // First filter series based on search
    const filtered = series.filter(item => {
      const searchLower = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      );
    });

    // Then sort series based on their most recent or oldest sermon
    return filtered.sort((a, b) => {
      const aSermons = sermons.filter(sermon => sermon.series?.id === a.id);
      const bSermons = sermons.filter(sermon => sermon.series?.id === b.id);

      const aDate = aSermons.length > 0
        ? Math.max(...aSermons.map(sermon => new Date(sermon.date).getTime()))
        : new Date(a.created_at).getTime();
      
      const bDate = bSermons.length > 0
        ? Math.max(...bSermons.map(sermon => new Date(sermon.date).getTime()))
        : new Date(b.created_at).getTime();

      return sortOrder === 'recent' ? bDate - aDate : aDate - bDate;
    });
  }, [series, sermons, searchQuery, sortOrder]);

  // Filter and prepare speaker sections with their sermons
  const speakerSections = useMemo(() => {
    // First filter speakers based on search
    const filteredSpeakers = speakers.filter(speaker => {
      const searchLower = searchQuery.toLowerCase();
      return (
        speaker.name.toLowerCase().includes(searchLower) ||
        speaker.title?.toLowerCase().includes(searchLower) ||
        speaker.bio?.toLowerCase().includes(searchLower)
      );
    });

    // Then prepare speaker sections with their sorted sermons
    return filteredSpeakers.map(speaker => {
      const speakerSermons = sermons
        .filter(sermon => sermon.speaker?.id === speaker.id)
        .sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return sortOrder === 'recent' ? dateB - dateA : dateA - dateB;
        });

      return {
        speaker,
        sermons: speakerSermons
      };
    });
  }, [speakers, sermons, searchQuery, sortOrder]);

  // Set up pagination for each content type
  const {
    visibleItems: visibleSermons,
    hasMore: hasMoreSermons,
    loadMore: loadMoreSermons
  } = usePagination(filteredSermons);

  const {
    visibleItems: visibleSeries,
    hasMore: hasMoreSeries,
    loadMore: loadMoreSeries
  } = usePagination(filteredSeries);

  const {
    visibleItems: visibleSpeakers,
    hasMore: hasMoreSpeakers,
    loadMore: loadMoreSpeakers
  } = usePagination(speakerSections);

  return {
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
  };
}