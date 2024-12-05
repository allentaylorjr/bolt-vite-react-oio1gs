import React from 'react';
import { VideoPlayerProps } from '../../types/video';
import { getVideoType } from '../../services/video/videoService';
import YouTubePlayer from './players/YouTubePlayer';
import VimeoPlayer from './players/VimeoPlayer';
import DirectPlayer from './players/DirectPlayer';
import ErrorDisplay from './shared/ErrorDisplay';

const VideoPlayer: React.FC<VideoPlayerProps> = (props) => {
  if (!props.url) {
    return <ErrorDisplay message="No video URL provided" />;
  }

  const videoType = getVideoType(props.url);

  switch (videoType) {
    case 'youtube':
      return <YouTubePlayer {...props} />;
    case 'vimeo':
      return <VimeoPlayer {...props} />;
    case 'direct':
      return <DirectPlayer {...props} />;
    default:
      return <ErrorDisplay message="Unsupported video format" />;
  }
};

export default VideoPlayer;