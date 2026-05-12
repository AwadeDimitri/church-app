import type { GetProfileQuery } from '@core/graphql/generated';

export type ProfileUser = NonNullable<
  NonNullable<GetProfileQuery['usersCollection']>['edges'][number]
>['node'];

export type ProfileStats = {
  sermons: number;
  prayers: number;
  donations: number;
};
