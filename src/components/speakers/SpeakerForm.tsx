import React, { useState } from 'react';
import { SpeakerFormData } from '../../types/speaker';
import { useSpeakerManagement } from '../../hooks/useSpeakerManagement';
import SpeakerImageUpload from './SpeakerImageUpload';
import Modal from '../common/Modal';

interface SpeakerFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const SpeakerForm: React.FC<SpeakerFormProps> = ({ onClose, onSuccess }) => {
  const { createSpeaker, loading, error } = useSpeakerManagement();
  const [formData, setFormData] = useState<SpeakerFormData>({
    name: '',
    title: '',
    bio: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createSpeaker(formData);
    if (success) {
      onSuccess();
      onClose();
    }
  };

  const handleProfilePictureSelect = (file: File) => {
    setFormData(prev => ({ ...prev, profilePicture: file }));
  };

  return (
    <Modal title="Add New Speaker" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <SpeakerImageUpload onFileSelect={handleProfilePictureSelect} />

          <div>
            <label className="label" htmlFor="name">
              Speaker Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
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
              className="input"
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
              className="input"
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
            {loading ? 'Creating...' : 'Create Speaker'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SpeakerForm;