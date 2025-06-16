import { UserClient } from "../clients/UserClient";


export const userService = {
  async logout(): Promise<void> {
    await UserClient.logout();
  },

  async login(email: string, password: string): Promise<LoginUserResponseDto> {
    return (await UserClient.login(email, password)).data;
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
