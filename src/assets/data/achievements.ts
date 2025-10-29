import { Achievement } from '@/models/Achievement';

export const achievements = [
  new Achievement(1, 'Szczwany liseł', '', '', '/src/assets/imgs/achievements/1.webp'),
  new Achievement(
    2,
    'Lisek zgrywusek',
    'Najzabawniejszy gracz w grze',
    'Zdobądź najwięcej punktów w rozgrywce',
    '/src/assets/imgs/achievements/2.webp',
    2
  ),
  new Achievement(
    3,
    'Lis projektant',
    'Twórca biblioteki',
    'Utwórz katalog',
    '/src/assets/imgs/achievements/3.webp',
    1
  ),
  new Achievement(
    4,
    'Lisi gospodarz',
    'Organizator gier',
    'Utwórz grę i zagraj ze znajomymi',
    '/src/assets/imgs/achievements/4.webp',
    3
  ),
  new Achievement(
    5,
    'Lisie gierki',
    '',
    'Dołącz do gry ze znajomymi',
    '/src/assets/imgs/achievements/4.webp'
  ),
  new Achievement(6, 'Lisek urwisek', '', '', '/src/assets/imgs/achievements/4.webp'),
];
