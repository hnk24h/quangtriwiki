import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const isRealServiceKey = rawServiceKey && !rawServiceKey.includes('placeholder');

const supabaseKey = isRealServiceKey
  ? rawServiceKey
  : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '');

export const supabaseServer = createClient<any>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
