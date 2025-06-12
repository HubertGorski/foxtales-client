import { UserClient } from '../clients/UserClient';
import { setupInterceptors } from '../Interceptors';

export const UserService = {
  
  async logout(): Promise<void> {
    await UserClient.logout();
    localStorage.removeItem("token");
  },
  
  async login(email: string, password: string): Promise<void> {
    const token = (await UserClient.login(email, password)).data;
    localStorage.setItem("token", token);
    setupInterceptors();
  },
  
  register(email: string, username: string, password: string) {
    return UserClient.register(email, username, password);
  },
  
};