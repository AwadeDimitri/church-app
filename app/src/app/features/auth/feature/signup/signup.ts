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
import { GoogleSignInButton } from '@features/auth/ui/google-sign-in-button/google-sign-in-button';
import { injectDispatch } from '@ngrx/signals/events';
import { AuthStore, registerPageEvents } from '@features/auth/data-access';

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NzIconDirective,
    Button,
    GoogleSignInButton,
  ],
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
          Créer un compte
        </h1>
        <p class="text-sm text-center text-church-text-secondary mt-2">
          Utilisez les informations appropriées pour continuer
        </p>
      </div>

      <form
        [formGroup]="form"
        (ngSubmit)="onSignup()"
        class="flex flex-col gap-4 mt-4"
      >
        <div>
          <input
            type="text"
            placeholder="Nom complet"
            formControlName="fullName"
            autocomplete="name"
            class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-base text-church-text placeholder:text-slate-400 outline-none transition-colors focus:border-church-blue"
          />
          @if (
            form.controls.fullName.touched && form.controls.fullName.invalid
          ) {
            <p class="text-xs text-church-red mt-1.5 px-1">
              @if (form.controls.fullName.hasError('required')) {
                Nom requis
              } @else if (form.controls.fullName.hasError('minlength')) {
                Au moins 2 caractères
              }
            </p>
          }
        </div>

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

        <div>
          <div class="relative">
            <input
              [type]="showPassword() ? 'text' : 'password'"
              placeholder="Mot de passe"
              formControlName="password"
              autocomplete="new-password"
              class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 pr-12 text-base text-church-text placeholder:text-slate-400 outline-none transition-colors focus:border-church-blue"
            />
            <button
              type="button"
              (click)="showPassword.set(!showPassword())"
              class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 active:text-church-blue"
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
            form.controls.password.touched && form.controls.password.invalid
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

        @if (authStore.registerErrorMessage()) {
          <p class="text-xs text-church-red text-center">
            {{ authStore.registerErrorMessage() }}
          </p>
        }

        <app-button
          variant="primary"
          size="lg"
          shape="rounded"
          [fullWidth]="true"
          type="submit"
          [disabled]="authStore.signUpMutation.isPending()"
        >
          {{
            authStore.signUpMutation.isPending()
              ? 'Inscription...'
              : "S'inscrire"
          }}
        </app-button>
      </form>

      <div class="flex items-center gap-4 my-6">
        <hr class="flex-1 border-slate-200" />
        <span class="text-sm text-church-text-secondary">Ou</span>
        <hr class="flex-1 border-slate-200" />
      </div>

      <app-google-sign-in-button
        label="S'inscrire avec Google"
        (click)="onGoogleSignUp()"
      />

      <div class="flex-1"></div>

      <p class="text-center text-sm text-church-text-secondary pt-8">
        Déjà un compte ?
        <a routerLink="/login" class="text-church-blue font-semibold">
          Se connecter
        </a>
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Signup {
  readonly authStore = inject(AuthStore);
  private readonly dispatch = injectDispatch(registerPageEvents);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly showPassword = signal(false);

  readonly form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSignup() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dispatch.signup(this.form.getRawValue());
  }

  onGoogleSignUp() {
    // TODO: wire Supabase OAuth flow
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
