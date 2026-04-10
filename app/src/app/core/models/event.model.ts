export interface ChurchEvent {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly date: string;
  readonly time: string;
  readonly location: string;
  readonly category: EventCategory;
  readonly imageUrl?: string;
}

export type EventCategory = 'culte' | 'louange' | 'etude' | 'jeunesse' | 'conference';
