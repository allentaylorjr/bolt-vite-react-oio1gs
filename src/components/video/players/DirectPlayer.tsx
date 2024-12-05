import React, { useState, useRef, useEffect } from 'react';
import { VideoPlayerProps } from '../../../types/video';
import { getStorjVideoUrl } from '../../../services/video/videoService';
import PlayerWrapper from '../shared/PlayerWrapper';
import ErrorDisplay from '../shared/ErrorDisplay';

const DirectPlayer: React.FC<VideoPlayerProps> = ({
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
      <PlayerWrapper loading={loading}>
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
      </PlayerWrapper>
    );
  } catch (error) {
    onError?.(error instanceof Error ? error.message : 'Failed to load video');
    return <ErrorDisplay message="Failed to load video" />;
  }
};

export default DirectPlayer;