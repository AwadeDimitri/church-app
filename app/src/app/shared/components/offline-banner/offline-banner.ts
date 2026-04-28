import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NetworkService } from '@core/services/network.service';

@Component({
  selector: 'app-offline-banner',
  imports: [NzIconDirective],
  template: `
    @if (!network.online()) {
      <div
        class="flex items-center justify-center gap-2 bg-amber-50 border-b border-amber-200 text-church-text text-xs py-2 px-4"
      >
        <nz-icon
          nzType="disconnect"
          nzTheme="outline"
          class="text-amber-600"
        />
        <span>Vous êtes hors connexion</span>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfflineBanner {
  protected readonly network = inject(NetworkService);
}
