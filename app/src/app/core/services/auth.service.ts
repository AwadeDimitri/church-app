import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '@supabase/supabase-js';
import { SupabaseService } from '@core/services/supabase.service';
import { NetworkService } from '@core/services/network.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService).client;
  private readonly network = inject(NetworkService);
  private readonly router = inject(Router);

  // Amorcée de façon synchrone depuis la session persistée : le démarrage de
  // l'app ne dépend ni du réseau ni du refresh du token. Supabase la tient
  // ensuite à jour via onAuthStateChange.
  private readonly _session = signal<Session | null>(
    inject(SupabaseService).persistedSession(),
  );

  readonly user = computed(() => this._session()?.user ?? null);
  readonly isAuthenticated = computed(() => !!this.user());

  constructor() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      // Un événement sans session n'est une déconnexion que pour SIGNED_OUT :
      // sans réseau, Supabase émet INITIAL_SESSION à vide faute d'avoir pu
      // rafraîchir le token, alors que la session reste valable.
      if (session || event === 'SIGNED_OUT') {
        this._session.set(session);
      }
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

  async signInWithGoogle() {
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (error) throw error;
    return data;
  }

  async exchangeCodeForSession(code: string) {
    const { data, error } =
      await this.supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    await this.router.navigate(['/login']);
  }

  async resetPassword(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  }

  async updatePassword(newPassword: string) {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  }

  async getAccessToken(): Promise<string | null> {
    // Hors ligne, la requête échouera de toute façon : on n'attend pas le
    // refresh du token (cf. SupabaseService.persistedSession).
    if (!this.network.online()) {
      return this._session()?.access_token ?? null;
    }
    const { data } = await this.supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }
}
