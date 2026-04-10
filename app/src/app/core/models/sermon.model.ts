export interface Sermon {
  readonly id: string;
  readonly title: string;
  readonly speaker: string;
  readonly date: string;
  readonly duration: number;
  readonly category: SermonCategory;
  readonly description?: string;
  readonly audioUrl?: string;
  readonly videoUrl?: string;
  readonly thumbnailUrl?: string;
}

export type SermonCategory = 'foi' | 'priere' | 'famille' | 'guerison' | 'louange';
