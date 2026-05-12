import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { BibleService } from '@core/services/bible.service';
import { EventStore } from '@features/events/data-access';
import { ProfileStore } from '@features/profile/data-access';
import { SermonStore } from '@features/sermons/data-access';
import { getYouTubeThumbnail } from '@core/utils/youtube.util';
import { SectionHeader } from '@shared/components/section-header/section-header';
import { SermonCard } from '@shared/components/sermon-card/sermon-card';

interface QuickAction {
  readonly icon: string;
  readonly label: string;
  readonly route: string;
}

const DAY_FMT = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' });
const MONTH_FMT = new Intl.DateTimeFormat('fr-FR', { month: 'short' });
const TIME_FMT = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' });
const SERMON_DATE_FMT = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

@Component({
  selector: 'app-home',
  imports: [NzIconDirective, RouterLink, SectionHeader, SermonCard],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Home {
  private readonly router = inject(Router);
  private readonly bibleService = inject(BibleService);
  private readonly sermonStore = inject(SermonStore);
  private readonly eventStore = inject(EventStore);
  private readonly profileStore = inject(ProfileStore);

  readonly dailyVerse = this.bibleService.dailyVerseDisplay;
  readonly lastReading = this.bibleService.lastReading;
  readonly eventsLoading = this.eventStore.isPending;
  readonly sermonsLoading = this.sermonStore.isPending;

  readonly firstName = computed(() => {
    const full = this.profileStore.user()?.full_name?.trim();
    return full ? full.split(/\s+/)[0] : '';
  });

  readonly upcomingEvents = computed(() =>
    this.eventStore.items().slice(0, 3).map(e => {
      const start = new Date(e.starts_at);
      return {
        id: e.id,
        title: e.title,
        description: e.description ?? '',
        location: e.location ?? '',
        day: DAY_FMT.format(start).replace('.', '').toUpperCase().slice(0, 3),
        dayNum: start.getDate(),
        month: MONTH_FMT.format(start).replace('.', '').toUpperCase(),
        time: TIME_FMT.format(start),
      };
    }),
  );

  readonly latestSermons = computed(() =>
    this.sermonStore.items().slice(0, 3).map(s => ({
      id: s.id,
      title: s.title,
      speaker: s.preacher_name,
      duration: s.duration ?? 0,
      date: s.published_at ? SERMON_DATE_FMT.format(new Date(s.published_at)) : '',
      thumbnailUrl: getYouTubeThumbnail(s.video_url),
      audioUrl: s.audio_url,
    })),
  );

  readonly quickActions: QuickAction[] = [
    { icon: 'play-circle', label: 'Sermons',     route: '/sermons' },
    { icon: 'calendar',    label: 'Événements',  route: '/events' },
    { icon: 'heart',       label: 'Prière',      route: '/prayer' },
    { icon: 'book',        label: 'À propos',    route: '/about' },
  ];

  openSermon(id: string): void {
    this.router.navigate(['/sermons', id]);
  }

  goToSermons(): void {
    this.router.navigate(['/sermons']);
  }

  goToEvents(): void {
    this.router.navigate(['/events']);
  }
}
