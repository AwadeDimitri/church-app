import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { Button } from '@shared/components/button/button';
import { StatCard } from '@shared/components/stat-card/stat-card';
import { CategoryFilter } from '@shared/components/category-filter/category-filter';
import { PrayerCard } from '@shared/components/prayer-card/prayer-card';
import { PrayerService } from '@core/services/prayer.service';

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  guerison: { bg: 'bg-church-red-light', text: 'text-church-red' },
  famille: { bg: 'bg-church-blue-light', text: 'text-church-blue' },
  travail: { bg: 'bg-amber-50', text: 'text-church-gold' },
  general: { bg: 'bg-green-50', text: 'text-church-green' },
};

const AVATAR_COLORS: Array<'blue' | 'red' | 'green' | 'gold' | 'purple'> = [
  'blue', 'red', 'green', 'gold', 'purple',
];

@Component({
  selector: 'app-prayer',
  imports: [DatePipe, NzIconDirective, Button, StatCard, CategoryFilter, PrayerCard],
  templateUrl: './prayer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Prayer {
  private readonly prayerService = inject(PrayerService);

  readonly categories = ['Toutes', 'Guerison', 'Famille', 'Travail', 'General'];
  readonly selectedCategory = signal('Toutes');

  // Formulaire nouvelle prière
  readonly newPrayerContent = signal('');
  readonly newPrayerCategory = signal('general');
  readonly newPrayerAnonymous = signal(false);
  readonly submitting = signal(false);

  readonly loading = this.prayerService.loading;
  readonly error = this.prayerService.error;
  readonly stats = this.prayerService.stats;

  readonly prayers = computed(() => {
    const selected = this.selectedCategory();
    const all = this.prayerService.prayers();

    if (selected === 'Toutes') return all;
    if (selected === 'Exaucees') return all.filter(p => p.is_answered);
    return all.filter(p => p.category.toLowerCase() === selected.toLowerCase());
  });

  getAuthorName(prayer: { is_anonymous: boolean; author?: { full_name: string } | null }): string {
    return prayer.is_anonymous ? 'Anonyme' : (prayer.author?.full_name ?? 'Membre');
  }

  getCategoryColor(category: string) {
    return CATEGORY_COLORS[category.toLowerCase()] ?? CATEGORY_COLORS['general'];
  }

  getAvatarColor(index: number) {
    return AVATAR_COLORS[index % AVATAR_COLORS.length];
  }

  onPray(id: string) {
    this.prayerService.pray(id).subscribe();
  }

  async onShare(prayer: { content: string }) {
    const text = `Prière : ${prayer.content}`;
    if (navigator.share) {
      await navigator.share({ title: 'Demande de prière', text });
    }
  }

  submitPrayer() {
    const content = this.newPrayerContent().trim();
    if (!content || this.submitting()) return;

    this.submitting.set(true);
    // TODO: remplacer par l'ID du user connecté quand l'auth sera en place
    const tempAuthorId = 'c3129cd5-aafe-4766-8d32-eeb48349aac3';

    this.prayerService.create(
      content,
      this.newPrayerCategory(),
      tempAuthorId,
      this.newPrayerAnonymous(),
    ).subscribe({
      next: () => {
        this.newPrayerContent.set('');
        this.newPrayerAnonymous.set(false);
        this.newPrayerCategory.set('general');
        this.submitting.set(false);
      },
      error: () => this.submitting.set(false),
    });
  }
}
