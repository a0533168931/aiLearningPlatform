import type { ApiMessageSuccess, ApiSuccess } from '../types/api';

const INCOMPLETE_RESPONSE = 'Unexpected API response.';

export function unwrapData<T>(payload: ApiSuccess<T>): T {
  if (payload.status !== 'success' || payload.data === undefined) {
    throw new Error(INCOMPLETE_RESPONSE);
  }

  return payload.data;
}

export function unwrapMessage(payload: ApiMessageSuccess): string {
  if (
    payload.status !== 'success' ||
    typeof payload.message !== 'string' ||
    payload.message.trim() === ''
  ) {
    throw new Error(INCOMPLETE_RESPONSE);
  }

  return payload.message;
}
