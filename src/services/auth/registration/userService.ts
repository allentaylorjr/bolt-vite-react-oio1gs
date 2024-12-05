import { supabase } from '../../supabase';
import { AuthError } from '../errors';
import type { RegistrationInput } from './types';
import type { User } from '@supabase/supabase-js';

export async function createUser(input: RegistrationInput, churchId: string): Promise<User> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          church_id: churchId,
          church_name: input.churchName,
          church_slug: input.slug
        }
      }
    });

    if (error) throw new AuthError(error.message);
    if (!data.user) throw new AuthError('Failed to create user account');

    return data.user;
  } catch (error) {
    console.error('User creation error:', error);
    throw error instanceof AuthError ? error : new AuthError('Failed to create user account');
  }
}