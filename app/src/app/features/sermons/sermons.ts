import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { Button } from '@shared/components/button/button';
import { CategoryFilter } from '@shared/components/category-filter/category-filter';
import { SermonCard } from '@shared/components/sermon-card/sermon-card';

interface SermonItem {
  readonly title: string;
  readonly speaker: string;
  readonly duration: number;
  readonly tag: string;
  readonly color: 'blue' | 'red' | 'green' | 'gold' | 'purple';
}

@Component({
  selector: 'app-sermons',
  imports: [NzIconDirective, Button, CategoryFilter, SermonCard],
  templateUrl: './sermons.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Sermons {
  readonly categories = ['Tous', 'Foi', 'Prière', 'Famille', 'Guérison', 'Louange'];
  readonly selectedCategory = signal('Tous');

  readonly sermons: SermonItem[] = [
    { title: 'La puissance de la prière',  speaker: 'Pasteur Jean-Marc', duration: 45, tag: 'Foi',      color: 'blue' },
    { title: 'Marcher par la foi',         speaker: 'Pasteur Sarah',     duration: 38, tag: 'Prière',    color: 'red' },
    { title: 'L\'amour inconditionnel',    speaker: 'Pasteur Jean-Marc', duration: 52, tag: 'Famille',   color: 'green' },
    { title: 'Être sel et lumière',        speaker: 'Diacre Philippe',   duration: 33, tag: 'Louange',   color: 'gold' },
    { title: 'La grâce suffisante',        speaker: 'Pasteur Sarah',     duration: 41, tag: 'Guérison',  color: 'purple' },
  ];
}
