import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-section-header',
  template: `
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-bold text-church-text">{{ title() }}</h3>
      @if (actionLabel()) {
        <button
          (click)="action.emit()"
          class="text-church-blue text-sm font-medium">
          {{ actionLabel() }}
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeader {
  readonly title = input.required<string>();
  readonly actionLabel = input<string>();
  readonly action = output<void>();
}
