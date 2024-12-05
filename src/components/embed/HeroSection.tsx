import React from 'react';
import { Calendar, User, Bookmark } from 'lucide-react';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useButtonStyles } from '../../hooks/useButtonStyles';
import { Sermon } from '../../types/sermon';
import CirclePlay from '../icons/CirclePlay';

interface HeroSectionProps {
  sermon: Sermon;
  onClick: (sermon: Sermon) => void;
  onBrowseSermons: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ sermon, onClick, onBrowseSermons }) => {
  const colors = useThemeColors();
  const whiteButtonStyles = useButtonStyles({ variant: 'white' });

  return (
    <div style={{ backgroundColor: colors.page.background }} className="pb-16 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mb-32">
          <div className="max-w-[850px] mx-auto rounded-xl overflow-hidden shadow-[24px_24px_52px_0px_rgba(0,0,0,0.24)] cursor-pointer relative group">
            {sermon.thumbnail_url ? (
              <>
                <img
                  src={sermon.thumbnail_url}
                  alt={sermon.title}
                  className="w-full aspect-video object-cover"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              </>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900" />
            )}
            
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h2 className="text-3xl font-bold text-white mb-2 leading-tight">{sermon.title}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-4">
                {sermon.speaker && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>{sermon.speaker.name}</span>
                  </div>
                )}
                {sermon.series && (
                  <div className="flex items-center">
                    <Bookmark className="w-4 h-4 mr-2" />
                    <span>{sermon.series.name}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(sermon.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => onClick(sermon)}
                  className={whiteButtonStyles.className}
                  style={whiteButtonStyles.style}
                >
                  Watch Now
                </button>
                <button
                  onClick={onBrowseSermons}
                  className="px-6 py-3 border-2 border-white rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-colors bg-transparent text-white"
                >
                  Browse Sermons
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;