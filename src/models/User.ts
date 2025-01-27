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
  }
}

export interface IUser extends User {
  isReady: boolean;
}

export class UserWithReady extends User implements IUser {
  isReady: boolean;

  constructor(
    userId: number,
    username: string,
    avatar: string,
    questionsCount: number,
    answersCount: number,
    lastSign: Date,
    registerDate: Date,
    gender: GENDER,
    role: ROLE = ROLE.USER,
    isReady: boolean = false
  ) {
    super(userId, username, avatar, questionsCount, answersCount, lastSign, registerDate, gender, role);
    this.isReady = isReady;
  }
}