import React from 'react';
import CirclePlay from '../icons/CirclePlay';

interface SermonThumbnailProps {
  thumbnailUrl?: string | null;
  showPlayIcon?: boolean;
}

const SermonThumbnail: React.FC<SermonThumbnailProps> = ({ thumbnailUrl, showPlayIcon = true }) => {
  return (
    <div className="aspect-video bg-gray-100 relative group">
      {thumbnailUrl ? (
        <>
          <img
            src={thumbnailUrl}
            alt="Sermon thumbnail"
            className="absolute inset-0 w-full h-full object-cover"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
      )}
      
      {showPlayIcon ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <CirclePlay className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105" />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button className="px-6 py-2 rounded-lg font-medium shadow-lg transition-colors bg-white text-black">
            Watch Now
          </button>
        </div>
      )}
    </div>
  );
};

export default SermonThumbnail;