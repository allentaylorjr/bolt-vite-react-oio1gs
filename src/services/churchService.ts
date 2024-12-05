import { supabase } from './supabase';
import { createSlug, isValidSlug } from '../utils/slugUtils';

export async function checkSlugAvailability(slug: string): Promise<boolean> {
  if (!isValidSlug(slug)) return false;

  const { data, error } = await supabase
    .from('churches')
    .select('slug')
    .eq('slug', slug)
    .single();

  if (error || !data) return true;
  return false;
}

export async function generateUniqueSlug(name: string): Promise<string> {
  let baseSlug = createSlug(name);
  let slug = baseSlug;
  let counter = 1;

  while (!(await checkSlugAvailability(slug))) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}