import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import VideoError from './VideoError';
import { normalizeStorjUrl } from '../../utils/videoUtils';

interface DirectVideoEmbedProps {
  url: string;
  title: string;
}

const DirectVideoEmbed: React.FC<DirectVideoEmbedProps> = ({ url, title }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    try {
      const normalizedUrl = normalizeStorjUrl(url);
      setVideoUrl(normalizedUrl);
      setError(null);
    } catch (error) {
      console.error('Error processing video URL:', error);
      setError('Invalid video URL');
    }
  }, [url]);

  const handleError = () => {
    setError('Failed to load video');
    setLoading(false);
  };

  const handleLoadedMetadata = () => {
    setLoading(false);
  };

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
        <video
          className="absolute inset-0 w-full h-full"
          controls
          playsInline
          preload="metadata"
          title={title}
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleError}
          crossOrigin="anonymous"
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/quicktime" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default DirectVideoEmbed;