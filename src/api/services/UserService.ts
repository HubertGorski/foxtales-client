import { User } from "@/models/User";
import { plainToInstance } from "class-transformer";
import { USER_LIMIT } from "@/enums/userLimitEnum";
import { Permission } from "@/models/Permission";
import { FoxGame } from "@/models/FoxGame";
import { Avatar } from "@/models/Avatar";
import { Question } from "@/models/Question";
import { CatalogType } from "@/models/CatalogType";
import { userClient, type IUserLoginResponse } from "../clients/UserClient";
import { useUserStore } from "@/stores/userStore";
import i18n from "@/configs/i18n";
import type { LANG } from "@/enums/languagesEnum";

export const userService = {
  async logout(): Promise<void> {
    await userClient.logout();
  },

  setUserSession(data: IUserLoginResponse) {
    const user = plainToInstance(User, data.user);
    for (const limit of user.userLimits) {
      switch (limit.type) {
        case USER_LIMIT.PERMISSION_GAME:
          user.permissions.push(plainToInstance(Permission, limit));
          break;
        case USER_LIMIT.USER_EXP:
          user.accountPoints = limit.currentValue;
          user.requiredAccountPointsToNextLevel = limit.closestThreshold;
          break;
        case USER_LIMIT.AVATAR:
          if (limit.currentValue > 0) {
            user.avatarsIds.push(limit.limitId);
          }
          break;
      }
    }

    const avatars: Avatar[] = [];
    const availableCatalogTypes: CatalogType[] = [];
    const foxGames: FoxGame[] = [];
    const publicQuestions: Question[] = [];

    data.publicQuestions.forEach((question) => {
      publicQuestions.push(plainToInstance(Question, question));
    });

    data.avatars.forEach((avatar) => {
      avatars.push(plainToInstance(Avatar, avatar));
    });

    data.availableCatalogTypes.forEach((catalogType) => {
      availableCatalogTypes.push(plainToInstance(CatalogType, catalogType));
    });

    data.foxGames.forEach((game) => {
      foxGames.push(plainToInstance(FoxGame, game));
    });

    foxGames.forEach((game) => {
      const permissionsNames = user.permissions.map(
        (permission) => permission.name
      );

      if (!permissionsNames.includes(game.permission)) {
        user.permissions.push(new Permission(game.permission, 1));
      }
    });

    const userStore = useUserStore();

    const currentLocale = i18n.global.locale.value
    user.language = currentLocale as LANG;
    userStore.setUserSession(user);
    userStore.setAvatars(avatars);
    userStore.setPublicQuestions(publicQuestions);
    userStore.setAvailableCatalogTypes(availableCatalogTypes);
  },

  async login(email: string, password: string): Promise<void> {
    const response = await userClient.login(email, password);
    this.setUserSession(response.data);
  },

  async registerTmpUser(username: string): Promise<void> {
    const response = await userClient.registerTmpUser(username);
    this.setUserSession(response.data);
  },

  async register(
    email: string,
    username: string,
    password: string,
    confirmPassword: string
  ) {
    return await userClient.register(
      email,
      username,
      password,
      confirmPassword
    );
  },

  async setAvatar(avatarId: number): Promise<boolean> {
    return await userClient.setAvatar(avatarId);
  },

  async setUsername(username: string): Promise<boolean> {
    return await userClient.setUsername(username);
  },
};
