import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { Button } from '@shared/components/button/button';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink, NzIconDirective, Button],
  template: `
    <div
      class="min-h-dvh bg-church-bg flex flex-col px-6 py-10 max-w-md mx-auto w-full"
    >
      <button
        type="button"
        (click)="goBack()"
        class="self-start w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-church-card text-church-blue active:bg-slate-50"
        aria-label="Retour"
      >
        <nz-icon nzType="arrow-left" class="text-lg" />
      </button>

      <div class="flex flex-col items-center mt-6">
        <img
          src="/logo-cijcm.png"
          alt="CI-JCM"
          class="w-30 h-30 object-contain mb-10"
        />
        <h1 class="text-2xl font-bold text-church-text text-center">
          Mot de passe oublié ?
        </h1>
        <p class="text-sm text-church-text-secondary mt-2 text-center max-w-xs">
          Entrez votre email, nous vous enverrons un lien pour réinitialiser
          votre mot de passe.
        </p>
      </div>

      @if (sent()) {
        <div
          class="flex flex-col items-center gap-4 bg-white rounded-2xl p-6 shadow-church-card mt-4"
        >
          <div
            class="w-14 h-14 rounded-full bg-church-gold-light flex items-center justify-center"
          >
            <nz-icon nzType="check-circle" class="text-3xl text-church-gold" />
          </div>
          <p class="text-center text-sm text-church-text">
            Un email a été envoyé à<br />
            <span class="font-semibold">{{ form.controls.email.value }}</span>
          </p>
          <p class="text-xs text-church-text-secondary text-center">
            Vérifiez votre boîte de réception (et les spams).
          </p>
          <a
            routerLink="/login"
            class="text-sm text-church-blue font-semibold mt-2"
          >
            Retour à la connexion
          </a>
        </div>
      } @else {
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="flex flex-col gap-4 mt-4"
        >
          <div>
            <input
              type="email"
              placeholder="Email"
              formControlName="email"
              autocomplete="email"
              class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-base text-church-text placeholder:text-slate-400 outline-none transition-colors focus:border-church-blue"
            />
            @if (form.controls.email.touched && form.controls.email.invalid) {
              <p class="text-xs text-church-red mt-1.5 px-1">
                @if (form.controls.email.hasError('required')) {
                  Email requis
                } @else if (form.controls.email.hasError('email')) {
                  Email invalide
                }
              </p>
            }
          </div>

          @if (errorMessage()) {
            <p class="text-xs text-church-red text-center">
              {{ errorMessage() }}
            </p>
          }

          <app-button
            variant="primary"
            size="lg"
            shape="rounded"
            [fullWidth]="true"
            type="submit"
            [disabled]="loading()"
          >
            {{ loading() ? 'Envoi...' : 'Envoyer le lien' }}
          </app-button>
        </form>
      }

      <div class="flex-1"></div>

      <p class="text-center text-sm text-church-text-secondary pt-8">
        Vous avez retrouvé le mot de passe ?
        <a routerLink="/login" class="text-church-blue font-semibold">
          Se connecter
        </a>
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ForgotPassword {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly loading = signal(false);
  readonly sent = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    try {
      await this.authService.resetPassword(this.form.controls.email.value);
      this.sent.set(true);
    } catch {
      this.errorMessage.set(
        "Impossible d'envoyer l'email. Réessayez plus tard.",
      );
    } finally {
      this.loading.set(false);
    }
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
