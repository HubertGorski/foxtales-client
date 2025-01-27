import { User } from "./User";

export class Answer {
  id: number;
  questionId: number;
  owner: User;
  answer: string;

  constructor(id = 0, questionId: number = 0, owner: User = new User(), answer: string = '') {
    this.id = id;
    this.questionId = questionId;
    this.owner = owner;
    this.answer = answer;
  }
}