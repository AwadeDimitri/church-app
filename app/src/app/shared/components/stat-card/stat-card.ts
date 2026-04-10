import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  template: `
    <div class="bg-white rounded-church-sm p-3 shadow-church-card text-center">
      <p class="font-bold" [class]="valueSizeClass() + ' ' + colorClass()">{{ value() }}</p>
      <p class="text-[10px] text-church-text-secondary font-medium">{{ label() }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCard {
  readonly value = input.required<string | number>();
  readonly label = input.required<string>();
  readonly color = input<string>('text-church-blue');
  readonly size = input<'sm' | 'lg'>('lg');

  protected colorClass = () => this.color();
  protected valueSizeClass = () => this.size() === 'lg' ? 'text-2xl' : 'text-xl';
}
