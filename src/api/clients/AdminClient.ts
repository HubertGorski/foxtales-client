import { apiClient } from '../Client';

export const adminClient = {
  restoreBackup(index: number): Promise<{ data: string }> {
    return apiClient.post(`/SuperAdmin/restoreBackup/${index}`);
  },
};
