import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { Button } from '@shared/components/button/button';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NzIconDirective, Button],
  template: `
    <div class="min-h-screen bg-church-bg flex flex-col justify-center px-6">
      <div class="text-center mb-10">
        <div class="w-20 h-20 bg-church-blue rounded-full flex items-center justify-center mx-auto mb-4">
          <nz-icon nzType="heart" nzTheme="fill" class="text-3xl text-white" />
        </div>
        <h1 class="text-2xl font-bold text-church-text">CI-JCM</h1>
        <p class="text-sm text-church-text-secondary mt-1">Bienvenue dans votre communaute</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="onLogin()" class="flex flex-col gap-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            formControlName="email"
            class="w-full bg-white rounded-church-sm px-4 py-3 text-sm shadow-church-card border-none outline-none focus:ring-2 focus:ring-church-blue/20"
          />
          @if (form.controls.email.touched && form.controls.email.invalid) {
            <p class="text-xs text-church-red mt-1 px-1">
              @if (form.controls.email.hasError('required')) { Email requis }
              @else if (form.controls.email.hasError('email')) { Email invalide }
            </p>
          }
        </div>

        <div>
          <input
            type="password"
            placeholder="Mot de passe"
            formControlName="password"
            class="w-full bg-white rounded-church-sm px-4 py-3 text-sm shadow-church-card border-none outline-none focus:ring-2 focus:ring-church-blue/20"
          />
          @if (form.controls.password.touched && form.controls.password.hasError('required')) {
            <p class="text-xs text-church-red mt-1 px-1">Mot de passe requis</p>
          }
        </div>

        @if (errorMessage()) {
          <p class="text-xs text-church-red text-center">{{ errorMessage() }}</p>
        }

        <app-button variant="primary" size="lg" type="submit" [disabled]="loading()">
          {{ loading() ? 'Connexion...' : 'Se connecter' }}
        </app-button>

        <p class="text-center text-sm text-church-text-secondary mt-4">
          Pas encore de compte ?
          <button type="button" (click)="goToSignup()" class="text-church-blue font-semibold">S'inscrire</button>
        </p>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  readonly loading = signal(false);
  readonly errorMessage = signal('');

  async onLogin() {
    if (this.loading()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    try {
      const { email, password } = this.form.getRawValue();
      await this.authService.signIn(email, password);
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
