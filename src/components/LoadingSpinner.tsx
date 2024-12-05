import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-16">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-4 border-blue-200"></div>
      <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
    </div>
  </div>
);

export default LoadingSpinner;