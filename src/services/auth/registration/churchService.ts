import { supabase } from '../../supabase';
import { ChurchError } from '../errors';
import type { ChurchData } from './types';

export async function createChurch(data: ChurchData): Promise<void> {
  try {
    const { error } = await supabase
      .from('churches')
      .insert([{
        id: data.id,
        name: data.name,
        slug: data.slug,
        subdomain: data.subdomain,
        primary_color: data.primary_color,
        button_text_color: data.button_text_color,
        accent_color: data.accent_color,
        font_family: data.font_family
      }]);

    if (error) {
      throw new ChurchError(
        error.code === '23505' ? 'Church URL is already taken' : 'Failed to create church'
      );
    }
  } catch (error) {
    console.error('Church creation error:', error);
    throw error instanceof ChurchError ? error : new ChurchError('Failed to create church');
  }
}

export async function checkSlugAvailability(slug: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('churches')
      .select('slug')
      .eq('slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new ChurchError('Failed to check URL availability');
    }

    return !data;
  } catch (error) {
    console.error('Slug check error:', error);
    throw new ChurchError('Failed to check URL availability');
  }
}