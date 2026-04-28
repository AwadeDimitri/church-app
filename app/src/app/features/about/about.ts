import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { PageHeader } from '@shared/components/page-header/page-header';

@Component({
  selector: 'app-about',
  imports: [NzIconDirective, PageHeader],
  template: `
    <div class="px-5 safe-area-top">
      <app-page-header title="À propos" backLink="/profile" />

      <div class="text-center mb-6 mt-2">
        <img
          src="/logo-cijcm.png"
          alt="CI-JCM"
          class="w-24 h-24 mx-auto mb-3 object-contain"
        />
        <h2 class="text-xl font-bold text-church-text">Église CI-JCM</h2>
        <p class="text-sm text-church-text-secondary">Lomé, Togo</p>
      </div>

      <section class="bg-white rounded-2xl p-4 mb-4 shadow-church-card">
        <h3 class="text-sm font-semibold text-church-text mb-2">Notre mission</h3>
        <p class="text-sm text-church-text-secondary leading-relaxed">
          [Description de la mission de l'église à compléter.]
        </p>
      </section>

      <section class="bg-white rounded-2xl p-4 mb-4 shadow-church-card">
        <h3 class="text-sm font-semibold text-church-text mb-3">Nous contacter</h3>
        <div class="space-y-3 text-sm text-church-text">
          <div class="flex items-start gap-3">
            <nz-icon nzType="environment" nzTheme="outline" class="text-church-blue mt-0.5" />
            <span>[Adresse à compléter]</span>
          </div>
          <div class="flex items-start gap-3">
            <nz-icon nzType="phone" nzTheme="outline" class="text-church-blue mt-0.5" />
            <span>[Téléphone à compléter]</span>
          </div>
          <div class="flex items-start gap-3">
            <nz-icon nzType="mail" nzTheme="outline" class="text-church-blue mt-0.5" />
            <span>[Email à compléter]</span>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-2xl p-4 mb-4 shadow-church-card">
        <h3 class="text-sm font-semibold text-church-text mb-3">L'application</h3>
        <div class="flex justify-between items-center text-sm">
          <span class="text-church-text-secondary">Version</span>
          <span class="font-mono font-semibold text-church-text">1.0.0</span>
        </div>
        <p class="text-xs text-church-text-secondary mt-3 leading-relaxed">
          Conçue pour la communauté CI-JCM.
        </p>
      </section>

      <p class="text-center text-xs text-church-text-secondary mb-4">
        © 2026 Église CI-JCM
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class About {}
