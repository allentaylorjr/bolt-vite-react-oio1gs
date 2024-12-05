import React from 'react';
import { useParams } from 'react-router-dom';
import { useChurchData } from '../hooks/useChurchData';
import SermonCard from '../components/SermonCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const SpeakerSermonsPage = () => {
  const { churchSlug, speakerId } = useParams();
  const { sermons, speakers, loading, error } = useChurchData(churchSlug);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const speaker = speakers.find(s => s.id === speakerId);
  const speakerSermons = sermons.filter(sermon => sermon.speaker?.id === speakerId);

  if (!speaker) return <ErrorMessage message="Speaker not found" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{speaker.name}</h1>
          {speaker.title && (
            <p className="text-gray-600 mb-2">{speaker.title}</p>
          )}
          {speaker.bio && (
            <p className="text-gray-600">{speaker.bio}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {speakerSermons.map((sermon) => (
            <SermonCard
              key={sermon.id}
              sermon={sermon}
              churchSlug={churchSlug || ''}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpeakerSermonsPage;