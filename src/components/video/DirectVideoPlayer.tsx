import React, { useState, useRef, useEffect } from 'react';
import { VideoPlayerProps } from '../../types/video';
import { getStorjVideoUrl } from '../../services/video/videoService';
import LoadingSpinner from '../LoadingSpinner';

const DirectVideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  title,
  config,
  onError,
  onReady,
  onPlay,
  onPause,
  onEnd
}) => {
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const handleLoadedMetadata = () => {
      setLoading(false);
      onReady?.();
    };

    const handleError = () => {
      setLoading(false);
      onError?.('Failed to load video');
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);
    video.addEventListener('play', () => onPlay?.());
    video.addEventListener('pause', () => onPause?.());
    video.addEventListener('ended', () => onEnd?.());

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
      video.removeEventListener('play', () => onPlay?.());
      video.removeEventListener('pause', () => onPause?.());
      video.removeEventListener('ended', () => onEnd?.());
    };
  }, [onReady, onError, onPlay, onPause, onEnd]);

  try {
    const videoUrl = getStorjVideoUrl(url);

    return (
      <div className="aspect-video bg-black relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
        <video
          ref={videoRef}
          className="w-full h-full"
          controls
          playsInline
          preload="metadata"
          title={title}
          crossOrigin="anonymous"
          {...config}
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/quicktime" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  } catch (error) {
    onError?.(error instanceof Error ? error.message : 'Failed to load video');
    return (
      <div className="aspect-video bg-gray-900 flex items-center justify-center text-gray-400">
        <p>Failed to load video</p>
      </div>
    );
  }
};

export default DirectVideoPlayer;