import { Component, ChangeDetectionStrategy, inject, input, computed, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Dispatcher } from '@ngrx/signals/events';
import { SermonStore, sermonDetailEvents } from '@features/sermons/data-access';
import { getYouTubeId } from '@core/utils/youtube.util';
import { PageHeader } from '@shared/components/page-header/page-header';
import { DurationPipe } from '@shared/pipes/duration.pipe';

@Component({
  selector: 'app-sermon-detail',
  imports: [DatePipe, NzIconDirective, PageHeader, DurationPipe],
  templateUrl: './sermon-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SermonDetail {
  private readonly store = inject(SermonStore);
  private readonly dispatcher = inject(Dispatcher);
  private readonly sanitizer = inject(DomSanitizer);

  readonly id = input.required<string>();

  readonly sermon = this.store.sermon;

  readonly youtubeEmbedUrl = computed(() => {
    const videoId = getYouTubeId(this.sermon()?.video_url);
    if (!videoId) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`,
    );
  });

  constructor() {
    effect(() => {
      this.dispatcher.dispatch(
        sermonDetailEvents.viewRequested({ id: this.id() }),
      );
    });
  }
}
