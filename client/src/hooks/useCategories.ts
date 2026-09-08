import { useQuery } from '@tanstack/react-query';
import { getAll } from '../api/categories.api';
import { queryKeys } from '../api/queryKeys';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: getAll,
  });
}
