import React from 'react';
import { Link } from 'react-router-dom';
import { Library } from 'lucide-react';
import { Series } from '../types/series';
import { Sermon } from '../types/sermon';

interface SeriesSectionProps {
  series: Series;
  sermons: Sermon[];
  churchSlug: string;
}

const SeriesSection: React.FC<SeriesSectionProps> = ({ series, sermons, churchSlug }) => {
  // Get date range for series
  const getDateRange = () => {
    if (sermons.length === 0) return '';
    
    const dates = sermons.map(sermon => new Date(sermon.date));
    const earliest = new Date(Math.min(...dates.map(d => d.getTime())));
    const latest = new Date(Math.max(...dates.map(d => d.getTime())));
    
    return `${earliest.toLocaleDateString()} - ${latest.toLocaleDateString()}`;
  };

  return (
    <Link 
      to={`/${churchSlug}/series/${series.id}`}
      className="bg-[#F2F2F2] rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow block group"
    >
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative">
        {series.thumbnail_url ? (
          <>
            <img
              src={series.thumbnail_url}
              alt={series.name}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Library className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button className="px-6 py-2 bg-white text-gray-900 rounded-lg font-medium shadow-lg hover:bg-gray-50 transition-colors">
            Watch Now
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-xl text-gray-900 mb-2">{series.name}</h3>
        
        {sermons.length > 0 && (
          <div className="text-sm text-gray-500 space-y-1">
            <div>{getDateRange()}</div>
            <div>{sermons.length} {sermons.length === 1 ? 'sermon' : 'sermons'}</div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default SeriesSection;