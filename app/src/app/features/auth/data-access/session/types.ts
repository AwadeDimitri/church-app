export type SessionStatus = 'pending' | 'authenticated' | 'unauthenticated';

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
};
