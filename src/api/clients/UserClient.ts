import type { Avatar } from '@/models/Avatar';
import { apiClient } from '../Client';
import type { User } from '@/models/User';
import type { FoxGame } from '@/models/FoxGame';
import type { CatalogType } from '@/models/CatalogType';
import type { Question } from '@/models/Question';

export interface IUserLoginResponse {
  user: User;
  avatars: Avatar[];
  foxGames: FoxGame[];
  availableCatalogTypes: CatalogType[];
  publicQuestions: Question[];
}

export const userClient = {
  logout(): Promise<string> {
    return apiClient.post('/user/logout');
  },

  login(email: string, password: string): Promise<{ data: IUserLoginResponse }> {
    return apiClient.post('/user/login', { email, password });
  },

  register(email: string, username: string, password: string, confirmPassword: string) {
    return apiClient.post('/user/registerUser', {
      email,
      username,
      password,
      confirmPassword,
    });
  },

  registerTmpUser(username: string): Promise<{ data: IUserLoginResponse }> {
    return apiClient.post('/user/registerTmpUser', { username });
  },

  setAvatar(avatarId: number): Promise<boolean> {
    return apiClient.post('/user/setAvatar', { avatarId });
  },

  setUsername(username: string): Promise<boolean> {
    return apiClient.post('/user/setUsername', { username });
  },
};
