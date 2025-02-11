import { defineStore } from "pinia";
import { User } from "@/models/User";
import { users } from "@/assets/data/users";

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
  },

  actions: {
    setUsername(newUsername: string) {
      this.user.username = newUsername;
    },

    setAvatar(source: string) {
      this.user.avatar = source;
    },
  },
});
