import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { Button } from '@shared/components/button/button';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [NzIconDirective, Button],
  template: `
    <div class="min-h-screen bg-church-bg flex flex-col justify-center px-6">
      <div class="text-center mb-10">
        <div class="w-20 h-20 bg-church-blue rounded-full flex items-center justify-center mx-auto mb-4">
          <nz-icon nzType="heart" nzTheme="fill" class="text-3xl text-white" />
        </div>
        <h1 class="text-2xl font-bold text-church-text">CI-JCM</h1>
        <p class="text-sm text-church-text-secondary mt-1">Bienvenue dans votre communaute</p>
      </div>

      <div class="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          [value]="email()"
          (input)="email.set($any($event.target).value)"
          class="w-full bg-white rounded-church-sm px-4 py-3 text-sm shadow-church-card border-none outline-none focus:ring-2 focus:ring-church-blue/20"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          [value]="password()"
          (input)="password.set($any($event.target).value)"
          (keydown.enter)="onLogin()"
          class="w-full bg-white rounded-church-sm px-4 py-3 text-sm shadow-church-card border-none outline-none focus:ring-2 focus:ring-church-blue/20"
        />

        @if (errorMessage()) {
          <p class="text-xs text-church-red text-center">{{ errorMessage() }}</p>
        }

        <app-button variant="primary" size="lg" [disabled]="loading()" (click)="onLogin()">
          {{ loading() ? 'Connexion...' : 'Se connecter' }}
        </app-button>

        <p class="text-center text-sm text-church-text-secondary mt-4">
          Pas encore de compte ?
          <button (click)="goToSignup()" class="text-church-blue font-semibold">S'inscrire</button>
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly email = signal('');
  readonly password = signal('');
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  async onLogin() {
    if (this.loading()) return;
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      await this.authService.signIn(this.email(), this.password());
      this.router.navigate(['/home']);
    } catch (e: any) {
      this.errorMessage.set(e.message === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect'
        : 'Une erreur est survenue');
    } finally {
      this.loading.set(false);
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
