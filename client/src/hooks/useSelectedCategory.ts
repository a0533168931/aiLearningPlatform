import { useParams } from 'react-router-dom';
import { parsePositiveId } from '../lib/routeId';
import type { Category } from '../types/category';
import { useCategories } from './useCategories';

export type CategoryOutletContext = {
  category: Category;
};

export type SelectedCategoryState =
  | { status: 'invalid' }
  | { status: 'loading' }
  | { status: 'error'; error: unknown }
  | { status: 'not-found' }
  | { status: 'ready'; category: Category };

export function useSelectedCategory(): SelectedCategoryState {
  const { categoryId: rawCategoryId } = useParams();
  const categoryId = parsePositiveId(rawCategoryId);
  const categoriesQuery = useCategories();

  if (categoryId === null) {
    return { status: 'invalid' };
  }

  if (categoriesQuery.isPending) {
    return { status: 'loading' };
  }

  if (categoriesQuery.error) {
    return { status: 'error', error: categoriesQuery.error };
  }

  const category = (categoriesQuery.data ?? []).find((item) => item.id === categoryId);

  if (!category) {
    return { status: 'not-found' };
  }

  return { status: 'ready', category };
}
