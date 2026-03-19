import { Type } from 'class-transformer';
import { Question } from './Question';
import { MemoryAnswer } from './MemoryAnswer';

export class Memory {
  @Type(() => Question)
  currentQuestion: Question;

  @Type(() => MemoryAnswer)
  memoryAnswers: MemoryAnswer[];

  @Type(() => Boolean)
  areUsersHidden: boolean;

  @Type(() => String)
  shareKey: string;

  @Type(() => Number)
  round: number;

  constructor(
    currentQuestion: Question,
    memoryAnswers: MemoryAnswer[],
    areUsersHidden: boolean,
    shareKey: string,
    round: number
  ) {
    this.currentQuestion = currentQuestion;
    this.memoryAnswers = memoryAnswers;
    this.areUsersHidden = areUsersHidden;
    this.shareKey = shareKey;
    this.round = round;
  }
}
