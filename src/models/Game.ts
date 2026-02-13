import { Type } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { FoxGame } from './FoxGame';
import { User } from './User';
import { Question } from './Question';
import { RULES } from '@/enums/rulesEnum';
import type { VIEW } from '@/enums/viewsEnum';

export class Game {
  @Type(() => String)
  code: string | null;

  @Type(() => FoxGame)
  foxGame: FoxGame;

  @Type(() => User)
  owner: User;

  @Type(() => Boolean)
  isPublic: boolean;

  @IsEnum(RULES)
  currentRules: RULES;

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

  @Type(() => Number)
  selectedPublicCatalogId: number | null;

  constructor(
    owner: User = new User(),
    users: User[] = [],
    code: string | null = null,
    foxGame = new FoxGame(),
    isPublic: boolean = false,
    password: string | null = null,
    usePublicQuestions = false,
    usePrivateQuestions = false,
    isQuestionsFromAnotherGamesAllowed = false,
    questions = [],
    round = 0,
    currentQuestion = null,
    isGameStarted = false,
    hasGameEnded = false,
    currentRules = RULES.PSYCH,
    selectedPublicCatalogId = null
  ) {
    this.code = code;
    this.foxGame = foxGame;
    this.isPublic = isPublic;
    this.owner = owner;
    this.users = users;
    this.password = password;
    this.usePublicQuestions = usePublicQuestions;
    this.usePrivateQuestions = usePrivateQuestions;
    this.isQuestionsFromAnotherGamesAllowed = isQuestionsFromAnotherGamesAllowed;
    this.questions = questions;
    this.round = round;
    this.currentQuestion = currentQuestion;
    this.isGameStarted = isGameStarted;
    this.hasGameEnded = hasGameEnded;
    this.currentRules = currentRules;
    this.selectedPublicCatalogId = selectedPublicCatalogId;
  }

  get usersCount(): number {
    return this.users.length;
  }

  get hasMinimumPlayers(): boolean {
    return this.currentRules === RULES.DIXIT ? this.usersCount >= 3 : true;
  }

  get hasSinglePlayerTeams(): boolean {
    const counts = new Map<number, number>();

    for (const { teamId } of this.users) {
      if (teamId == null) continue;
      counts.set(teamId, (counts.get(teamId) ?? 0) + 1);
    }

    return Array.from(counts.values()).includes(1);
  }

  getReadyUsersCount(view: VIEW): number {
    return this.users.filter(user => user.isReadyForView === view).length;
  }

  getAreUsersUnready(view: VIEW): boolean {
    return (
      this.users.length === 0 ||
      this.users
        .filter(user => user.userId !== this.owner.userId)
        .some(user => user.isReadyForView !== view)
    );
  }

  getSelectedAnswerUserIds(userId: number): number[] {
    return this.users
      .filter(user => user.votersIdsForHisAnswer.includes(userId))
      .map(user => user.userId);
  }

  get isPasswordSet(): boolean {
    return !!this.password;
  }

  setUsers(users: User[]): void {
    this.users = users;
  }

  isCurrentView(userId: number, view: VIEW): boolean {
    return this.users.find(user => user.userId === userId)?.currentView === view;
  }

  isUserReady(userId: number, view: VIEW): boolean {
    return this.users.find(user => user.userId === userId)?.isReadyForView === view;
  }
}
