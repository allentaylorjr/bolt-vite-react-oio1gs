import React, { useState, useCallback } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { useImageUpload } from '../../hooks/useImageUpload';

interface ThumbnailUploaderProps {
  onFileSelect: (file: File) => void;
  currentThumbnail?: string;
}

const ThumbnailUploader: React.FC<ThumbnailUploaderProps> = ({ onFileSelect, currentThumbnail }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentThumbnail || null);
  const [isDragging, setIsDragging] = useState(false);
  const { handleImageUpload, compressing, error } = useImageUpload({
  maxSizeMB: 0.7,
  maxWidthOrHeight: 1920
});

  const handleFileChange = useCallback(async (file: File) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      try {
        // Compress image before upload
        const compressedFile = await handleImageUpload(file);
        onFileSelect(compressedFile);

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(compressedFile);
      } catch (err) {
        console.error('Error processing image:', err);
        alert('Failed to process image. Please try again.');
      }
    }
  }, [onFileSelect, handleImageUpload]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  return (
    <div className="mt-1">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thumbnail Image
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
              isDragging ? 'border-blue-500 bg-blue-50' :
              previewUrl ? 'border-blue-300' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              <div className="relative aspect-video">
                <img
                  src={previewUrl}
                  alt="Thumbnail preview"
                  className="absolute inset-0 w-full h-full object-cover rounded"
                  crossOrigin="anonymous"
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  {compressing ? 'Processing image...' : 'Drag and drop an image here, or click to select'}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="sr-only"
              id="thumbnail-upload"
              disabled={compressing}
            />
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
      </div>
      <label
        htmlFor="thumbnail-upload"
        className={`mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
          compressing ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {compressing ? 'Processing...' : previewUrl ? 'Change thumbnail' : 'Select thumbnail'}
      </label>
    </div>
  );
};

export default ThumbnailUploader;