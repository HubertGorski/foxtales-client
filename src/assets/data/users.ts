import { ROLE } from "@/enums/rolesEnum";
import { UserInLobby } from "@/models/User";
import { DEFAULT_AVATAR } from "@/enums/userEnum";
import { GENDER } from "@/enums/userEnum";

export const users = [
  new UserInLobby(1, "Natalia Bardzodlug ienazwisko", '', 0, 0, new Date(), new Date(), GENDER.WOMAN, ROLE.USER),
  new UserInLobby(2, "Adam Kaleta", DEFAULT_AVATAR, 0, 0, new Date(), new Date(), GENDER.MAN),
  new UserInLobby(3, "Przemo", DEFAULT_AVATAR, 0, 0, new Date(), new Date(), GENDER.MAN),
  new UserInLobby(4, "Mariuszek DobryCzłowiek", DEFAULT_AVATAR, 0, 0, new Date(), new Date(), GENDER.MAN, ROLE.ADMIN),
  new UserInLobby(5, "Hubert Bardzodlugienazwisko", DEFAULT_AVATAR, 0, 0, new Date(), new Date(), GENDER.MAN, ROLE.ADMIN),
  new UserInLobby(8, "Marta", DEFAULT_AVATAR, 0, 0, new Date(), new Date(), GENDER.MAN),
  new UserInLobby(9, "Wojtek", DEFAULT_AVATAR, 0, 0, new Date(), new Date(), GENDER.MAN)
];
