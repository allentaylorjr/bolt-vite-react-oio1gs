import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const storjConfig = {
  endpoint: 'https://gateway.storjshare.io',
  accessKey: 'jx33ixog5iw6ar4du6trc6qbpgwq',
  secretKey: 'j26ujs7mimrqilfgzczuwl6gk52tunxz32e6bm7hgtsoyptjcrxw4',
  bucket: 'sermon-videos'
};

const s3Client = new S3Client({
  endpoint: storjConfig.endpoint,
  region: 'us-east-1',
  credentials: {
    accessKeyId: storjConfig.accessKey,
    secretAccessKey: storjConfig.secretKey
  },
  forcePathStyle: true
});

export async function uploadToStorj(file: File, churchId: string): Promise<string> {
  try {
    const fileExtension = file.name.split('.').pop();
    const key = `${churchId}/${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: storjConfig.bucket,
      Key: key,
      Body: await file.arrayBuffer(),
      ContentType: file.type
    });

    await s3Client.send(command);
    return `${storjConfig.endpoint}/${storjConfig.bucket}/${key}`;
  } catch (error) {
    console.error('Storj upload error:', error);
    throw error;
  }
}