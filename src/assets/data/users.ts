import { ROLE } from "@/enums/rolesEnum";
import { UserWithReady } from "@/models/User";
import { DEFAULT_AVATAR } from "@/enums/userEnum";
import { GENDER } from "@/enums/userEnum";

export const users = [
  new UserWithReady(1, "Natalia Bardzodlug ienazwisko", '', 0, 0, new Date(), new Date(), GENDER.WOMAN, ROLE.USER),
  new UserWithReady(2, "Adam Kaleta", DEFAULT_AVATAR, 0, 0, new Date(), new Date(), GENDER.MAN),
  new UserWithReady(3, "Przemo", DEFAULT_AVATAR, 0, 0, new Date(), new Date(), GENDER.MAN),
  new UserWithReady(4, "Mariuszek DobryCzłowiek", DEFAULT_AVATAR, 0, 0, new Date(), new Date(), GENDER.MAN, ROLE.ADMIN),
  new UserWithReady(5, "Hubert Bardzodlugienazwisko", DEFAULT_AVATAR, 0, 0, new Date(), new Date(), GENDER.MAN, ROLE.ADMIN),
  new UserWithReady(8, "Marta", DEFAULT_AVATAR, 0, 0, new Date(), new Date(), GENDER.MAN),
  new UserWithReady(9, "Wojtek", DEFAULT_AVATAR, 0, 0, new Date(), new Date(), GENDER.MAN)
];
