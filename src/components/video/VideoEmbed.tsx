import React from 'react';
import { getVideoProvider } from '../../utils/videoUtils';
import YouTubeEmbed from './YouTubeEmbed';
import VimeoEmbed from './VimeoEmbed';
import DirectVideoEmbed from './DirectVideoEmbed';
import VideoError from './VideoError';

interface VideoEmbedProps {
  url: string;
  title: string;
}

const VideoEmbed: React.FC<VideoEmbedProps> = ({ url, title }) => {
  if (!url) {
    return <VideoError message="No video URL provided" />;
  }

  const provider = getVideoProvider(url);

  switch (provider) {
    case 'youtube':
      return <YouTubeEmbed url={url} title={title} />;
    case 'vimeo':
      return <VimeoEmbed url={url} title={title} />;
    case 'direct':
      return <DirectVideoEmbed url={url} title={title} />;
    default:
      return <VideoError message="Unsupported video provider" />;
  }
};

export default VideoEmbed;