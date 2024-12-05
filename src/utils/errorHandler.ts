export class SermonError extends Error {
  code: string;
  
  constructor(message: string, code: string = 'UNKNOWN_ERROR') {
    super(message);
    this.name = 'SermonError';
    this.code = code;
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message
    };
  }
}

export function handleUploadError(error: unknown): SermonError {
  if (error instanceof SermonError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new SermonError(error.message, 'UPLOAD_ERROR');
  }
  
  return new SermonError('An unexpected error occurred', 'UNKNOWN_ERROR');
}