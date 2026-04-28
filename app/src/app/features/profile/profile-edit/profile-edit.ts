import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  effect,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Button } from '@shared/components/button/button';
import { PageHeader } from '@shared/components/page-header/page-header';
import { ProfileService } from '@core/services/profile.service';

@Component({
  selector: 'app-profile-edit',
  imports: [ReactiveFormsModule, Button, PageHeader],
  templateUrl: './profile-edit.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfileEdit {
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly user = this.profileService.user;
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.group({
    full_name: ['', [Validators.required, Validators.minLength(2)]],
    phone: [''],
  });

  constructor() {
    effect(() => {
      const u = this.user();
      if (u) {
        this.form.patchValue({
          full_name: u.full_name ?? '',
          phone: u.phone ?? '',
        });
      }
    });
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    try {
      const value = this.form.getRawValue();
      await this.profileService.updateProfile({
        full_name: value.full_name,
        phone: value.phone || null,
      });
      this.router.navigateByUrl('/profile');
    } catch (err) {
      this.errorMessage.set(
        err instanceof Error ? err.message : 'Erreur de mise à jour',
      );
    } finally {
      this.loading.set(false);
    }
  }
}
