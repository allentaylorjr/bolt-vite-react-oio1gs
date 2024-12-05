export interface UploadResult {
  url: string;
  key: string;
  bucket: string;
}

export interface StorageError {
  code: string;
  message: string;
  details?: unknown;
}