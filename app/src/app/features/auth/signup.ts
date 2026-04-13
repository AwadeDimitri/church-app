import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { Button } from '@shared/components/button/button';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [NzIconDirective, Button],
  template: `
    <div class="min-h-screen bg-church-bg flex flex-col justify-center px-6">
      <div class="text-center mb-10">
        <div class="w-20 h-20 bg-church-blue rounded-full flex items-center justify-center mx-auto mb-4">
          <nz-icon nzType="heart" nzTheme="fill" class="text-3xl text-white" />
        </div>
        <h1 class="text-2xl font-bold text-church-text">Rejoignez CI-JCM</h1>
        <p class="text-sm text-church-text-secondary mt-1">Creez votre compte</p>
      </div>

      <div class="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nom complet"
          [value]="fullName()"
          (input)="fullName.set($any($event.target).value)"
          class="w-full bg-white rounded-church-sm px-4 py-3 text-sm shadow-church-card border-none outline-none focus:ring-2 focus:ring-church-blue/20"
        />
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
          (keydown.enter)="onSignup()"
          class="w-full bg-white rounded-church-sm px-4 py-3 text-sm shadow-church-card border-none outline-none focus:ring-2 focus:ring-church-blue/20"
        />

        @if (errorMessage()) {
          <p class="text-xs text-church-red text-center">{{ errorMessage() }}</p>
        }

        @if (successMessage()) {
          <p class="text-xs text-church-green text-center">{{ successMessage() }}</p>
        }

        <app-button variant="primary" size="lg" [disabled]="loading()" (click)="onSignup()">
          {{ loading() ? 'Inscription...' : "S'inscrire" }}
        </app-button>

        <p class="text-center text-sm text-church-text-secondary mt-4">
          Deja un compte ?
          <button (click)="goToLogin()" class="text-church-blue font-semibold">Se connecter</button>
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Signup {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly fullName = signal('');
  readonly email = signal('');
  readonly password = signal('');
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  async onSignup() {
    if (this.loading()) return;
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      await this.authService.signUp(this.email(), this.password(), this.fullName());
      this.successMessage.set('Compte cree ! Verifiez votre email pour confirmer.');
    } catch (e: any) {
      this.errorMessage.set(e.message ?? 'Une erreur est survenue');
    } finally {
      this.loading.set(false);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
