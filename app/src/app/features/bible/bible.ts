import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { PageHeader } from '@shared/components/page-header/page-header';
import { BibleService } from '@core/services/bible.service';

type Testament = 1 | 2;

@Component({
  selector: 'app-bible',
  imports: [RouterLink, NzIconDirective, PageHeader],
  templateUrl: './bible.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Bible {
  private readonly bibleService = inject(BibleService);

  readonly loading = this.bibleService.loading;
  readonly error = this.bibleService.error;
  readonly lastReading = this.bibleService.lastReading;

  readonly selectedTestament = signal<Testament>(1);

  readonly filteredBooks = computed(() =>
    this.bibleService.books().filter(b => b.testament === this.selectedTestament()),
  );

  selectTestament(t: Testament): void {
    this.selectedTestament.set(t);
  }
}
