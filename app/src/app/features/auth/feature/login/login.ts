import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { Button } from '@shared/components/button/button';
import { GoogleSignInButton } from '@features/auth/ui/google-sign-in-button/google-sign-in-button';
import { injectDispatch } from '@ngrx/signals/events';
import {
  AuthStore,
  passwordSignInPageEvents,
  oauthSignInPageEvents,
} from '@features/auth/data-access';

const REASON_MESSAGES: Record<string, string> = {
  prayer:
    'Connectez-vous pour partager vos sujets de prière avec la communauté.',
  profile: 'Connectez-vous pour accéder à votre profil.',
};

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NzIconDirective,
    Button,
    GoogleSignInButton,
  ],
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
          Connectez-vous
        </h1>
        @if (reasonMessage) {
          <p class="text-sm text-center text-church-text mt-2">
            {{ reasonMessage }}
          </p>
        } @else {
          <p class="text-sm text-center text-church-text-secondary mt-2">
            Entrer un email et mot de passe valide pour se connecter à votre
            compte.
          </p>
        }
      </div>

      <form
        [formGroup]="form"
        (ngSubmit)="onLogin()"
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

        <div>
          <div class="relative">
            <input
              [type]="showPassword() ? 'text' : 'password'"
              placeholder="Mot de passe"
              formControlName="password"
              autocomplete="current-password"
              class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 pr-12 text-base text-church-text placeholder:text-slate-400 outline-none transition-colors focus:border-church-blue"
            />
            <button
              type="button"
              (click)="showPassword.set(!showPassword())"
              class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 active:text-church-blue mt-4"
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
            form.controls.password.hasError('required')
          ) {
            <p class="text-xs text-church-red mt-1.5 px-1">
              Mot de passe requis
            </p>
          }
        </div>

        <a
          routerLink="/forgot-password"
          class="text-sm text-church-blue font-medium self-end -mt-1"
        >
          Mot de passe oublié ?
        </a>

        @if (authStore.signInErrorMessage()) {
          <p class="text-xs text-church-red text-center">
            {{ authStore.signInErrorMessage() }}
          </p>
        }

        <app-button
          variant="primary"
          size="lg"
          shape="rounded"
          [fullWidth]="true"
          type="submit"
          [disabled]="authStore.signInMutation.isPending()"
        >
          {{
            authStore.signInMutation.isPending()
              ? 'Connexion...'
              : 'Se connecter'
          }}
        </app-button>
      </form>

      <div class="flex items-center gap-4 my-6">
        <hr class="flex-1 border-slate-200" />
        <span class="text-sm text-church-text-secondary">Ou</span>
        <hr class="flex-1 border-slate-200" />
      </div>

      @if (authStore.googleSignInErrorMessage()) {
        <p class="text-xs text-church-red text-center mb-2">
          {{ authStore.googleSignInErrorMessage() }}
        </p>
      }

      <app-google-sign-in-button
        [disabled]="authStore.googleSignInMutation.isPending()"
        (click)="onGoogleSignIn()"
      />

      <p class="text-center text-sm text-church-text-secondary mt-8">
        Pas encore de compte ?
        <a routerLink="/signup" class="text-church-blue font-semibold">
          S'inscrire
        </a>
      </p>

      <a
        routerLink="/home"
        class="text-center text-xs text-church-text-secondary mt-4 active:text-church-blue"
      >
        Continuer sans compte →
      </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Login {
  readonly authStore = inject(AuthStore);
  private readonly passwordDispatch = injectDispatch(passwordSignInPageEvents);
  private readonly oauthDispatch = injectDispatch(oauthSignInPageEvents);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);

  readonly showPassword = signal(false);

  readonly reasonMessage = (() => {
    const reason = this.route.snapshot.queryParamMap.get('reason');
    return reason ? REASON_MESSAGES[reason] ?? null : null;
  })();

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onLogin() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.passwordDispatch.signIn(this.form.getRawValue());
  }

  onGoogleSignIn() {
    this.oauthDispatch.signInWithGoogle();
  }
}
