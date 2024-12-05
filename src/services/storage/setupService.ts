import { ensurePublicBucket } from '../../utils/storage/bucketUtils';
import { StorageError } from '../../utils/errors/storageErrors';

export async function setupStorageBuckets(churchId: string) {
  try {
    await Promise.all([
      ensurePublicBucket(`sermon-videos-${churchId}`),
      ensurePublicBucket(`sermon-thumbnails-${churchId}`),
      ensurePublicBucket(`speaker-profiles-${churchId}`),
      ensurePublicBucket(`church-logos-${churchId}`)
    ]);
  } catch (error) {
    throw new StorageError('Failed to setup storage buckets', error);
  }
}