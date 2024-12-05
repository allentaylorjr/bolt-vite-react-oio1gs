import { AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { AuthError } from './errors';
import { AuthFormData } from './types';
import { validateAuth } from './validation';

export async function signUp(data: AuthFormData) {
  try {
    const validatedData = validateAuth(data);
    
    const { data: authData, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`
      }
    });

    if (error) {
      if (error instanceof SupabaseAuthError) {
        throw new AuthError(
          error.message,
          error.name,
          error.status
        );
      }
      throw error;
    }

    if (!authData.user) {
      throw new AuthError('Failed to create account', 'USER_CREATION_ERROR', 400);
    }

    return { user: authData.user };
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError(
      'Failed to create account',
      'REGISTRATION_ERROR',
      500
    );
  }
}

export async function signIn(data: AuthFormData) {
  try {
    const validatedData = validateAuth(data);

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password
    });

    if (error) {
      if (error instanceof SupabaseAuthError) {
        throw new AuthError(
          error.message,
          error.name,
          error.status
        );
      }
      throw error;
    }

    if (!authData.user) {
      throw new AuthError('Invalid login credentials', 'INVALID_CREDENTIALS', 401);
    }

    return { user: authData.user };
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError(
      'Failed to sign in',
      'AUTHENTICATION_ERROR',
      500
    );
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new AuthError(
      'Failed to sign out',
      'SIGNOUT_ERROR',
      500
    );
  }
}