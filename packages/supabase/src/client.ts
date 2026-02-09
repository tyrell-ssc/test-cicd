import { createClient } from '@supabase/supabase-js';
import type { Database } from '@test-cicd/db/database.types';

export type SupabaseClient = ReturnType<typeof createSupabaseClient>;

export function createSupabaseClient(
  url: string,
  publishableKey: string,
  options?: {
    auth?: {
      storage?: unknown;
      persistSession?: boolean;
      detectSessionInUrl?: boolean;
      autoRefreshToken?: boolean;
    };
  }
) {
  return createClient<Database>(url, publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      ...options?.auth,
    },
  });
}
