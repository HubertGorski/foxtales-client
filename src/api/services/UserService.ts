import { User } from "@/models/User";
import { plainToInstance } from "class-transformer";
import { USER_LIMIT } from "@/enums/userLimitEnum";
import { Permission } from "@/models/Permission";
import { FoxGame } from "@/models/FoxGame";
import { Avatar } from "@/models/Avatar";
import { Question } from "@/models/Question";
import { CatalogType } from "@/models/CatalogType";
import { userClient } from "../clients/UserClient";

export const userService = {
  async logout(): Promise<void> {
    await userClient.logout();
  },

  async login(
    email: string,
    password: string
  ): Promise<{
    user: User;
    avatars: Avatar[];
    availableCatalogTypes: CatalogType[];
    publicQuestions: Question[];
  }> {
    const response = await userClient.login(email, password);
    const user = plainToInstance(User, response.data.user);

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

    response.data.publicQuestions.forEach((question) => {
      publicQuestions.push(plainToInstance(Question, question));
    });

    response.data.avatars.forEach((avatar) => {
      avatars.push(plainToInstance(Avatar, avatar));
    });

    response.data.availableCatalogTypes.forEach((catalogType) => {
      availableCatalogTypes.push(plainToInstance(CatalogType, catalogType));
    });

    response.data.foxGames.forEach((game) => {
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

    return { user, avatars, availableCatalogTypes, publicQuestions };
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
