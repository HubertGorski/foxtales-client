import { Type } from "class-transformer";
import { FoxGame } from "./FoxGame";
import { User } from "./User";

export class Game {

  @Type(() => String)
  code: string | null;
  
  @Type(() => FoxGame)
  foxGame: FoxGame;
  
  @Type(() => User)
  owner: User;
  
  @Type(() => Boolean)
  isPublic: boolean;
  
  @Type(() => User)
  users: User[];
  
  @Type(() => String)
  password: string | null;
  
  @Type(() => Boolean)
  usePublicQuestions: boolean;
  
  @Type(() => Boolean)
  usePrivateQuestions: boolean;
  
  @Type(() => Boolean)
  isQuestionsFromAnotherGamesAllowed: boolean;

  constructor(
    owner: User = new User(),
    users: User[] = [],
    code: string | null = null,
    foxGame = new FoxGame(),
    isPublic: boolean = false,
    password: string | null = null,
    usePublicQuestions = true,
    usePrivateQuestions = true,
    isQuestionsFromAnotherGamesAllowed = false
  ) {
    this.code = code;
    this.foxGame = foxGame;
    this.isPublic = isPublic;
    this.owner = owner;
    this.users = users;
    this.password = password;
    this.usePublicQuestions = usePublicQuestions;
    this.usePrivateQuestions = usePrivateQuestions;
    this.isQuestionsFromAnotherGamesAllowed =
      isQuestionsFromAnotherGamesAllowed;
  }

  get usersCount(): number {
    return this.users.length;
  }

  get readyUsersCount(): number {
    return this.users.filter((user) => user.isReady).length;
  }

  get areUsersUnready(): boolean {
    return this.users.length === 0 || this.users.filter((user) => user.userId !== this.owner.userId).some((user) => !user.isReady);
  }

  get isPasswordSet(): boolean {
    return !!this.password;
  }

  get name(): string {
    return `Gra użytkownika ${this.owner.username}`;
  }

  setUsers(users: User[]): void {
    this.users = users;
  }
}
