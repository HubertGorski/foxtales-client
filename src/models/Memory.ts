import { Expose, Type } from 'class-transformer';
import { Question } from './Question';
import { MemoryAnswer } from './MemoryAnswer';

export class Memory {
  @Expose({ name: 'memoryId' })
  id: number | null = null;

  @Type(() => Question)
  currentQuestion: Question;

  @Type(() => MemoryAnswer)
  memoryAnswers: MemoryAnswer[];

  @Type(() => Boolean)
  areUsersHidden: boolean;

  constructor(currentQuestion: Question, memoryAnswers: MemoryAnswer[], areUsersHidden: boolean) {
    this.currentQuestion = currentQuestion;
    this.memoryAnswers = memoryAnswers;
    this.areUsersHidden = areUsersHidden;
  }
}
