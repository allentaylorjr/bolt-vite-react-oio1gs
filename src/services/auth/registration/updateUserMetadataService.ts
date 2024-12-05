import { supabase } from '../../supabase';
import { AuthError } from '@supabase/supabase-js';
import { AuthenticationError } from '../../../utils/errors/authErrors';

export async function updateUserMetadata(userId: string, churchId: string) {
  try {
    console.log('Updating user metadata:', { userId, churchId });

    const { error } = await supabase.auth.updateUser({
      data: { 
        church_id: churchId,
        role: 'admin'
      }
    });

    if (error) {
      console.error('Error updating user metadata:', error);
      throw error;
    }

    console.log('User metadata updated successfully');
  } catch (error) {
    console.error('Metadata update error:', error);
    if (error instanceof AuthError) {
      throw new AuthenticationError('Failed to update user metadata', error);
    }
    throw error;
  }
}