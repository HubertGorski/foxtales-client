import { Type } from "class-transformer";
import { FoxGame } from "./FoxGame";
import { User } from "./User";
import { Question } from "./Question";

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
  
  @Type(() => Question)
  questions: Question[];
  
  @Type(() => Number)
  round: number;
  
  @Type(() => Question)
  currentQuestion: Question | null;
  
  @Type(() => Boolean)
  isGameStarted: boolean;
  
  @Type(() => Boolean)
  hasGameEnded: boolean;

  constructor(
    owner: User = new User(),
    users: User[] = [],
    code: string | null = null,
    foxGame = new FoxGame(),
    isPublic: boolean = true,
    password: string | null = null,
    usePublicQuestions = true,
    usePrivateQuestions = false,
    isQuestionsFromAnotherGamesAllowed = false,
    questions = [],
    round = 0,
    currentQuestion = null,
    isGameStarted = false,
    hasGameEnded = false,
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
    this.questions = questions;
    this.round = round;
    this.currentQuestion = currentQuestion;
    this.isGameStarted = isGameStarted;
    this.hasGameEnded = hasGameEnded;
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

  setUsers(users: User[]): void {
    this.users = users;
  }
}
