import React, { useState, useEffect, useRef } from 'react';
import { VideoPlayerProps } from '../../../types/video';
import { createVimeoEmbedUrl } from '../../../services/video/vimeoService';
import PlayerWrapper from '../shared/PlayerWrapper';
import ErrorDisplay from '../shared/ErrorDisplay';

const VimeoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  title,
  onError,
  onReady,
  onPlay,
  onPause,
  onEnd
}) => {
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes('vimeo.com')) return;

      try {
        const data = JSON.parse(event.data);
        switch (data.event) {
          case 'ready':
            setLoading(false);
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
        console.error('Error processing Vimeo event:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onReady, onPlay, onPause, onEnd]);

  const embedUrl = createVimeoEmbedUrl(url);
  if (!embedUrl) {
    onError?.('Invalid Vimeo URL');
    return <ErrorDisplay message="Invalid Vimeo URL" />;
  }

  return (
    <PlayerWrapper loading={loading}>
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title={title}
        className="w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        onError={() => {
          setLoading(false);
          onError?.('Failed to load Vimeo video');
        }}
      />
    </PlayerWrapper>
  );
};

export default VimeoPlayer;