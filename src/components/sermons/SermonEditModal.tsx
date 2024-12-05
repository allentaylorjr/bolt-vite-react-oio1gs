import React, { useState } from 'react';
import { Sermon, SermonFormData } from '../../types/sermon';
import { useSermonEdit } from '../../hooks/useSermonEdit';
import { useSeries } from '../../hooks/useSeries';
import { useSpeakers } from '../../hooks/useSpeakers';
import ThumbnailUploader from './ThumbnailUploader';
import Modal from '../common/Modal';

interface SermonEditModalProps {
  sermon: Sermon;
  onClose: () => void;
  onSuccess: () => void;
}

const SermonEditModal: React.FC<SermonEditModalProps> = ({ sermon, onClose, onSuccess }) => {
  const { updateSermon, isUpdating, error } = useSermonEdit();
  const { series } = useSeries();
  const { speakers } = useSpeakers();
  const [formData, setFormData] = useState<SermonFormData>({
    title: sermon.title,
    description: sermon.description || '',
    speaker_id: sermon.speaker?.id || '',
    series_id: sermon.series?.id || '',
    date: sermon.date,
    videoUrl: sermon.video_url || '',
    thumbnail_url: sermon.thumbnail_url || ''
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateSermon(sermon.id, {
      ...formData,
      thumbnailFile: thumbnailFile || undefined
    }, sermon);
    if (success) {
      onSuccess();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Modal title="Edit Sermon" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="label" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="input py-3"
            />
          </div>

          <div>
            <label className="label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="input py-3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="speaker_id">
                Speaker
              </label>
              <select
                id="speaker_id"
                name="speaker_id"
                value={formData.speaker_id}
                onChange={handleInputChange}
                className="input py-3"
              >
                <option value="">Select a speaker</option>
                {speakers.map((speaker) => (
                  <option key={speaker.id} value={speaker.id}>
                    {speaker.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="series_id">
                Series
              </label>
              <select
                id="series_id"
                name="series_id"
                value={formData.series_id}
                onChange={handleInputChange}
                className="input py-3"
              >
                <option value="">Select a series</option>
                {series.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="input py-3"
            />
          </div>

          <div>
            <label className="label" htmlFor="videoUrl">
              Video URL
            </label>
            <input
              type="url"
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl || ''}
              onChange={handleInputChange}
              className="input py-3"
              placeholder="Enter video URL"
            />
          </div>

          <ThumbnailUploader
            onFileSelect={setThumbnailFile}
            currentThumbnail={sermon.thumbnail_url || undefined}
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
            disabled={isUpdating}
            className="btn-primary"
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SermonEditModal;