import type {
  GetPrayerCategoriesQuery,
  GetPrayerRequestsQuery,
} from '@core/graphql/generated';

export type PrayerCategory = NonNullable<
  GetPrayerCategoriesQuery['categoriesCollection']
>['edges'][number]['node'];

export type PrayerCategorySlug = PrayerCategory['slug'];

export type PrayerCategoryFilter = PrayerCategorySlug | 'all';

export type Prayer = NonNullable<
  NonNullable<
    GetPrayerRequestsQuery['prayer_requestsCollection']
  >['edges'][number]
>['node'];

export type PrayerScope = 'all' | 'mine';

export type PrayerListState = {
  scope: PrayerScope;
  selectedCategory: PrayerCategoryFilter;
};

export type PrayerDetailState = {
  currentPrayerId: string | null;
};
