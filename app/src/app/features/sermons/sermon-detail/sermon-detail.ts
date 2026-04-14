import { Component, ChangeDetectionStrategy, inject, input, computed } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SermonService } from '@core/services/sermon.service';

@Component({
  selector: 'app-sermon-detail',
  imports: [DatePipe, RouterLink, NzIconDirective],
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
    const sermon = this.sermon();
    if (!sermon?.video_url) return null;
    const videoId = this.extractYouTubeId(sermon.video_url);
    if (!videoId) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`
    );
  });

  private extractYouTubeId(url: string): string | null {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match?.[1] ?? null;
  }
}
