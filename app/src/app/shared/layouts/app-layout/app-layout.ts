import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '@shared/components/navbar/navbar';
import { OfflineBanner } from '@shared/components/offline-banner/offline-banner';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, Navbar, OfflineBanner],
  templateUrl: './app-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AppLayout {}
