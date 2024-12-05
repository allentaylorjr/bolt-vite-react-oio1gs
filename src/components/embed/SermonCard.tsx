import React from 'react';
import { User, Calendar } from 'lucide-react';
import { Sermon } from '../../types/sermon';

interface SermonCardProps {
  sermon: Sermon;
  onClick: () => void;
  variant?: 'carousel' | 'grid';
}

const SermonCard: React.FC<SermonCardProps> = ({ sermon, onClick, variant = 'carousel' }) => {
  const isCarousel = variant === 'carousel';
  
  return (
    <div
      className={`flex-none ${isCarousel ? 'w-[300px] bg-white' : 'w-full bg-[#f4f4f4]'} rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer`}
      style={{ scrollSnapAlign: 'start' }}
      onClick={onClick}
    >
      <div className="aspect-video bg-gray-100 relative group">
        {sermon.thumbnail_url ? (
          <>
            <img
              src={sermon.thumbnail_url}
              alt={sermon.title}
              className="absolute inset-0 w-full h-full object-cover"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button className="px-6 py-2 rounded-lg font-medium shadow-lg transition-colors bg-white text-black">
            Watch Now
          </button>
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-gray-900 text-lg leading-snug line-clamp-2 mb-1.5 font-['Mulish',_'Montserrat',_sans-serif]">
          {sermon.title}
        </h4>
        <div className="flex items-center gap-3 text-xs leading-none text-gray-500 font-['Mulish',_'Montserrat',_sans-serif] font-medium">
          {sermon.speaker && (
            <div className="flex items-center">
              <User className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
              <span>{sermon.speaker.name}</span>
            </div>
          )}
          <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
            <span>{new Date(sermon.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SermonCard;