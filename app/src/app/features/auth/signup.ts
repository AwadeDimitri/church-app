import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { Button } from '@shared/components/button/button';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, NzIconDirective, Button],
  template: `
    <div class="min-h-screen bg-church-bg flex flex-col justify-center px-6">
      <div class="text-center mb-10">
        <div class="w-20 h-20 bg-church-blue rounded-full flex items-center justify-center mx-auto mb-4">
          <nz-icon nzType="heart" nzTheme="fill" class="text-3xl text-white" />
        </div>
        <h1 class="text-2xl font-bold text-church-text">Rejoignez CI-JCM</h1>
        <p class="text-sm text-church-text-secondary mt-1">Creez votre compte</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSignup()" class="flex flex-col gap-4">
        <div>
          <input
            type="text"
            placeholder="Nom complet"
            formControlName="fullName"
            class="w-full bg-white rounded-church-sm px-4 py-3 text-sm shadow-church-card border-none outline-none focus:ring-2 focus:ring-church-blue/20"
          />
          @if (form.controls.fullName.touched && form.controls.fullName.invalid) {
            <p class="text-xs text-church-red mt-1 px-1">
              @if (form.controls.fullName.hasError('required')) { Nom requis }
              @else if (form.controls.fullName.hasError('minlength')) { Au moins 2 caractères }
            </p>
          }
        </div>

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
          @if (form.controls.password.touched && form.controls.password.invalid) {
            <p class="text-xs text-church-red mt-1 px-1">
              @if (form.controls.password.hasError('required')) { Mot de passe requis }
              @else if (form.controls.password.hasError('minlength')) { Au moins 6 caractères }
            </p>
          }
        </div>

        @if (errorMessage()) {
          <p class="text-xs text-church-red text-center">{{ errorMessage() }}</p>
        }

        @if (successMessage()) {
          <p class="text-xs text-church-green text-center">{{ successMessage() }}</p>
        }

        <app-button variant="primary" size="lg" type="submit" [disabled]="loading()">
          {{ loading() ? 'Inscription...' : "S'inscrire" }}
        </app-button>

        <p class="text-center text-sm text-church-text-secondary mt-4">
          Deja un compte ?
          <button type="button" (click)="goToLogin()" class="text-church-blue font-semibold">Se connecter</button>
        </p>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Signup {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  async onSignup() {
    if (this.loading()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      const { email, password, fullName } = this.form.getRawValue();
      await this.authService.signUp(email, password, fullName);
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
