import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { NzIconDirective } from 'ng-zorro-antd/icon';

/**
 * Remplace un contenu qui n'a pas pu être chargé faute de réseau. Pas de bouton
 * « Réessayer » : la requête en pause repart seule au retour de la connexion.
 * L'annonce aux lecteurs d'écran est portée par le bandeau global (OfflineBanner).
 */
@Component({
  selector: 'app-offline-notice',
  imports: [NzIconDirective],
  template: `
    @if (variant() === 'inline') {
      <p class="flex items-center gap-2 py-4 text-sm text-church-text-secondary">
        <nz-icon nzType="disconnect" nzTheme="outline" aria-hidden="true" />
        Indisponible hors connexion
      </p>
    } @else {
      <div class="flex flex-col items-center justify-center py-16 text-center">
        <nz-icon
          nzType="disconnect"
          nzTheme="outline"
          class="text-4xl text-church-text-secondary mb-3"
          aria-hidden="true"
        />
        <p class="text-sm font-semibold text-church-text">Indisponible hors connexion</p>
        <p class="text-sm text-church-text-secondary mt-1">
          Le contenu s'affichera dès le retour du réseau.
        </p>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfflineNotice {
  /** `inline` : une ligne dans une section ; `block` : état centré d'une page. */
  readonly variant = input<'inline' | 'block'>('block');
}
