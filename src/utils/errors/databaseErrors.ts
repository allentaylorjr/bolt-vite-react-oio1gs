import { AppError } from './baseError';

export class DatabaseError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(message, 'DATABASE_ERROR', 500);
    if (originalError) {
      console.error('Original database error:', originalError);
    }
  }
}