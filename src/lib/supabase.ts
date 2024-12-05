import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = 'https://bqaqdaktjzeicwzfvvoo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxYXFkYWt0anplaWN3emZ2dm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MjYyNjQsImV4cCI6MjA0ODMwMjI2NH0.E_2FM8K17qE3WVujw7OcGo3AhyMj_FQ2_Jv-ap0uAE8';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage
  }
});