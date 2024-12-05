import React from 'react';
import { Link } from 'react-router-dom';
import { User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Speaker } from '../types/speaker';
import { Sermon } from '../types/sermon';
import SermonThumbnail from './embed/SermonThumbnail';

interface SpeakerSectionProps {
  speaker: Speaker;
  sermons: Sermon[];
  churchSlug: string;
}

const SpeakerSection: React.FC<SpeakerSectionProps> = ({ speaker, sermons, churchSlug }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#F2F2F2] rounded-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {speaker.profile_picture_url ? (
            <img
              src={speaker.profile_picture_url}
              alt={speaker.name}
              className="w-12 h-12 rounded-full object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{speaker.name}</h3>
            {speaker.title && (
              <p className="text-sm text-gray-500">{speaker.title}</p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {sermons.map((sermon) => (
            <Link
              key={sermon.id}
              to={`/${churchSlug}/sermon/${sermon.id}`}
              className="flex-none w-[300px] bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              style={{ scrollSnapAlign: 'start' }}
            >
              <SermonThumbnail thumbnailUrl={sermon.thumbnail_url} showPlayIcon={false} />
              <div className="p-4">
                <h4 className="font-medium text-gray-900 line-clamp-2 mb-2">
                  {sermon.title}
                </h4>
                <p className="text-sm text-gray-500">
                  {new Date(sermon.date).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="absolute top-0 right-0 bottom-0 w-48 pointer-events-none bg-gradient-to-l from-[#f2f2f2] to-transparent z-10" />
      </div>
    </div>
  );
};

export default SpeakerSection;