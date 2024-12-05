import { supabase } from '../../supabase';
import { AuthError } from '@supabase/supabase-js';
import { RegistrationError } from '../../../utils/errors/authErrors';

export async function createUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`
      }
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user data returned');

    return data.user;
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.message === 'User already registered') {
        throw new RegistrationError('This email is already registered');
      }
      throw new RegistrationError('Unable to create account', { originalError: error });
    }
    throw new RegistrationError('Registration failed');
  }
}