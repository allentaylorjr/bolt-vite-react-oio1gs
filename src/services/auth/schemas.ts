import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters long')
  .max(72, 'Password must be less than 72 characters');

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export const churchDataSchema = z.object({
  id: z.string().uuid('Invalid church ID'),
  name: z.string().min(1, 'Church name is required').max(100, 'Church name is too long'),
  slug: z
    .string()
    .min(1, 'Church URL is required')
    .max(50, 'Church URL is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Church URL can only contain lowercase letters, numbers, and hyphens'),
  subdomain: z.string(),
  primary_color: z.string().regex(hexColorRegex, 'Invalid color format'),
  button_text_color: z.string().regex(hexColorRegex, 'Invalid color format'),
  accent_color: z.string().regex(hexColorRegex, 'Invalid color format'),
  font_family: z.string().min(1, 'Font family is required')
});

export type ChurchData = z.infer<typeof churchDataSchema>;