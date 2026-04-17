import { eventGroup } from '@ngrx/signals/events';
import { type } from '@ngrx/signals';

export const passwordSignInPageEvents = eventGroup({
  source: 'Password Sign In Page',
  events: {
    signIn: type<{ email: string; password: string }>(),
  },
});

export const passwordSignInApiEvents = eventGroup({
  source: 'Password Sign In API',
  events: {
    failed: type<{ message: string }>(),
  },
});
