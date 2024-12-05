import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <div className="aspect-video bg-gray-900 flex items-center justify-center text-gray-400">
    <p>{message}</p>
  </div>
);

export default ErrorDisplay;