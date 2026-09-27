import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables. Copy .env.example to .env and fill in your project values.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const ROLES = ['Cook', 'Driver', 'Gateman', 'House help / Maid'];
export const AVAILABILITY = ['Full-time', 'Part-time', 'Live-in', 'Weekends only'];
