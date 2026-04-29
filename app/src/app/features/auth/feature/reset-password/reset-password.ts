import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { AuthError } from '@supabase/supabase-js';
import { Button } from '@shared/components/button/button';
import { AuthService } from '@core/services/auth.service';

type Stage = 'validating' | 'invalid' | 'form' | 'success';

const UPDATE_PASSWORD_ERRORS: Record<string, string> = {
  weak_password: 'Mot de passe trop faible',
  same_password: "Le nouveau mot de passe est identique à l'ancien",
};

const GENERIC_UPDATE_PASSWORD_ERROR = 'Une erreur est survenue. Réessayez.';

const passwordsMatch = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirm = control.get('confirm')?.value;
  return password && confirm && password !== confirm
    ? { mismatch: true }
    : null;
};

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink, NzIconDirective, Button],
  template: `
    <div
      class="flex flex-col px-6 py-8 max-w-md mx-auto w-full"
    >
      <div class="flex flex-col items-center mt-6">
        <img
          src="/logo-cijcm.png"
          alt="CI-JCM"
          class="w-30 h-30 object-contain mb-10"
        />
        <h1 class="text-2xl font-bold text-church-text text-center">
          Nouveau mot de passe
        </h1>
        <p class="text-sm text-church-text-secondary mt-2 text-center max-w-xs">
          Choisissez un nouveau mot de passe pour votre compte.
        </p>
      </div>

      @switch (stage()) {
        @case ('validating') {
          <div class="flex flex-col items-center mt-10">
            <div
              class="w-12 h-12 border-4 border-church-blue border-t-transparent rounded-full animate-spin mb-4"
            ></div>
            <p class="text-sm text-church-text-secondary">
              Vérification du lien...
            </p>
          </div>
        }

        @case ('invalid') {
          <div
            class="flex flex-col items-center gap-4 bg-white rounded-2xl p-6 shadow-church-card mt-4"
          >
            <div
              class="w-14 h-14 rounded-full bg-church-red/10 flex items-center justify-center"
            >
              <span class="text-3xl text-church-red font-bold">!</span>
            </div>
            <p class="text-center text-sm text-church-text">
              Le lien de réinitialisation est invalide ou expiré.
            </p>
            <a
              routerLink="/forgot-password"
              class="text-sm text-church-blue font-semibold mt-2"
            >
              Demander un nouveau lien
            </a>
          </div>
        }

        @case ('form') {
          <form
            [formGroup]="form"
            (ngSubmit)="onSubmit()"
            class="flex flex-col gap-4 mt-4"
          >
            <div>
              <div class="relative">
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  placeholder="Nouveau mot de passe"
                  formControlName="password"
                  autocomplete="new-password"
                  class="w-full bg-white border border-church-text/10 rounded-xl px-4 py-3.5 pr-12 text-base text-church-text placeholder:text-church-text-secondary/60 outline-none transition-colors focus:border-church-blue"
                />
                <button
                  type="button"
                  (click)="showPassword.set(!showPassword())"
                  class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-church-text-secondary active:text-church-blue"
                  [attr.aria-label]="
                    showPassword()
                      ? 'Masquer le mot de passe'
                      : 'Afficher le mot de passe'
                  "
                >
                  <nz-icon
                    [nzType]="showPassword() ? 'eye-invisible' : 'eye'"
                    class="text-lg"
                  />
                </button>
              </div>
              @if (
                form.controls.password.touched &&
                form.controls.password.invalid
              ) {
                <p class="text-xs text-church-red mt-1.5 px-1">
                  @if (form.controls.password.hasError('required')) {
                    Mot de passe requis
                  } @else if (form.controls.password.hasError('minlength')) {
                    Au moins 6 caractères
                  }
                </p>
              }
            </div>

            <div>
              <input
                [type]="showPassword() ? 'text' : 'password'"
                placeholder="Confirmer le mot de passe"
                formControlName="confirm"
                autocomplete="new-password"
                class="w-full bg-white border border-church-text/10 rounded-xl px-4 py-3.5 text-base text-church-text placeholder:text-church-text-secondary/60 outline-none transition-colors focus:border-church-blue"
              />
              @if (
                form.controls.confirm.touched &&
                (form.controls.confirm.hasError('required') ||
                  form.hasError('mismatch'))
              ) {
                <p class="text-xs text-church-red mt-1.5 px-1">
                  @if (form.controls.confirm.hasError('required')) {
                    Confirmation requise
                  } @else {
                    Les mots de passe ne correspondent pas
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
              {{ loading() ? 'Enregistrement...' : 'Enregistrer' }}
            </app-button>
          </form>
        }

        @case ('success') {
          <div
            class="flex flex-col items-center gap-4 bg-white rounded-2xl p-6 shadow-church-card mt-4"
          >
            <div
              class="w-14 h-14 rounded-full bg-church-green/10 flex items-center justify-center"
            >
              <nz-icon nzType="check-circle" class="text-3xl text-church-green" />
            </div>
            <p class="text-center text-sm text-church-text">
              Mot de passe mis à jour.
            </p>
            <p class="text-xs text-church-text-secondary text-center">
              Redirection en cours...
            </p>
          </div>
        }
      }

      <div class="flex-1"></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ResetPassword {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly stage = signal<Stage>('validating');
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showPassword = signal(false);

  readonly form = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', Validators.required],
    },
    { validators: passwordsMatch },
  );

  constructor() {
    this.exchangeCode();
  }

  private async exchangeCode() {
    const code = this.route.snapshot.queryParamMap.get('code');
    if (!code) {
      this.stage.set('invalid');
      return;
    }
    try {
      await this.authService.exchangeCodeForSession(code);
      this.stage.set('form');
    } catch {
      this.stage.set('invalid');
    }
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    try {
      await this.authService.updatePassword(this.form.controls.password.value);
      this.stage.set('success');
      setTimeout(() => this.router.navigateByUrl('/home'), 1500);
    } catch (err) {
      const code = err instanceof AuthError ? err.code : undefined;
      this.errorMessage.set(
        (code && UPDATE_PASSWORD_ERRORS[code]) ?? GENERIC_UPDATE_PASSWORD_ERROR,
      );
    } finally {
      this.loading.set(false);
    }
  }
}
