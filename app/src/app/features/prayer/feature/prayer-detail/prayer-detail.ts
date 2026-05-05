import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  signal,
  computed,
  effect,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import {
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { Dispatcher, Events } from '@ngrx/signals/events';
import {
  injectQuery,
  keepPreviousData,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { PageHeader } from '@shared/components/page-header/page-header';
import { Avatar } from '@shared/components/avatar/avatar';
import {
  avatarColorFor,
  type AvatarColor,
} from '@shared/components/avatar/avatar-colors';
import { Button } from '@shared/components/button/button';
import { RelativeTimePipe } from '@shared/pipes/relative-time.pipe';
import { GetPrayerRequestGQL } from '@core/graphql/generated';
import { AuthService } from '@core/services/auth.service';
import {
  PrayerStore,
  intercessionEntityEvents,
  intercessionListEvents,
  intercessionMutationEvents,
  prayerEntityEvents,
  prayerMutationEvents,
} from '@features/prayer/data-access';
import type { Intercession } from '@features/prayer/util';

@Component({
  selector: 'app-prayer-detail',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    NzIconDirective,
    PageHeader,
    Avatar,
    Button,
    RelativeTimePipe,
  ],
  templateUrl: './prayer-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PrayerDetail {
  private readonly store = inject(PrayerStore);
  private readonly dispatcher = inject(Dispatcher);
  private readonly auth = inject(AuthService);
  private readonly getPrayerGQL = inject(GetPrayerRequestGQL);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly id = input.required<string>();

  private readonly prayerQuery = injectQuery(() => ({
    queryKey: ['prayers', 'detail', this.id()],
    enabled: !!this.auth.user(),
    queryFn: async ({ signal }) => {
      const userId = this.auth.user()!.id;
      const result = await firstValueFrom(
        this.getPrayerGQL.fetch({
          variables: { id: this.id(), userId },
          context: { fetchOptions: { signal } },
        }),
      );
      return result.data?.prayer_requestsCollection?.edges?.[0]?.node ?? null;
    },
    placeholderData: keepPreviousData,
  }));

  readonly prayer = computed(() => this.prayerQuery.data() ?? undefined);

  readonly intercessions = this.store.intercessions;
  readonly intercessionsCount = this.store.intercessionsCount;
  readonly intercessionsLoading = this.store.intercessionsLoading;
  readonly submitting = this.store.isCreatingIntercession;

  readonly authorName = computed(() => {
    const p = this.prayer();
    if (!p) return '';
    return p.is_anonymous ? 'Anonyme' : (p.author?.full_name ?? 'Membre');
  });

  readonly currentUserName = computed(() => {
    const u = this.auth.user();
    const meta = (u?.user_metadata ?? {}) as { full_name?: string };
    return meta.full_name ?? 'Moi';
  });

  readonly isLikedByMe = computed(
    () => (this.prayer()?.my_likes?.edges.length ?? 0) > 0,
  );

  readonly form = this.fb.group({
    content: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(300)]],
    isAnonymous: [false],
  });

  readonly testimonyForm = this.fb.group({
    testimony: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(1000)]],
  });

  readonly markDialogOpen = signal(false);
  readonly marking = this.store.isMarkingAnswered;

  readonly canMarkAsAnswered = computed(() => {
    const p = this.prayer();
    const meId = this.auth.user()?.id;
    return !!p && !!meId && p.author?.id === meId && !p.is_answered;
  });

  constructor() {
    effect(() => {
      const id = this.id();
      if (id) {
        this.dispatcher.dispatch(
          intercessionListEvents.viewRequested({ prayerId: id }),
        );
      }
    });

    const events = inject(Events);

    events
      .on(prayerEntityEvents.markedAnswered)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.markDialogOpen.set(false));

    events
      .on(intercessionEntityEvents.created)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.form.reset({ content: '', isAnonymous: false }));
  }

  authorNameOf(item: Intercession): string {
    if (item.is_anonymous) return 'Anonyme';
    return item.author?.full_name ?? 'Membre';
  }

  avatarColorOf(name: string): AvatarColor {
    return avatarColorFor(name);
  }

  isMineOf(item: Intercession): boolean {
    const meId = this.auth.user()?.id;
    return !!meId && item.author?.id === meId;
  }

  isLikedByMeOf(item: Intercession): boolean {
    return (item.my_likes?.edges.length ?? 0) > 0;
  }

  amenCountOf(item: Intercession): number {
    return item.likes?.totalCount ?? 0;
  }

  submit(): void {
    if (this.form.invalid || this.submitting()) return;
    const { content, isAnonymous } = this.form.getRawValue();
    this.dispatcher.dispatch(
      intercessionMutationEvents.createRequested({
        prayer_id: this.id(),
        content: content.trim(),
        is_anonymous: isAnonymous,
      }),
    );
  }

  toggleAmen(item: Intercession): void {
    const event = this.isLikedByMeOf(item)
      ? intercessionMutationEvents.unlikeRequested({ intercessionId: item.id })
      : intercessionMutationEvents.likeRequested({ intercessionId: item.id });
    this.dispatcher.dispatch(event);
  }

  deleteIntercession(item: Intercession): void {
    if (!window.confirm('Supprimer cette intercession ?')) return;
    this.dispatcher.dispatch(
      intercessionMutationEvents.deleteRequested({ id: item.id }),
    );
  }

  togglePray(): void {
    const p = this.prayer();
    if (!p) return;
    if (this.isLikedByMe()) {
      this.dispatcher.dispatch(
        prayerMutationEvents.unlikeRequested({ prayerId: p.id }),
      );
    } else {
      this.dispatcher.dispatch(
        prayerMutationEvents.likeRequested({ prayerId: p.id }),
      );
    }
  }

  async onShare(): Promise<void> {
    const p = this.prayer();
    if (!p) return;
    const title = p.is_answered ? 'Prière exaucée' : 'Demande de prière';
    const text = p.is_answered ? `Prière exaucée : ${p.content}` : `Prière : ${p.content}`;
    if (navigator.share) {
      await navigator.share({ title, text });
    }
  }

  openMarkDialog(): void {
    this.testimonyForm.reset({ testimony: '' });
    this.markDialogOpen.set(true);
  }

  closeMarkDialog(): void {
    if (this.marking()) return;
    this.markDialogOpen.set(false);
  }

  confirmMarkAsAnswered(): void {
    if (this.testimonyForm.invalid || this.marking()) return;
    const { testimony } = this.testimonyForm.getRawValue();
    this.dispatcher.dispatch(
      prayerMutationEvents.markAnsweredRequested({
        id: this.id(),
        testimony: testimony.trim(),
      }),
    );
  }
}
