import type { GetPrayerIntercessionsQuery } from '@core/graphql/generated';

export type IntercessionListState = {
  currentPrayerId: string | null;
};

export type Intercession = NonNullable<
  NonNullable<
    GetPrayerIntercessionsQuery['prayer_intercessionsCollection']
  >['edges'][number]
>['node'];
