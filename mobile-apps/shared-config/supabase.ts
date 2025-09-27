import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Use the same Supabase configuration as your VIP platform
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://eepcddbdvfhmeouzkpsb.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlcGNkZGJkdmZobWVvdXprcHNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzUwOTEsImV4cCI6MjA2NTk1MTA5MX0.BWINVlYppSOvs0EVyimhYgoday3Dv1UoqA5Z5gqwZGc';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Export types for use in both apps
export type { Database } from './types';
