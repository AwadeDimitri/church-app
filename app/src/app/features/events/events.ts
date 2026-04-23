import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { EventService } from '@core/services/event.service';
import { PageHeader } from '@shared/components/page-header/page-header';

const DAY_FMT = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' });
const DAY_NUM_FMT = new Intl.DateTimeFormat('fr-FR', { day: '2-digit' });
const MONTH_FMT = new Intl.DateTimeFormat('fr-FR', { month: 'short' });
const TIME_FMT = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' });
const FULL_DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

@Component({
  selector: 'app-events',
  imports: [NzIconDirective, PageHeader],
  templateUrl: './events.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Events {
  private readonly eventService = inject(EventService);

  readonly loading = this.eventService.loading;
  readonly error = this.eventService.error;
  readonly hasMore = this.eventService.hasMore;

  readonly events = computed(() =>
    this.eventService.events().map(e => {
      const start = new Date(e.starts_at);
      const end = e.ends_at ? new Date(e.ends_at) : null;
      return {
        id: e.id,
        title: e.title,
        description: e.description ?? '',
        location: e.location ?? '',
        coverUrl: e.cover_url || null,
        day: DAY_FMT.format(start).replace('.', '').toUpperCase().slice(0, 3),
        dayNumber: DAY_NUM_FMT.format(start),
        month: MONTH_FMT.format(start).replace('.', '').toUpperCase(),
        fullDate: this.capitalize(FULL_DATE_FMT.format(start)),
        timeRange: end
          ? `${TIME_FMT.format(start)} – ${TIME_FMT.format(end)}`
          : TIME_FMT.format(start),
      };
    }),
  );

  loadMore(): void {
    this.eventService.loadMore();
  }

  private capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
