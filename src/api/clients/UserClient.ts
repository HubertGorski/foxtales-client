import type { Avatar } from '@/models/Avatar';
import { apiClient } from '../Client';
import type { User } from '@/models/User';
import type { FoxGame } from '@/models/FoxGame';
import type { CatalogType } from '@/models/CatalogType';
import type { Catalog } from '@/models/Catalog';
import { LangToNumber, type LANG } from '@/enums/languagesEnum';
import type { Memory } from '@/models/Memory';

export interface IUserLoginResponse {
  user: User;
  avatars: Avatar[];
  memories: Memory[];
  foxGames: FoxGame[];
  availableCatalogTypes: CatalogType[];
  publicCatalogs: Catalog[];
}

export const userClient = {
  logout(): Promise<string> {
    return apiClient.post('/user/logout');
  },

  login(
    email: string,
    password: string,
    isProlongSessionEnabled: boolean
  ): Promise<{ data: IUserLoginResponse }> {
    return apiClient.post('/user/login', { email, password, isProlongSessionEnabled });
  },

  loginByToken(): Promise<{ data: IUserLoginResponse | null }> {
    return apiClient.post('/user/loginByToken');
  },

  refreshToken(): Promise<{ data: string }> {
    return apiClient.post('/user/refresh');
  },

  register(
    email: string,
    username: string,
    password: string,
    confirmPassword: string,
    termsAccepted: boolean,
    languageEnum: LANG
  ) {
    const language = LangToNumber[languageEnum];
    return apiClient.post('/user/registerUser', {
      email,
      username,
      password,
      confirmPassword,
      termsAccepted,
      language,
    });
  },

  registerTmpUser(
    username: string,
    termsAccepted: boolean,
    languageEnum: LANG
  ): Promise<{ data: IUserLoginResponse }> {
    const language = LangToNumber[languageEnum];
    return apiClient.post('/user/registerTmpUser', { username, termsAccepted, language });
  },

  setAvatar(avatarId: number): Promise<boolean> {
    return apiClient.post('/user/setAvatar', { avatarId });
  },

  setLanguage(languageEnum: LANG): Promise<boolean> {
    const language = LangToNumber[languageEnum];
    return apiClient.post('/user/setLanguage', { language });
  },

  setUsername(username: string): Promise<boolean> {
    return apiClient.post('/user/setUsername', { username });
  },

  setUseAiTranslations(useAiTranslations: boolean): Promise<boolean> {
    return apiClient.post('/user/setUseAiTranslations', { useAiTranslations });
  },
};
