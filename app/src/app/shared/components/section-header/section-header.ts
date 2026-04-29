import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { NzIconDirective } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-section-header',
  imports: [NzIconDirective],
  template: `
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-bold text-church-text">{{ title() }}</h3>
      @if (actionLabel()) {
        <button
          type="button"
          (click)="action.emit()"
          class="inline-flex items-center gap-1 -mr-2 px-2 py-1 text-church-blue text-sm font-medium rounded-md active:bg-church-blue-light/60 transition-colors">
          {{ actionLabel() }}
          <nz-icon nzType="right" nzTheme="outline" class="text-xs" />
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
