import { Component, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dispatcher } from '@ngrx/signals/events';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { Button } from '@shared/components/button/button';
import { PageHeader } from '@shared/components/page-header/page-header';
import {
  PrayerStore,
  prayerMutationEvents,
} from '@features/prayer/data-access';

@Component({
  selector: 'app-prayer-new',
  imports: [ReactiveFormsModule, NzIconDirective, Button, PageHeader],
  templateUrl: './prayer-new.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PrayerNew {
  private readonly store = inject(PrayerStore);
  private readonly dispatcher = inject(Dispatcher);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly categories = this.store.categories;
  readonly submitting = this.store.isCreating;

  readonly form = this.fb.group({
    categoryId: ['', Validators.required],
    content: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(500)]],
    isAnonymous: [false],
  });

  constructor() {
    effect(() => {
      const cats = this.categories();
      if (cats.length > 0 && !this.form.controls.categoryId.value) {
        this.form.patchValue({ categoryId: cats[0].id });
      }
    });
  }

  submit(): void {
    if (this.submitting()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { content, categoryId, isAnonymous } = this.form.getRawValue();
    this.dispatcher.dispatch(
      prayerMutationEvents.createRequested({
        content: content.trim(),
        category_id: categoryId,
        is_anonymous: isAnonymous,
      }),
    );
  }
}
