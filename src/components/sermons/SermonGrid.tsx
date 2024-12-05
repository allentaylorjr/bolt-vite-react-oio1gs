import React from 'react';
import SermonCard from './SermonCard';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';
import { Sermon } from '../../types/sermon';

interface SermonGridProps {
  sermons: Sermon[];
  loading: boolean;
  error: string | null;
  onSermonClick?: (sermon: Sermon) => void;
  onSermonDelete?: () => void;
}

const SermonGrid: React.FC<SermonGridProps> = ({
  sermons,
  loading,
  error,
  onSermonClick,
  onSermonDelete
}) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  if (sermons.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">No sermons found.</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {sermons.map((sermon) => (
        <SermonCard 
          key={sermon.id} 
          sermon={sermon}
          onEdit={onSermonClick}
          onDelete={onSermonDelete}
        />
      ))}
    </div>
  );
};

export default SermonGrid;