import { GENDER } from "@/enums/userEnum";
import { ROLE } from "@/enums/rolesEnum";

export class User {
  userId: number;
  username: string;
  avatar: string;
  questionsCount: number;
  answersCount: number;
  lastSign: Date;
  registerDate: Date;
  gender: GENDER;
  role: ROLE;
  totalGamesPlayed: number;
  averageResponseTime: number;
  accountPoints: number;

  constructor(
    userId: number = 0,
    username: string = 'Fox Gamer',
    avatar: string = '',
    questionsCount: number = 0,
    answersCount: number = 0,
    lastSign: Date = new Date(),
    registerDate: Date = new Date(),
    gender: GENDER = GENDER.MAN,
    role: ROLE = ROLE.USER,
    totalGamesPlayed: number = 0,
    averageResponseTime: number = 0,
    accountPoints: number = 0,
  ) {
    this.userId = userId;
    this.username = username;
    this.avatar = avatar;
    this.questionsCount = questionsCount;
    this.answersCount = answersCount;
    this.lastSign = lastSign;
    this.registerDate = registerDate;
    this.gender = gender;
    this.role = role;
    this.totalGamesPlayed = totalGamesPlayed;
    this.averageResponseTime = averageResponseTime;
    this.accountPoints = accountPoints;
  }
}

export interface IUserInLobby extends User {
  isReady: boolean;
}

export interface IUserInGame extends User {
  isReady: boolean;
  points: number;
  chosenPlayerAnswer: User;
  votersForHisAnswer: User[];
  votersAndVoteCounts: {voterId: number, voteCount: number}[];
  responseTime: number;
  averageResponseTimeInCurrentGame: number;
}

export class UserInLobby extends User implements IUserInLobby {
  isReady: boolean;

  constructor(
    userId: number = 0,
    username: string = 'Fox Gamer',
    avatar: string = '',
    questionsCount: number = 0,
    answersCount: number = 0,
    lastSign: Date = new Date(),
    registerDate: Date = new Date(),
    gender: GENDER = GENDER.MAN,
    role: ROLE = ROLE.USER,
    totalGamesPlayed: number = 0,
    averageResponseTime: number = 0,
    accountPoints: number = 0,
    isReady: boolean = false
  ) {
    super(userId, username, avatar, questionsCount, answersCount, lastSign, registerDate, gender, role, totalGamesPlayed, averageResponseTime, accountPoints);
    this.isReady = isReady;
  }
}