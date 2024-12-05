import React from 'react';
import { Library } from 'lucide-react';
import { Series } from '../../types/series';
import { Sermon } from '../../types/sermon';

interface SeriesCardProps {
  series: Series;
  sermons: Sermon[];
}

const SeriesCard: React.FC<SeriesCardProps> = ({ series, sermons }) => {
  return (
    <div 
      onClick={() => window.location.href = `/embed/${series.church_id}/series/${series.id}`}
      className="bg-[#F2F2F2] rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
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
          <button className="px-6 py-2 rounded-lg font-medium shadow-lg transition-colors bg-white text-black">
            Watch Now
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-xl text-gray-900 mb-2">{series.name}</h3>
        {series.description && (
          <p className="text-gray-600 line-clamp-2 mb-2">{series.description}</p>
        )}
        <div className="text-sm text-gray-500">
          {sermons.length} {sermons.length === 1 ? 'sermon' : 'sermons'}
        </div>
      </div>
    </div>
  );
};

export default SeriesCard;