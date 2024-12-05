import { createPublicBucket } from '../../services/storage/bucketService';

export async function ensurePublicBucket(bucketName: string): Promise<void> {
  try {
    await createPublicBucket(bucketName);
    console.log(`Successfully created public bucket: ${bucketName}`);
  } catch (error) {
    if ((error as any)?.name === 'BucketAlreadyExists') {
      console.log(`Bucket ${bucketName} already exists`);
      return;
    }
    throw error;
  }
}

export function generateBucketName(churchId: string, type: string): string {
  return `${type}-${churchId}`.toLowerCase();
}