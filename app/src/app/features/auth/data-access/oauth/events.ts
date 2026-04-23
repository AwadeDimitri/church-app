import { eventGroup } from '@ngrx/signals/events';
import { type } from '@ngrx/signals';

export const oauthSignInPageEvents = eventGroup({
  source: 'OAuth Sign In Page',
  events: {
    signInWithGoogle: type<void>(),
  },
});

export const oauthSignInApiEvents = eventGroup({
  source: 'OAuth Sign In API',
  events: {
    failed: type<{ message: string }>(),
  },
});
