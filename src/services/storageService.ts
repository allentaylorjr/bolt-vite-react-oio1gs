import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  endpoint: 'https://gateway.storjshare.io',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'jx33ixog5iw6ar4du6trc6qbpgwq',
    secretAccessKey: import.meta.env.VITE_STORJ_SECRET_KEY
  },
  forcePathStyle: true
});

async function uploadFile(file: File, churchId: string, bucket: string): Promise<string> {
  if (!file) {
    throw new Error('No file provided');
  }

  try {
    const fileExtension = file.name.split('.').pop();
    const key = `${churchId}/${uuidv4()}.${fileExtension}`;
    const contentType = file.type || 'application/octet-stream';

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: uint8Array,
      ContentType: contentType,
      ACL: 'public-read',
      CacheControl: 'max-age=31536000',
      Metadata: {
        'x-amz-acl': 'public-read',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

    await s3Client.send(command);

    // Return a direct gateway URL for public access
    return `https://link.storjshare.io/raw/${bucket}/${key}`;
  } catch (error) {
    console.error(`Error uploading to ${bucket}:`, error);
    throw new Error(`Failed to upload file to ${bucket}`);
  }
}

export async function uploadToStorj(file: File, churchId: string): Promise<string> {
  return uploadFile(file, churchId, 'sermon-videos');
}

export async function uploadThumbnail(file: File, churchId: string): Promise<string> {
  return uploadFile(file, churchId, 'sermon-thumbnails');
}