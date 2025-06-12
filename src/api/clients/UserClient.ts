import { apiClient } from '../Client';

export const UserClient = {
  
  logout(): Promise<string> {
    return apiClient.post('/user/logout');
  },
  
  login(email: string, password: string): Promise<string> {
    return apiClient.post('/user/login', { email, password });
  },
  
  register(email: string, username: string, password: string) {
    return apiClient.post('/user/register', { email, username, password });
  },
  
  test() {
    return apiClient.get('/user/get');
  },
  
};