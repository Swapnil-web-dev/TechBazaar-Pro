// ─── Supabase Client ──────────────────────────────────────────────────────────
// Replace placeholder values with your real Supabase project credentials.
// Get these from: https://supabase.com → Your Project → Settings → API
// ──────────────────────────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL      || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY &&
  SUPABASE_URL !== 'YOUR_SUPABASE_URL'
);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

if (!isSupabaseConfigured) {
  console.warn(
    '[TechBazaar] Supabase is not configured yet.\n' +
    'User data is stored in this browser only.\n' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.\n' +
    'Get your keys from: https://supabase.com → Project → Settings → API'
  );
}
