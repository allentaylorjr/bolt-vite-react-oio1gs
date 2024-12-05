import { z } from 'zod';
import { ChurchSettings } from './types';

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;

const settingsSchema = z.object({
  name: z.string().min(1, 'Church name is required'),
  description: z.string().optional().nullable(),
  website: z.string().regex(urlRegex, 'Invalid website URL').optional().nullable(),
  logo_url: z.string().optional().nullable(),
  primary_color: z.string().regex(hexColorRegex, 'Invalid color format'),
  button_text_color: z.string().regex(hexColorRegex, 'Invalid color format'),
  accent_color: z.string().regex(hexColorRegex, 'Invalid color format'),
  font_family: z.string().min(1, 'Font family is required')
});

export function validateSettings(data: unknown): ChurchSettings {
  return settingsSchema.parse(data);
}