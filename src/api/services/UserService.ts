import { useUserStore } from "@/stores/userStore";
import { UserClient } from "../clients/UserClient";
import { setupInterceptors } from "../Interceptors";

const userStore = useUserStore();

export const UserService = {
  async logout(): Promise<void> {
    await UserClient.logout();
    localStorage.removeItem("token");
  },

  async login(email: string, password: string): Promise<void> {
    const response: LoginUserResponseDto = (
      await UserClient.login(email, password)
    ).data;
    userStore.setUsername(response.username);
    localStorage.setItem("token", response.accessToken);
    setupInterceptors();
  },

  register(email: string, username: string, password: string) {
    return UserClient.register(email, username, password);
  },
};

// TODO: przeniesc
class LoginUserResponseDto {
  userId: number = 0;
  username: string = "";
  accessToken: string = "";
}
