import { S3Client, CreateBucketCommand, PutBucketPolicyCommand } from '@aws-sdk/client-s3';
import { storageConfig } from './config';

const s3Client = new S3Client({
  endpoint: storageConfig.endpoint,
  region: storageConfig.region,
  credentials: {
    accessKeyId: storageConfig.accessKeyId,
    secretAccessKey: storageConfig.secretKey
  },
  forcePathStyle: true
});

export async function createPublicBucket(bucketName: string): Promise<void> {
  try {
    // Create the bucket
    await s3Client.send(
      new CreateBucketCommand({
        Bucket: bucketName
      })
    );

    // Make bucket public by setting bucket policy
    const publicPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`]
        }
      ]
    };

    await s3Client.send(
      new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify(publicPolicy)
      })
    );
  } catch (error) {
    console.error('Error creating public bucket:', error);
    throw new Error('Failed to create public bucket');
  }
}