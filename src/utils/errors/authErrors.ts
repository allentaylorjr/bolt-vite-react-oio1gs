import { AppError } from './baseError';

export class RegistrationError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(message, 'REGISTRATION_ERROR', 400);
    if (originalError) {
      console.error('Original registration error:', originalError);
    }
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(message, 'AUTHENTICATION_ERROR', 401);
    if (originalError) {
      console.error('Original authentication error:', originalError);
    }
  }
}