import { useState } from 'react';

export function usePagination<T>(items: T[], itemsPerPage: number = 6) {
  const [page, setPage] = useState(1);
  
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasMore = page < totalPages;
  
  const visibleItems = items.slice(0, page * itemsPerPage);
  
  const loadMore = () => {
    setPage(prev => Math.min(prev + 1, totalPages));
  };
  
  const reset = () => {
    setPage(1);
  };
  
  return {
    visibleItems,
    hasMore,
    loadMore,
    reset
  };
}