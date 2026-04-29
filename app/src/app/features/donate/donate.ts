import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { PageHeader } from '@shared/components/page-header/page-header';
import { environment } from '@env';

interface Operator {
  readonly key: 'flooz' | 'mixx';
  readonly label: string;
  readonly operator: string;
  readonly number: string;
  readonly ussd: string;
  readonly ussdHref: string;
  readonly logo: string;
}

const toUssdHref = (ussd: string): string => `tel:${ussd.replace(/#/g, '%23')}`;

@Component({
  selector: 'app-donate',
  imports: [NzIconDirective, PageHeader],
  templateUrl: './donate.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Donate {
  readonly copiedKey = signal<string | null>(null);

  readonly operators: Operator[] = [
    {
      key: 'flooz',
      label: environment.donations.flooz.label,
      operator: environment.donations.flooz.operator,
      number: environment.donations.flooz.number,
      ussd: environment.donations.flooz.ussd,
      ussdHref: toUssdHref(environment.donations.flooz.ussd),
      logo: environment.donations.flooz.logo,
    },
    {
      key: 'mixx',
      label: environment.donations.mixx.label,
      operator: environment.donations.mixx.operator,
      number: environment.donations.mixx.number,
      ussd: environment.donations.mixx.ussd,
      ussdHref: toUssdHref(environment.donations.mixx.ussd),
      logo: environment.donations.mixx.logo,
    },
  ];

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
