import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  model,
} from '@angular/core';

@Component({
  selector: 'app-category-filter',
  template: `
    <div class="scroll-snap-x flex gap-2 mb-6">
      @for (category of categories(); track category) {
        <button
          (click)="selected.set(category)"
          [class]="
            category === selected()
              ? 'shrink-0 bg-church-blue text-white! text-xs font-semibold px-4 py-2 rounded-full'
              : 'shrink-0 bg-white text-church-text-secondary text-xs font-semibold px-4 py-2 rounded-full shadow-church-card'
          "
        >
          {{ category }}
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFilter {
  readonly categories = input.required<string[]>();
  readonly selected = model.required<string>();
}
