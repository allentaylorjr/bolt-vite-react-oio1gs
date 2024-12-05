import React from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

interface SearchSortControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortOrder: 'recent' | 'oldest';
  onSortChange: (value: 'recent' | 'oldest') => void;
}

const SearchSortControls: React.FC<SearchSortControlsProps> = ({
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortChange
}) => {
  const handleClearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className="flex gap-4">
      {/* Search Control */}
      <div className="relative w-[300px]">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="w-full bg-gray-100 hover:bg-gray-200 transition-colors pl-12 pr-12 py-3 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Sort Control */}
      <div className="relative">
        <select
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value as 'recent' | 'oldest')}
          className="appearance-none bg-gray-100 hover:bg-gray-200 transition-colors px-6 py-3 pr-12 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option value="recent">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
};

export default SearchSortControls;