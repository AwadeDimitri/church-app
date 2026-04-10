export interface Donation {
  readonly id: string;
  readonly amount: number;
  readonly currency: string;
  readonly frequency: DonationFrequency;
  readonly paymentMethod: PaymentMethod;
  readonly date: string;
}

export type DonationFrequency = 'once' | 'weekly' | 'monthly';
export type PaymentMethod = 'card' | 'bank' | 'mobile';
