export const getAvatar = (id: number | undefined): string => {
  if (!id) {
    return '';
  }

  return new URL(`/src/assets/imgs/defaultAvatars/${id}.webp`, import.meta.url).href;
};

export const getUnknownAvatar = (): string => {
  return new URL('/src/assets/imgs/defaultAvatars/idk.webp', import.meta.url).href;
};

export const getCatalogImg = (catalogId: number) => {
  return new URL(`/src/assets/imgs/catalogs/${catalogId}.webp`, import.meta.url).href;
};
