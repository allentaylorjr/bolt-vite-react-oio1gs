import React, { useState } from 'react';
import { extractVideoId } from '../../utils/videoUtils';
import LoadingSpinner from '../LoadingSpinner';
import VideoError from './VideoError';

interface VimeoEmbedProps {
  url: string;
  title: string;
}

const VimeoEmbed: React.FC<VimeoEmbedProps> = ({ url, title }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoId = extractVideoId(url);

  if (!videoId) {
    return <VideoError message="Invalid Vimeo URL" />;
  }

  const handleError = () => {
    setError('Failed to load video');
    setLoading(false);
  };

  const embedUrl = `https://player.vimeo.com/video/${videoId}?h=d846b9e718&badge=0&autopause=0&player_id=0&app_id=58479`;

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
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
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

export default VimeoEmbed;