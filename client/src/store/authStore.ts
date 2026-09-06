import { create } from 'zustand';
import type { User } from '../types/user';

const USER_KEY = 'user';
const TOKEN_KEY = 'token';

type AuthState = {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
};

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function readStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export const useAuthStore = create<AuthState>((set) => ({
  user: readStoredUser(),
  token: readStoredToken(),
  setAuth: (user, token) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    set({ user: null, token: null });
  },
}));
