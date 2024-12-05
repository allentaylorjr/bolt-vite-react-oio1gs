import React, { useEffect, useRef, useState } from 'react';
import { VideoPlayerProps } from '../../../types/video';
import { getYouTubeVideoId } from '../../../services/video/youtubeService';
import PlayerWrapper from '../shared/PlayerWrapper';
import ErrorDisplay from '../shared/ErrorDisplay';

declare global {
  interface Window {
    YT: {
      Player: any;
      loaded: number;
      ready: (callback: () => void) => void;
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

const YouTubePlayer: React.FC<VideoPlayerProps> = ({
  url,
  title,
  onError,
  onReady,
  onPlay,
  onPause,
  onEnd
}) => {
  const [loading, setLoading] = useState(true);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const videoId = getYouTubeVideoId(url);
  if (!videoId) {
    onError?.('Invalid YouTube URL');
    return <ErrorDisplay message="Invalid YouTube URL" />;
  }

  useEffect(() => {
    // Load YouTube API script
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Initialize player when API is ready
    const initPlayer = () => {
      if (!containerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 0,
          modestbranding: 1,
          rel: 0,
          origin: window.location.origin
        },
        events: {
          onReady: () => {
            setLoading(false);
            onReady?.();
          },
          onStateChange: (event: any) => {
            switch (event.data) {
              case 1: // playing
                onPlay?.();
                break;
              case 2: // paused
                onPause?.();
                break;
              case 0: // ended
                onEnd?.();
                break;
            }
          },
          onError: () => {
            setLoading(false);
            onError?.('Failed to load YouTube video');
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, onReady, onPlay, onPause, onEnd, onError]);

  return (
    <PlayerWrapper loading={loading}>
      <div ref={containerRef} className="w-full h-full" />
    </PlayerWrapper>
  );
};

export default YouTubePlayer;