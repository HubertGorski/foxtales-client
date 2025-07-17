import { User } from "@/models/User";
import { UserClient } from "../clients/UserClient";
import { plainToInstance } from "class-transformer";
import { USER_LIMIT } from "@/enums/userLimitEnum";
import { Permission } from "@/models/Permission";
import { FoxGame } from "@/models/FoxGame";
import { Avatar } from "@/models/Avatar";
import type { Question } from "@/models/Question";
import type { Catalog } from "@/models/Catalog";
import { CatalogType } from "@/models/CatalogType";

export const userService = {
  async logout(): Promise<void> {
    await UserClient.logout();
  },

  async login(
    email: string,
    password: string
  ): Promise<{
    user: User;
    avatars: Avatar[];
    availableCatalogTypes: CatalogType[];
  }> {
    const response = await UserClient.login(email, password);
    const user = plainToInstance(User, response.data.user);
    user.avatar = plainToInstance(Avatar, user.avatar);

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

    return { user, avatars, availableCatalogTypes };
  },

  async register(
    email: string,
    username: string,
    password: string,
    confirmPassword: string
  ) {
    return await UserClient.register(
      email,
      username,
      password,
      confirmPassword
    );
  },

  async setAvatar(avatarId: number): Promise<boolean> {
    return await UserClient.setAvatar(avatarId);
  },

  async setUsername(username: string): Promise<boolean> {
    return await UserClient.setUsername(username);
  },

  async addQuestion(question: Question): Promise<number> {
    return (await UserClient.addQuestion(question)).data;
  },

  async removeQuestion(questionId: number): Promise<boolean> {
    return await UserClient.removeQuestion(questionId);
  },

  async addCatalog(catalog: Catalog): Promise<number> {
    return (await UserClient.addCatalog(catalog)).data;
  },

  async editCatalog(catalog: Catalog): Promise<number> {
    return await UserClient.editCatalog(catalog);
  },

  async getUserCatalogs(): Promise<Catalog[]> {
    return (await UserClient.getUserCatalogs()).data;
  },

  async assignedQuestionsToCatalogs(questionsIds: number[], catalogsIds: number[]): Promise<boolean> {
    return (await UserClient.assignedQuestionsToCatalogs(questionsIds, catalogsIds)).data;
  },
};
