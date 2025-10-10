import { defineStore } from "pinia";

interface ViewState {
  isKeyboardOpen: boolean;
}

export const useViewStore = defineStore({
  id: "viewStore",
  state: (): ViewState => ({
    isKeyboardOpen: false
  }),

  getters: {
    getIsKeyboardOpen: (state) => () => {
      return state.isKeyboardOpen;
    }
  },

  actions: {
    setIsKeyboardOpen(isKeyboardOpen: boolean) {
      this.isKeyboardOpen = isKeyboardOpen;
    }
  },
});
