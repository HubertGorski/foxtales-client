import { DEFAULT_AVATAR_SOURCE, GENDER } from "@/enums/userEnum";
import { ROLE } from "@/enums/rolesEnum";
import { PERMISSION } from "@/enums/permissions";
import { Catalog } from "./Catalog";
import { Avatar } from "./Avatar";
import { Achievement } from "./Achievement";
import { Permission } from "./Permission";
import { LANG } from "@/enums/languagesEnum";
import { Question } from "./Question";
import { DylematyCard } from "./DylematyCard";
import { Deck } from "./Deck";
import { UserLimit } from "./UserLimit";
import { Type } from "class-transformer";

export class User {
  // Basic info
  userId: number = 0;
  gender: GENDER = GENDER.MAN;
  role: ROLE = ROLE.USER;
  language: LANG = LANG.PL;
  invitedUsersToAppCount: number = 0;
  lastSign: Date = new Date();
  registerDate: Date = new Date();
  accessToken: string = "";

  username: string = "Fox Gamer";

  @Type(() => Avatar)
  avatar: Avatar = new Avatar(1, DEFAULT_AVATAR_SOURCE);

  level: number = 0;
  accountPoints: number = 0;
  requiredAccountPointsToNextLevel: number = 0;

  @Type(() => Achievement)
  achievements: Achievement[] = [];

  avatarsIds: number[] = [];

  @Type(() => Permission)
  permissions: Permission[] = [];

  @Type(() => UserLimit)
  userLimits: UserLimit[] = [];

  //Psych game
  totalPsychGamesPlayed: number = 0;
  answersPickedByOthers: number = 0;
  answersCountPsych: number = 0;
  averageResponseTime: number = 0;

  @Type(() => Catalog)
  catalogs: Catalog[] = [];
  
  @Type(() => Question)
  questions: Question[] = [];

  //Dylematy game
  totalDylematyGamesPlayed: number = 0;

  @Type(() => Deck)
  decks: Deck[] = [];

  @Type(() => DylematyCard)
  dylematyCards: DylematyCard[] = [];
  
  answersInDylematyCount: number = 0;
  correctAnswersInDylematyCount: number = 0;

  // In game
  isReady: boolean = false;
  pointsInGame: number = 0;
  round: number = 1;

  // In Psych Game
  @Type(() => User)
  chosenPlayerAnswer: User | null = null;
  
  @Type(() => User)
  votersForHisAnswer: User[] = [];
  
  votersAndVoteCounts: { voterId: number; voteCount: number }[] = [];
  responseTime: number = 0;
  averageResponseTimeInCurrentGame: number = 0;

  // In Dylematy Game
  @Type(() => User)
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
    return this.questions.filter((question) => question.isPublic).length;
  }

  //DYLEMATY
  get decksCount(): number {
    return this.decks.length;
  }

  get dylematyCardsCount(): number {
    return this.dylematyCards.length;
  }

  get negativeCards(): DylematyCard[] {
    return this.dylematyCards.filter((card) => card.isNegativeCard);
  }

  get positiveCards(): DylematyCard[] {
    return this.dylematyCards.filter((card) => card.isPositiveCard);
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
