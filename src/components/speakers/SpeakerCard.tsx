import React from 'react';
import { Trash2, User, Pencil } from 'lucide-react';
import { Speaker } from '../../types/speaker';

interface SpeakerCardProps {
  speaker: Speaker;
  onDelete: (id: string) => void;
  onEdit: (speaker: Speaker) => void;
}

const SpeakerCard: React.FC<SpeakerCardProps> = ({ speaker, onDelete, onEdit }) => {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          {speaker.profile_picture_url ? (
            <img
              src={speaker.profile_picture_url}
              alt={speaker.name}
              className="w-12 h-12 rounded-full object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{speaker.name}</h3>
            {speaker.title && (
              <p className="text-sm text-gray-500">{speaker.title}</p>
            )}
            {speaker.bio && (
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {speaker.bio}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(speaker)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit speaker"
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(speaker.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete speaker"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpeakerCard;