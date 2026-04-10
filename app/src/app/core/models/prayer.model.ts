export interface PrayerRequest {
  readonly id: string;
  readonly author: string;
  readonly content: string;
  readonly category: PrayerCategory;
  readonly isAnonymous: boolean;
  readonly isAnswered: boolean;
  readonly prayerCount: number;
  readonly createdAt: string;
}

export type PrayerCategory = 'guerison' | 'famille' | 'travail' | 'general';
