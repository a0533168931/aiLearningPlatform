import { useQuery } from '@tanstack/react-query';
import { getSubcategories } from '../api/categories.api';
import { isPositiveId, queryKeys } from '../api/queryKeys';

export function useSubcategories(categoryId: number | null | undefined) {
  return useQuery({
    queryKey: queryKeys.subcategories(categoryId),
    queryFn: () => {
      if (!isPositiveId(categoryId)) {
        return Promise.resolve([]);
      }

      return getSubcategories(categoryId);
    },
    enabled: isPositiveId(categoryId),
  });
}
