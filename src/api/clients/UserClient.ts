import type { Avatar } from "@/models/Avatar";
import { apiClient } from "../Client";
import type { User } from "@/models/User";
import type { FoxGame } from "@/models/FoxGame";
import type { Question } from "@/models/Question";
import type { CatalogType } from "@/models/CatalogType";

export const userClient = {
  logout(): Promise<string> {
    return apiClient.post("/user/logout");
  },

  login(
    email: string,
    password: string
  ): Promise<{
    data: {
      user: User;
      avatars: Avatar[];
      foxGames: FoxGame[];
      availableCatalogTypes: CatalogType[];
      publicQuestions: Question[];
    };
  }> {
    return apiClient.post("/user/login", { email, password });
  },

  register(
    email: string,
    username: string,
    password: string,
    confirmPassword: string
  ) {
    return apiClient.post("/user/register", {
      email,
      username,
      password,
      confirmPassword,
    });
  },

  setAvatar(avatarId: number): Promise<boolean> {
    return apiClient.post("/user/setAvatar", { avatarId });
  },

  setUsername(username: string): Promise<boolean> {
    return apiClient.post("/user/setUsername", { username });
  }
};
