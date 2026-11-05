import { Injectable } from '@angular/core';
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '@env';

/**
 * Clé localStorage de la session. Même valeur que le défaut de supabase-js (les
 * sessions déjà ouvertes restent valides), figée ici pour pouvoir relire la
 * session sans passer par le client.
 */
const AUTH_STORAGE_KEY = `sb-${new URL(environment.supabaseUrl).hostname.split('.')[0]}-auth-token`;

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
        storageKey: AUTH_STORAGE_KEY,
      },
    },
  );

  /**
   * Session persistée sur l'appareil, lue de façon synchrone et sans réseau.
   *
   * `auth.getSession()` rafraîchit d'abord un token expiré : hors ligne, il
   * retente pendant ~25 s avant de répondre. Cette lecture ne dépend que du
   * localStorage — le token d'accès retourné peut donc être expiré.
   */
  persistedSession(): Session | null {
    try {
      const session: Partial<Session> | null = JSON.parse(
        localStorage.getItem(AUTH_STORAGE_KEY) ?? 'null',
      );
      return session?.access_token && session.user ? (session as Session) : null;
    } catch {
      return null; // storage indisponible ou valeur corrompue
    }
  }
}
