export class SermonError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', statusCode = 500) {
    super(message);
    this.name = 'SermonError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class ValidationError extends SermonError {
  constructor(message) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class AuthenticationError extends SermonError {
  constructor(message = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401);
  }
}

export class NotFoundError extends SermonError {
  constructor(message) {
    super(message, 'NOT_FOUND', 404);
  }
}