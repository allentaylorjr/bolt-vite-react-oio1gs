import React from 'react';

interface VideoErrorProps {
  message: string;
}

const VideoError: React.FC<VideoErrorProps> = ({ message }) => (
  <div className="aspect-video bg-black flex items-center justify-center text-white">
    <p>{message}</p>
  </div>
);

export default VideoError;