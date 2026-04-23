import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzIconDirective } from 'ng-zorro-antd/icon';

type BackLink = boolean | string | (string | number)[];

@Component({
  selector: 'app-page-header',
  imports: [RouterLink, NzIconDirective],
  template: `
    <header class="flex items-center gap-2 mb-6 min-h-11">
      <div class="flex-1 flex justify-start">
        @if (backLink(); as link) {
          @if (link === true) {
            <button
              type="button"
              (click)="goBack()"
              aria-label="Retour"
              class="w-10 h-10 -ml-2 inline-flex items-center justify-center rounded-full active:bg-black/5"
            >
              <nz-icon
                nzType="arrow-left"
                nzTheme="outline"
                class="text-church-text text-xl [&>svg]:block"
              />
            </button>
          } @else {
            <a
              [routerLink]="link"
              aria-label="Retour"
              class="w-10 h-10 -ml-2 inline-flex items-center justify-center rounded-full active:bg-black/5"
            >
              <nz-icon
                nzType="arrow-left"
                nzTheme="outline"
                class="text-church-text text-xl [&>svg]:block"
              />
            </a>
          }
        }
      </div>
      <div class="flex flex-col items-center leading-tight">
        <span class="text-lg font-semibold text-church-text">{{
          title()
        }}</span>
        @if (subtitle(); as sub) {
          <span class="text-xs text-church-text-secondary mt-0.5">{{
            sub
          }}</span>
        }
      </div>
      <div class="flex-1 flex justify-end">
        <ng-content />
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeader {
  private readonly location = inject(Location);

  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly backLink = input<BackLink>(false);

  goBack(): void {
    this.location.back();
  }
}
