import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { NzIconDirective } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-sermon-card',
  imports: [NzIconDirective],
  template: `
    <button
      (click)="play.emit()"
      class="w-full bg-white rounded-church-sm p-4 shadow-church-card flex gap-4 items-center text-left">
      <div class="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" [class]="bgClass()">
        <nz-icon nzType="play-circle" nzTheme="outline" [class]="'text-2xl ' + textClass()" />
      </div>
      <div class="flex-1 min-w-0">
        <h4 class="font-semibold text-church-text text-sm truncate">{{ title() }}</h4>
        <p class="text-xs text-church-text-secondary">{{ speaker() }}</p>
        <div class="flex items-center gap-3 mt-1">
          <span class="text-[10px] text-church-text-secondary flex items-center gap-1">
            <nz-icon nzType="clock-circle" nzTheme="outline" class="text-xs" /> {{ duration() }} min
          </span>
          @if (tag()) {
            <span class="text-[10px] px-2 py-0.5 rounded-full" [class]="bgClass() + ' ' + textClass()">
              {{ tag() }}
            </span>
          } @else {
            <span class="text-[10px] text-church-text-secondary">{{ date() }}</span>
          }
        </div>
      </div>
      @if (showPlayButton()) {
        <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0" [class]="bgClass()">
          <nz-icon nzType="play-circle" nzTheme="outline" [class]="textClass()" />
        </div>
      }
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SermonCard {
  readonly title = input.required<string>();
  readonly speaker = input.required<string>();
  readonly duration = input.required<number>();
  readonly date = input('');
  readonly tag = input<string>();
  readonly color = input<'blue' | 'red' | 'green' | 'gold' | 'purple'>('blue');
  readonly showPlayButton = input(false);
  readonly play = output<void>();

  private static readonly colorMap = {
    blue:   { bg: 'bg-church-blue-light', text: 'text-church-blue' },
    red:    { bg: 'bg-church-red-light',  text: 'text-church-red' },
    green:  { bg: 'bg-green-50',          text: 'text-church-green' },
    gold:   { bg: 'bg-amber-50',          text: 'text-church-gold' },
    purple: { bg: 'bg-purple-50',         text: 'text-purple-500' },
  };

  protected bgClass = () => SermonCard.colorMap[this.color()].bg;
  protected textClass = () => SermonCard.colorMap[this.color()].text;
}
