import { PERMISSION_GAME } from '@/enums/permissions';
import { Expose } from 'class-transformer';

export class FoxGame {
  @Expose({ name: 'foxGameId' })
  permission: PERMISSION_GAME;

  icon: string;

  @Expose()
  name: string;

  description: string;

  constructor(
    permission: PERMISSION_GAME = PERMISSION_GAME.PSYCH,
    icon: string = '',
    name: string = '',
    description: string = ''
  ) {
    this.permission = permission;
    this.icon = icon;
    this.name = name;
    this.description = description;
  }
}
