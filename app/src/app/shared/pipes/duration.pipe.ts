import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'duration', standalone: true })
export class DurationPipe implements PipeTransform {
  transform(seconds: number | null | undefined): string {
    if (seconds == null || seconds <= 0) return '—';
    const totalMinutes = Math.round(seconds / 60);
    if (totalMinutes < 60) return `${totalMinutes} min`;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes === 0 ? `${hours}h` : `${hours}h ${String(minutes).padStart(2, '0')}`;
  }
}
