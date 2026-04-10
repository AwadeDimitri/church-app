export interface User {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly avatarUrl?: string;
  readonly memberSince: string;
  readonly role: UserRole;
}

export type UserRole = 'member' | 'deacon' | 'pastor' | 'admin';
