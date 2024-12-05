import React, { useState } from 'react';
import { Youtube, Video, ExternalLink } from 'lucide-react';
import VideoUploader from './VideoUploader';
import ThumbnailUploader from './ThumbnailUploader';
import { useSermonUpload } from '../../hooks/useSermonUpload';
import { useSeries } from '../../hooks/useSeries';
import { useSpeakers } from '../../hooks/useSpeakers';
import { SermonFormData } from '../../types/sermon';
import Modal from '../common/Modal';

type VideoSource = 'file' | 'youtube' | 'vimeo';

interface SermonFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const SermonForm: React.FC<SermonFormProps> = ({ onClose, onSuccess }) => {
  const { uploadSermon, isUploading, error } = useSermonUpload();
  const { series } = useSeries();
  const { speakers } = useSpeakers();
  const [videoSource, setVideoSource] = useState<VideoSource>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<SermonFormData>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    videoUrl: '',
    series_id: '',
    speaker_id: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await uploadSermon({
      ...formData,
      videoFile: selectedFile || undefined,
      thumbnailFile: thumbnailFile || undefined,
    });

    if (success && onSuccess) {
      onSuccess();
      onClose();
    }
  };

  return (
    <Modal title="Add New Sermon" onClose={onClose}>
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
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              required
              placeholder="Enter sermon title"
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
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              rows={4}
              placeholder="Enter sermon description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="date">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="series_id">
                Series
              </label>
              <select
                id="series_id"
                name="series_id"
                value={formData.series_id}
                onChange={(e) => setFormData({ ...formData, series_id: e.target.value })}
                className="input"
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
            <label className="label" htmlFor="speaker_id">
              Speaker
            </label>
            <select
              id="speaker_id"
              name="speaker_id"
              value={formData.speaker_id}
              onChange={(e) => setFormData({ ...formData, speaker_id: e.target.value })}
              className="input"
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
            <label className="label">Video Source</label>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <button
                type="button"
                onClick={() => setVideoSource('file')}
                className={`p-3 flex flex-col items-center justify-center rounded-lg border-2 transition-colors ${
                  videoSource === 'file'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Video className={`h-6 w-6 mb-1 ${videoSource === 'file' ? 'text-blue-500' : 'text-gray-400'}`} />
                <span className={`text-sm ${videoSource === 'file' ? 'text-blue-700' : 'text-gray-500'}`}>
                  Upload File
                </span>
              </button>
              <button
                type="button"
                onClick={() => setVideoSource('youtube')}
                className={`p-3 flex flex-col items-center justify-center rounded-lg border-2 transition-colors ${
                  videoSource === 'youtube'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Youtube className={`h-6 w-6 mb-1 ${videoSource === 'youtube' ? 'text-blue-500' : 'text-gray-400'}`} />
                <span className={`text-sm ${videoSource === 'youtube' ? 'text-blue-700' : 'text-gray-500'}`}>
                  YouTube
                </span>
              </button>
              <button
                type="button"
                onClick={() => setVideoSource('vimeo')}
                className={`p-3 flex flex-col items-center justify-center rounded-lg border-2 transition-colors ${
                  videoSource === 'vimeo'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <ExternalLink className={`h-6 w-6 mb-1 ${videoSource === 'vimeo' ? 'text-blue-500' : 'text-gray-400'}`} />
                <span className={`text-sm ${videoSource === 'vimeo' ? 'text-blue-700' : 'text-gray-500'}`}>
                  Vimeo
                </span>
              </button>
            </div>

            {videoSource === 'file' ? (
              <VideoUploader onFileSelect={setSelectedFile} />
            ) : (
              <div>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder={`Enter ${videoSource === 'youtube' ? 'YouTube' : 'Vimeo'} URL`}
                  className="input"
                  pattern={
                    videoSource === 'youtube'
                      ? "https?://(?:www\\.)?(?:youtube\\.com/watch\\?v=|youtu\\.be/).+"
                      : "https?://(?:www\\.)?vimeo\\.com/.+"
                  }
                  title={`Please enter a valid ${videoSource === 'youtube' ? 'YouTube' : 'Vimeo'} URL`}
                />
              </div>
            )}
          </div>

          <ThumbnailUploader onFileSelect={setThumbnailFile} />
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
            disabled={isUploading}
            className="btn-primary"
          >
            {isUploading ? 'Uploading...' : 'Upload Sermon'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SermonForm;