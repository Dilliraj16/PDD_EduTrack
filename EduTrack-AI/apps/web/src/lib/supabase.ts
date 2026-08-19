import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lkjspdberhsepgvktlzh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxranNwZGJlcmhzZXBndmt0bHpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMTcyNDIsImV4cCI6MjEwMTY5MzI0Mn0.dkVoqiNCXHbiP7d332wI1sO-tB5ZZ1BFQRYWfcj6g7I';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
