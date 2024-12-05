import { ValidationError } from '../../utils/errors/validationErrors';

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }
}

export function validatePassword(password: string): void {
  if (password.length < 6) {
    throw new ValidationError('Password must be at least 6 characters long');
  }
}

export function validateChurchData(name: string, slug: string): void {
  if (!name.trim()) {
    throw new ValidationError('Church name is required');
  }

  if (!slug.trim()) {
    throw new ValidationError('Church URL is required');
  }

  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(slug)) {
    throw new ValidationError('Invalid church URL format');
  }
}