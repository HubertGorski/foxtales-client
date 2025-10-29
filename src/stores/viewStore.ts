import { defineStore } from 'pinia';

interface ViewState {
  isKeyboardOpen: boolean;
  isMobile: boolean;
}

export const useViewStore = defineStore({
  id: 'viewStore',
  state: (): ViewState => ({
    isKeyboardOpen: false,
    isMobile: false,
  }),

  getters: {
    getIsKeyboardOpen: state => () => state.isKeyboardOpen,
    getIsMobile: state => () => state.isMobile,
  },

  actions: {
    setIsKeyboardOpen(isKeyboardOpen: boolean) {
      this.isKeyboardOpen = isKeyboardOpen;
    },
    setIsMobile(isMobile: boolean) {
      this.isMobile = isMobile;
    },
  },
});
