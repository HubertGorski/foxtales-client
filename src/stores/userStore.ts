import { defineStore } from "pinia";
import { User } from "@/models/User";
import { users } from "@/assets/data/users";
import { Avatar } from "@/models/Avatar";
import type { LANG } from "@/enums/languagesEnum";
import type { Catalog } from "@/models/Catalog";
import type { Question } from "@/models/Question";
import type { PERMISSION, PERMISSION_GAME } from "@/enums/permissions";
import type { Deck } from "@/models/Deck";

interface UserState {
  user: User;
  avatars: Avatar[];
}

export const useUserStore = defineStore({
  id: "userStore",
  state: (): UserState => ({
    user: new User(),
    avatars: [],
  }),

  getters: {
    getAccessToken: (state) => () => {
      return state.user.accessToken;
    },

    getPermissionByName: (state) => (name: PERMISSION_GAME | PERMISSION) => {
      const permission = state.user.permissions.find(
        (permission) => permission.name === name
      );

      if (!permission) {
        throw new Error(`Invalid permission: ${name}`);
      }

      return permission;
    },
  },

  actions: {
    setAvatars(avatars: Avatar[]) {
      this.avatars = avatars;
    },

    setUserSession(user: User) {
      this.user = user;
    },

    setAccessToken(accessToken: string) {
      this.user.accessToken = accessToken;
    },

    setUsername(newUsername: string) {
      this.user.username = newUsername;
    },

    setAvatar(newAvatar: Avatar) {
      this.user.avatar = newAvatar;
    },

    setLanguage(newLanguage: LANG) {
      this.user.language = newLanguage;
    },

    addCatalog(newCatalog: Catalog) {
      this.user.catalogs.push(newCatalog);
    },

    addDeck(newDeck: Deck) {
      this.user.decks.push(newDeck);
    },

    editCatalog(catalog: Catalog) {
      const index = this.user.catalogs.findIndex(
        (userCatalog) => userCatalog.id === catalog.id
      );
      if (index !== -1) {
        this.user.catalogs[index] = catalog;
      }
    },

    editDeck(deck: Deck) {
      const index = this.user.decks.findIndex(
        (userDeck) => userDeck.id === deck.id
      );
      if (index !== -1) {
        this.user.decks[index] = deck;
      }
    },

    addQuestion(newQuestion: Question) {
      this.user.questions.push(newQuestion);
    },
    
    removeQuestion(questionId: number) {
      this.user.questions = this.user.questions.filter(
        (question) => question.id !== questionId
      );
    },
  },
});
