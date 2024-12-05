import { supabase } from '../supabase';
import { v4 as uuidv4 } from 'uuid';
import { createSlug } from '../../utils/slugUtils';

interface RegistrationData {
  email: string;
  password: string;
  churchName: string;
}

export async function registerUser(data: RegistrationData) {
  try {
    const slug = createSlug(data.churchName);

    // Sign up user with Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.churchName,
          slug: slug
        }
      }
    });

    if (signUpError) throw signUpError;
    if (!authData.user) throw new Error('Failed to create user account');

    return authData.user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}