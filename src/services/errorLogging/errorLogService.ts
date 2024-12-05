import { supabase } from '../supabase';

interface ErrorLog {
  name: string;
  message: string;
  details?: Record<string, any>;
}

export async function logError(error: ErrorLog) {
  try {
    console.log('Logging error:', error);

    const { error: insertError } = await supabase
      .from('registration_errors')
      .insert([{
        name: error.name,
        message: error.message,
        details: error.details,
        created_at: new Date().toISOString()
      }]);

    if (insertError) {
      console.error('Failed to log error:', insertError);
    }
  } catch (loggingError) {
    console.error('Error logging failed:', loggingError);
  }
}