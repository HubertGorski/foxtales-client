import { ICON } from '@/enums/iconsEnum';
import { PERMISSION_GAME } from '@/enums/permissions';
import { FoxGame } from '@/models/FoxGame';

const foxGames = [
  new FoxGame(
    PERMISSION_GAME.PSYCH,
    ICON.GAME_PSYCH,
    'foxGame.psych.name',
    'foxGame.psych.description'
  ),
  new FoxGame(
    PERMISSION_GAME.DYLEMATY,
    ICON.GAME_DYLEMATY,
    'foxGame.dylematy.name',
    'foxGame.dylematy.description'
  ),
  new FoxGame(
    PERMISSION_GAME.KILLGAME,
    ICON.GAME_KILLGAME,
    'foxGame.killGame.name',
    'foxGame.killGame.description'
  ),
];

export default foxGames;
