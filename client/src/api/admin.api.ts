import type { ApiMessageSuccess, ApiSuccess } from '../types/api';
import type {
  Category,
  CreateCategoryRequest,
  CreateSubCategoryRequest,
  SubCategory,
  UpdateCategoryRequest,
  UpdateSubCategoryRequest,
} from '../types/category';
import api from './client';
import { unwrapData, unwrapMessage } from './parse';

export async function createCategory(
  input: CreateCategoryRequest
): Promise<Category> {
  const { data } = await api.post<ApiSuccess<Category>>('/admin/categories', {
    name: input.name,
  });
  return unwrapData(data);
}

export async function updateCategory(
  id: number,
  input: UpdateCategoryRequest
): Promise<Category> {
  const { data } = await api.patch<ApiSuccess<Category>>(
    `/admin/categories/${id}`,
    { name: input.name }
  );
  return unwrapData(data);
}

export async function deleteCategory(id: number): Promise<string> {
  const { data } = await api.delete<ApiMessageSuccess>(
    `/admin/categories/${id}`
  );
  return unwrapMessage(data);
}

export async function createSubcategory(
  input: CreateSubCategoryRequest
): Promise<SubCategory> {
  const { data } = await api.post<ApiSuccess<SubCategory>>(
    '/admin/categories/subcategories',
    {
      categoryId: input.categoryId,
      name: input.name,
    }
  );
  return unwrapData(data);
}

export async function updateSubcategory(
  id: number,
  input: UpdateSubCategoryRequest
): Promise<SubCategory> {
  const { data } = await api.patch<ApiSuccess<SubCategory>>(
    `/admin/categories/subcategories/${id}`,
    { name: input.name }
  );
  return unwrapData(data);
}

export async function deleteSubcategory(id: number): Promise<string> {
  const { data } = await api.delete<ApiMessageSuccess>(
    `/admin/categories/subcategories/${id}`
  );
  return unwrapMessage(data);
}
