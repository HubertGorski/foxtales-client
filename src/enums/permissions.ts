import { Permission } from "@/models/Permission";

export enum PERMISSION {
  ADD_NEW_PRIVATE_QUESTION_PER_DAY = "addNewPrivateQuestionPerDay",
  CONVERT_PRIVATE_QUESTION_TO_PUBLIC_PER_DAY = "convertPrivateQuestionToPublicPerDay",
  CREATE_GAME_WITH_PRIVATE_QUESTIONS_PER_DAY = "createGameWithPrivateQuestionsPerDay",
  AVAILABLE_CATALOGS = "availableCatalogs",
}
export enum PERMISSION_GAME {
  PSYCH = "psych",
  DYLEMATY = "dylematy",
  KILLGAME = "killgame",
}

export const defaultPermissions = [
  new Permission(PERMISSION_GAME.PSYCH, 1),
  new Permission(PERMISSION_GAME.DYLEMATY, 1),
  new Permission(PERMISSION_GAME.KILLGAME, 1),
];
