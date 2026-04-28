import { Injectable, inject, signal, effect } from '@angular/core';
import { Router } from '@angular/router';
import {
  GetProfileGQL,
  type GetProfileQuery,
} from '@core/graphql/generated';
import { unwrapNodes } from '@core/graphql/unwrap';
import { AuthService } from '@core/services/auth.service';

type ProfileUser = NonNullable<
  NonNullable<GetProfileQuery['usersCollection']>['edges'][number]
>['node'];

interface ProfileStats {
  sermons: number;
  prayers: number;
  donations: number;
}

const EMPTY_STATS: ProfileStats = { sermons: 0, prayers: 0, donations: 0 };

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly getProfileGQL = inject(GetProfileGQL);

  private readonly _user = signal<ProfileUser | null>(null);
  private readonly _stats = signal<ProfileStats>(EMPTY_STATS);
  private readonly _loading = signal(false);

  readonly user = this._user.asReadonly();
  readonly stats = this._stats.asReadonly();
  readonly loading = this._loading.asReadonly();

  constructor() {
    effect(() => {
      const user = this.authService.user();
      if (!user) {
        this._user.set(null);
        this._stats.set(EMPTY_STATS);
        this._loading.set(false);
        return;
      }

      this._loading.set(true);
      this.getProfileGQL.fetch({ variables: { userId: user.id } }).subscribe({
        next: (r) => {
          this._user.set(
            unwrapNodes<ProfileUser>(r.data?.usersCollection)[0] ?? null,
          );
          this._stats.set({
            sermons: r.data?.sermons_count?.totalCount ?? 0,
            prayers: r.data?.user_prayers_count?.totalCount ?? 0,
            donations: 0,
          });
          this._loading.set(false);
        },
        error: () => this._loading.set(false),
      });
    });
  }

  async signOut() {
    await this.authService.signOut();
    await this.router.navigate(['/login']);
  }
}
