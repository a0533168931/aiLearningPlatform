import { create } from 'zustand';
import type { Role, User } from '../types/user';

const USER_KEY = 'user';
const TOKEN_KEY = 'token';

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
};

function isRole(value: unknown): value is Role {
  return value === 'USER' || value === 'ADMIN';
}

function isValidUser(value: unknown): value is User {
  if (value == null || typeof value !== 'object') {
    return false;
  }

  const user = value as Record<string, unknown>;

  return (
    typeof user.id === 'number' &&
    typeof user.name === 'string' &&
    typeof user.email === 'string' &&
    isRole(user.role) &&
    typeof user.createdAt === 'string' &&
    typeof user.updatedAt === 'string'
  );
}

function computeIsAuthenticated(user: User | null, token: string | null): boolean {
  return user != null && typeof token === 'string' && token.length > 0;
}

function clearStoredAuth(): void {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

function readPersistedAuth(): Pick<AuthState, 'user' | 'token' | 'isAuthenticated'> {
  try {
    const rawUser = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    const parsedUser: unknown = rawUser ? JSON.parse(rawUser) : null;
    const user = isValidUser(parsedUser) ? parsedUser : null;
    const safeToken = typeof token === 'string' && token.length > 0 ? token : null;

    if (!computeIsAuthenticated(user, safeToken)) {
      clearStoredAuth();
      return { user: null, token: null, isAuthenticated: false };
    }

    return { user, token: safeToken, isAuthenticated: true };
  } catch {
    clearStoredAuth();
    return { user: null, token: null, isAuthenticated: false };
  }
}

const initialAuth = readPersistedAuth();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialAuth.user,
  token: initialAuth.token,
  isAuthenticated: initialAuth.isAuthenticated,
  login: (user, token) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    clearStoredAuth();
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
