import { z } from 'zod';
import { ValidationError } from '../errors';
import type { RegistrationData } from './types';

const registrationSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(72, 'Password must be less than 72 characters'),
  churchName: z.string()
    .min(1, 'Church name is required')
    .max(100, 'Church name is too long'),
  slug: z.string()
    .min(1, 'Church URL is required')
    .max(50, 'Church URL is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Church URL can only contain lowercase letters, numbers, and hyphens')
});

export function validateRegistrationData(data: RegistrationData): RegistrationData {
  try {
    const result = registrationSchema.safeParse(data);
    if (!result.success) {
      throw new ValidationError(result.error.errors[0].message);
    }
    return result.data;
  } catch (error) {
    throw error instanceof ValidationError ? error : new ValidationError('Invalid registration data');
  }
}