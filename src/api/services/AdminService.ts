import { adminClient } from '../clients/AdminClient';

export const adminService = {
  async restoreBackup(index: number): Promise<{ data: string }> {
    return await adminClient.restoreBackup(index);
  },
};
