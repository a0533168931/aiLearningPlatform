import { useQuery } from '@tanstack/react-query';
import { getAll } from '../api/users.api';
import { queryKeys } from '../api/queryKeys';

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: getAll,
  });
}
