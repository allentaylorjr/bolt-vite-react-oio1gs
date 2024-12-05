import { supabase } from '../supabase';
import { validateEmail, validatePassword, validateChurchData } from './validationService';
import { RegistrationError } from '../../utils/errors/authErrors';
import { ValidationError } from '../../utils/errors/validationErrors';
import { v4 as uuidv4 } from 'uuid';

interface ChurchData {
  name: string;
  slug: string;
  subdomain: string;
  description?: string;
  website?: string;
  primary_color?: string;
  button_text_color: string;
  accent_color: string;
  font_family: string;
}

export async function registerUser(email: string, password: string, churchData: ChurchData) {
  try {
    // Validate inputs
    validateEmail(email);
    validatePassword(password);
    validateChurchData(churchData.name, churchData.slug);

    // Check if email is already registered
    const { data: existingUser } = await supabase.auth.admin.listUsers({
      filters: {
        email: email
      }
    });

    if (existingUser?.users?.length > 0) {
      throw new ValidationError('Email already registered');
    }

    // Check if slug is available
    const { data: existingChurch } = await supabase
      .from('churches')
      .select('id')
      .eq('slug', churchData.slug)
      .single();

    if (existingChurch) {
      throw new ValidationError('This church URL is already taken');
    }

    // Create user with church metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          role: 'admin',
          ...churchData
        }
      }
    });

    if (error) {
      console.error('Supabase signup error:', error);
      throw new RegistrationError('Registration failed', error);
    }

    if (!data.user) {
      throw new RegistrationError('No user data returned');
    }

    return { user: data.user };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    console.error('Registration Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      errorType: error.constructor.name
    });

    if (error instanceof RegistrationError) {
      throw error;
    }

    throw new RegistrationError(
      'Unable to create account. Please try again later.'
    );
  }
}