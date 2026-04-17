import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const registerPageEvents = eventGroup({
  source: 'Register Page',
  events: {
    signup: type<{
      email: string;
      password: string;
      fullName: string;
    }>(),
  },
});
