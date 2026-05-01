import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const DEMO_MODE = !supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL';

export const supabase = DEMO_MODE
  ? null
  : createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: 'eproc-sim-auth',
      },
    });
