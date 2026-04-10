import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { Button } from '@shared/components/button/button';
import { StatCard } from '@shared/components/stat-card/stat-card';
import { CategoryFilter } from '@shared/components/category-filter/category-filter';
import { PrayerCard } from '@shared/components/prayer-card/prayer-card';

interface Stat {
  readonly value: number;
  readonly label: string;
  readonly color: string;
}

interface PrayerRequestItem {
  readonly author: string;
  readonly content: string;
  readonly date: string;
  readonly category: string;
  readonly prayerCount: number;
  readonly isAnswered: boolean;
  readonly avatarColor: 'blue' | 'red' | 'green' | 'gold' | 'purple';
  readonly categoryColor: { bg: string; text: string };
}

@Component({
  selector: 'app-prayer',
  imports: [NzIconDirective, Button, StatCard, CategoryFilter, PrayerCard],
  templateUrl: './prayer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Prayer {
  readonly stats: Stat[] = [
    { value: 127, label: 'Prières actives', color: 'text-church-blue' },
    { value: 84,  label: 'Exaucées',        color: 'text-church-green' },
    { value: 312, label: 'Intercesseurs',   color: 'text-church-gold' },
  ];

  readonly categories = ['Toutes', 'Guérison', 'Famille', 'Travail', 'Exaucées'];
  readonly selectedCategory = signal('Toutes');

  readonly prayers: PrayerRequestItem[] = [
    { author: 'Marie A.',  content: 'Priez pour ma mère qui est hospitalisée. Elle a besoin de guérison et de force en ce moment difficile.',     date: 'Il y a 2 heures', category: 'Guérison', prayerCount: 24, isAnswered: false, avatarColor: 'blue',   categoryColor: { bg: 'bg-church-red-light', text: 'text-church-red' } },
    { author: 'Pierre D.', content: 'Je cherche un emploi depuis 3 mois. Priez pour que Dieu ouvre les bonnes portes et me donne la patience.',  date: 'Il y a 5 heures', category: 'Travail',  prayerCount: 18, isAnswered: false, avatarColor: 'gold',   categoryColor: { bg: 'bg-amber-50', text: 'text-church-gold' } },
    { author: 'Sophie L.',  content: 'Gloire à Dieu ! Mon fils a réussi ses examens. Merci pour vos prières fidèles.',                           date: 'Hier',            category: 'Exaucée',  prayerCount: 42, isAnswered: true,  avatarColor: 'green',  categoryColor: { bg: 'bg-green-50', text: 'text-church-green' } },
    { author: 'Anonyme',   content: 'Priez pour la restauration de mon couple. Nous traversons des moments très difficiles.',                     date: 'Il y a 1 jour',   category: 'Famille',  prayerCount: 56, isAnswered: false, avatarColor: 'purple', categoryColor: { bg: 'bg-church-blue-light', text: 'text-church-blue' } },
  ];
}
