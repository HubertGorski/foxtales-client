import { GENDER } from '@/enums/userEnum';
import { LANG, LangFromNumber, LangToNumber } from '@/enums/languagesEnum';
import { User } from './User';
import { Transform, Type } from 'class-transformer';

export class Question {
  id: number | null;
  text: string;
  ownerId: number;

  @Transform(
    ({ value }) => {
      if (typeof value === 'number') {
        return LangFromNumber[value] ?? LANG.PL;
      }

      if (typeof value === 'string') {
        return LangToNumber[value as LANG] ?? 1;
      }

      return value;
    },
    { toClassOnly: false }
  )
  language: LANG;

  targetGender: GENDER;
  isPublic: boolean;
  usedCount: number;
  publicDate: Date | null;
  createdDate: Date;
  catalogIds: number[];

  @Type(() => User)
  currentUser: User | null = null;

  constructor(
    id: number | null = null,
    text: string = '',
    ownerId: number = 0,
    language: LANG = LANG.PL,
    targetGender: GENDER = GENDER.ALL,
    isPublic: boolean = false,
    usedCount: number = 0,
    publicDate: Date | null = null,
    createdDate: Date = new Date(),
    catalogIds = []
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
    this.catalogIds = catalogIds;
  }

  addCatalogs(catalogIds: number[]): void {
    this.catalogIds = catalogIds;
  }
}
