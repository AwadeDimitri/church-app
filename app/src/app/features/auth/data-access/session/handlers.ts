import { signalStoreFeature } from '@ngrx/signals';
import { inject } from '@angular/core';
import { withEffects, Events } from '@ngrx/signals/events';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { sessionEvents } from './events';

export function withSessionHandlers() {
  return signalStoreFeature(
    withEffects(() => {
      const events = inject(Events);
      const router = inject(Router);

      return {
        navigateOnSignedIn$: events
          .on(sessionEvents.signedIn)
          .pipe(tap(() => router.navigate(['/home']))),
        navigateOnSignedOut$: events
          .on(sessionEvents.signedOut)
          .pipe(tap(() => router.navigate(['/login']))),
      };
    }),
  );
}
