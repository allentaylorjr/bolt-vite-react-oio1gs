import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { StorageError } from '../../utils/errors';

const s3Client = new S3Client({
  endpoint: 'https://gateway.storjshare.io',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'jx33ixog5iw6ar4du6trc6qbpgwq',
    secretAccessKey: import.meta.env.VITE_STORJ_SECRET_KEY
  },
  forcePathStyle: true
});

async function uploadFile(
  file: File,
  churchId: string,
  bucket: string,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
  } = {}
): Promise<string> {
  try {
    // Validate file size
    if (options.maxSize && file.size > options.maxSize) {
      throw new StorageError(
        `File size exceeds limit of ${Math.round(options.maxSize / 1024 / 1024)}MB`,
        'FILE_TOO_LARGE'
      );
    }

    // Validate file type
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      throw new StorageError(
        `Invalid file type. Allowed types: ${options.allowedTypes.join(', ')}`,
        'INVALID_FILE_TYPE'
      );
    }

    const fileExtension = file.name.split('.').pop();
    const key = `${churchId}/${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: await file.arrayBuffer(),
      ContentType: file.type
    });

    await s3Client.send(command);
    return `https://link.storjshare.io/raw/${bucket}/${key}`;
  } catch (error) {
    console.error('Storage upload error:', error);
    throw new StorageError(
      'Failed to upload file',
      'UPLOAD_FAILED'
    );
  }
}

export async function uploadVideo(file: File, churchId: string): Promise<string> {
  return uploadFile(file, churchId, 'sermon-videos', {
    maxSize: 2 * 1024 * 1024 * 1024, // 2GB
    allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime']
  });
}

export async function uploadThumbnail(file: File, churchId: string): Promise<string> {
  return uploadFile(file, churchId, 'sermon-thumbnails', {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });
}

export async function uploadSpeakerProfile(file: File, churchId: string): Promise<string> {
  return uploadFile(file, churchId, 'speaker-profiles', {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });
}

export async function uploadSeriesThumbnail(file: File, churchId: string): Promise<string> {
  return uploadFile(file, churchId, 'series-thumbnails', {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });
}

export async function uploadChurchLogo(file: File, churchId: string): Promise<string> {
  return uploadFile(file, churchId, 'church-logos', {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });
}