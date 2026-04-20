import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon';
type Size = 'sm' | 'md' | 'lg';
type Shape = 'pill' | 'rounded';

@Component({
  selector: 'app-button',
  host: { '[class.block]': 'fullWidth()' },
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="classes()"
      [attr.aria-label]="ariaLabel()">
      <ng-content />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  readonly variant = input<Variant>('primary');
  readonly size = input<Size>('md');
  readonly shape = input<Shape>('pill');
  readonly fullWidth = input(false);
  readonly disabled = input(false);
  readonly type = input<'button' | 'submit'>('button');
  readonly ariaLabel = input<string>();
  readonly customClass = input('');

  protected readonly classes = computed(() => {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none';
    const shape = this.variant() === 'icon' ? 'rounded-full' : Button.shapeMap[this.shape()];
    const variant = Button.variantMap[this.variant()];
    const size = this.variant() === 'icon' ? Button.iconSizeMap[this.size()] : Button.sizeMap[this.size()];
    const width = this.fullWidth() ? 'w-full' : '';
    const custom = this.customClass();

    return `${base} ${shape} ${variant} ${size} ${width} ${custom}`.trim();
  });

  private static readonly shapeMap: Record<Shape, string> = {
    pill: 'rounded-full',
    rounded: 'rounded-xl',
  };

  private static readonly variantMap: Record<Variant, string> = {
    primary:   'bg-church-blue text-white! shadow-sm active:bg-church-blue-dark',
    secondary: 'bg-white text-church-blue! shadow-church-card active:bg-slate-50',
    danger:    'bg-church-red text-white! shadow-lg shadow-church-red/30 active:bg-red-600',
    ghost:     'text-church-text-secondary! active:text-church-text',
    icon:      'bg-white rounded-full shadow-church-card active:bg-slate-50',
  };

  private static readonly sizeMap: Record<Size, string> = {
    sm: 'text-xs px-4 py-2',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-lg px-6 py-4 font-bold',
  };

  private static readonly iconSizeMap: Record<Size, string> = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-lg',
    lg: 'w-12 h-12 text-xl',
  };
}
