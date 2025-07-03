import { Permission } from "@/models/Permission";

export enum PERMISSION {
  ADD_NEW_PRIVATE_QUESTION_PER_DAY,
  CONVERT_PRIVATE_QUESTION_TO_PUBLIC_PER_DAY,
  CREATE_GAME_WITH_PRIVATE_QUESTIONS_PER_DAY,
  AVAILABLE_CATALOGS,
}
export enum PERMISSION_GAME {
  PSYCH = 1,
  DYLEMATY = 2,
  KILLGAME = 3,
}

export const defaultPermissions = [
  new Permission(PERMISSION_GAME.PSYCH, 1),
  new Permission(PERMISSION_GAME.DYLEMATY, 1),
  new Permission(PERMISSION_GAME.KILLGAME, 1),
];
