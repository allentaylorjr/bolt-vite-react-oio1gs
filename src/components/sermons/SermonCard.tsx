import React from 'react';
import { Calendar, User, Bookmark, Trash2, Pencil } from 'lucide-react';
import { Sermon } from '../../types/sermon';
import DeleteSermonButton from './DeleteSermonButton';

interface SermonCardProps {
  sermon: Sermon;
  onEdit?: (sermon: Sermon) => void;
  onDelete?: () => void;
}

const SermonCard: React.FC<SermonCardProps> = ({ sermon, onEdit, onDelete }) => {
  return (
    <div className="card overflow-hidden">
      <div 
        className="aspect-video bg-gray-100 relative group"
      >
        {sermon.thumbnail_url ? (
          <>
            <img
              src={`${sermon.thumbnail_url}`}
              alt={sermon.title}
              className="absolute inset-0 w-full h-full object-cover"
              crossOrigin="anonymous"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-200" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100 group-hover:from-blue-100 group-hover:to-gray-200 transition-all duration-200" />
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-xl text-gray-900 line-clamp-2 leading-tight">
            {sermon.title}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit?.(sermon)}
              className="p-2 text-gray-500 hover:text-blue-600 focus:outline-none"
              title="Edit sermon"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <DeleteSermonButton sermonId={sermon.id} onSuccess={onDelete || (() => {})} />
          </div>
        </div>
        
        {sermon.description && (
          <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
            {sermon.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {sermon.speaker && (
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{sermon.speaker.name}</span>
            </div>
          )}
          
          {sermon.series && (
            <div className="flex items-center">
              <Bookmark className="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{sermon.series.name}</span>
            </div>
          )}
          
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
            <span>{new Date(sermon.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SermonCard;