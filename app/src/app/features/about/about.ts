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
        <h3 class="text-sm font-semibold text-church-text mb-2">
          Notre mission
        </h3>
        <p class="text-sm text-church-text-secondary leading-relaxed">
          L'Église CI-JCM est une communauté chrétienne au cœur de Lomé, dédiée
          à la prédication de l'Évangile, à la formation spirituelle de ses
          membres et au service de la communauté.
        </p>
      </section>

      <section class="bg-white rounded-2xl p-4 mb-4 shadow-church-card">
        <h3 class="text-sm font-semibold text-church-text mb-3">
          Nous contacter
        </h3>
        <div class="space-y-3 text-sm text-church-text">
          <div class="flex items-start gap-3">
            <nz-icon
              nzType="environment"
              nzTheme="outline"
              class="text-church-blue mt-0.5"
            />
            <span>Avenue de la Libération, Tokoin Wuiti, Lomé</span>
          </div>
          <a
            href="tel:+22896395161"
            class="flex items-start gap-3 active:opacity-70"
          >
            <nz-icon
              nzType="phone"
              nzTheme="outline"
              class="text-church-blue mt-0.5"
            />
            <span>+228 96 39 51 61</span>
          </a>
          <a
            href="mailto:contact@cijcm.tg"
            class="flex items-start gap-3 active:opacity-70"
          >
            <nz-icon
              nzType="mail"
              nzTheme="outline"
              class="text-church-blue mt-0.5"
            />
            <span>contact&#64;cijcm.tg</span>
          </a>
        </div>
      </section>

      <section class="bg-white rounded-2xl p-4 mb-4 shadow-church-card">
        <h3 class="text-sm font-semibold text-church-text mb-3">Nous suivre</h3>
        <div class="flex items-center justify-around">
          <a
            href="https://tiktok.com/@cijcm"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            class="w-12 h-12 rounded-full bg-church-text/5 flex items-center justify-center active:opacity-70 transition-opacity"
          >
            <svg viewBox="0 0 24 24" class="w-6 h-6 fill-church-text">
              <path
                d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z"
              />
            </svg>
          </a>
          <a
            href="https://facebook.com/eglisecijcm"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            class="w-12 h-12 rounded-full bg-church-blue/10 flex items-center justify-center active:opacity-70 transition-opacity"
          >
            <svg viewBox="0 0 24 24" class="w-6 h-6 fill-church-blue">
              <path
                d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z"
              />
            </svg>
          </a>
          <a
            href="https://youtube.com/@cijcm"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            class="w-12 h-12 rounded-full bg-church-red/10 flex items-center justify-center active:opacity-70 transition-opacity"
          >
            <svg viewBox="0 0 24 24" class="w-6 h-6 fill-church-red">
              <path
                d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
              />
            </svg>
          </a>
        </div>
      </section>

      <section class="bg-white rounded-2xl p-4 mb-4 shadow-church-card">
        <h3 class="text-sm font-semibold text-church-text mb-3">
          L'application
        </h3>
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
