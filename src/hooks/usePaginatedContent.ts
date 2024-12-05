import { useState, useMemo, useCallback } from 'react';
import { Sermon } from '../types/sermon';
import { Series } from '../types/series';
import { Speaker } from '../types/speaker';

type ContentItem = Sermon | Series | Speaker;

export function usePaginatedContent<T extends ContentItem>(
  items: T[],
  itemsPerPage: number = 6,
  searchQuery: string = '',
  sortOrder: 'recent' | 'oldest' = 'recent',
  contentType: 'sermons' | 'series' | 'speakers' = 'sermons'
) {
  const [page, setPage] = useState(1);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter(item => {
      switch (contentType) {
        case 'sermons':
          const sermon = item as Sermon;
          return (
            sermon.title?.toLowerCase().includes(query) ||
            sermon.description?.toLowerCase().includes(query) ||
            sermon.speaker?.name?.toLowerCase().includes(query) ||
            sermon.series?.name?.toLowerCase().includes(query)
          );
        case 'series':
          const series = item as Series;
          return (
            series.name?.toLowerCase().includes(query) ||
            series.description?.toLowerCase().includes(query)
          );
        case 'speakers':
          const speaker = item as Speaker;
          return (
            speaker.name?.toLowerCase().includes(query) ||
            speaker.title?.toLowerCase().includes(query) ||
            speaker.bio?.toLowerCase().includes(query)
          );
        default:
          return false;
      }
    });
  }, [items, searchQuery, contentType]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      switch (contentType) {
        case 'sermons':
          const sermonA = a as Sermon;
          const sermonB = b as Sermon;
          const dateA = new Date(sermonA.date).getTime();
          const dateB = new Date(sermonB.date).getTime();
          return sortOrder === 'recent' ? dateB - dateA : dateA - dateB;
        case 'series':
        case 'speakers':
          const itemA = a as Series | Speaker;
          const itemB = b as Series | Speaker;
          const createdA = new Date(itemA.created_at).getTime();
          const createdB = new Date(itemB.created_at).getTime();
          return sortOrder === 'recent' ? createdB - createdA : createdA - createdB;
        default:
          return 0;
      }
    });
  }, [filteredItems, sortOrder, contentType]);

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const hasMore = page < totalPages;
  
  const visibleItems = useMemo(() => {
    return sortedItems.slice(0, page * itemsPerPage);
  }, [sortedItems, page, itemsPerPage]);
  
  const loadMore = useCallback(() => {
    return new Promise<void>(resolve => {
      setPage(prev => Math.min(prev + 1, totalPages));
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    });
  }, [totalPages]);
  
  const reset = useCallback(() => {
    setPage(1);
  }, []);
  
  return {
    visibleItems,
    hasMore,
    loadMore,
    reset,
    total: sortedItems.length,
    currentPage: page
  };
}