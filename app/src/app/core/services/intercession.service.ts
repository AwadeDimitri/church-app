import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import {
  GetPrayerIntercessionsGQL,
  CreatePrayerIntercessionGQL,
  DeletePrayerIntercessionGQL,
  LikeIntercessionGQL,
  UnlikeIntercessionGQL,
  type GetPrayerIntercessionsQuery,
} from '@core/graphql/generated';
import { unwrapNodes } from '@core/graphql/unwrap';
import { AuthService } from '@core/services/auth.service';

type Intercession = NonNullable<
  NonNullable<
    GetPrayerIntercessionsQuery['prayer_intercessionsCollection']
  >['edges'][number]
>['node'];

export interface IntercessionFeed {
  items: Intercession[];
  totalCount: number;
}

// Placeholder UUID utilisé tant que l'auth n'a pas résolu l'user ; aucune ligne ne match.
const EMPTY_UUID = '00000000-0000-0000-0000-000000000000';

@Injectable({ providedIn: 'root' })
export class IntercessionService {
  private readonly auth = inject(AuthService);
  private readonly listGQL = inject(GetPrayerIntercessionsGQL);
  private readonly createGQL = inject(CreatePrayerIntercessionGQL);
  private readonly deleteGQL = inject(DeletePrayerIntercessionGQL);
  private readonly likeGQL = inject(LikeIntercessionGQL);
  private readonly unlikeGQL = inject(UnlikeIntercessionGQL);

  forPrayer(prayerId: string) {
    const userId = this.auth.user()?.id ?? EMPTY_UUID;
    return this.listGQL
      .watch({ variables: { prayerId, userId } })
      .valueChanges.pipe(
        map(
          (r): IntercessionFeed => ({
            items: unwrapNodes<Intercession>(
              r.data?.prayer_intercessionsCollection,
            ),
            totalCount:
              r.data?.prayer_intercessionsCollection?.totalCount ?? 0,
          }),
        ),
      );
  }

  create(prayerId: string, content: string, isAnonymous: boolean) {
    return this.createGQL.mutate({
      variables: { prayer_id: prayerId, content, is_anonymous: isAnonymous },
      refetchQueries: ['GetPrayerIntercessions'],
    });
  }

  delete(id: string) {
    return this.deleteGQL.mutate({
      variables: { id },
      refetchQueries: ['GetPrayerIntercessions'],
    });
  }

  like(intercessionId: string) {
    return this.likeGQL.mutate({
      variables: { intercessionId },
      refetchQueries: ['GetPrayerIntercessions'],
    });
  }

  unlike(intercessionId: string) {
    return this.unlikeGQL.mutate({
      variables: { intercessionId },
      refetchQueries: ['GetPrayerIntercessions'],
    });
  }
}
