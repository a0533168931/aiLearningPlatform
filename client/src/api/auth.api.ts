import api from './client';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

function parseAuthResponse(data: AuthResponse): AuthResponse {
  if (data.status !== 'success' || !data.user?.id || !data.token) {
    throw new Error('Authentication response was incomplete.');
  }

  return data;
}

export async function register(input: RegisterRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/users/register', {
    name: input.name,
    email: input.email,
    password: input.password,
  });

  return parseAuthResponse(data);
}

export async function login(input: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/users/login', {
    email: input.email,
    password: input.password,
  });

  return parseAuthResponse(data);
}
