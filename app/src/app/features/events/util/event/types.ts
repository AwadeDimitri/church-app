import type { GetUpcomingEventsQuery } from '@core/graphql/generated';

export type ChurchEvent = NonNullable<
  NonNullable<GetUpcomingEventsQuery['eventsCollection']>['edges'][number]
>['node'];
