import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Bookmark, ExternalLink } from 'lucide-react';
import { useChurchTheme } from '../../contexts/ChurchThemeContext';
import { Sermon } from '../../types/sermon';
import CirclePlay from '../icons/CirclePlay';

interface HeroSectionProps {
  sermon: Sermon;
  churchSlug: string;
  church: {
    name: string;
    logo_url?: string;
    website?: string;
  };
}

const HeroSection: React.FC<HeroSectionProps> = ({ sermon, churchSlug, church }) => {
  const { theme } = useChurchTheme();

  return (
    <div className="bg-[#EEEEEE]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with Logo and Website Button */}
        <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
          <div className="flex items-center">
            {church.logo_url ? (
              <img
                src={church.logo_url}
                alt={church.name}
                className="h-16 w-auto object-contain"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="h-16 w-16 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {church.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          {church.website && (
            <a
              href={church.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-2 text-sm font-medium rounded-lg bg-white hover:bg-gray-50 text-gray-900 shadow-sm transition-colors"
            >
              Visit Website
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          )}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto">
          {/* Video Thumbnail - Takes up 7 columns */}
          <div className="lg:col-span-7 relative w-full max-w-[860px] mx-auto">
            <div className="aspect-video">
              <Link
                to={`/${churchSlug}/sermon/${sermon.id}`}
                className="block absolute inset-0 rounded-lg overflow-hidden shadow-[24px_24px_52px_0px_rgba(0,0,0,0.24)] group"
              >
                {sermon.thumbnail_url ? (
                  <img
                    src={sermon.thumbnail_url}
                    alt={sermon.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
                )}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <CirclePlay className="w-28 h-28 text-white opacity-80 group-hover:opacity-100 transition-all transform group-hover:scale-105" />
                </div>
              </Link>
            </div>
          </div>

          {/* Content - Takes up 5 columns */}
          <div className="lg:col-span-5 lg:pl-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 leading-tight">
              {sermon.title}
            </h1>
            {sermon.description && (
              <p className="text-gray-400 text-lg font-light mb-3 line-clamp-3 leading-snug">
                {sermon.description}
              </p>
            )}
            <div className="flex flex-wrap gap-4 text-base font-light text-gray-400 mb-6">
              {sermon.speaker && (
                <Link 
                  to={`/${churchSlug}/speaker/${sermon.speaker.id}`}
                  className="flex items-center hover:text-blue-400 transition-colors"
                >
                  <User className="w-5 h-5 mr-2 text-gray-500" />
                  <span>{sermon.speaker.name}</span>
                </Link>
              )}
              {sermon.series && (
                <Link 
                  to={`/${churchSlug}/series/${sermon.series.id}`}
                  className="flex items-center hover:text-blue-400 transition-colors"
                >
                  <Bookmark className="w-5 h-5 mr-2 text-gray-500" />
                  <span>{sermon.series.name}</span>
                </Link>
              )}
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                <span>{new Date(sermon.date).toLocaleDateString()}</span>
              </div>
            </div>
            <Link
              to={`/${churchSlug}/sermon/${sermon.id}`}
              className="inline-flex items-center px-16 py-5 text-xl font-medium rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              style={{ 
                backgroundColor: theme.buttonColor,
                color: theme.buttonTextColor
              }}
            >
              Watch Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;