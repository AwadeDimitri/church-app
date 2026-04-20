import { signalStore, withComputed } from '@ngrx/signals';
import { computed } from '@angular/core';
import { withSessionReducers, withSessionHandlers } from './session';
import { withPasswordReducers, withPasswordHandlers } from './password';
import { withRegisterReducers, withRegisterHandlers } from './register';

export const AuthStore = signalStore(
  { providedIn: 'root' },

  withSessionReducers(),
  withPasswordReducers(),
  withRegisterReducers(),

  withComputed(({ sessionStatus }) => ({
    isAuthenticated: computed(() => sessionStatus() === 'authenticated'),
    isGuest: computed(() => sessionStatus() !== 'authenticated'),
    sessionChecked: computed(() => sessionStatus() !== 'pending'),
  })),

  withSessionHandlers(),
  withPasswordHandlers(),
  withRegisterHandlers(),
);
