import { supabase } from '../../supabase';
import { v4 as uuidv4 } from 'uuid';
import { validateRegistrationData } from './validation';
import { createChurch, checkSlugAvailability } from './churchService';
import { AuthError } from '../errors';
import type { RegistrationData, ChurchData } from './types';

export async function registerUser(data: RegistrationData) {
  try {
    // Step 1: Validate input
    const validatedData = validateRegistrationData(data);

    // Step 2: Check if slug is available
    const isAvailable = await checkSlugAvailability(validatedData.slug);
    if (!isAvailable) {
      throw new AuthError('This church URL is already taken');
    }

    // Step 3: Generate church ID
    const churchId = uuidv4();

    // Step 4: Create user with Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          church_id: churchId,
          church_name: validatedData.churchName,
          church_slug: validatedData.slug
        }
      }
    });

    if (signUpError) throw new AuthError(signUpError.message);
    if (!authData.user) throw new AuthError('Failed to create user account');

    // Step 5: Create church record
    const churchData: ChurchData = {
      id: churchId,
      name: validatedData.churchName,
      slug: validatedData.slug,
      subdomain: validatedData.slug,
      primary_color: '#2563eb',
      button_text_color: '#FFFFFF',
      accent_color: '#FFFFFF',
      font_family: 'Inter'
    };

    await createChurch(churchData);

    return authData.user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error instanceof AuthError ? error : new AuthError('Registration failed');
  }
}