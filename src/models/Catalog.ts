import type { Question } from "./Question";

export class Catalog {
  id: number;
  size: number;
  title: string;
  description: string;
  ownerId: number;
  createdDate: Date;
  usedCount: number;
  isSelected: boolean;
  questions: Question[];

  constructor(
    id: number = 0,
    size: number = 0,
    title: string = "",
    description: string = "",
    ownerId: number = 0,
    createdDate: Date = new Date(),
    usedCount: number = 0,
    isSelected: boolean = false,
    questions: Question[] = []
  ) {
    this.id = id;
    this.size = size;
    this.title = title;
    this.description = description;
    this.ownerId = ownerId;
    this.createdDate = createdDate;
    this.usedCount = usedCount;
    this.isSelected = isSelected;
    this.questions = questions;
  }

  get questionsCount(): number {
    return this.questions.length;
  }

  get isFull(): boolean {
    return this.questionsCount === this.size;
  }

  availableTypes = [
    { id: 1, name: "small", size: 10 },
    { id: 2, name: "medium", size: 20 },
    { id: 3, name: "large", size: 35 },
  ];

  setQuestions(questions: Question[]): Catalog {
    this.questions = questions;
    return this;
  }
}
