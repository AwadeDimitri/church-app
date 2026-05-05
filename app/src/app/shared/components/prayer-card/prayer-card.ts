import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { Avatar } from '../avatar/avatar';
import type { AvatarColor } from '../avatar/avatar-colors';

@Component({
  selector: 'app-prayer-card',
  imports: [NzIconDirective, Avatar],
  templateUrl: './prayer-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrayerCard {
  readonly author = input.required<string>();
  readonly content = input.required<string>();
  readonly date = input.required<string>();
  readonly category = input.required<string>();
  readonly prayerCount = input(0);
  readonly isAnswered = input(false);
  readonly avatarColor = input<AvatarColor>('blue');
  readonly categoryColor = input<{ bg: string; text: string }>({ bg: 'bg-church-blue-light', text: 'text-church-blue' });
}
