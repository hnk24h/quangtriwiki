import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://ncdberbmnupahvujqrdy.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_5jj_u-9JFt0FrtRFIPlh5A_v5J3mYH1';

export const supabase = createClient<any>(supabaseUrl, supabaseKey);
