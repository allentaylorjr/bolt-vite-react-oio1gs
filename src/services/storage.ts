import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { StorageError } from '../utils/errors';

const s3Client = new S3Client({
  endpoint: 'https://gateway.storjshare.io',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'jx33ixog5iw6ar4du6trc6qbpgwq',
    secretAccessKey: 'j26ujs7mimrqilfgzczuwl6gk52tunxz32e6bm7hgtsoyptjcrxw4'
  },
  forcePathStyle: true
});

export async function uploadFile(file: File, churchId: string): Promise<string> {
  try {
    const fileExtension = file.name.split('.').pop();
    const key = `${churchId}/${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: 'sermon-videos',
      Key: key,
      Body: await file.arrayBuffer(),
      ContentType: file.type
    });

    await s3Client.send(command);
    return `https://gateway.storjshare.io/sermon-videos/${key}`;
  } catch (error) {
    throw new StorageError(
      'Failed to upload file',
      'STORAGE_UPLOAD_ERROR'
    );
  }
}