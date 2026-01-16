import type { LANG } from '@/enums/languagesEnum';
import { Expose, Transform } from 'class-transformer';

export class Answer {
  @Expose({ name: 'answerId' })
  id: number;
  questionId: number;
  ownerId: number;
  answer: string;

  @Transform(({ value }) => {
    if (!value) return null;
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key.toLowerCase() as LANG, val])
    );
  })
  answerInOtherLanguages: Partial<Record<LANG, string>> | null = null;
  votersCount: number = 0;

  constructor(id = 0, questionId: number = 0, ownerId: number = 0, answer: string = '') {
    this.id = id;
    this.questionId = questionId;
    this.ownerId = ownerId;
    this.answer = answer;
  }
}
