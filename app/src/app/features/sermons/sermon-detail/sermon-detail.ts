import { Component, ChangeDetectionStrategy, inject, input, computed } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SermonService } from '@core/services/sermon.service';
import { getYouTubeId } from '@core/utils/youtube.util';
import { PageHeader } from '@shared/components/page-header/page-header';

@Component({
  selector: 'app-sermon-detail',
  imports: [DatePipe, NzIconDirective, PageHeader],
  templateUrl: './sermon-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SermonDetail {
  private readonly sermonService = inject(SermonService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly id = input.required<string>();

  readonly sermon = toSignal(
    toObservable(this.id).pipe(
      switchMap(id => this.sermonService.getById(id)),
    ),
  );

  readonly youtubeEmbedUrl = computed(() => {
    const videoId = getYouTubeId(this.sermon()?.video_url);
    if (!videoId) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`,
    );
  });
}
