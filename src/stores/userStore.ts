import { defineStore } from "pinia";
import { User } from "@/models/User";
import { users } from "@/assets/data/users";
import type { Avatar } from "@/models/Avatar";
import type { LANG } from "@/enums/languagesEnum";
import type { Catalog } from "@/models/Catalog";
import type { Question } from "@/models/Question";
import type { PERMISSION, PERMISSION_GAME } from "@/enums/permissions";
import { permissions } from "@/assets/data/permissions";

interface UserState {
  user: User;
}

export const useUserStore = defineStore({
  id: "userStore",
  state: (): UserState => ({
    user: users[7],
  }),

  getters: {
    getUserRole: (state) => {
      return state.user.role;
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

    editCatalog(catalog: Catalog) {
      const index = this.user.catalogs.findIndex(
        (userCatalog) => userCatalog.id === catalog.id
      );
      if (index !== -1) {
        this.user.catalogs[index] = catalog;
      }
    },

    addQuestion(newQuestion: Question) {
      this.user.questions.push(newQuestion);
    },
  },
});
