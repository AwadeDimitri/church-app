import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { DurationPipe } from '@shared/pipes/duration.pipe';

@Component({
  selector: 'app-sermon-card',
  imports: [NzIconDirective, DurationPipe],
  template: `
    <button
      (click)="play.emit()"
      class="w-full bg-white rounded-2xl p-4 shadow-church-card flex gap-4 items-center text-left active:scale-[0.99] transition-transform"
    >
      @if (thumbnailUrl(); as url) {
        <div
          class="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100"
        >
          <img
            [src]="url"
            [alt]="title()"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      } @else {
        <div
          class="w-20 h-20 rounded-xl flex items-center justify-center shrink-0 bg-church-blue-light"
        >
          <nz-icon
            [nzType]="audioUrl() ? 'audio' : 'play-circle'"
            nzTheme="outline"
            class="text-3xl text-church-blue"
          />
        </div>
      }

      <div class="flex-1 min-w-0">
        <h4
          class="font-semibold text-church-text text-sm leading-snug line-clamp-2"
        >
          {{ title() }}
        </h4>
        <p class="text-xs text-church-text-secondary mt-1 truncate">
          {{ speaker() }}
        </p>
        <div
          class="flex items-center gap-2 mt-2 text-xs text-church-text-secondary"
        >
          <span class="flex items-center gap-1">
            <nz-icon nzType="clock-circle" nzTheme="outline" />
            {{ duration() | duration }}
          </span>
          @if (tag()) {
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-church-blue-light text-church-blue"
            >
              {{ tag() }}
            </span>
          } @else if (date()) {
            <span class="opacity-50">•</span>
            <span>{{ date() }}</span>
          }
        </div>
      </div>

      @if (showPlayButton()) {
        <nz-icon
          nzType="play-circle"
          nzTheme="outline"
          class="text-church-blue text-2xl shrink-0"
        />
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
  readonly thumbnailUrl = input<string | null>();
  readonly audioUrl = input<string | null>();
  readonly showPlayButton = input(false);
  readonly play = output<void>();
}
