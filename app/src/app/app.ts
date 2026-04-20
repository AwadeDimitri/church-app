import { Component, ChangeDetectionStrategy, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  constructor() {
    afterNextRender(() => {
      const splash = document.getElementById('app-splash');
      if (!splash) return;
      splash.classList.add('is-hidden');
      splash.addEventListener('transitionend', () => splash.remove(), { once: true });
    });
  }
}
