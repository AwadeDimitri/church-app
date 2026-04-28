import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

type CallbackState = 'loading' | 'error';

@Component({
  selector: 'app-auth-callback',
  imports: [RouterLink],
  template: `
    <div
      class="flex flex-col items-center justify-center px-6 py-8 max-w-md mx-auto w-full"
    >
      <img
        src="/logo-cijcm.png"
        alt="CI-JCM"
        class="w-30 h-30 object-contain mb-10"
      />

      @if (state() === 'loading') {
        <div
          class="w-12 h-12 border-4 border-church-blue border-t-transparent rounded-full animate-spin mb-6"
        ></div>
        <p class="text-church-text text-center">Connexion en cours...</p>
      } @else {
        <div
          class="w-16 h-16 rounded-full bg-church-red/10 flex items-center justify-center mb-6"
        >
          <span class="text-3xl text-church-red font-bold">!</span>
        </div>
        <h1 class="text-xl font-bold text-church-text text-center mb-2">
          La connexion a échoué
        </h1>
        <p class="text-sm text-church-text-secondary text-center mb-6">
          {{ errorMessage() }}
        </p>
        <a routerLink="/login" class="text-church-blue font-semibold">
          Retour à la connexion
        </a>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AuthCallback {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly state = signal<CallbackState>('loading');
  readonly errorMessage = signal<string>('');

  constructor() {
    this.handleCallback();
  }

  private async handleCallback() {
    const params = this.route.snapshot.queryParamMap;
    const error = params.get('error');

    if (error) {
      const description = params.get('error_description');
      this.state.set('error');
      this.errorMessage.set(description ?? error);
      return;
    }

    const code = params.get('code');
    if (!code) {
      this.state.set('error');
      this.errorMessage.set("Code de connexion manquant dans l'URL.");
      return;
    }

    try {
      await this.authService.exchangeCodeForSession(code);
      await this.router.navigateByUrl('/home');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Une erreur est survenue';
      this.state.set('error');
      this.errorMessage.set(message);
    }
  }
}
