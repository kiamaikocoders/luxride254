import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eepcddbdvfhmeouzkpsb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlcGNkZGJkdmZobWVvdXprcHNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzUwOTEsImV4cCI6MjA2NTk1MTA5MX0.BWINVlYppSOvs0EVyimhYgoday3Dv1UoqA5Z5gqwZGc';
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 