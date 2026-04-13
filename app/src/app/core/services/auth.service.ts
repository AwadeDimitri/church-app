import { Injectable, signal, computed } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '@env';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase: SupabaseClient;
  private readonly _user = signal<User | null>(null);
  private readonly _loading = signal(true);

  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user());

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    // Écouter les changements d'auth
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this._user.set(session?.user ?? null);
      this._loading.set(false);
    });

    // Vérifier la session existante
    this.supabase.auth.getSession().then(({ data }) => {
      this._user.set(data.session?.user ?? null);
      this._loading.set(false);
    });
  }

  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async getAccessToken(): Promise<string | null> {
    const { data } = await this.supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }
}
