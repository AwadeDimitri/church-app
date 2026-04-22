import { Component, ChangeDetectionStrategy, inject, computed, signal, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { Button } from '@shared/components/button/button';
import { StatCard } from '@shared/components/stat-card/stat-card';
import { CategoryFilter } from '@shared/components/category-filter/category-filter';
import { PrayerCard } from '@shared/components/prayer-card/prayer-card';
import { PrayerService } from '@core/services/prayer.service';

// Mapping clé couleur DB -> classes Tailwind (palette de theming, pas de donnée)
const PALETTE: Record<string, { bg: string; text: string }> = {
  red:    { bg: 'bg-church-red-light',  text: 'text-church-red' },
  blue:   { bg: 'bg-church-blue-light', text: 'text-church-blue' },
  green:  { bg: 'bg-green-50',          text: 'text-church-green' },
  gold:   { bg: 'bg-amber-50',          text: 'text-church-gold' },
  purple: { bg: 'bg-purple-50',         text: 'text-purple-500' },
  gray:   { bg: 'bg-gray-100',          text: 'text-gray-600' },
};
const FALLBACK_COLOR = PALETTE['gray']!;

const AVATAR_COLORS: Array<'blue' | 'red' | 'green' | 'gold' | 'purple'> = [
  'blue', 'red', 'green', 'gold', 'purple',
];

@Component({
  selector: 'app-prayer',
  imports: [DatePipe, ReactiveFormsModule, NzIconDirective, Button, StatCard, CategoryFilter, PrayerCard],
  templateUrl: './prayer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Prayer {
  private readonly prayerService = inject(PrayerService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly serviceCategories = this.prayerService.categories;

  // "Toutes" = concept UX (filtre désactivé), préfixé côté client
  readonly filterCategories = computed(() =>
    ['Toutes', ...this.serviceCategories().map(c => c.name)],
  );
  readonly selectedCategory = signal('Toutes');

  readonly form = this.fb.group({
    categoryId: ['', Validators.required],
    content: ['', [Validators.required, Validators.pattern(/\S/)]],
    isAnonymous: [false],
  });

  readonly submitting = signal(false);

  readonly loading = this.prayerService.loading;
  readonly error = this.prayerService.error;
  readonly hasMore = this.prayerService.hasMore;
  readonly allPrayers = this.prayerService.prayers;
  readonly stats = this.prayerService.stats;

  loadMore(): void {
    this.prayerService.loadMore();
  }

  readonly prayers = computed(() => {
    const selected = this.selectedCategory();
    const all = this.prayerService.prayers();

    if (selected === 'Toutes') return all;
    return all.filter(p => p.category?.name === selected);
  });

  constructor() {
    // Sélectionne la première catégorie par défaut dès qu'elles sont chargées
    effect(() => {
      const cats = this.serviceCategories();
      if (cats.length > 0 && !this.form.controls.categoryId.value) {
        this.form.patchValue({ categoryId: cats[0].id });
      }
    });
  }

  getAuthorName(prayer: { is_anonymous: boolean; author?: { full_name: string } | null }): string {
    return prayer.is_anonymous ? 'Anonyme' : (prayer.author?.full_name ?? 'Membre');
  }

  getCategoryColor(colorKey: string) {
    return PALETTE[colorKey] ?? FALLBACK_COLOR;
  }

  getAvatarColor(index: number) {
    return AVATAR_COLORS[index % AVATAR_COLORS.length];
  }

  isLikedByMe(prayer: { my_likes?: { edges: ReadonlyArray<unknown> } | null }): boolean {
    return (prayer.my_likes?.edges.length ?? 0) > 0;
  }

  togglePray(prayer: { id: string; my_likes?: { edges: ReadonlyArray<unknown> } | null }) {
    if (this.isLikedByMe(prayer)) {
      this.prayerService.unlike(prayer.id).subscribe();
    } else {
      this.prayerService.like(prayer.id).subscribe();
    }
  }

  async onShare(prayer: { content: string }) {
    const text = `Prière : ${prayer.content}`;
    if (navigator.share) {
      await navigator.share({ title: 'Demande de prière', text });
    }
  }

  submitPrayer() {
    if (this.submitting()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const { content, categoryId, isAnonymous } = this.form.getRawValue();

    this.prayerService.create(content.trim(), categoryId, isAnonymous).subscribe({
      next: () => {
        this.form.reset({
          content: '',
          categoryId: this.serviceCategories()[0]?.id ?? '',
          isAnonymous: false,
        });
        this.submitting.set(false);
      },
      error: () => this.submitting.set(false),
    });
  }
}
