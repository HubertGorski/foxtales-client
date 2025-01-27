import { User, UserInLobby } from "./User";

export class Game {
  code: string;
  owner: User;
  isPublic: boolean;
  users: UserInLobby[];
  password: string | null;
  usePublicQuestions: boolean;
  usePrivateQuestions: boolean;

  constructor(code: string, isPublic: boolean = false, owner: User = new User(), users: UserInLobby[] = [], password: string | null = null, usePublicQuestions = true, usePrivateQuestions = true) {
    this.code = code;
    this.isPublic = isPublic;
    this.owner = owner;
    this.users = users;
    this.password = password;
    this.usePublicQuestions = usePublicQuestions;
    this.usePrivateQuestions = usePrivateQuestions;
  }

  get usersCount(): number {
    return this.users.length;
  }

  get readyUsersCount(): number {
    return this.users.filter(user => user.isReady).length
  }

  get areUsersUnready(): boolean {
    return this.users.length === 0 || this.users.some(user => !user.isReady)
  }

  get isPasswordSet(): boolean {
    return !!this.password;
  }

  get name(): string {
    return `Gra użytkownika ${this.owner.username}`;
  }
  
}