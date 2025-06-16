import { GENDER } from "@/enums/userEnum";
import { LANG } from "@/enums/languagesEnum";

export class Question {
  id: number;
  text: string;
  ownerId: number;
  language: LANG;
  targetGender: GENDER;
  isPublic: boolean;
  usedCount: number;
  publicDate: Date | null;
  createdDate: Date;

  constructor(
    id: number = 0,
    text: string = "",
    ownerId: number = 0,
    language: LANG = LANG.PL,
    targetGender: GENDER = GENDER.ALL,
    isPublic: boolean = false,
    usedCount: number = 0,
    publicDate: Date | null = null,
    createdDate: Date = new Date()
  ) {
    this.id = id;
    this.text = text;
    this.isPublic = isPublic;
    this.ownerId = ownerId;
    this.language = language;
    this.targetGender = targetGender;
    this.usedCount = usedCount;
    this.publicDate = publicDate;
    this.createdDate = createdDate;
  }
}
