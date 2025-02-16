import { DEFAULT_AVATAR, GENDER } from "@/enums/userEnum";
import { ROLE } from "@/enums/rolesEnum";
import { PERMISSION, Permission } from "@/enums/permissions";
import { Catalog } from "./Catalog";
import { Avatar } from "./Avatar";

export class User {
  // Basic info
  userId: number = 0;
  username: string = "Fox Gamer";
  avatar: Avatar = new Avatar(1, DEFAULT_AVATAR);
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
  achievementsIds: number[] = [];
  avatarsIds: number[] = [];
  permissions: Permission[] = [];
  catalogs: Catalog[] = [];

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
    this.initializeExampleUserDetails();
  }

  getPermission(permissionName: PERMISSION): Permission | undefined {
    return this.permissions.find(p => p.name === permissionName);
  }

  isPermissionLimitExceeded(permissionName: PERMISSION): boolean {
    const permission = this.getPermission(permissionName);
    return permission ? permission.isLimitExceeded() : false;
  }

  decrementPermissionUsage(permissionName: PERMISSION): void {
    const permission = this.getPermission(permissionName);
    if (permission) {
      permission.currentUsage--;
    }
  }

  private initializeExampleUserDetails(): void {
    this.catalogs = [
      new Catalog(1, "Impreza u Przema"),
      new Catalog(2, "Zabawne pytania"),
      new Catalog(3, "Na nudną imprezę"),
      new Catalog(4, "Uczelnia"),
      new Catalog(5, "Spotkanie rodzinne"),
      new Catalog(6, "Gdy jesteś w górach i w schronisku nie ma co robić"),
      new Catalog(7, "Takie tam"),
    ];
    this.achievementsIds = [1, 2];
    this.avatarsIds = [5];
    this.permissions = [
      new Permission(PERMISSION.ADD_NEW_PRIVATE_QUESTION_PER_DAY, 2),
      new Permission(PERMISSION.CONVERT_PRIVATE_QUESTION_TO_PUBLIC_PER_DAY, 1),
      new Permission(PERMISSION.CREATE_GAME_WITH_PRIVATE_QUESTIONS_PER_DAY, 1),
      new Permission(PERMISSION.AVAILABLE_CATALOGS, 2, this.catalogs.length),
    ];
  }}
