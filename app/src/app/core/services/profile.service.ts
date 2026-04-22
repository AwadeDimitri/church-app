import { Injectable, inject, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
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

const EMPTY_UUID = '00000000-0000-0000-0000-000000000000';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly getProfileGQL = inject(GetProfileGQL);

  private readonly profileQuery = this.getProfileGQL.watch({
    variables: { userId: this.authService.user()?.id ?? EMPTY_UUID },
  });

  readonly user = toSignal(
    this.profileQuery.valueChanges.pipe(
      map(
        (r): ProfileUser | null =>
          unwrapNodes<ProfileUser>(r.data?.usersCollection)[0] ?? null,
      ),
    ),
    { initialValue: null as ProfileUser | null },
  );

  readonly stats = toSignal(
    this.profileQuery.valueChanges.pipe(
      map((r): ProfileStats => ({
        sermons: r.data?.sermons_count?.totalCount ?? 0,
        prayers: r.data?.user_prayers_count?.totalCount ?? 0,
        donations: 0,
      })),
    ),
    { initialValue: { sermons: 0, prayers: 0, donations: 0 } as ProfileStats },
  );

  readonly loading = toSignal(
    this.profileQuery.valueChanges.pipe(map(r => r.loading)),
    { initialValue: true },
  );

  constructor() {
    effect(() => {
      const user = this.authService.user();
      if (user?.id) {
        this.profileQuery.refetch({ userId: user.id });
      }
    });
  }

  async signOut() {
    await this.authService.signOut();
    await this.router.navigate(['/login']);
  }
}
