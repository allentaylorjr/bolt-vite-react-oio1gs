import React, { useEffect, useRef } from 'react';
import { VideoPlayerProps } from '../../types/video';
import { getVimeoVideoId } from '../../services/video/videoService';

const VimeoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  title,
  onError,
  onReady,
  onPlay,
  onPause,
  onEnd
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes('vimeo.com')) return;

      try {
        const data = JSON.parse(event.data);
        switch (data.event) {
          case 'ready':
            onReady?.();
            break;
          case 'play':
            onPlay?.();
            break;
          case 'pause':
            onPause?.();
            break;
          case 'ended':
            onEnd?.();
            break;
        }
      } catch (error) {
        console.error('Error processing Vimeo player event:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onReady, onPlay, onPause, onEnd]);

  const videoId = getVimeoVideoId(url);
  if (!videoId) {
    onError?.('Invalid Vimeo URL');
    return (
      <div className="aspect-video bg-gray-900 flex items-center justify-center text-gray-400">
        <p>Invalid Vimeo URL</p>
      </div>
    );
  }

  const embedUrl = `https://player.vimeo.com/video/${videoId}?api=1&autopause=0`;

  return (
    <div className="aspect-video">
      <iframe
        ref={iframeRef}
        className="w-full h-full"
        src={embedUrl}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        onError={() => onError?.('Failed to load Vimeo video')}
      />
    </div>
  );
};

export default VimeoPlayer;