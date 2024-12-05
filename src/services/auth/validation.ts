import { z } from 'zod';
import { AuthFormData } from './types';
import { ValidationError } from './errors';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(72, 'Password must be less than 72 characters')
});

export function validateAuth(data: AuthFormData): AuthFormData {
  try {
    return authSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.errors[0].message);
    }
    throw new ValidationError('Invalid input data');
  }
}