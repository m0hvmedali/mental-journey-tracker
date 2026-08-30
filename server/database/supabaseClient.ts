import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const isConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.trim() !== '' &&
  !supabaseUrl.includes('urzxbbqelpnzitqvffhs') &&
  supabaseUrl.startsWith('http') &&
  supabaseAnonKey &&
  supabaseAnonKey.trim() !== ''
);

let supabaseClientInstance: SupabaseClient | null = null;
let isActuallyConfigured = false;

if (isConfigured) {
  try {
    supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey);
    isActuallyConfigured = true;
  } catch (err) {
    console.error('⚠️ Failed to initialize Supabase client:', err);
    supabaseClientInstance = null;
    isActuallyConfigured = false;
  }
}

export const supabase = supabaseClientInstance;
export const isSupabaseConfigured = isActuallyConfigured;

