import { supabase } from '../../supabase';
import { AuthError } from '@supabase/supabase-js';
import { AuthenticationError } from '../../../utils/errors/authErrors';

export async function signUpUser(email: string, password: string) {
  try {
    console.log('Attempting to sign up user:', { email });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`
      }
    });

    if (error) {
      console.error('Supabase signup error:', error);
      throw error;
    }

    if (!data.user) {
      console.error('No user data returned from signup');
      throw new Error('No user data returned');
    }

    console.log('User signup successful:', { userId: data.user.id });
    return data.user;
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof AuthError) {
      throw new AuthenticationError('Failed to create account', error);
    }
    throw error;
  }
}