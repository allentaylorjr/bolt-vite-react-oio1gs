import React, { useState } from 'react';
import { VideoPlayerProps } from '../../types/video';
import { getYouTubeVideoId, createYouTubeEmbedUrl } from '../../services/video/youtubeService';
import LoadingSpinner from '../LoadingSpinner';

const YouTubePlayer: React.FC<VideoPlayerProps> = ({
  url,
  title,
  config,
  onError,
  onReady
}) => {
  const [loading, setLoading] = useState(true);

  const videoId = getYouTubeVideoId(url);
  if (!videoId) {
    onError?.('Invalid YouTube URL');
    return (
      <div className="aspect-video bg-gray-900 flex items-center justify-center text-gray-400">
        <p>Invalid YouTube URL</p>
      </div>
    );
  }

  const embedUrl = createYouTubeEmbedUrl(videoId, config);

  const handleLoad = () => {
    setLoading(false);
    onReady?.();
  };

  const handleError = () => {
    setLoading(false);
    onError?.('Failed to load YouTube video');
  };

  return (
    <div className="aspect-video bg-black relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      <iframe
        className="w-full h-full"
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        referrerPolicy="origin"
      />
    </div>
  );
};

export default YouTubePlayer;