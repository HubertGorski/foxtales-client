import { PERMISSION, PERMISSION_GAME } from '@/enums/permissions';
import { Permission } from '@/models/Permission';

export const permissions = [
  new Permission(PERMISSION.ADD_NEW_PRIVATE_QUESTION_PER_DAY, 2),
  new Permission(PERMISSION.CONVERT_PRIVATE_QUESTION_TO_PUBLIC_PER_DAY, 1),
  new Permission(PERMISSION.CREATE_GAME_WITH_PRIVATE_QUESTIONS_PER_DAY, 1),
  new Permission(PERMISSION.AVAILABLE_CATALOGS, 2, 7),
  new Permission(PERMISSION_GAME.PSYCH, 1, 1),
  new Permission(PERMISSION_GAME.DYLEMATY, 1, 1),
  new Permission(PERMISSION_GAME.KILLGAME, 1, 0),
];
