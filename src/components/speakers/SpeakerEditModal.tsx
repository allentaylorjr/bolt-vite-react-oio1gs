import React, { useState } from 'react';
import { Speaker, SpeakerFormData } from '../../types/speaker';
import { useSpeakerManagement } from '../../hooks/useSpeakerManagement';
import SpeakerImageUpload from './SpeakerImageUpload';
import Modal from '../common/Modal';

interface SpeakerEditModalProps {
  speaker: Speaker;
  onClose: () => void;
  onSuccess: () => void;
}

const SpeakerEditModal: React.FC<SpeakerEditModalProps> = ({ speaker, onClose, onSuccess }) => {
  const { updateSpeaker, loading, error } = useSpeakerManagement();
  const [formData, setFormData] = useState<SpeakerFormData>({
    name: speaker.name,
    title: speaker.title || '',
    bio: speaker.bio || '',
    profile_picture_url: speaker.profile_picture_url
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateSpeaker(speaker.id, formData);
    if (success) {
      onSuccess();
      onClose();
    }
  };

  const handleProfilePictureSelect = (file: File) => {
    setFormData(prev => ({ ...prev, profilePicture: file }));
  };

  return (
    <Modal title="Edit Speaker" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <SpeakerImageUpload
            onFileSelect={handleProfilePictureSelect}
            currentImage={speaker.profile_picture_url}
          />

          <div>
            <label className="label" htmlFor="name">
              Speaker Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input py-3"
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input py-3"
              placeholder="e.g. Senior Pastor, Guest Speaker"
            />
          </div>

          <div>
            <label className="label" htmlFor="bio">
              Biography
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="input py-3"
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SpeakerEditModal;