import { useState, useCallback } from 'react';
import { compressImage } from '../utils/imageCompression';

interface ImageUploadOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  onCompress?: (file: File) => void;
  onError?: (error: Error) => void;
}

export function useImageUpload(options: ImageUploadOptions = {}) {
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File): Promise<File> => {
    if (!file) return file;

    try {
      setCompressing(true);
      setError(null);

      const compressedFile = await compressImage(file, {
        maxSizeMB: options.maxSizeMB || 0.7,
        maxWidthOrHeight: options.maxWidthOrHeight || 1920
      });

      options.onCompress?.(compressedFile);
      return compressedFile;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to compress image');
      setError(error.message);
      options.onError?.(error);
      throw error;
    } finally {
      setCompressing(false);
    }
  }, [options]);

  return {
    handleImageUpload,
    compressing,
    error
  };
}