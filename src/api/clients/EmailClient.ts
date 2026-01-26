import { apiClient } from '../Client';

export const emailClient = {
  contact(
    message: string,
    fromEmail: string,
    subject: string = 'Formularz kontaktowy'
  ): Promise<{ data: boolean }> {
    return apiClient.post('/contact', { fromEmail, subject, message });
  },
};
