import { DEFAULT_AVATAR_SOURCE, GENDER } from "@/enums/userEnum";
import { ROLE } from "@/enums/rolesEnum";
import { PERMISSION } from "@/enums/permissions";
import { Catalog } from "./Catalog";
import { Avatar } from "./Avatar";
import type { Achievement } from "./Achievement";
import type { Permission } from "./Permission";
import { LANG } from "@/enums/languagesEnum";
import type { Question } from "./Question";
import type { DylematyCard } from "./DylematyCard";
import type { Deck } from "./Deck";

export class User {
  // Basic info
  userId: number = 0;
  gender: GENDER = GENDER.MAN;
  role: ROLE = ROLE.USER;
  language: LANG = LANG.PL;
  invitedUsersToAppCount: number = 0;
  lastSign: Date = new Date();
  registerDate: Date = new Date();

  username: string = "Fox Gamer";
  avatar: Avatar = new Avatar(1, DEFAULT_AVATAR_SOURCE);
  level: number = 0;
  accountPoints: number = 0;
  requiredAccountPointsToNextLevel: number = 0;
  achievements: Achievement[] = [];
  avatarsIds: number[] = [];
  permissions: Permission[] = [];

  //Psych game
  totalPsychGamesPlayed: number = 0;
  answersPickedByOthers: number = 0;
  answersCountPsych: number = 0;
  averageResponseTime: number = 0;
  catalogs: Catalog[] = [];
  questions: Question[] = [];
  
  //Dylematy game
  totalDylematyGamesPlayed: number = 0;
  decks: Deck[] = [];
  positiveCards: DylematyCard[] = [];
  negativeCards: DylematyCard[] = [];
  publicPositiveCardsCount: number = 0;
  publicNegativeCardsCount: number = 0;
  answersInDylematyCount: number = 0;
  correctAnswersInDylematyCount: number = 0;

  // In game
  isReady: boolean = false;
  pointsInGame: number = 0;
  round: number = 1;
  
  // In Psych Game
  chosenPlayerAnswer: User | null = null;
  votersForHisAnswer: User[] = [];
  votersAndVoteCounts: { voterId: number; voteCount: number }[] = [];
  responseTime: number = 0;
  averageResponseTimeInCurrentGame: number = 0;

  // In Dylematy Game
  playersWithCorrectAnswer: User[] = [];

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

  get totalGamesPlayed(): number {
    return this.totalPsychGamesPlayed + this.totalDylematyGamesPlayed;
  }

  // PSYCH
  get catalogsCount(): number {
    return this.catalogs.length;
  }

  get questionsCount(): number {
    return this.questions.length;
  }

  get publicQuestionsCount(): number {
    return this.questions.filter(question => question.isPublic).length;
  }
  
  //DYLEMATY
  get decksCount(): number {
    return this.decks.length;
  }


  getPermission(permissionName: PERMISSION): Permission | undefined {
    return this.permissions.find((p) => p.name === permissionName);
  }

  isPermissionLimitExceeded(permissionName: PERMISSION): boolean {
    const permission = this.getPermission(permissionName);
    return permission ? permission.isLimitExceeded : false;
  }

  decrementPermissionUsage(permissionName: PERMISSION): void {
    const permission = this.getPermission(permissionName);
    if (permission) {
      permission.currentUsage--;
    }
  }
}
