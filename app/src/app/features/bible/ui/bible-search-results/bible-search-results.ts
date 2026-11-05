import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconDirective } from 'ng-zorro-antd/icon';

import type {
  BibleReferenceMatch,
  BibleSearchHit,
} from '@features/bible/util';
import { InfiniteScrollDirective } from '@shared/directives/infinite-scroll.directive';

@Component({
  selector: 'app-bible-search-results',
  imports: [RouterLink, NzIconDirective, InfiniteScrollDirective],
  templateUrl: './bible-search-results.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BibleSearchResults {
  readonly query = input.required<string>();
  readonly references = input.required<BibleReferenceMatch[]>();
  readonly hits = input.required<BibleSearchHit[]>();
  /** Nombre total de versets trouvés, au-delà de ceux affichés. */
  readonly total = input.required<number>();

  readonly loadMore = output<void>();

  protected readonly hasMore = computed(() => this.hits().length < this.total());
  protected readonly empty = computed(
    () => this.references().length === 0 && this.total() === 0,
  );

  protected referenceLink(match: BibleReferenceMatch): (string | number)[] {
    return match.chapter === null
      ? ['/bible', match.slug]
      : ['/bible', match.slug, match.chapter];
  }
}
