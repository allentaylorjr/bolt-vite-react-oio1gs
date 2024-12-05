import imageCompression from 'browser-image-compression';

interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker?: boolean;
  maxIteration?: number;
  exifOrientation?: number;
  fileType?: string;
  initialQuality?: number;
}

const defaultOptions: CompressionOptions = {
  maxSizeMB: 0.7,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  maxIteration: 10,
  exifOrientation: 1,
  fileType: 'image/jpeg',
  initialQuality: 0.8
};

export async function compressImage(
  file: File,
  customOptions: Partial<CompressionOptions> = {}
): Promise<File> {
  try {
    // Merge default options with custom options
    const options = { ...defaultOptions, ...customOptions };

    // Don't compress if file is already smaller than maxSizeMB
    if (file.size / 1024 / 1024 < options.maxSizeMB) {
      return file;
    }

    // Compress image
    const compressedFile = await imageCompression(file, options);

    // Create a new file with the original name but compressed data
    return new File([compressedFile], file.name, {
      type: compressedFile.type,
      lastModified: new Date().getTime()
    });
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
}