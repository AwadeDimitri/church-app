import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'relativeTime', standalone: true })
export class RelativeTimePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    const seconds = Math.max(0, (Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "à l'instant";
    const minutes = seconds / 60;
    if (minutes < 60) return `il y a ${Math.floor(minutes)} min`;
    const hours = minutes / 60;
    if (hours < 24) return `il y a ${Math.floor(hours)} h`;
    const days = hours / 24;
    if (days < 2) return 'hier';
    if (days < 7) return `il y a ${Math.floor(days)} jours`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  }
}
