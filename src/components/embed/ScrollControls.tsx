import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ScrollControlsProps {
  onScroll: (direction: 'left' | 'right') => void;
}

const ScrollControls: React.FC<ScrollControlsProps> = ({ onScroll }) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => onScroll('left')}
        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-6 h-6 text-gray-600" />
      </button>
      <button
        onClick={() => onScroll('right')}
        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-6 h-6 text-gray-600" />
      </button>
    </div>
  );
};

export default ScrollControls;