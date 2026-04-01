import { LANG } from '@/enums/languagesEnum';

const adjs: Record<LANG, string[]> = {
  [LANG.EN]: [
    'Swift',
    'Neon',
    'Arctic',
    'Ghost',
    'Golden',
    'Cyber',
    'Silent',
    'Lunar',
    'Crimson',
    'Shadow',
    'Frost',
    'Mystic',
  ],
  [LANG.PL]: [
    'Szybki',
    'Neonowy',
    'Arktyczny',
    'Zloty',
    'Cichy',
    'Ukryty',
    'Dziki',
    'Zelazny',
    'Mrozny',
    'Sprytny',
    'Mglisty',
  ],
  [LANG.DE]: [
    'Schnell',
    'Goldener',
    'Stiller',
    'Wilder',
    'Eisiger',
    'Flinker',
    'Schlauer',
    'Finsterer',
    'Roter',
  ],
  [LANG.FR]: [
    'Rapide',
    'Argente',
    'Secret',
    'Fier',
    'Sauvage',
    'Glace',
    'Ruse',
    'Sombre',
    'Petit',
    'Vif',
  ],
  [LANG.ES]: [
    'Veloz',
    'Dorado',
    'Oculto',
    'Feroz',
    'Bravo',
    'Gelido',
    'Astuto',
    'Sombre',
    'Rojo',
    'Chico',
  ],
};

const foxes: Record<LANG, string[]> = {
  [LANG.EN]: ['Fox', 'Tail', 'Kit', 'Vulpix', 'Fennec', 'Vulpine', 'Kitsune', 'Vixen'],
  [LANG.PL]: ['Lis', 'Ogon', 'Lisek', 'Kita', 'Pyszczek', 'Pazurek', 'Futro', 'Rudzielec'],
  [LANG.DE]: ['Fuchs', 'Schwanz', 'Pfote', 'Pelz', 'Welpe', 'Fuchsi', 'Schlauchs'],
  [LANG.FR]: ['Renard', 'Queue', 'Patte', 'Goupil', 'Museau', 'Renardeau'],
  [LANG.ES]: ['Zorro', 'Cola', 'Patas', 'Zorrito', 'Pelaje', 'Hocico'],
};

export const generateFoxNick = (lang: LANG = LANG.EN): string => {
  const currentAdjs = adjs[lang] || adjs[LANG.EN];
  const currentFoxes = foxes[lang] || foxes[LANG.EN];

  const num = Math.floor(Math.random() * 100);
  const rnd = (list: string[]) => list[Math.floor(Math.random() * list.length)];

  return `${rnd(currentAdjs)}${rnd(currentFoxes)}${num}`;
};
