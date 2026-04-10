import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { Button } from '@shared/components/button/button';

interface PaymentOption {
  readonly icon: string;
  readonly label: string;
  readonly description: string;
  readonly bgClass: string;
  readonly iconColor: string;
}

@Component({
  selector: 'app-donate',
  imports: [NzIconDirective, Button],
  templateUrl: './donate.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Donate {
  readonly amounts = [5, 10, 20, 50, 100, 200];
  readonly selectedAmount = signal<number | null>(null);
  readonly frequency = signal<'once' | 'weekly' | 'monthly'>('once');
  readonly selectedPayment = signal<string>('card');

  readonly frequencies: { value: 'once' | 'weekly' | 'monthly'; label: string }[] = [
    { value: 'once',    label: 'Une fois' },
    { value: 'weekly',  label: 'Hebdo' },
    { value: 'monthly', label: 'Mensuel' },
  ];

  readonly paymentOptions: PaymentOption[] = [
    { icon: 'credit-card', label: 'Carte bancaire',   description: 'Visa, Mastercard',  bgClass: 'bg-church-blue-light', iconColor: 'text-church-blue' },
    { icon: 'bank',        label: 'Virement bancaire', description: 'SEPA direct',        bgClass: 'bg-amber-50',           iconColor: 'text-church-gold' },
    { icon: 'wallet',      label: 'Mobile Money',      description: 'Orange, MTN, Wave',  bgClass: 'bg-green-50',            iconColor: 'text-church-green' },
  ];

  selectAmount(amount: number): void {
    this.selectedAmount.set(amount);
  }

  setFrequency(freq: 'once' | 'weekly' | 'monthly'): void {
    this.frequency.set(freq);
  }
}
