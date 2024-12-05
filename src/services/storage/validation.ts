const MAX_FILE_SIZES = {
  video: 2 * 1024 * 1024 * 1024, // 2GB
  image: 5 * 1024 * 1024 // 5MB
};

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
];

const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime'
];

export function validateImageFile(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Invalid image type. Supported formats: JPG, PNG, WebP');
  }

  if (file.size > MAX_FILE_SIZES.image) {
    throw new Error('Image size exceeds 5MB limit');
  }
}

export function validateVideoFile(file: File): void {
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    throw new Error('Invalid video type. Supported formats: MP4, WebM, MOV');
  }

  if (file.size > MAX_FILE_SIZES.video) {
    throw new Error('Video size exceeds 2GB limit');
  }
}