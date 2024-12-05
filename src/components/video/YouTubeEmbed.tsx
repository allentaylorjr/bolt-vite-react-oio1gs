import React, { useState } from 'react';
import { extractVideoId } from '../../utils/videoUtils';
import LoadingSpinner from '../LoadingSpinner';
import VideoError from './VideoError';

interface YouTubeEmbedProps {
  url: string;
  title: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ url, title }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoId = extractVideoId(url);

  if (!videoId) {
    return <VideoError message="Invalid YouTube URL" />;
  }

  const handleError = () => {
    setError('Failed to load video');
    setLoading(false);
  };

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=0`;

  return (
    <div className="aspect-video bg-black relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      {error ? (
        <VideoError message={error} />
      ) : (
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
          onLoad={() => setLoading(false)}
          onError={handleError}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default YouTubeEmbed;