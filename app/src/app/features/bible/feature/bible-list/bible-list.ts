import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Dispatcher } from '@ngrx/signals/events';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { PageHeader } from '@shared/components/page-header/page-header';
import { BibleStore, bibleSearchEvents } from '@features/bible/data-access';
import { BibleSearchResults } from '@features/bible/ui/bible-search-results/bible-search-results';

type Testament = 1 | 2;

const SEARCH_DEBOUNCE_MS = 200;
const SEARCH_MIN_LENGTH = 2;
const SEARCH_PAGE_SIZE = 30;

@Component({
  selector: 'app-bible-list',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NzIconDirective,
    PageHeader,
    BibleSearchResults,
  ],
  templateUrl: './bible-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BibleList {
  private readonly store = inject(BibleStore);
  private readonly dispatcher = inject(Dispatcher);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** Recherche en cours, portée par l'URL (`?q=`) : un retour arrière la retrouve. */
  readonly q = input<string>();

  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly lastReading = this.store.lastReading;

  readonly selectedTestament = signal<Testament>(1);

  readonly filteredBooks = computed(() =>
    this.store.books().filter(b => b.testament === this.selectedTestament()),
  );

  protected readonly searchControl = new FormControl('', { nonNullable: true });
  protected readonly searchQuery = this.store.searchQuery;
  /** En dessous de deux caractères, la liste des livres reste affichée. */
  protected readonly searching = computed(
    () => this.searchQuery().length >= SEARCH_MIN_LENGTH,
  );
  protected readonly searchReferences = this.store.searchReferences;
  protected readonly searchTotal = this.store.searchTotal;
  private readonly searchLimit = signal(SEARCH_PAGE_SIZE);
  protected readonly searchHits = computed(() =>
    this.store.searchHits(this.searchLimit()),
  );

  /** Dernière recherche que le champ a lui-même inscrite dans l'URL. */
  private typedQuery = '';

  constructor() {
    // URL -> store, et -> champ quand le changement ne vient pas de la saisie
    // (retour arrière, nouvel appui sur l'onglet Bible). Ce setValue doit
    // émettre : c'est ce qui remet à jour la dernière valeur connue du champ.
    effect(() => {
      const query = this.q()?.trim() ?? '';
      untracked(() => {
        if (query !== this.typedQuery) {
          this.searchControl.setValue(query);
        }
        this.searchLimit.set(SEARCH_PAGE_SIZE);
        this.dispatcher.dispatch(bibleSearchEvents.queryChanged({ query }));
      });
    });

    // Saisie -> URL.
    this.searchControl.valueChanges
      .pipe(
        debounceTime(SEARCH_DEBOUNCE_MS),
        map(value => value.trim()),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe(query => this.writeQuery(query));
  }

  selectTestament(t: Testament): void {
    this.selectedTestament.set(t);
  }

  protected clearSearch(): void {
    this.searchControl.setValue('');
    this.writeQuery(''); // sans attendre le délai de saisie
  }

  private writeQuery(query: string): void {
    this.typedQuery = query;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: query || null },
      replaceUrl: true,
    });
  }

  protected showMoreResults(): void {
    this.searchLimit.update(limit => limit + SEARCH_PAGE_SIZE);
  }
}
