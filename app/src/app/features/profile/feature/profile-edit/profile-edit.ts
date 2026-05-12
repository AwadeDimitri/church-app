import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  effect,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Dispatcher } from '@ngrx/signals/events';
import { Button } from '@shared/components/button/button';
import { PageHeader } from '@shared/components/page-header/page-header';
import { ProfileStore, profileEvents } from '@features/profile/data-access';

@Component({
  selector: 'app-profile-edit',
  imports: [ReactiveFormsModule, Button, PageHeader],
  templateUrl: './profile-edit.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfileEdit {
  private readonly store = inject(ProfileStore);
  private readonly dispatcher = inject(Dispatcher);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly user = this.store.user;
  protected readonly loading = this.store.isUpdating;
  protected readonly errorMessage = computed(() => {
    const err = this.store.updateError();
    return err ? (err.message ?? 'Erreur de mise à jour') : null;
  });

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

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.dispatcher.dispatch(
      profileEvents.updateRequested({
        full_name: value.full_name,
        phone: value.phone || null,
      }),
    );
  }
}
