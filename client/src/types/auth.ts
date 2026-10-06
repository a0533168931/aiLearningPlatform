import type { User } from './user';

export type AuthResponse = {
  status: 'success';
  user: User;
  token: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};
