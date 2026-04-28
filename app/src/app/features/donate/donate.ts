import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { PageHeader } from '@shared/components/page-header/page-header';
import { environment } from '@env';

interface Operator {
  readonly key: 'flooz' | 'tmoney';
  readonly label: string;
  readonly operator: string;
  readonly number: string;
  readonly ussd: string;
  readonly ussdHref: string;
  readonly accentClass: string;
  readonly iconColor: string;
  readonly icon: string;
}

const toUssdHref = (ussd: string): string =>
  `tel:${ussd.replace(/#/g, '%23')}`;

@Component({
  selector: 'app-donate',
  imports: [NzIconDirective, PageHeader],
  templateUrl: './donate.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Donate {
  readonly amounts = [1_000, 2_000, 5_000, 10_000, 25_000, 50_000];
  readonly selectedAmount = signal<number | null>(null);
  readonly copiedKey = signal<string | null>(null);

  readonly operators: Operator[] = [
    {
      key: 'flooz',
      label: environment.donations.flooz.label,
      operator: environment.donations.flooz.operator,
      number: environment.donations.flooz.number,
      ussd: environment.donations.flooz.ussd,
      ussdHref: toUssdHref(environment.donations.flooz.ussd),
      accentClass: 'bg-amber-50 border-amber-200',
      iconColor: 'text-church-gold',
      icon: 'wallet',
    },
    {
      key: 'tmoney',
      label: environment.donations.tmoney.label,
      operator: environment.donations.tmoney.operator,
      number: environment.donations.tmoney.number,
      ussd: environment.donations.tmoney.ussd,
      ussdHref: toUssdHref(environment.donations.tmoney.ussd),
      accentClass: 'bg-church-blue-light border-church-blue/20',
      iconColor: 'text-church-blue',
      icon: 'mobile',
    },
  ];

  selectAmount(amount: number): void {
    this.selectedAmount.set(this.selectedAmount() === amount ? null : amount);
  }

  async copyNumber(operator: Operator): Promise<void> {
    try {
      await navigator.clipboard.writeText(operator.number);
      this.copiedKey.set(operator.key);
      setTimeout(() => {
        if (this.copiedKey() === operator.key) {
          this.copiedKey.set(null);
        }
      }, 2000);
    } catch {
      // clipboard API unavailable, no fallback needed for v1
    }
  }
}
