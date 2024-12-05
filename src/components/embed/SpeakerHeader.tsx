import React from 'react';
import { User } from 'lucide-react';
import { Speaker } from '../../types/speaker';

interface SpeakerHeaderProps {
  speaker: Speaker;
}

const SpeakerHeader: React.FC<SpeakerHeaderProps> = ({ speaker }) => {
  return (
    <div className="flex items-center space-x-4">
      {speaker.profile_picture_url ? (
        <img
          src={speaker.profile_picture_url}
          alt={speaker.name}
          className="w-12 h-12 rounded-full object-cover"
          crossOrigin="anonymous"
        />
      ) : (
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-gray-400" />
        </div>
      )}
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{speaker.name}</h3>
        {speaker.title && (
          <p className="text-sm text-gray-500">{speaker.title}</p>
        )}
      </div>
    </div>
  );
};

export default SpeakerHeader;