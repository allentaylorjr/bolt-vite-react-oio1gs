import React from 'react';
import { Trash2, Library, Pencil } from 'lucide-react';
import { Series } from '../../types/series';

interface SeriesCardProps {
  series: Series;
  onDelete: (id: string) => void;
  onEdit: (series: Series) => void;
}

const SeriesCard: React.FC<SeriesCardProps> = ({ series, onDelete, onEdit }) => {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
            {series.thumbnail_url ? (
              <img
                src={series.thumbnail_url}
                alt={series.name}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                <Library className="h-8 w-8 text-blue-600" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{series.name}</h3>
            {series.description && (
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {series.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(series)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit series"
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(series.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete series"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeriesCard;