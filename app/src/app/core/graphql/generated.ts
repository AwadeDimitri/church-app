import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A high precision floating point value represented as a string */
  BigFloat: { input: string; output: string; }
  /** An arbitrary size integer represented as a string */
  BigInt: { input: string; output: string; }
  /** An opaque string using for tracking a position in results during pagination */
  Cursor: { input: string; output: string; }
  /** A date without time information */
  Date: { input: string; output: string; }
  /** A date and time */
  Datetime: { input: string; output: string; }
  /** A Javascript Object Notation value serialized as a string */
  JSON: { input: unknown; output: unknown; }
  /** Any type not handled by the type system */
  Opaque: { input: any; output: any; }
  /** A time without date information */
  Time: { input: string; output: string; }
  /** A universally unique identifier */
  UUID: { input: string; output: string; }
};

/** Boolean expression comparing fields on type "BigFloat" */
export type BigFloatFilter = {
  eq?: InputMaybe<Scalars['BigFloat']['input']>;
  gt?: InputMaybe<Scalars['BigFloat']['input']>;
  gte?: InputMaybe<Scalars['BigFloat']['input']>;
  in?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['BigFloat']['input']>;
  lte?: InputMaybe<Scalars['BigFloat']['input']>;
  neq?: InputMaybe<Scalars['BigFloat']['input']>;
};

/** Boolean expression comparing fields on type "BigFloatList" */
export type BigFloatListFilter = {
  containedBy?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
  contains?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
  eq?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
};

/** Boolean expression comparing fields on type "BigInt" */
export type BigIntFilter = {
  eq?: InputMaybe<Scalars['BigInt']['input']>;
  gt?: InputMaybe<Scalars['BigInt']['input']>;
  gte?: InputMaybe<Scalars['BigInt']['input']>;
  in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['BigInt']['input']>;
  lte?: InputMaybe<Scalars['BigInt']['input']>;
  neq?: InputMaybe<Scalars['BigInt']['input']>;
};

/** Boolean expression comparing fields on type "BigIntList" */
export type BigIntListFilter = {
  containedBy?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  eq?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

/** Boolean expression comparing fields on type "Boolean" */
export type BooleanFilter = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  is?: InputMaybe<FilterIs>;
};

/** Boolean expression comparing fields on type "BooleanList" */
export type BooleanListFilter = {
  containedBy?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  contains?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  eq?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

/** Boolean expression comparing fields on type "Date" */
export type DateFilter = {
  eq?: InputMaybe<Scalars['Date']['input']>;
  gt?: InputMaybe<Scalars['Date']['input']>;
  gte?: InputMaybe<Scalars['Date']['input']>;
  in?: InputMaybe<Array<Scalars['Date']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Date']['input']>;
  lte?: InputMaybe<Scalars['Date']['input']>;
  neq?: InputMaybe<Scalars['Date']['input']>;
};

/** Boolean expression comparing fields on type "DateList" */
export type DateListFilter = {
  containedBy?: InputMaybe<Array<Scalars['Date']['input']>>;
  contains?: InputMaybe<Array<Scalars['Date']['input']>>;
  eq?: InputMaybe<Array<Scalars['Date']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['Date']['input']>>;
};

/** Boolean expression comparing fields on type "Datetime" */
export type DatetimeFilter = {
  eq?: InputMaybe<Scalars['Datetime']['input']>;
  gt?: InputMaybe<Scalars['Datetime']['input']>;
  gte?: InputMaybe<Scalars['Datetime']['input']>;
  in?: InputMaybe<Array<Scalars['Datetime']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Datetime']['input']>;
  lte?: InputMaybe<Scalars['Datetime']['input']>;
  neq?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Boolean expression comparing fields on type "DatetimeList" */
export type DatetimeListFilter = {
  containedBy?: InputMaybe<Array<Scalars['Datetime']['input']>>;
  contains?: InputMaybe<Array<Scalars['Datetime']['input']>>;
  eq?: InputMaybe<Array<Scalars['Datetime']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['Datetime']['input']>>;
};

export enum FilterIs {
  NotNull = 'NOT_NULL',
  Null = 'NULL'
}

/** Boolean expression comparing fields on type "Float" */
export type FloatFilter = {
  eq?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<Scalars['Float']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  neq?: InputMaybe<Scalars['Float']['input']>;
};

/** Boolean expression comparing fields on type "FloatList" */
export type FloatListFilter = {
  containedBy?: InputMaybe<Array<Scalars['Float']['input']>>;
  contains?: InputMaybe<Array<Scalars['Float']['input']>>;
  eq?: InputMaybe<Array<Scalars['Float']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['Float']['input']>>;
};

/** Boolean expression comparing fields on type "ID" */
export type IdFilter = {
  eq?: InputMaybe<Scalars['ID']['input']>;
};

/** Boolean expression comparing fields on type "Int" */
export type IntFilter = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  neq?: InputMaybe<Scalars['Int']['input']>;
};

/** Boolean expression comparing fields on type "IntList" */
export type IntListFilter = {
  containedBy?: InputMaybe<Array<Scalars['Int']['input']>>;
  contains?: InputMaybe<Array<Scalars['Int']['input']>>;
  eq?: InputMaybe<Array<Scalars['Int']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** The root type for creating and mutating data */
export type Mutation = {
  __typename?: 'Mutation';
  /** Deletes zero or more records from the `bible_books` collection */
  deleteFrombible_booksCollection: Bible_BooksDeleteResponse;
  /** Deletes zero or more records from the `bible_verses` collection */
  deleteFrombible_versesCollection: Bible_VersesDeleteResponse;
  /** Deletes zero or more records from the `categories` collection */
  deleteFromcategoriesCollection: CategoriesDeleteResponse;
  /** Deletes zero or more records from the `donations` collection */
  deleteFromdonationsCollection: DonationsDeleteResponse;
  /** Deletes zero or more records from the `events` collection */
  deleteFromeventsCollection: EventsDeleteResponse;
  /** Deletes zero or more records from the `groups` collection */
  deleteFromgroupsCollection: GroupsDeleteResponse;
  /** Deletes zero or more records from the `posts` collection */
  deleteFrompostsCollection: PostsDeleteResponse;
  /** Deletes zero or more records from the `prayer_likes` collection */
  deleteFromprayer_likesCollection: Prayer_LikesDeleteResponse;
  /** Deletes zero or more records from the `prayer_requests` collection */
  deleteFromprayer_requestsCollection: Prayer_RequestsDeleteResponse;
  /** Deletes zero or more records from the `sermons` collection */
  deleteFromsermonsCollection: SermonsDeleteResponse;
  /** Deletes zero or more records from the `user_groups` collection */
  deleteFromuser_groupsCollection: User_GroupsDeleteResponse;
  /** Deletes zero or more records from the `users` collection */
  deleteFromusersCollection: UsersDeleteResponse;
  /** Adds one or more `bible_books` records to the collection */
  insertIntobible_booksCollection?: Maybe<Bible_BooksInsertResponse>;
  /** Adds one or more `bible_verses` records to the collection */
  insertIntobible_versesCollection?: Maybe<Bible_VersesInsertResponse>;
  /** Adds one or more `categories` records to the collection */
  insertIntocategoriesCollection?: Maybe<CategoriesInsertResponse>;
  /** Adds one or more `donations` records to the collection */
  insertIntodonationsCollection?: Maybe<DonationsInsertResponse>;
  /** Adds one or more `events` records to the collection */
  insertIntoeventsCollection?: Maybe<EventsInsertResponse>;
  /** Adds one or more `groups` records to the collection */
  insertIntogroupsCollection?: Maybe<GroupsInsertResponse>;
  /** Adds one or more `posts` records to the collection */
  insertIntopostsCollection?: Maybe<PostsInsertResponse>;
  /** Adds one or more `prayer_likes` records to the collection */
  insertIntoprayer_likesCollection?: Maybe<Prayer_LikesInsertResponse>;
  /** Adds one or more `prayer_requests` records to the collection */
  insertIntoprayer_requestsCollection?: Maybe<Prayer_RequestsInsertResponse>;
  /** Adds one or more `sermons` records to the collection */
  insertIntosermonsCollection?: Maybe<SermonsInsertResponse>;
  /** Adds one or more `user_groups` records to the collection */
  insertIntouser_groupsCollection?: Maybe<User_GroupsInsertResponse>;
  /** Adds one or more `users` records to the collection */
  insertIntousersCollection?: Maybe<UsersInsertResponse>;
  /** Updates zero or more records in the `bible_books` collection */
  updatebible_booksCollection: Bible_BooksUpdateResponse;
  /** Updates zero or more records in the `bible_verses` collection */
  updatebible_versesCollection: Bible_VersesUpdateResponse;
  /** Updates zero or more records in the `categories` collection */
  updatecategoriesCollection: CategoriesUpdateResponse;
  /** Updates zero or more records in the `donations` collection */
  updatedonationsCollection: DonationsUpdateResponse;
  /** Updates zero or more records in the `events` collection */
  updateeventsCollection: EventsUpdateResponse;
  /** Updates zero or more records in the `groups` collection */
  updategroupsCollection: GroupsUpdateResponse;
  /** Updates zero or more records in the `posts` collection */
  updatepostsCollection: PostsUpdateResponse;
  /** Updates zero or more records in the `prayer_likes` collection */
  updateprayer_likesCollection: Prayer_LikesUpdateResponse;
  /** Updates zero or more records in the `prayer_requests` collection */
  updateprayer_requestsCollection: Prayer_RequestsUpdateResponse;
  /** Updates zero or more records in the `sermons` collection */
  updatesermonsCollection: SermonsUpdateResponse;
  /** Updates zero or more records in the `user_groups` collection */
  updateuser_groupsCollection: User_GroupsUpdateResponse;
  /** Updates zero or more records in the `users` collection */
  updateusersCollection: UsersUpdateResponse;
};


/** The root type for creating and mutating data */
export type MutationDeleteFrombible_BooksCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Bible_BooksFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFrombible_VersesCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Bible_VersesFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromcategoriesCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<CategoriesFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromdonationsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<DonationsFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromeventsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<EventsFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromgroupsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<GroupsFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFrompostsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<PostsFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromprayer_LikesCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Prayer_LikesFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromprayer_RequestsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Prayer_RequestsFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromsermonsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<SermonsFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromuser_GroupsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<User_GroupsFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromusersCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<UsersFilter>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntobible_BooksCollectionArgs = {
  objects: Array<Bible_BooksInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntobible_VersesCollectionArgs = {
  objects: Array<Bible_VersesInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntocategoriesCollectionArgs = {
  objects: Array<CategoriesInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntodonationsCollectionArgs = {
  objects: Array<DonationsInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntoeventsCollectionArgs = {
  objects: Array<EventsInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntogroupsCollectionArgs = {
  objects: Array<GroupsInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntopostsCollectionArgs = {
  objects: Array<PostsInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntoprayer_LikesCollectionArgs = {
  objects: Array<Prayer_LikesInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntoprayer_RequestsCollectionArgs = {
  objects: Array<Prayer_RequestsInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntosermonsCollectionArgs = {
  objects: Array<SermonsInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntouser_GroupsCollectionArgs = {
  objects: Array<User_GroupsInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntousersCollectionArgs = {
  objects: Array<UsersInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationUpdatebible_BooksCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Bible_BooksFilter>;
  set: Bible_BooksUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdatebible_VersesCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Bible_VersesFilter>;
  set: Bible_VersesUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdatecategoriesCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<CategoriesFilter>;
  set: CategoriesUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdatedonationsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<DonationsFilter>;
  set: DonationsUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdateeventsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<EventsFilter>;
  set: EventsUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdategroupsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<GroupsFilter>;
  set: GroupsUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdatepostsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<PostsFilter>;
  set: PostsUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdateprayer_LikesCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Prayer_LikesFilter>;
  set: Prayer_LikesUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdateprayer_RequestsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Prayer_RequestsFilter>;
  set: Prayer_RequestsUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdatesermonsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<SermonsFilter>;
  set: SermonsUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdateuser_GroupsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<User_GroupsFilter>;
  set: User_GroupsUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdateusersCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<UsersFilter>;
  set: UsersUpdateInput;
};

export type Node = {
  /** Retrieves a record by `ID` */
  nodeId: Scalars['ID']['output'];
};

/** Boolean expression comparing fields on type "Opaque" */
export type OpaqueFilter = {
  eq?: InputMaybe<Scalars['Opaque']['input']>;
  is?: InputMaybe<FilterIs>;
};

/** Defines a per-field sorting order */
export enum OrderByDirection {
  /** Ascending order, nulls first */
  AscNullsFirst = 'AscNullsFirst',
  /** Ascending order, nulls last */
  AscNullsLast = 'AscNullsLast',
  /** Descending order, nulls first */
  DescNullsFirst = 'DescNullsFirst',
  /** Descending order, nulls last */
  DescNullsLast = 'DescNullsLast'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

/** The root type for querying data */
export type Query = {
  __typename?: 'Query';
  /** A pagable collection of type `bible_books` */
  bible_booksCollection?: Maybe<Bible_BooksConnection>;
  /** A pagable collection of type `bible_verses` */
  bible_versesCollection?: Maybe<Bible_VersesConnection>;
  /** A pagable collection of type `categories` */
  categoriesCollection?: Maybe<CategoriesConnection>;
  /** A pagable collection of type `donations` */
  donationsCollection?: Maybe<DonationsConnection>;
  /** A pagable collection of type `events` */
  eventsCollection?: Maybe<EventsConnection>;
  /** A pagable collection of type `groups` */
  groupsCollection?: Maybe<GroupsConnection>;
  intercessors_count?: Maybe<Scalars['Int']['output']>;
  /** Retrieve a record by its `ID` */
  node?: Maybe<Node>;
  /** A pagable collection of type `posts` */
  postsCollection?: Maybe<PostsConnection>;
  /** A pagable collection of type `prayer_likes` */
  prayer_likesCollection?: Maybe<Prayer_LikesConnection>;
  /** A pagable collection of type `prayer_requests` */
  prayer_requestsCollection?: Maybe<Prayer_RequestsConnection>;
  /** A pagable collection of type `sermons` */
  sermonsCollection?: Maybe<SermonsConnection>;
  /** A pagable collection of type `user_groups` */
  user_groupsCollection?: Maybe<User_GroupsConnection>;
  /** A pagable collection of type `users` */
  usersCollection?: Maybe<UsersConnection>;
};


/** The root type for querying data */
export type QueryBible_BooksCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Bible_BooksFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Bible_BooksOrderBy>>;
};


/** The root type for querying data */
export type QueryBible_VersesCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Bible_VersesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Bible_VersesOrderBy>>;
};


/** The root type for querying data */
export type QueryCategoriesCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<CategoriesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CategoriesOrderBy>>;
};


/** The root type for querying data */
export type QueryDonationsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<DonationsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<DonationsOrderBy>>;
};


/** The root type for querying data */
export type QueryEventsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<EventsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EventsOrderBy>>;
};


/** The root type for querying data */
export type QueryGroupsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<GroupsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<GroupsOrderBy>>;
};


/** The root type for querying data */
export type QueryNodeArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root type for querying data */
export type QueryPostsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<PostsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PostsOrderBy>>;
};


/** The root type for querying data */
export type QueryPrayer_LikesCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Prayer_LikesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Prayer_LikesOrderBy>>;
};


/** The root type for querying data */
export type QueryPrayer_RequestsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Prayer_RequestsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Prayer_RequestsOrderBy>>;
};


/** The root type for querying data */
export type QuerySermonsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<SermonsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SermonsOrderBy>>;
};


/** The root type for querying data */
export type QueryUser_GroupsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<User_GroupsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<User_GroupsOrderBy>>;
};


/** The root type for querying data */
export type QueryUsersCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<UsersFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
};

/** Boolean expression comparing fields on type "String" */
export type StringFilter = {
  eq?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  iregex?: InputMaybe<Scalars['String']['input']>;
  is?: InputMaybe<FilterIs>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  neq?: InputMaybe<Scalars['String']['input']>;
  regex?: InputMaybe<Scalars['String']['input']>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression comparing fields on type "StringList" */
export type StringListFilter = {
  containedBy?: InputMaybe<Array<Scalars['String']['input']>>;
  contains?: InputMaybe<Array<Scalars['String']['input']>>;
  eq?: InputMaybe<Array<Scalars['String']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Boolean expression comparing fields on type "Time" */
export type TimeFilter = {
  eq?: InputMaybe<Scalars['Time']['input']>;
  gt?: InputMaybe<Scalars['Time']['input']>;
  gte?: InputMaybe<Scalars['Time']['input']>;
  in?: InputMaybe<Array<Scalars['Time']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Time']['input']>;
  lte?: InputMaybe<Scalars['Time']['input']>;
  neq?: InputMaybe<Scalars['Time']['input']>;
};

/** Boolean expression comparing fields on type "TimeList" */
export type TimeListFilter = {
  containedBy?: InputMaybe<Array<Scalars['Time']['input']>>;
  contains?: InputMaybe<Array<Scalars['Time']['input']>>;
  eq?: InputMaybe<Array<Scalars['Time']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['Time']['input']>>;
};

/** Boolean expression comparing fields on type "UUID" */
export type UuidFilter = {
  eq?: InputMaybe<Scalars['UUID']['input']>;
  in?: InputMaybe<Array<Scalars['UUID']['input']>>;
  is?: InputMaybe<FilterIs>;
  neq?: InputMaybe<Scalars['UUID']['input']>;
};

/** Boolean expression comparing fields on type "UUIDList" */
export type UuidListFilter = {
  containedBy?: InputMaybe<Array<Scalars['UUID']['input']>>;
  contains?: InputMaybe<Array<Scalars['UUID']['input']>>;
  eq?: InputMaybe<Array<Scalars['UUID']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['UUID']['input']>>;
};

export type Bible_Books = Node & {
  __typename?: 'bible_books';
  bible_versesCollection?: Maybe<Bible_VersesConnection>;
  chapter_count: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  position: Scalars['Int']['output'];
  slug: Scalars['String']['output'];
  testament: Scalars['Int']['output'];
};


export type Bible_BooksBible_VersesCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Bible_VersesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Bible_VersesOrderBy>>;
};

export type Bible_BooksConnection = {
  __typename?: 'bible_booksConnection';
  edges: Array<Bible_BooksEdge>;
  pageInfo: PageInfo;
};

export type Bible_BooksDeleteResponse = {
  __typename?: 'bible_booksDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Bible_Books>;
};

export type Bible_BooksEdge = {
  __typename?: 'bible_booksEdge';
  cursor: Scalars['String']['output'];
  node: Bible_Books;
};

export type Bible_BooksFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<Bible_BooksFilter>>;
  chapter_count?: InputMaybe<IntFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<Bible_BooksFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<Bible_BooksFilter>>;
  position?: InputMaybe<IntFilter>;
  slug?: InputMaybe<StringFilter>;
  testament?: InputMaybe<IntFilter>;
};

export type Bible_BooksInsertInput = {
  chapter_count?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  testament?: InputMaybe<Scalars['Int']['input']>;
};

export type Bible_BooksInsertResponse = {
  __typename?: 'bible_booksInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Bible_Books>;
};

export type Bible_BooksOrderBy = {
  chapter_count?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  name?: InputMaybe<OrderByDirection>;
  position?: InputMaybe<OrderByDirection>;
  slug?: InputMaybe<OrderByDirection>;
  testament?: InputMaybe<OrderByDirection>;
};

export type Bible_BooksUpdateInput = {
  chapter_count?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  testament?: InputMaybe<Scalars['Int']['input']>;
};

export type Bible_BooksUpdateResponse = {
  __typename?: 'bible_booksUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Bible_Books>;
};

export type Bible_Verses = Node & {
  __typename?: 'bible_verses';
  bible_books?: Maybe<Bible_Books>;
  book_id: Scalars['Int']['output'];
  chapter: Scalars['Int']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  text: Scalars['String']['output'];
  verse: Scalars['Int']['output'];
};

export type Bible_VersesConnection = {
  __typename?: 'bible_versesConnection';
  edges: Array<Bible_VersesEdge>;
  pageInfo: PageInfo;
};

export type Bible_VersesDeleteResponse = {
  __typename?: 'bible_versesDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Bible_Verses>;
};

export type Bible_VersesEdge = {
  __typename?: 'bible_versesEdge';
  cursor: Scalars['String']['output'];
  node: Bible_Verses;
};

export type Bible_VersesFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<Bible_VersesFilter>>;
  book_id?: InputMaybe<IntFilter>;
  chapter?: InputMaybe<IntFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<Bible_VersesFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<Bible_VersesFilter>>;
  text?: InputMaybe<StringFilter>;
  verse?: InputMaybe<IntFilter>;
};

export type Bible_VersesInsertInput = {
  book_id?: InputMaybe<Scalars['Int']['input']>;
  chapter?: InputMaybe<Scalars['Int']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  verse?: InputMaybe<Scalars['Int']['input']>;
};

export type Bible_VersesInsertResponse = {
  __typename?: 'bible_versesInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Bible_Verses>;
};

export type Bible_VersesOrderBy = {
  book_id?: InputMaybe<OrderByDirection>;
  chapter?: InputMaybe<OrderByDirection>;
  text?: InputMaybe<OrderByDirection>;
  verse?: InputMaybe<OrderByDirection>;
};

export type Bible_VersesUpdateInput = {
  book_id?: InputMaybe<Scalars['Int']['input']>;
  chapter?: InputMaybe<Scalars['Int']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  verse?: InputMaybe<Scalars['Int']['input']>;
};

export type Bible_VersesUpdateResponse = {
  __typename?: 'bible_versesUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Bible_Verses>;
};

export type Categories = Node & {
  __typename?: 'categories';
  color: Scalars['String']['output'];
  created_at: Scalars['Datetime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  prayer_requestsCollection?: Maybe<Prayer_RequestsConnection>;
  sermonsCollection?: Maybe<SermonsConnection>;
  slug: Scalars['String']['output'];
  type: Scalars['String']['output'];
};


export type CategoriesPrayer_RequestsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Prayer_RequestsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Prayer_RequestsOrderBy>>;
};


export type CategoriesSermonsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<SermonsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SermonsOrderBy>>;
};

export type CategoriesConnection = {
  __typename?: 'categoriesConnection';
  edges: Array<CategoriesEdge>;
  pageInfo: PageInfo;
};

export type CategoriesDeleteResponse = {
  __typename?: 'categoriesDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Categories>;
};

export type CategoriesEdge = {
  __typename?: 'categoriesEdge';
  cursor: Scalars['String']['output'];
  node: Categories;
};

export type CategoriesFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<CategoriesFilter>>;
  color?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  description?: InputMaybe<StringFilter>;
  id?: InputMaybe<UuidFilter>;
  name?: InputMaybe<StringFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<CategoriesFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<CategoriesFilter>>;
  slug?: InputMaybe<StringFilter>;
  type?: InputMaybe<StringFilter>;
};

export type CategoriesInsertInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type CategoriesInsertResponse = {
  __typename?: 'categoriesInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Categories>;
};

export type CategoriesOrderBy = {
  color?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  description?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  name?: InputMaybe<OrderByDirection>;
  slug?: InputMaybe<OrderByDirection>;
  type?: InputMaybe<OrderByDirection>;
};

export type CategoriesUpdateInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type CategoriesUpdateResponse = {
  __typename?: 'categoriesUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Categories>;
};

export type Donations = Node & {
  __typename?: 'donations';
  amount: Scalars['BigFloat']['output'];
  created_at: Scalars['Datetime']['output'];
  currency: Scalars['String']['output'];
  frequency: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  payment_method: Scalars['String']['output'];
  user_id: Scalars['UUID']['output'];
  users?: Maybe<Users>;
};

export type DonationsConnection = {
  __typename?: 'donationsConnection';
  edges: Array<DonationsEdge>;
  pageInfo: PageInfo;
};

export type DonationsDeleteResponse = {
  __typename?: 'donationsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Donations>;
};

export type DonationsEdge = {
  __typename?: 'donationsEdge';
  cursor: Scalars['String']['output'];
  node: Donations;
};

export type DonationsFilter = {
  amount?: InputMaybe<BigFloatFilter>;
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<DonationsFilter>>;
  created_at?: InputMaybe<DatetimeFilter>;
  currency?: InputMaybe<StringFilter>;
  frequency?: InputMaybe<StringFilter>;
  id?: InputMaybe<UuidFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<DonationsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<DonationsFilter>>;
  payment_method?: InputMaybe<StringFilter>;
  user_id?: InputMaybe<UuidFilter>;
};

export type DonationsInsertInput = {
  amount?: InputMaybe<Scalars['BigFloat']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  frequency?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  payment_method?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type DonationsInsertResponse = {
  __typename?: 'donationsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Donations>;
};

export type DonationsOrderBy = {
  amount?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  currency?: InputMaybe<OrderByDirection>;
  frequency?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  payment_method?: InputMaybe<OrderByDirection>;
  user_id?: InputMaybe<OrderByDirection>;
};

export type DonationsUpdateInput = {
  amount?: InputMaybe<Scalars['BigFloat']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  frequency?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  payment_method?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type DonationsUpdateResponse = {
  __typename?: 'donationsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Donations>;
};

export type Events = Node & {
  __typename?: 'events';
  cover_url: Scalars['String']['output'];
  created_at: Scalars['Datetime']['output'];
  created_by: Scalars['UUID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  ends_at?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['UUID']['output'];
  location?: Maybe<Scalars['String']['output']>;
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  starts_at: Scalars['Datetime']['output'];
  title: Scalars['String']['output'];
  updated_at: Scalars['Datetime']['output'];
  users?: Maybe<Users>;
};

export type EventsConnection = {
  __typename?: 'eventsConnection';
  edges: Array<EventsEdge>;
  pageInfo: PageInfo;
};

export type EventsDeleteResponse = {
  __typename?: 'eventsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Events>;
};

export type EventsEdge = {
  __typename?: 'eventsEdge';
  cursor: Scalars['String']['output'];
  node: Events;
};

export type EventsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<EventsFilter>>;
  cover_url?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  created_by?: InputMaybe<UuidFilter>;
  description?: InputMaybe<StringFilter>;
  ends_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<UuidFilter>;
  location?: InputMaybe<StringFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<EventsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<EventsFilter>>;
  starts_at?: InputMaybe<DatetimeFilter>;
  title?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
};

export type EventsInsertInput = {
  cover_url?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  created_by?: InputMaybe<Scalars['UUID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  ends_at?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  starts_at?: InputMaybe<Scalars['Datetime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
};

export type EventsInsertResponse = {
  __typename?: 'eventsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Events>;
};

export type EventsOrderBy = {
  cover_url?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  created_by?: InputMaybe<OrderByDirection>;
  description?: InputMaybe<OrderByDirection>;
  ends_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  location?: InputMaybe<OrderByDirection>;
  starts_at?: InputMaybe<OrderByDirection>;
  title?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
};

export type EventsUpdateInput = {
  cover_url?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  created_by?: InputMaybe<Scalars['UUID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  ends_at?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  starts_at?: InputMaybe<Scalars['Datetime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
};

export type EventsUpdateResponse = {
  __typename?: 'eventsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Events>;
};

export type Groups = Node & {
  __typename?: 'groups';
  created_at: Scalars['Datetime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  updated_at: Scalars['Datetime']['output'];
  user_groupsCollection?: Maybe<User_GroupsConnection>;
};


export type GroupsUser_GroupsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<User_GroupsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<User_GroupsOrderBy>>;
};

export type GroupsConnection = {
  __typename?: 'groupsConnection';
  edges: Array<GroupsEdge>;
  pageInfo: PageInfo;
};

export type GroupsDeleteResponse = {
  __typename?: 'groupsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Groups>;
};

export type GroupsEdge = {
  __typename?: 'groupsEdge';
  cursor: Scalars['String']['output'];
  node: Groups;
};

export type GroupsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<GroupsFilter>>;
  created_at?: InputMaybe<DatetimeFilter>;
  description?: InputMaybe<StringFilter>;
  id?: InputMaybe<UuidFilter>;
  name?: InputMaybe<StringFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<GroupsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<GroupsFilter>>;
  updated_at?: InputMaybe<DatetimeFilter>;
};

export type GroupsInsertInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
};

export type GroupsInsertResponse = {
  __typename?: 'groupsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Groups>;
};

export type GroupsOrderBy = {
  created_at?: InputMaybe<OrderByDirection>;
  description?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  name?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
};

export type GroupsUpdateInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
};

export type GroupsUpdateResponse = {
  __typename?: 'groupsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Groups>;
};

export type Posts = Node & {
  __typename?: 'posts';
  category?: Maybe<Scalars['String']['output']>;
  content: Scalars['String']['output'];
  cover_url?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['Datetime']['output'];
  id: Scalars['UUID']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  published_at?: Maybe<Scalars['Datetime']['output']>;
  title: Scalars['String']['output'];
  updated_at: Scalars['Datetime']['output'];
};

export type PostsConnection = {
  __typename?: 'postsConnection';
  edges: Array<PostsEdge>;
  pageInfo: PageInfo;
};

export type PostsDeleteResponse = {
  __typename?: 'postsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Posts>;
};

export type PostsEdge = {
  __typename?: 'postsEdge';
  cursor: Scalars['String']['output'];
  node: Posts;
};

export type PostsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<PostsFilter>>;
  category?: InputMaybe<StringFilter>;
  content?: InputMaybe<StringFilter>;
  cover_url?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<UuidFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<PostsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<PostsFilter>>;
  published_at?: InputMaybe<DatetimeFilter>;
  title?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
};

export type PostsInsertInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  cover_url?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  published_at?: InputMaybe<Scalars['Datetime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
};

export type PostsInsertResponse = {
  __typename?: 'postsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Posts>;
};

export type PostsOrderBy = {
  category?: InputMaybe<OrderByDirection>;
  content?: InputMaybe<OrderByDirection>;
  cover_url?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  published_at?: InputMaybe<OrderByDirection>;
  title?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
};

export type PostsUpdateInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  cover_url?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  published_at?: InputMaybe<Scalars['Datetime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
};

export type PostsUpdateResponse = {
  __typename?: 'postsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Posts>;
};

export type Prayer_Likes = Node & {
  __typename?: 'prayer_likes';
  created_at: Scalars['Datetime']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  prayer_id: Scalars['UUID']['output'];
  prayer_requests?: Maybe<Prayer_Requests>;
  user_id: Scalars['UUID']['output'];
  users?: Maybe<Users>;
};

export type Prayer_LikesConnection = {
  __typename?: 'prayer_likesConnection';
  edges: Array<Prayer_LikesEdge>;
  pageInfo: PageInfo;
  /** The total number of records matching the `filter` criteria */
  totalCount: Scalars['Int']['output'];
};

export type Prayer_LikesDeleteResponse = {
  __typename?: 'prayer_likesDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Prayer_Likes>;
};

export type Prayer_LikesEdge = {
  __typename?: 'prayer_likesEdge';
  cursor: Scalars['String']['output'];
  node: Prayer_Likes;
};

export type Prayer_LikesFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<Prayer_LikesFilter>>;
  created_at?: InputMaybe<DatetimeFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<Prayer_LikesFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<Prayer_LikesFilter>>;
  prayer_id?: InputMaybe<UuidFilter>;
  user_id?: InputMaybe<UuidFilter>;
};

export type Prayer_LikesInsertInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  prayer_id?: InputMaybe<Scalars['UUID']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type Prayer_LikesInsertResponse = {
  __typename?: 'prayer_likesInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Prayer_Likes>;
};

export type Prayer_LikesOrderBy = {
  created_at?: InputMaybe<OrderByDirection>;
  prayer_id?: InputMaybe<OrderByDirection>;
  user_id?: InputMaybe<OrderByDirection>;
};

export type Prayer_LikesUpdateInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  prayer_id?: InputMaybe<Scalars['UUID']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type Prayer_LikesUpdateResponse = {
  __typename?: 'prayer_likesUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Prayer_Likes>;
};

export type Prayer_Requests = Node & {
  __typename?: 'prayer_requests';
  author_id: Scalars['UUID']['output'];
  categories?: Maybe<Categories>;
  category_id: Scalars['UUID']['output'];
  content: Scalars['String']['output'];
  created_at: Scalars['Datetime']['output'];
  id: Scalars['UUID']['output'];
  is_anonymous: Scalars['Boolean']['output'];
  is_answered: Scalars['Boolean']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  prayer_likesCollection?: Maybe<Prayer_LikesConnection>;
  updated_at: Scalars['Datetime']['output'];
  users?: Maybe<Users>;
};


export type Prayer_RequestsPrayer_LikesCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Prayer_LikesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Prayer_LikesOrderBy>>;
};

export type Prayer_RequestsConnection = {
  __typename?: 'prayer_requestsConnection';
  edges: Array<Prayer_RequestsEdge>;
  pageInfo: PageInfo;
  /** The total number of records matching the `filter` criteria */
  totalCount: Scalars['Int']['output'];
};

export type Prayer_RequestsDeleteResponse = {
  __typename?: 'prayer_requestsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Prayer_Requests>;
};

export type Prayer_RequestsEdge = {
  __typename?: 'prayer_requestsEdge';
  cursor: Scalars['String']['output'];
  node: Prayer_Requests;
};

export type Prayer_RequestsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<Prayer_RequestsFilter>>;
  author_id?: InputMaybe<UuidFilter>;
  category_id?: InputMaybe<UuidFilter>;
  content?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<UuidFilter>;
  is_anonymous?: InputMaybe<BooleanFilter>;
  is_answered?: InputMaybe<BooleanFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<Prayer_RequestsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<Prayer_RequestsFilter>>;
  updated_at?: InputMaybe<DatetimeFilter>;
};

export type Prayer_RequestsInsertInput = {
  author_id?: InputMaybe<Scalars['UUID']['input']>;
  category_id?: InputMaybe<Scalars['UUID']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  is_anonymous?: InputMaybe<Scalars['Boolean']['input']>;
  is_answered?: InputMaybe<Scalars['Boolean']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
};

export type Prayer_RequestsInsertResponse = {
  __typename?: 'prayer_requestsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Prayer_Requests>;
};

export type Prayer_RequestsOrderBy = {
  author_id?: InputMaybe<OrderByDirection>;
  category_id?: InputMaybe<OrderByDirection>;
  content?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  is_anonymous?: InputMaybe<OrderByDirection>;
  is_answered?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
};

export type Prayer_RequestsUpdateInput = {
  author_id?: InputMaybe<Scalars['UUID']['input']>;
  category_id?: InputMaybe<Scalars['UUID']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  is_anonymous?: InputMaybe<Scalars['Boolean']['input']>;
  is_answered?: InputMaybe<Scalars['Boolean']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
};

export type Prayer_RequestsUpdateResponse = {
  __typename?: 'prayer_requestsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Prayer_Requests>;
};

export type Sermons = Node & {
  __typename?: 'sermons';
  audio_url: Scalars['String']['output'];
  categories?: Maybe<Categories>;
  category_id?: Maybe<Scalars['UUID']['output']>;
  created_at?: Maybe<Scalars['Datetime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  duration?: Maybe<Scalars['Int']['output']>;
  id: Scalars['UUID']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  preacher_name: Scalars['String']['output'];
  published_at?: Maybe<Scalars['Datetime']['output']>;
  title: Scalars['String']['output'];
  updated_at?: Maybe<Scalars['Datetime']['output']>;
  video_url?: Maybe<Scalars['String']['output']>;
};

export type SermonsConnection = {
  __typename?: 'sermonsConnection';
  edges: Array<SermonsEdge>;
  pageInfo: PageInfo;
  /** The total number of records matching the `filter` criteria */
  totalCount: Scalars['Int']['output'];
};

export type SermonsDeleteResponse = {
  __typename?: 'sermonsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Sermons>;
};

export type SermonsEdge = {
  __typename?: 'sermonsEdge';
  cursor: Scalars['String']['output'];
  node: Sermons;
};

export type SermonsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<SermonsFilter>>;
  audio_url?: InputMaybe<StringFilter>;
  category_id?: InputMaybe<UuidFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  description?: InputMaybe<StringFilter>;
  duration?: InputMaybe<IntFilter>;
  id?: InputMaybe<UuidFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<SermonsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<SermonsFilter>>;
  preacher_name?: InputMaybe<StringFilter>;
  published_at?: InputMaybe<DatetimeFilter>;
  title?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
  video_url?: InputMaybe<StringFilter>;
};

export type SermonsInsertInput = {
  audio_url?: InputMaybe<Scalars['String']['input']>;
  category_id?: InputMaybe<Scalars['UUID']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  duration?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  preacher_name?: InputMaybe<Scalars['String']['input']>;
  published_at?: InputMaybe<Scalars['Datetime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  video_url?: InputMaybe<Scalars['String']['input']>;
};

export type SermonsInsertResponse = {
  __typename?: 'sermonsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Sermons>;
};

export type SermonsOrderBy = {
  audio_url?: InputMaybe<OrderByDirection>;
  category_id?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  description?: InputMaybe<OrderByDirection>;
  duration?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  preacher_name?: InputMaybe<OrderByDirection>;
  published_at?: InputMaybe<OrderByDirection>;
  title?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
  video_url?: InputMaybe<OrderByDirection>;
};

export type SermonsUpdateInput = {
  audio_url?: InputMaybe<Scalars['String']['input']>;
  category_id?: InputMaybe<Scalars['UUID']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  duration?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  preacher_name?: InputMaybe<Scalars['String']['input']>;
  published_at?: InputMaybe<Scalars['Datetime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
  video_url?: InputMaybe<Scalars['String']['input']>;
};

export type SermonsUpdateResponse = {
  __typename?: 'sermonsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Sermons>;
};

export type User_Groups = Node & {
  __typename?: 'user_groups';
  group_id: Scalars['UUID']['output'];
  groups?: Maybe<Groups>;
  joined_at: Scalars['Datetime']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  user_id: Scalars['UUID']['output'];
  users?: Maybe<Users>;
};

export type User_GroupsConnection = {
  __typename?: 'user_groupsConnection';
  edges: Array<User_GroupsEdge>;
  pageInfo: PageInfo;
};

export type User_GroupsDeleteResponse = {
  __typename?: 'user_groupsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<User_Groups>;
};

export type User_GroupsEdge = {
  __typename?: 'user_groupsEdge';
  cursor: Scalars['String']['output'];
  node: User_Groups;
};

export type User_GroupsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<User_GroupsFilter>>;
  group_id?: InputMaybe<UuidFilter>;
  joined_at?: InputMaybe<DatetimeFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<User_GroupsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<User_GroupsFilter>>;
  user_id?: InputMaybe<UuidFilter>;
};

export type User_GroupsInsertInput = {
  group_id?: InputMaybe<Scalars['UUID']['input']>;
  joined_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type User_GroupsInsertResponse = {
  __typename?: 'user_groupsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<User_Groups>;
};

export type User_GroupsOrderBy = {
  group_id?: InputMaybe<OrderByDirection>;
  joined_at?: InputMaybe<OrderByDirection>;
  user_id?: InputMaybe<OrderByDirection>;
};

export type User_GroupsUpdateInput = {
  group_id?: InputMaybe<Scalars['UUID']['input']>;
  joined_at?: InputMaybe<Scalars['Datetime']['input']>;
  user_id?: InputMaybe<Scalars['UUID']['input']>;
};

export type User_GroupsUpdateResponse = {
  __typename?: 'user_groupsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<User_Groups>;
};

export type Users = Node & {
  __typename?: 'users';
  avatar_url?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['Datetime']['output']>;
  donationsCollection?: Maybe<DonationsConnection>;
  email?: Maybe<Scalars['String']['output']>;
  eventsCollection?: Maybe<EventsConnection>;
  full_name: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  is_active: Scalars['Boolean']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  prayer_likesCollection?: Maybe<Prayer_LikesConnection>;
  prayer_requestsCollection?: Maybe<Prayer_RequestsConnection>;
  role: Scalars['String']['output'];
  updated_at?: Maybe<Scalars['Datetime']['output']>;
  user_groupsCollection?: Maybe<User_GroupsConnection>;
};


export type UsersDonationsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<DonationsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<DonationsOrderBy>>;
};


export type UsersEventsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<EventsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EventsOrderBy>>;
};


export type UsersPrayer_LikesCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Prayer_LikesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Prayer_LikesOrderBy>>;
};


export type UsersPrayer_RequestsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Prayer_RequestsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Prayer_RequestsOrderBy>>;
};


export type UsersUser_GroupsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<User_GroupsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<User_GroupsOrderBy>>;
};

export type UsersConnection = {
  __typename?: 'usersConnection';
  edges: Array<UsersEdge>;
  pageInfo: PageInfo;
};

export type UsersDeleteResponse = {
  __typename?: 'usersDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Users>;
};

export type UsersEdge = {
  __typename?: 'usersEdge';
  cursor: Scalars['String']['output'];
  node: Users;
};

export type UsersFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<UsersFilter>>;
  avatar_url?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  email?: InputMaybe<StringFilter>;
  full_name?: InputMaybe<StringFilter>;
  id?: InputMaybe<UuidFilter>;
  is_active?: InputMaybe<BooleanFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<UsersFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<UsersFilter>>;
  phone?: InputMaybe<StringFilter>;
  role?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DatetimeFilter>;
};

export type UsersInsertInput = {
  avatar_url?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  full_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
};

export type UsersInsertResponse = {
  __typename?: 'usersInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Users>;
};

export type UsersOrderBy = {
  avatar_url?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  email?: InputMaybe<OrderByDirection>;
  full_name?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  is_active?: InputMaybe<OrderByDirection>;
  phone?: InputMaybe<OrderByDirection>;
  role?: InputMaybe<OrderByDirection>;
  updated_at?: InputMaybe<OrderByDirection>;
};

export type UsersUpdateInput = {
  avatar_url?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  full_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['Datetime']['input']>;
};

export type UsersUpdateResponse = {
  __typename?: 'usersUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Users>;
};

export type GetEventsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetEventsQuery = { __typename?: 'Query', eventsCollection?: { __typename?: 'eventsConnection', edges: Array<{ __typename?: 'eventsEdge', node: { __typename?: 'events', id: string, title: string, description?: string | null, location?: string | null, cover_url: string, starts_at: string, ends_at?: string | null } }> } | null };

export type GetUpcomingEventsQueryVariables = Exact<{
  now: Scalars['Datetime']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetUpcomingEventsQuery = { __typename?: 'Query', eventsCollection?: { __typename?: 'eventsConnection', edges: Array<{ __typename?: 'eventsEdge', node: { __typename?: 'events', id: string, title: string, description?: string | null, location?: string | null, cover_url: string, starts_at: string, ends_at?: string | null } }> } | null };

export type GetPostsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetPostsQuery = { __typename?: 'Query', postsCollection?: { __typename?: 'postsConnection', edges: Array<{ __typename?: 'postsEdge', node: { __typename?: 'posts', id: string, title: string, content: string, category?: string | null, cover_url?: string | null, published_at?: string | null, created_at: string } }> } | null };

export type GetPrayerRequestsQueryVariables = Exact<{
  userId: Scalars['UUID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetPrayerRequestsQuery = { __typename?: 'Query', prayer_requestsCollection?: { __typename?: 'prayer_requestsConnection', edges: Array<{ __typename?: 'prayer_requestsEdge', node: { __typename?: 'prayer_requests', id: string, content: string, is_anonymous: boolean, is_answered: boolean, created_at: string, category?: { __typename?: 'categories', id: string, slug: string, name: string, color: string } | null, author?: { __typename?: 'users', id: string, full_name: string } | null, likes?: { __typename?: 'prayer_likesConnection', totalCount: number } | null, my_likes?: { __typename?: 'prayer_likesConnection', edges: Array<{ __typename?: 'prayer_likesEdge', node: { __typename?: 'prayer_likes', user_id: string } }> } | null } }> } | null };

export type GetPrayerRequestQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
  userId: Scalars['UUID']['input'];
}>;


export type GetPrayerRequestQuery = { __typename?: 'Query', prayer_requestsCollection?: { __typename?: 'prayer_requestsConnection', edges: Array<{ __typename?: 'prayer_requestsEdge', node: { __typename?: 'prayer_requests', id: string, content: string, is_anonymous: boolean, is_answered: boolean, created_at: string, category?: { __typename?: 'categories', id: string, slug: string, name: string, color: string } | null, author?: { __typename?: 'users', id: string, full_name: string } | null, likes?: { __typename?: 'prayer_likesConnection', totalCount: number } | null, my_likes?: { __typename?: 'prayer_likesConnection', edges: Array<{ __typename?: 'prayer_likesEdge', node: { __typename?: 'prayer_likes', user_id: string } }> } | null } }> } | null };

export type GetMyPrayerRequestsQueryVariables = Exact<{
  userId: Scalars['UUID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetMyPrayerRequestsQuery = { __typename?: 'Query', prayer_requestsCollection?: { __typename?: 'prayer_requestsConnection', edges: Array<{ __typename?: 'prayer_requestsEdge', node: { __typename?: 'prayer_requests', id: string, content: string, is_anonymous: boolean, is_answered: boolean, created_at: string, category?: { __typename?: 'categories', id: string, slug: string, name: string, color: string } | null, author?: { __typename?: 'users', id: string, full_name: string } | null, likes?: { __typename?: 'prayer_likesConnection', totalCount: number } | null, my_likes?: { __typename?: 'prayer_likesConnection', edges: Array<{ __typename?: 'prayer_likesEdge', node: { __typename?: 'prayer_likes', user_id: string } }> } | null } }> } | null };

export type GetPrayerStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPrayerStatsQuery = { __typename?: 'Query', intercessors?: number | null, active?: { __typename?: 'prayer_requestsConnection', totalCount: number } | null, answered?: { __typename?: 'prayer_requestsConnection', totalCount: number } | null };

export type GetPrayerCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPrayerCategoriesQuery = { __typename?: 'Query', categoriesCollection?: { __typename?: 'categoriesConnection', edges: Array<{ __typename?: 'categoriesEdge', node: { __typename?: 'categories', id: string, slug: string, name: string, color: string, description?: string | null } }> } | null };

export type CreatePrayerRequestMutationVariables = Exact<{
  content: Scalars['String']['input'];
  category_id: Scalars['UUID']['input'];
  is_anonymous: Scalars['Boolean']['input'];
}>;


export type CreatePrayerRequestMutation = { __typename?: 'Mutation', insertIntoprayer_requestsCollection?: { __typename?: 'prayer_requestsInsertResponse', records: Array<{ __typename?: 'prayer_requests', id: string, created_at: string }> } | null };

export type LikePrayerMutationVariables = Exact<{
  prayerId: Scalars['UUID']['input'];
}>;


export type LikePrayerMutation = { __typename?: 'Mutation', insertIntoprayer_likesCollection?: { __typename?: 'prayer_likesInsertResponse', records: Array<{ __typename?: 'prayer_likes', prayer_id: string, user_id: string }> } | null };

export type UnlikePrayerMutationVariables = Exact<{
  prayerId: Scalars['UUID']['input'];
}>;


export type UnlikePrayerMutation = { __typename?: 'Mutation', deleteFromprayer_likesCollection: { __typename?: 'prayer_likesDeleteResponse', records: Array<{ __typename?: 'prayer_likes', prayer_id: string }> } };

export type GetSermonsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<SermonsFilter>;
}>;


export type GetSermonsQuery = { __typename?: 'Query', sermonsCollection?: { __typename?: 'sermonsConnection', edges: Array<{ __typename?: 'sermonsEdge', node: { __typename?: 'sermons', id: string, title: string, preacher_name: string, audio_url: string, video_url?: string | null, description?: string | null, duration?: number | null, published_at?: string | null, category?: { __typename?: 'categories', id: string, name: string } | null } }> } | null };

export type GetSermonByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetSermonByIdQuery = { __typename?: 'Query', sermonsCollection?: { __typename?: 'sermonsConnection', edges: Array<{ __typename?: 'sermonsEdge', node: { __typename?: 'sermons', id: string, title: string, preacher_name: string, audio_url: string, video_url?: string | null, description?: string | null, duration?: number | null, published_at?: string | null, category?: { __typename?: 'categories', id: string, name: string } | null } }> } | null };

export type GetSermonCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSermonCategoriesQuery = { __typename?: 'Query', categoriesCollection?: { __typename?: 'categoriesConnection', edges: Array<{ __typename?: 'categoriesEdge', node: { __typename?: 'categories', id: string, name: string } }> } | null };

export type GetProfileQueryVariables = Exact<{
  userId: Scalars['UUID']['input'];
}>;


export type GetProfileQuery = { __typename?: 'Query', usersCollection?: { __typename?: 'usersConnection', edges: Array<{ __typename?: 'usersEdge', node: { __typename?: 'users', id: string, email?: string | null, full_name: string, phone?: string | null, avatar_url?: string | null, role: string, is_active: boolean, created_at?: string | null } }> } | null, sermons_count?: { __typename?: 'sermonsConnection', totalCount: number } | null, user_prayers_count?: { __typename?: 'prayer_requestsConnection', totalCount: number } | null };

export type UpdateProfileMutationVariables = Exact<{
  userId: Scalars['UUID']['input'];
  set: UsersUpdateInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateusersCollection: { __typename?: 'usersUpdateResponse', records: Array<{ __typename?: 'users', id: string, full_name: string, phone?: string | null }> } };

export const GetEventsDocument = gql`
    query GetEvents($limit: Int = 20, $offset: Int = 0) {
  eventsCollection(
    first: $limit
    offset: $offset
    orderBy: [{starts_at: AscNullsLast}]
  ) {
    edges {
      node {
        id
        title
        description
        location
        cover_url
        starts_at
        ends_at
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetEventsGQL extends Apollo.Query<GetEventsQuery, GetEventsQueryVariables> {
    override document = GetEventsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetUpcomingEventsDocument = gql`
    query GetUpcomingEvents($now: Datetime!, $limit: Int = 20, $offset: Int = 0) {
  eventsCollection(
    filter: {starts_at: {gte: $now}}
    orderBy: [{starts_at: AscNullsLast}]
    first: $limit
    offset: $offset
  ) {
    edges {
      node {
        id
        title
        description
        location
        cover_url
        starts_at
        ends_at
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetUpcomingEventsGQL extends Apollo.Query<GetUpcomingEventsQuery, GetUpcomingEventsQueryVariables> {
    override document = GetUpcomingEventsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetPostsDocument = gql`
    query GetPosts($limit: Int = 20, $offset: Int = 0) {
  postsCollection(
    first: $limit
    offset: $offset
    orderBy: [{created_at: DescNullsLast}]
  ) {
    edges {
      node {
        id
        title
        content
        category
        cover_url
        published_at
        created_at
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetPostsGQL extends Apollo.Query<GetPostsQuery, GetPostsQueryVariables> {
    override document = GetPostsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetPrayerRequestsDocument = gql`
    query GetPrayerRequests($userId: UUID!, $limit: Int = 10, $offset: Int = 0) {
  prayer_requestsCollection(
    first: $limit
    offset: $offset
    orderBy: [{created_at: DescNullsLast}]
  ) {
    edges {
      node {
        id
        content
        is_anonymous
        is_answered
        created_at
        category: categories {
          id
          slug
          name
          color
        }
        author: users {
          id
          full_name
        }
        likes: prayer_likesCollection {
          totalCount
        }
        my_likes: prayer_likesCollection(filter: {user_id: {eq: $userId}}, first: 1) {
          edges {
            node {
              user_id
            }
          }
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetPrayerRequestsGQL extends Apollo.Query<GetPrayerRequestsQuery, GetPrayerRequestsQueryVariables> {
    override document = GetPrayerRequestsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetPrayerRequestDocument = gql`
    query GetPrayerRequest($id: UUID!, $userId: UUID!) {
  prayer_requestsCollection(filter: {id: {eq: $id}}, first: 1) {
    edges {
      node {
        id
        content
        is_anonymous
        is_answered
        created_at
        category: categories {
          id
          slug
          name
          color
        }
        author: users {
          id
          full_name
        }
        likes: prayer_likesCollection {
          totalCount
        }
        my_likes: prayer_likesCollection(filter: {user_id: {eq: $userId}}, first: 1) {
          edges {
            node {
              user_id
            }
          }
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetPrayerRequestGQL extends Apollo.Query<GetPrayerRequestQuery, GetPrayerRequestQueryVariables> {
    override document = GetPrayerRequestDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetMyPrayerRequestsDocument = gql`
    query GetMyPrayerRequests($userId: UUID!, $limit: Int = 50, $offset: Int = 0) {
  prayer_requestsCollection(
    filter: {author_id: {eq: $userId}}
    first: $limit
    offset: $offset
    orderBy: [{created_at: DescNullsLast}]
  ) {
    edges {
      node {
        id
        content
        is_anonymous
        is_answered
        created_at
        category: categories {
          id
          slug
          name
          color
        }
        author: users {
          id
          full_name
        }
        likes: prayer_likesCollection {
          totalCount
        }
        my_likes: prayer_likesCollection(filter: {user_id: {eq: $userId}}, first: 1) {
          edges {
            node {
              user_id
            }
          }
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetMyPrayerRequestsGQL extends Apollo.Query<GetMyPrayerRequestsQuery, GetMyPrayerRequestsQueryVariables> {
    override document = GetMyPrayerRequestsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetPrayerStatsDocument = gql`
    query GetPrayerStats {
  active: prayer_requestsCollection(filter: {is_answered: {eq: false}}) {
    totalCount
  }
  answered: prayer_requestsCollection(filter: {is_answered: {eq: true}}) {
    totalCount
  }
  intercessors: intercessors_count
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetPrayerStatsGQL extends Apollo.Query<GetPrayerStatsQuery, GetPrayerStatsQueryVariables> {
    override document = GetPrayerStatsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetPrayerCategoriesDocument = gql`
    query GetPrayerCategories {
  categoriesCollection(
    filter: {type: {eq: "prayer"}}
    orderBy: [{name: AscNullsLast}]
  ) {
    edges {
      node {
        id
        slug
        name
        color
        description
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetPrayerCategoriesGQL extends Apollo.Query<GetPrayerCategoriesQuery, GetPrayerCategoriesQueryVariables> {
    override document = GetPrayerCategoriesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreatePrayerRequestDocument = gql`
    mutation CreatePrayerRequest($content: String!, $category_id: UUID!, $is_anonymous: Boolean!) {
  insertIntoprayer_requestsCollection(
    objects: [{content: $content, category_id: $category_id, is_anonymous: $is_anonymous}]
  ) {
    records {
      id
      created_at
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreatePrayerRequestGQL extends Apollo.Mutation<CreatePrayerRequestMutation, CreatePrayerRequestMutationVariables> {
    override document = CreatePrayerRequestDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LikePrayerDocument = gql`
    mutation LikePrayer($prayerId: UUID!) {
  insertIntoprayer_likesCollection(objects: [{prayer_id: $prayerId}]) {
    records {
      prayer_id
      user_id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LikePrayerGQL extends Apollo.Mutation<LikePrayerMutation, LikePrayerMutationVariables> {
    override document = LikePrayerDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UnlikePrayerDocument = gql`
    mutation UnlikePrayer($prayerId: UUID!) {
  deleteFromprayer_likesCollection(filter: {prayer_id: {eq: $prayerId}}) {
    records {
      prayer_id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UnlikePrayerGQL extends Apollo.Mutation<UnlikePrayerMutation, UnlikePrayerMutationVariables> {
    override document = UnlikePrayerDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetSermonsDocument = gql`
    query GetSermons($limit: Int = 10, $offset: Int = 0, $filter: sermonsFilter) {
  sermonsCollection(
    first: $limit
    offset: $offset
    filter: $filter
    orderBy: [{published_at: DescNullsLast}]
  ) {
    edges {
      node {
        id
        title
        preacher_name
        audio_url
        video_url
        description
        duration
        published_at
        category: categories {
          id
          name
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetSermonsGQL extends Apollo.Query<GetSermonsQuery, GetSermonsQueryVariables> {
    override document = GetSermonsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetSermonByIdDocument = gql`
    query GetSermonById($id: UUID!) {
  sermonsCollection(filter: {id: {eq: $id}}, first: 1) {
    edges {
      node {
        id
        title
        preacher_name
        audio_url
        video_url
        description
        duration
        published_at
        category: categories {
          id
          name
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetSermonByIdGQL extends Apollo.Query<GetSermonByIdQuery, GetSermonByIdQueryVariables> {
    override document = GetSermonByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetSermonCategoriesDocument = gql`
    query GetSermonCategories {
  categoriesCollection(
    filter: {type: {eq: "sermon"}}
    orderBy: [{name: AscNullsLast}]
  ) {
    edges {
      node {
        id
        name
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetSermonCategoriesGQL extends Apollo.Query<GetSermonCategoriesQuery, GetSermonCategoriesQueryVariables> {
    override document = GetSermonCategoriesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetProfileDocument = gql`
    query GetProfile($userId: UUID!) {
  usersCollection(filter: {id: {eq: $userId}}, first: 1) {
    edges {
      node {
        id
        email
        full_name
        phone
        avatar_url
        role
        is_active
        created_at
      }
    }
  }
  sermons_count: sermonsCollection {
    totalCount
  }
  user_prayers_count: prayer_requestsCollection(
    filter: {author_id: {eq: $userId}}
  ) {
    totalCount
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetProfileGQL extends Apollo.Query<GetProfileQuery, GetProfileQueryVariables> {
    override document = GetProfileDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateProfileDocument = gql`
    mutation UpdateProfile($userId: UUID!, $set: usersUpdateInput!) {
  updateusersCollection(filter: {id: {eq: $userId}}, set: $set, atMost: 1) {
    records {
      id
      full_name
      phone
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateProfileGQL extends Apollo.Mutation<UpdateProfileMutation, UpdateProfileMutationVariables> {
    override document = UpdateProfileDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }