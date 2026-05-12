import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { PageHeader } from '@shared/components/page-header/page-header';
import { BibleStore } from '@features/bible/data-access';

type Testament = 1 | 2;

@Component({
  selector: 'app-bible-list',
  imports: [RouterLink, NzIconDirective, PageHeader],
  templateUrl: './bible-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BibleList {
  private readonly store = inject(BibleStore);

  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly lastReading = this.store.lastReading;

  readonly selectedTestament = signal<Testament>(1);

  readonly filteredBooks = computed(() =>
    this.store.books().filter(b => b.testament === this.selectedTestament()),
  );

  selectTestament(t: Testament): void {
    this.selectedTestament.set(t);
  }
}
