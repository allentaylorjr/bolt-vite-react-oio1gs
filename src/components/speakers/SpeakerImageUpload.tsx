import React, { useState, useCallback } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface SpeakerImageUploadProps {
  onFileSelect: (file: File) => void;
  currentImage?: string;
}

const SpeakerImageUpload: React.FC<SpeakerImageUploadProps> = ({ onFileSelect, currentImage }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((file: File) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      onFileSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onFileSelect]);

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
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Profile Picture
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
          <div className="relative w-32 h-32 mx-auto">
            <img
              src={previewUrl}
              alt="Profile preview"
              className="w-full h-full object-cover rounded-full"
              crossOrigin="anonymous"
            />
          </div>
        ) : (
          <div className="text-center py-8">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              Drag and drop an image here, or click to select
            </p>
            <p className="mt-1 text-xs text-gray-400">
              PNG, JPG, WebP up to 5MB
            </p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="sr-only"
          id="profile-picture-upload"
        />
      </div>
      <label
        htmlFor="profile-picture-upload"
        className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
      >
        {previewUrl ? 'Change picture' : 'Select picture'}
      </label>
    </div>
  );
};

export default SpeakerImageUpload;