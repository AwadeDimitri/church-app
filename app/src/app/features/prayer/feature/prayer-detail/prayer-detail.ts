import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  signal,
  computed,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
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
import { firstValueFrom, switchMap } from 'rxjs';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { PageHeader } from '@shared/components/page-header/page-header';
import { Avatar } from '@shared/components/avatar/avatar';
import { Button } from '@shared/components/button/button';
import { RelativeTimePipe } from '@shared/pipes/relative-time.pipe';
import { GetPrayerRequestGQL } from '@core/graphql/generated';
import { IntercessionService } from '@core/services/intercession.service';
import { AuthService } from '@core/services/auth.service';
import {
  PrayerStore,
  prayerEntityEvents,
  prayerMutationEvents,
} from '@features/prayer/data-access';

const PALETTE: Record<string, { bg: string; text: string }> = {
  red:    { bg: 'bg-church-red-light',  text: 'text-church-red' },
  blue:   { bg: 'bg-church-blue-light', text: 'text-church-blue' },
  green:  { bg: 'bg-green-50',          text: 'text-church-green' },
  gold:   { bg: 'bg-amber-50',          text: 'text-church-gold' },
  purple: { bg: 'bg-purple-50',         text: 'text-purple-500' },
  gray:   { bg: 'bg-gray-100',          text: 'text-gray-600' },
};
const FALLBACK_COLOR = PALETTE['gray']!;

const AVATAR_COLORS = ['blue', 'red', 'green', 'gold', 'purple'] as const;
type AvatarColor = (typeof AVATAR_COLORS)[number];

type IntercessionItem = {
  id: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
  author?: { id: string; full_name?: string | null } | null;
  likes?: { totalCount?: number | null } | null;
  my_likes?: { edges: { node: { user_id: string } }[] } | null;
};

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
  private readonly intercessionService = inject(IntercessionService);
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

  private readonly feed = toSignal(
    toObservable(this.id).pipe(
      switchMap(id => this.intercessionService.forPrayer(id)),
    ),
  );
  readonly intercessions = computed(() => this.feed()?.items ?? []);
  readonly intercessionsCount = computed(() => this.feed()?.totalCount ?? 0);
  readonly intercessionsLoading = computed(() => this.feed() === undefined);

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

  readonly categoryColor = computed(() => {
    const key = this.prayer()?.category?.color ?? '';
    return PALETTE[key] ?? FALLBACK_COLOR;
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

  readonly submitting = signal(false);
  readonly markDialogOpen = signal(false);
  readonly marking = this.store.isMarkingAnswered;

  readonly canMarkAsAnswered = computed(() => {
    const p = this.prayer();
    const meId = this.auth.user()?.id;
    return !!p && !!meId && p.author?.id === meId && !p.is_answered;
  });

  constructor() {
    inject(Events)
      .on(prayerEntityEvents.markedAnswered)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.markDialogOpen.set(false));
  }

  authorNameOf(item: IntercessionItem): string {
    if (item.is_anonymous) return 'Anonyme';
    return item.author?.full_name ?? 'Membre';
  }

  avatarColorOf(name: string): AvatarColor {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash * 31 + name.charCodeAt(i)) | 0;
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]!;
  }

  isMineOf(item: IntercessionItem): boolean {
    const meId = this.auth.user()?.id;
    return !!meId && item.author?.id === meId;
  }

  isLikedByMeOf(item: IntercessionItem): boolean {
    return (item.my_likes?.edges.length ?? 0) > 0;
  }

  amenCountOf(item: IntercessionItem): number {
    return item.likes?.totalCount ?? 0;
  }

  submit(): void {
    if (this.form.invalid || this.submitting()) return;
    const { content, isAnonymous } = this.form.getRawValue();
    this.submitting.set(true);
    this.intercessionService
      .create(this.id(), content.trim(), isAnonymous)
      .subscribe({
        next: () => {
          this.form.reset({ content: '', isAnonymous: false });
          this.submitting.set(false);
        },
        error: () => this.submitting.set(false),
      });
  }

  toggleAmen(item: IntercessionItem): void {
    if (this.isLikedByMeOf(item)) {
      this.intercessionService.unlike(item.id).subscribe();
    } else {
      this.intercessionService.like(item.id).subscribe();
    }
  }

  deleteIntercession(item: IntercessionItem): void {
    if (!window.confirm('Supprimer cette intercession ?')) return;
    this.intercessionService.delete(item.id).subscribe();
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
