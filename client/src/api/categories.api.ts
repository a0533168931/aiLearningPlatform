import type { ApiSuccess } from '../types/api';
import type { Category, SubCategory } from '../types/category';
import api from './client';
import { unwrapData } from './parse';

export async function getAll(): Promise<Category[]> {
  const { data } = await api.get<ApiSuccess<Category[]>>('/categories');
  return unwrapData(data);
}

export async function getSubcategories(categoryId: number): Promise<SubCategory[]> {
  const { data } = await api.get<ApiSuccess<SubCategory[]>>(
    `/categories/${categoryId}/subcategories`
  );
  return unwrapData(data);
}
