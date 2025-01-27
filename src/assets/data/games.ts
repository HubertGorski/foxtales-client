import { ROLE } from "@/enums/rolesEnum";
import { User, UserInLobby } from "@/models/User";
import { DEFAULT_AVATAR } from "@/enums/userEnum";
import { GENDER } from "@/enums/userEnum";
import { Game } from "@/models/Game";

const users: UserInLobby[] = [
  new UserInLobby(1, "Natalia Bardzodlug ienazwisko", '', 0, 0, new Date(), new Date(), GENDER.WOMAN, ROLE.USER),
  new UserInLobby(2, "Adam Kaleta", DEFAULT_AVATAR, 0, 0, new Date(), new Date(), GENDER.MAN),
  new UserInLobby(3, "Przemo", DEFAULT_AVATAR, 0, 0, new Date(), new Date(), GENDER.MAN),
];

export const games = [
  new Game('PIESEK1', true, new User(), users),
  new Game('PLACKI3', true, new User(1, 'Aleks'), users, 'oko'),
  new Game('UN2PUBLIC', false, new User(2, 'Artur'), users, 'oko'),
  new Game('HEHE54', true, new User(3, 'Przemysław Bukowski'), users),
  new Game('UN2PUBLIC', true, new User(4, 'Mariuszek Corporation'), users, 'oko'),
  new Game('UN2PUBLIC', true, new User(4, 'MariuszekCorporationVersionBezSpacji'), users, 'oko'),
];
