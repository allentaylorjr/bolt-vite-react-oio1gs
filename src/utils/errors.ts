export class AppError extends Error {
  code: string;
  statusCode: number;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', statusCode: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode
    };
  }
}

export class ApiError extends AppError {
  constructor(message: string, code: string = 'API_ERROR', statusCode: number = 500) {
    super(message, code, statusCode);
  }
}

export class StorageError extends AppError {
  constructor(message: string, code: string = 'STORAGE_ERROR', statusCode: number = 500) {
    super(message, code, statusCode);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTH_ERROR', 401);
  }
}

export class PermissionError extends AppError {
  constructor(message: string = 'Permission denied') {
    super(message, 'PERMISSION_ERROR', 403);
  }
}