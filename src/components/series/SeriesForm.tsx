import React, { useState } from 'react';
import { SeriesFormData } from '../../types/series';
import { useSeriesManagement } from '../../hooks/useSeriesManagement';
import ThumbnailUploader from '../sermons/ThumbnailUploader';
import Modal from '../common/Modal';

interface SeriesFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const SeriesForm: React.FC<SeriesFormProps> = ({ onClose, onSuccess }) => {
  const { createSeries, loading, error } = useSeriesManagement();
  const [formData, setFormData] = useState<SeriesFormData>({
    name: '',
    description: ''
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createSeries({
      ...formData,
      thumbnailFile: thumbnailFile || undefined
    });
    if (success) {
      onSuccess();
      onClose();
    }
  };

  return (
    <Modal title="Add New Series" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="label" htmlFor="name">
              Series Name
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
            <label className="label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              rows={4}
            />
          </div>

          <ThumbnailUploader
            onFileSelect={setThumbnailFile}
            currentThumbnail={formData.thumbnail_url}
          />
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
            {loading ? 'Creating...' : 'Create Series'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SeriesForm;