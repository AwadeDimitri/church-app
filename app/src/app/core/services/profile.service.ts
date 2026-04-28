import { Injectable, inject, signal, effect } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import {
  GetProfileGQL,
  UpdateProfileGQL,
  type GetProfileQuery,
  type UsersUpdateInput,
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
  private readonly updateProfileGQL = inject(UpdateProfileGQL);

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
      this.fetchProfile(user.id);
    });
  }

  private fetchProfile(userId: string): void {
    this._loading.set(true);
    this.getProfileGQL.fetch({ variables: { userId } }).subscribe({
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
  }

  async updateProfile(updates: UsersUpdateInput): Promise<void> {
    const user = this.authService.user();
    if (!user) throw new Error('Not authenticated');
    await firstValueFrom(
      this.updateProfileGQL.mutate({
        variables: { userId: user.id, set: updates },
      }),
    );
    this.fetchProfile(user.id);
  }

  async signOut() {
    await this.authService.signOut();
    await this.router.navigate(['/login']);
  }
}
