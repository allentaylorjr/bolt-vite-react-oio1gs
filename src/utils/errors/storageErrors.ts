import { AppError } from './baseError';

export class StorageError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(message, 'STORAGE_ERROR');
    
    if (originalError) {
      console.error('Original storage error:', originalError);
    }
  }
}