import { createSupabaseClient } from '@test-cicd/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';

let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!clientInstance) {
    clientInstance = createSupabaseClient(config.supabase.url, config.supabase.publishableKey);
  }
  return clientInstance;
}

// Convenience export for direct import
export const supabase = getSupabaseClient();
