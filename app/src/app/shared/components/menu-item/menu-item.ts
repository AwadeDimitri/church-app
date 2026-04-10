import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { NzIconDirective } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-menu-item',
  imports: [NzIconDirective],
  template: `
    <button
      (click)="action.emit()"
      class="w-full flex items-center gap-4 p-4"
      [class.border-b]="!last()"
      [class.border-slate-50]="!last()">
      <div class="w-10 h-10 rounded-xl flex items-center justify-center" [class]="bgClass()">
        <nz-icon [nzType]="icon()" nzTheme="outline" [class]="iconColor()" />
      </div>
      <span class="flex-1 text-sm font-medium text-left" [class]="labelColor()">{{ label() }}</span>
      @if (showArrow()) {
        <nz-icon nzType="right" nzTheme="outline" class="text-church-text-secondary" />
      }
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuItem {
  readonly icon = input.required<string>();
  readonly label = input.required<string>();
  readonly bgClass = input('bg-church-blue-light');
  readonly iconColor = input('text-church-blue');
  readonly labelColor = input('text-church-text');
  readonly showArrow = input(true);
  readonly last = input(false);
  readonly action = output<void>();
}
