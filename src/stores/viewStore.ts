import { defineStore } from 'pinia';

interface InfoMessage {
  id: number;
  text: string;
}

interface ViewState {
  isKeyboardOpen: boolean;
  isMobile: boolean;
  useWakeLock: boolean;
  infos: InfoMessage[];
}

export const useViewStore = defineStore({
  id: 'viewStore',
  state: (): ViewState => ({
    isKeyboardOpen: false,
    isMobile: false,
    useWakeLock: false,
    infos: [],
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
    setInfo(info: string) {
      if (!info) return;

      const id = Date.now() + Math.random();
      this.infos.push({ id, text: info });

      setTimeout(() => {
        this.infos = this.infos.filter(i => i.id !== id);
      }, 4000);
    },
    toggleWakeLock() {
      this.useWakeLock = !this.useWakeLock;
    },
  },
});
