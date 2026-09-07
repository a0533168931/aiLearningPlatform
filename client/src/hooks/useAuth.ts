import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login as loginRequest, register as registerRequest } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';
import type { LoginRequest, RegisterRequest } from '../types/auth';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logoutStore = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  const logout = () => {
    logoutStore();
    queryClient.clear();
    window.location.replace('/');
  };

  return { user, token, isAuthenticated, logout };
}

export function useLogin() {
  const loginStore = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (input: LoginRequest) => loginRequest(input),
    retry: 0,
    onSuccess: (data) => {
      loginStore(data.user, data.token);
    },
  });
}

export function useRegister() {
  const loginStore = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (input: RegisterRequest) => registerRequest(input),
    retry: 0,
    onSuccess: (data) => {
      loginStore(data.user, data.token);
    },
  });
}
