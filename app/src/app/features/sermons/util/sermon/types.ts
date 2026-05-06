import type {
  GetSermonCategoriesQuery,
  GetSermonsQuery,
} from '@core/graphql/generated';

export type Sermon = NonNullable<
  NonNullable<GetSermonsQuery['sermonsCollection']>['edges'][number]
>['node'];

export type SermonCategory = NonNullable<
  NonNullable<
    GetSermonCategoriesQuery['categoriesCollection']
  >['edges'][number]
>['node'];

export type SermonListState = {
  search: string;
  categoryId: string | null;
};

export type SermonDetailState = {
  currentSermonId: string | null;
};
