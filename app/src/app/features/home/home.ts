import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconDirective } from 'ng-zorro-antd/icon';
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

interface ChurchEventPreview {
  readonly day: string;
  readonly dayBg: string;
  readonly dayText: string;
  readonly date: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly location: string;
}

interface SermonPreview {
  readonly title: string;
  readonly speaker: string;
  readonly duration: number;
  readonly date: string;
  readonly color: 'blue' | 'red' | 'green';
}

@Component({
  selector: 'app-home',
  imports: [NzIconDirective, RouterLink, Button, SectionHeader, SermonCard],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Home {
  readonly quickActions: QuickAction[] = [
    { icon: 'dollar-circle', label: 'Donner',      route: '/donate', bg: 'bg-church-blue-light', text: 'text-church-blue' },
    { icon: 'heart',         label: 'Prière',       route: '/prayer', bg: 'bg-church-red-light',  text: 'text-church-red' },
    { icon: 'calendar',      label: 'Événements',   route: '/home',   bg: 'bg-amber-50',          text: 'text-church-gold' },
    { icon: 'book',          label: 'Bible',         route: '/home',   bg: 'bg-green-50',           text: 'text-church-green' },
  ];

  readonly events: ChurchEventPreview[] = [
    { day: 'SAM', dayBg: 'bg-church-blue-light', dayText: 'text-church-blue', date: '12 Avril • 18h00', title: 'Soirée de louange',  description: 'Une soirée de worship et d\'adoration', icon: 'environment', location: 'Salle principale' },
    { day: 'DIM', dayBg: 'bg-church-red-light',  dayText: 'text-church-red',  date: '13 Avril • 09h30', title: 'Culte dominical',     description: 'Série : Les fondements de la foi',      icon: 'team',        location: 'Tout public' },
    { day: 'MER', dayBg: 'bg-amber-50',           dayText: 'text-church-gold', date: '16 Avril • 19h00', title: 'Étude biblique',      description: 'Épître aux Romains, chapitre 8',        icon: 'read',        location: 'Groupe adultes' },
  ];

  readonly sermons: SermonPreview[] = [
    { title: 'La puissance de la prière', speaker: 'Pasteur Jean-Marc', duration: 45, date: '6 Avril 2026',  color: 'blue' },
    { title: 'Marcher par la foi',        speaker: 'Pasteur Sarah',     duration: 38, date: '30 Mars 2026',  color: 'red' },
    { title: 'L\'amour inconditionnel',   speaker: 'Pasteur Jean-Marc', duration: 52, date: '23 Mars 2026',  color: 'green' },
  ];
}
