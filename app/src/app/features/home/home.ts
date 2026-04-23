import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { BibleService } from '@core/services/bible.service';
import { SermonService } from '@core/services/sermon.service';
import { EventService } from '@core/services/event.service';
import { ProfileService } from '@core/services/profile.service';
import { getYouTubeThumbnail } from '@core/utils/youtube.util';
import { Button } from '@shared/components/button/button';
import { SectionHeader } from '@shared/components/section-header/section-header';
import { SermonCard } from '@shared/components/sermon-card/sermon-card';

interface QuickAction {
  readonly icon: string;
  readonly label: string;
  readonly route: string;
  readonly bg: string;
  readonly text: string;
}

interface EventColor {
  readonly bg: string;
  readonly text: string;
}

const DAY_FMT = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' });
const DATE_FMT = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' });
const TIME_FMT = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' });
const SERMON_DATE_FMT = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

const EVENT_COLORS: readonly EventColor[] = [
  { bg: 'bg-church-blue-light', text: 'text-church-blue' },
  { bg: 'bg-church-red-light',  text: 'text-church-red' },
  { bg: 'bg-amber-50',          text: 'text-church-gold' },
];

const SERMON_COLORS = ['blue', 'red', 'green'] as const;

@Component({
  selector: 'app-home',
  imports: [NzIconDirective, RouterLink, Button, SectionHeader, SermonCard],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Home {
  private readonly router = inject(Router);
  private readonly bibleService = inject(BibleService);
  private readonly sermonService = inject(SermonService);
  private readonly eventService = inject(EventService);
  private readonly profileService = inject(ProfileService);

  readonly dailyVerse = this.bibleService.dailyVerseDisplay;

  readonly firstName = computed(() => {
    const full = this.profileService.user()?.full_name?.trim();
    return full ? full.split(/\s+/)[0] : '';
  });

  readonly upcomingEvents = computed(() =>
    this.eventService.events().slice(0, 3).map((e, i) => {
      const start = new Date(e.starts_at);
      const color = EVENT_COLORS[i % EVENT_COLORS.length];
      return {
        id: e.id,
        title: e.title,
        description: e.description ?? '',
        location: e.location ?? '',
        day: DAY_FMT.format(start).replace('.', '').toUpperCase().slice(0, 3),
        date: `${DATE_FMT.format(start)} • ${TIME_FMT.format(start)}`,
        dayBg: color.bg,
        dayText: color.text,
      };
    }),
  );

  readonly latestSermons = computed(() =>
    this.sermonService.sermons().slice(0, 3).map((s, i) => ({
      id: s.id,
      title: s.title,
      speaker: s.preacher_name,
      duration: s.duration ?? 0,
      date: s.published_at ? SERMON_DATE_FMT.format(new Date(s.published_at)) : '',
      thumbnailUrl: getYouTubeThumbnail(s.video_url),
      audioUrl: s.audio_url,
      color: SERMON_COLORS[i % SERMON_COLORS.length],
    })),
  );

  readonly quickActions: QuickAction[] = [
    { icon: 'dollar-circle', label: 'Donner',      route: '/donate', bg: 'bg-church-blue-light', text: 'text-church-blue' },
    { icon: 'heart',         label: 'Prière',       route: '/prayer', bg: 'bg-church-red-light',  text: 'text-church-red' },
    { icon: 'calendar',      label: 'Événements',   route: '/events', bg: 'bg-amber-50',          text: 'text-church-gold' },
    { icon: 'book',          label: 'Bible',        route: '/bible',  bg: 'bg-green-50',          text: 'text-church-green' },
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
