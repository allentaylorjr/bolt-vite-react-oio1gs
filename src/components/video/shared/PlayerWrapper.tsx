import React from 'react';
import LoadingSpinner from '../../LoadingSpinner';

interface PlayerWrapperProps {
  children: React.ReactNode;
  loading?: boolean;
}

const PlayerWrapper: React.FC<PlayerWrapperProps> = ({ children, loading }) => {
  return (
    <div className="aspect-video bg-black relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      {children}
    </div>
  );
};

export default PlayerWrapper;