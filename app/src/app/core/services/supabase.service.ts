import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '@env';

/**
 * Singleton Supabase client shared across the app.
 * Prefer using this over manual createClient() calls to keep a single auth session.
 */
@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly client: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseKey,
    {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: false,
        autoRefreshToken: true,
        persistSession: true,
      },
    },
  );
}
