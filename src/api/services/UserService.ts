import { UserClient } from "../clients/UserClient";
import { setupInterceptors } from "../Interceptors";


export const UserService = {
  async logout(): Promise<void> {
    await UserClient.logout();
    localStorage.removeItem("token");
  },

  async login(email: string, password: string): Promise<LoginUserResponseDto> {
    const response: LoginUserResponseDto = (await UserClient.login(email, password)).data;
    localStorage.setItem("token", response.accessToken);
    setupInterceptors();
    return response;
  },

  register(email: string, username: string, password: string, confirmPassword: string) {
    return UserClient.register(email, username, password, confirmPassword);
  },
};

// TODO: przeniesc
class LoginUserResponseDto {
  userId: number = 0;
  username: string = "";
  accessToken: string = "";
}
