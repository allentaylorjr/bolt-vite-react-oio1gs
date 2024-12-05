import { supabase } from '../../supabase';
import { ChurchData } from '../schemas';
import { RegistrationError } from '../../../utils/errors/authErrors';

export async function createChurch(churchData: ChurchData) {
  try {
    const { data, error } = await supabase
      .from('churches')
      .insert([{
        name: churchData.name,
        slug: churchData.slug,
        subdomain: churchData.subdomain,
        description: churchData.description || '',
        website: churchData.website || '',
        primary_color: churchData.primary_color || '#2563eb',
        button_text_color: churchData.button_text_color || '#FFFFFF',
        accent_color: churchData.accent_color || '#FFFFFF',
        font_family: churchData.font_family || 'Inter'
      }])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No church data returned');

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new RegistrationError('Failed to create church', { originalError: error });
    }
    throw new RegistrationError('Church creation failed');
  }
}