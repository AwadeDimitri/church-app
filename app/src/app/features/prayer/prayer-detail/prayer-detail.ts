import { Component, ChangeDetectionStrategy, inject, input, computed } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { PageHeader } from '@shared/components/page-header/page-header';
import { Avatar } from '@shared/components/avatar/avatar';
import { PrayerService } from '@core/services/prayer.service';

const PALETTE: Record<string, { bg: string; text: string }> = {
  red:    { bg: 'bg-church-red-light',  text: 'text-church-red' },
  blue:   { bg: 'bg-church-blue-light', text: 'text-church-blue' },
  green:  { bg: 'bg-green-50',          text: 'text-church-green' },
  gold:   { bg: 'bg-amber-50',          text: 'text-church-gold' },
  purple: { bg: 'bg-purple-50',         text: 'text-purple-500' },
  gray:   { bg: 'bg-gray-100',          text: 'text-gray-600' },
};
const FALLBACK_COLOR = PALETTE['gray']!;

@Component({
  selector: 'app-prayer-detail',
  imports: [DatePipe, NzIconDirective, PageHeader, Avatar],
  templateUrl: './prayer-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PrayerDetail {
  private readonly prayerService = inject(PrayerService);

  readonly id = input.required<string>();

  readonly prayer = toSignal(
    toObservable(this.id).pipe(
      switchMap(id => this.prayerService.getById(id)),
    ),
  );

  readonly authorName = computed(() => {
    const p = this.prayer();
    if (!p) return '';
    return p.is_anonymous ? 'Anonyme' : (p.author?.full_name ?? 'Membre');
  });

  readonly categoryColor = computed(() => {
    const key = this.prayer()?.category?.color ?? '';
    return PALETTE[key] ?? FALLBACK_COLOR;
  });

  readonly isLikedByMe = computed(
    () => (this.prayer()?.my_likes?.edges.length ?? 0) > 0,
  );

  togglePray() {
    const p = this.prayer();
    if (!p) return;
    if (this.isLikedByMe()) {
      this.prayerService.unlike(p.id).subscribe();
    } else {
      this.prayerService.like(p.id).subscribe();
    }
  }

  async onShare() {
    const p = this.prayer();
    if (!p) return;
    const text = `Prière : ${p.content}`;
    if (navigator.share) {
      await navigator.share({ title: 'Demande de prière', text });
    }
  }
}
