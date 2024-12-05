import { AppError } from './baseError';

export class ChurchCreationError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(message, 'CHURCH_CREATION_ERROR');
    
    if (originalError) {
      console.error('Original church creation error:', originalError);
    }
  }
}