import { Type } from 'class-transformer';
import { Question } from './Question';
import { User } from './User';

export class Memory {
  @Type(() => Question)
  currentQuestion: Question;

  @Type(() => User)
  users: User[];

  constructor(currentQuestion: Question, users: User[]) {
    this.currentQuestion = currentQuestion;
    this.users = users;
  }
}
