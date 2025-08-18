import { Expose } from "class-transformer";

export class Answer {
  @Expose({ name: "answerId" })
  id: number;
  questionId: number;
  ownerId: number;
  answer: string;
  votersCount: number = 0;

  constructor(
    id = 0,
    questionId: number = 0,
    ownerId: number = 0,
    answer: string = ""
  ) {
    this.id = id;
    this.questionId = questionId;
    this.ownerId = ownerId;
    this.answer = answer;
  }
}
