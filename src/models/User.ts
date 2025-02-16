import { DEFAULT_AVATAR, GENDER } from "@/enums/userEnum";
import { ROLE } from "@/enums/rolesEnum";
import type { Achievement } from "./Achievement";
import { PERMISSION, Permission } from "@/enums/permissions";

export class User {
  // Basic info
  userId: number = 0;
  username: string = "Fox Gamer";
  avatar: string = DEFAULT_AVATAR;
  gender: GENDER = GENDER.MAN;
  role: ROLE = ROLE.USER;
  questionsCount: number = 0;
  publicQuestionsCount: number = 0;
  answersPickedByOthers: number = 0;
  answersCount: number = 0;
  totalGamesPlayed: number = 0;
  averageResponseTime: number = 0;
  lastSign: Date = new Date();
  registerDate: Date = new Date();
  accountPoints: number = 0;
  requiredAccountPointsToNextLevel: number = 0;
  level: number = 0;
  achievements: Achievement[] = [];
  permissions: Permission[] = [
    new Permission(PERMISSION.ADD_NEW_PRIVATE_QUESTION_PER_DAY, 2),
    new Permission(PERMISSION.CONVERT_PRIVATE_QUESTION_TO_PUBLIC_PER_DAY, 1),
    new Permission(PERMISSION.CREATE_GAME_WITH_PRIVATE_QUESTIONS_PER_DAY, 1),
    new Permission(PERMISSION.AVAILABLE_CATALOGS, 2),
  ];

  // In Game or lobby
  isReady: boolean = false;
  pointsInGame: number = 0;
  chosenPlayerAnswer: User | null = null;
  votersForHisAnswer: User[] = [];
  votersAndVoteCounts: { voterId: number; voteCount: number }[] = [];
  responseTime: number = 0;
  averageResponseTimeInCurrentGame: number = 0;
  round: number = 1;

  //Statistics
  gameHistory: {
    id: number;
    votersCountForHisAnswer: number;
    answersCount: number;
    playersCount: number;
    averageResponseTime: number;
  }[] = [];

  constructor(args: Partial<User> = {}) {
    Object.assign(this, { ...args });
  }

  isPermissionLimitExceeded(permissionName: PERMISSION): boolean {
    return this.permissions
      .find((p) => p.name === permissionName)!
      .isLimitExceeded();
  }
}
