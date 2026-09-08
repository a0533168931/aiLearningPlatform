import { isPositiveId } from '../api/queryKeys';

export function parsePositiveId(value: string | null | undefined): number | null {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) {
    return null;
  }

  const id = Number(value);
  return isPositiveId(id) ? id : null;
}
