import { supabase } from '../../supabase';
import { RegistrationError } from '../../../utils/errors/authErrors';

export async function updateUserMetadata(userId: string, churchId: string) {
  try {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { church_id: churchId }
    });

    if (error) throw error;
  } catch (error) {
    if (error instanceof Error) {
      throw new RegistrationError('Failed to update user metadata', { originalError: error });
    }
    throw new RegistrationError('User metadata update failed');
  }
}