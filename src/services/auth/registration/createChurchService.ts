import { supabase } from '../../supabase';
import { DatabaseError } from '../../../utils/errors/databaseErrors';

interface CreateChurchParams {
  id: string;
  name: string;
  slug: string;
}

export async function createChurch({ id, name, slug }: CreateChurchParams) {
  try {
    console.log('Creating church record:', { id, name, slug });

    const { error: insertError } = await supabase
      .from('churches')
      .insert([{
        id,
        name,
        slug,
        subdomain: slug,
        primary_color: '#2563eb',
        button_text_color: '#FFFFFF',
        accent_color: '#FFFFFF',
        font_family: 'Inter'
      }]);

    if (insertError) {
      console.error('Error creating church:', insertError);
      throw insertError;
    }

    console.log('Church record created successfully');
  } catch (error) {
    console.error('Church creation error:', error);
    throw new DatabaseError('Failed to create church record', error as Error);
  }
}