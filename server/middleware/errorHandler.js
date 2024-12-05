import { SermonError } from '../utils/errors.js';

export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err instanceof SermonError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message
      }
    });
  }

  // Handle validation errors
  if (err.array && typeof err.array === 'function') {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: err.array()
      }
    });
  }

  // Default error response
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    }
  });
}