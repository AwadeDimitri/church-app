import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { Router } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { Button } from '@shared/components/button/button';
import { PageHeader } from '@shared/components/page-header/page-header';
import { PrayerService } from '@core/services/prayer.service';

@Component({
  selector: 'app-prayer-new',
  imports: [ReactiveFormsModule, NzIconDirective, Button, PageHeader],
  templateUrl: './prayer-new.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PrayerNew {
  private readonly prayerService = inject(PrayerService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);

  readonly categories = this.prayerService.categories;
  readonly submitting = signal(false);

  readonly form = this.fb.group({
    categoryId: ['', Validators.required],
    content: ['', [Validators.required, Validators.pattern(/\S/)]],
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

  submit() {
    if (this.submitting()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const { content, categoryId, isAnonymous } = this.form.getRawValue();

    this.prayerService.create(content.trim(), categoryId, isAnonymous).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/prayer']);
      },
      error: () => this.submitting.set(false),
    });
  }
}
