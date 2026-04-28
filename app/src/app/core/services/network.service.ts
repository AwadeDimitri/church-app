import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NetworkService {
  private readonly _online = signal(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );
  readonly online = this._online.asReadonly();

  constructor() {
    if (typeof window === 'undefined') return;
    const update = () => this._online.set(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
  }
}
