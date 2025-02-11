import { GENDER } from "@/enums/userEnum";
import { LANG } from "@/enums/languagesEnum";
import { User } from "./User";

export class Question {
  id: number;
  text: string;
  owner: User;
  language: LANG;
  targetGender: GENDER;
  isPublic: boolean;
  usedCount: number;

  constructor(
    id: number = 0,
    text: string = "",
    owner: User = new User(),
    language: LANG = LANG.PL,
    targetGender: GENDER = GENDER.ALL,
    isPublic: boolean = false,
    usedCount: number = 0
  ) {
    this.id = id;
    this.text = text;
    this.isPublic = isPublic;
    this.owner = owner;
    this.language = language;
    this.targetGender = targetGender;
    this.isPublic = isPublic;
    this.usedCount = usedCount;
  }
}
