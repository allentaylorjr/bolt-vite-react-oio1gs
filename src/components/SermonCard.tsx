import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { Sermon } from '../types/sermon';
import SermonThumbnail from './embed/SermonThumbnail';

interface SermonCardProps {
  sermon: Sermon;
  churchSlug: string;
}

const SermonCard: React.FC<SermonCardProps> = ({ sermon, churchSlug }) => {
  return (
    <Link 
      to={`/${churchSlug}/sermon/${sermon.id}`}
      className="bg-[#F2F2F2] rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <SermonThumbnail thumbnailUrl={sermon.thumbnail_url} showPlayIcon={false} />
      <div className="p-4">
        <h3 className="font-semibold text-xl text-gray-900 mb-2 leading-snug font-['Mulish',_'Montserrat',_sans-serif]">
          {sermon.title}
        </h3>
        <div className="flex flex-wrap gap-3 text-sm text-gray-500 font-['Mulish',_'Montserrat',_sans-serif]">
          {sermon.speaker && (
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{sermon.speaker.name}</span>
            </div>
          )}
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
            <span>{new Date(sermon.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SermonCard;