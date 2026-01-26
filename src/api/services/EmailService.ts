import type { User } from '@/models/User';
import { emailClient } from '../clients/EmailClient';

export const emailService = {
  async contact(mailContent: string, user: User): Promise<{ data: boolean }> {
    const mail = user.email ?? `${user.username}-${user.userId}@foxtales.cc`;
    return await emailClient.contact(mailContent, mail);
  },
};
