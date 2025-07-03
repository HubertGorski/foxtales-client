import { User } from "@/models/User";
import { UserClient } from "../clients/UserClient";
import { plainToInstance } from "class-transformer";
import { USER_LIMIT } from "@/enums/userLimitEnum";
import { Permission } from "@/models/Permission";
import { FoxGame } from "@/models/FoxGame";

export const userService = {
  async logout(): Promise<void> {
    await UserClient.logout();
  },

  async login(email: string, password: string): Promise<User> {
    const response = await UserClient.login(email, password);
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

    const foxGames: FoxGame[] = [];
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

    return user;
  },

  register(
    email: string,
    username: string,
    password: string,
    confirmPassword: string
  ) {
    return UserClient.register(email, username, password, confirmPassword);
  },
};
