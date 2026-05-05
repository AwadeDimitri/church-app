import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import type { AvatarColor } from './avatar-colors';

@Component({
  selector: 'app-avatar',
  template: `
    <div
      class="rounded-full flex items-center justify-center"
      [class]="sizeClass() + ' ' + bgClass()">
      <span [class]="fontClass() + ' font-bold ' + textClass()">{{ initials() }}</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Avatar {
  readonly name = input.required<string>();
  readonly color = input<AvatarColor>('blue');
  readonly size = input<'sm' | 'md' | 'lg'>('sm');

  protected readonly initials = computed(() => {
    const parts = this.name().split(/\s+/);
    return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
  });

  private static readonly colorMap = {
    blue:   { bg: 'bg-church-blue-light', text: 'text-church-blue' },
    red:    { bg: 'bg-church-red-light',  text: 'text-church-red' },
    green:  { bg: 'bg-green-50',          text: 'text-church-green' },
    gold:   { bg: 'bg-amber-50',          text: 'text-church-gold' },
    purple: { bg: 'bg-purple-50',         text: 'text-purple-500' },
  };

  private static readonly sizeMap = {
    sm: { size: 'w-9 h-9',   font: 'text-sm' },
    md: { size: 'w-14 h-14', font: 'text-lg' },
    lg: { size: 'w-24 h-24', font: 'text-3xl' },
  };

  protected bgClass = () => Avatar.colorMap[this.color()].bg;
  protected textClass = () => Avatar.colorMap[this.color()].text;
  protected sizeClass = () => Avatar.sizeMap[this.size()].size;
  protected fontClass = () => Avatar.sizeMap[this.size()].font;
}
