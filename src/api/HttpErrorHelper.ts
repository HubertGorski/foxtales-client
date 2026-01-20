import { AxiosError } from 'axios';

export function mapHttpErrorToMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response) {
      return error.response.data?.message ?? `Błąd serwera (${error.response.status})`;
    }

    if (error.request) {
      return 'Brak połączenia z serwerem';
    }
    return error.message;
  }

  return 'Nieoczekiwany błąd';
}

export function isValidationError(error: AxiosError): boolean {
  const status = error.response?.status;
  const data = error.response?.data as any;

  return status === 400 || status === 422 || Boolean(data?.errors);
}
