import axios from 'axios';

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error) && isRecord(error.response?.data)) {
    const data = error.response.data;
    if (
      data.status === 'error' &&
      typeof data.message === 'string' &&
      data.message.trim() !== ''
    ) {
      return data.message;
    }
  }

  return FALLBACK_MESSAGE;
}
