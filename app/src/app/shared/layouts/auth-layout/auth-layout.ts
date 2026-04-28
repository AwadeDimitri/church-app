import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OfflineBanner } from '@shared/components/offline-banner/offline-banner';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, OfflineBanner],
  templateUrl: './auth-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AuthLayout {}
