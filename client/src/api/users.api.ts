import type { ApiSuccess } from '../types/api';
import type { User } from '../types/user';
import api from './client';
import { unwrapData } from './parse';

export async function getAll(): Promise<User[]> {
  const { data } = await api.get<ApiSuccess<User[]>>('/users/all');
  return unwrapData(data);
}

export async function getById(id: number): Promise<User> {
  const { data } = await api.get<ApiSuccess<User>>(`/users/view/${id}`);
  return unwrapData(data);
}
