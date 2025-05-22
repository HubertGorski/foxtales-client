
import { DYLEMATY_CARD_TYPE, DylematyCard } from "@/models/DylematyCard";

export const dylematyCards = [
  new DylematyCard(1, 'Masz moc przechodzenia przez ściany', DYLEMATY_CARD_TYPE.POSITIVE),
  new DylematyCard(2, 'Wieczorami jesteś niewidzialny', DYLEMATY_CARD_TYPE.POSITIVE),
  new DylematyCard(3, 'Śmierdzisz rybą', DYLEMATY_CARD_TYPE.NEGATIVE),
  new DylematyCard(4, 'Znasz wszystkie języki świata', DYLEMATY_CARD_TYPE.POSITIVE),
  new DylematyCard(5, 'Zawsze gdy próbujesz czegoś nowego to źle się dla Ciebie to kończy', DYLEMATY_CARD_TYPE.NEGATIVE)
];
