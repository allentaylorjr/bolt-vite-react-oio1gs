import React, { useRef, useCallback } from 'react';
import { useThemeColors } from '../hooks/useThemeColors';

interface LoadMoreButtonProps {
  onClick: () => Promise<void>;
  loading?: boolean;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ onClick, loading }) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const colors = useThemeColors();

  const handleClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;

    scrollPositionRef.current = window.scrollY;
    const buttonTop = buttonRef.current?.getBoundingClientRect().top || 0;
    const buttonOffset = buttonTop + scrollPositionRef.current;

    try {
      await onClick();
      requestAnimationFrame(() => {
        const newButtonTop = buttonRef.current?.getBoundingClientRect().top || 0;
        const scrollTo = buttonOffset - newButtonTop + scrollPositionRef.current;
        window.scrollTo(0, scrollTo);
      });
    } catch (error) {
      console.error('Error loading more content:', error);
    }
  }, [onClick, loading]);

  const buttonStyles = {
    backgroundColor: colors?.button?.background || '#000000',
    color: colors?.button?.text || '#FFFFFF'
  };

  return (
    <div ref={buttonRef} className="flex justify-center py-8">
      <button
        onClick={handleClick}
        disabled={loading}
        className="min-w-[200px] px-6 py-3 rounded-lg font-medium transition-colors hover:opacity-90 disabled:opacity-50"
        style={buttonStyles}
      >
        {loading ? 'Loading...' : 'Load More'}
      </button>
    </div>
  );
};

export default LoadMoreButton;