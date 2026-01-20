import { AxiosError } from 'axios';

export function mapHttpErrorToMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response) {
      return error.response.data?.message
        ? `auth.${error.response.data?.message}`
        : 'auth.unknownError';
    }

    if (error.request) {
      return 'auth.noConnection';
    }

    return error.message;
  }

  return 'auth.unknownError';
}

export function isValidationError(error: AxiosError): boolean {
  const status = error.response?.status;
  const data = error.response?.data as any;

  return status === 400 || status === 422 || Boolean(data?.errors);
}
