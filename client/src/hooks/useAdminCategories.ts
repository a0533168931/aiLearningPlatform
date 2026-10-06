import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createCategory,
  createSubcategory,
  deleteCategory,
  deleteSubcategory,
  updateCategory,
  updateSubcategory,
} from '../api/admin.api';
import { queryKeys } from '../api/queryKeys';
import type {
  CreateCategoryRequest,
  CreateSubCategoryRequest,
  UpdateCategoryRequest,
  UpdateSubCategoryRequest,
} from '../types/category';

function invalidateCatalog(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: queryKeys.categories });
  void queryClient.invalidateQueries({ queryKey: ['subcategories'] });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCategoryRequest) => createCategory(input),
    onSuccess: () => invalidateCatalog(queryClient),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateCategoryRequest }) =>
      updateCategory(id, input),
    onSuccess: () => invalidateCatalog(queryClient),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => invalidateCatalog(queryClient),
  });
}

export function useCreateSubcategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateSubCategoryRequest) => createSubcategory(input),
    onSuccess: () => invalidateCatalog(queryClient),
  });
}

export function useUpdateSubcategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: UpdateSubCategoryRequest;
    }) => updateSubcategory(id, input),
    onSuccess: () => invalidateCatalog(queryClient),
  });
}

export function useDeleteSubcategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteSubcategory(id),
    onSuccess: () => invalidateCatalog(queryClient),
  });
}
