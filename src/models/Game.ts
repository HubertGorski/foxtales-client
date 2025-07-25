import { FoxGame } from "./FoxGame";
import { User } from "./User";

export class Game {
  code: string;
  foxGame: FoxGame;
  owner: User;
  isPublic: boolean;
  users: User[];
  password: string | null;
  usePublicQuestions: boolean;
  usePrivateQuestions: boolean;
  isQuestionsFromAnotherGamesAllowed: boolean;

  constructor(
    code: string,
    foxGame = new FoxGame(),
    isPublic: boolean = false,
    owner: User = new User(),
    users: User[] = [],
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
    return this.users.length === 0 || this.users.some((user) => !user.isReady);
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
