import { defineStore } from "pinia";

import { users } from "../data/users";

export const useUserStore = defineStore("user", {
  state: () => ({
    currentUser: null,
  }),

  actions: {
    login(email, password) {
      const user = users.find(
        (user) => user.email === email && user.password === password,
      );

      if (!user) {
        return false;
      }

      user.isLoggedIn = true;

      this.currentUser = user;

      return true;
    },

    logout() {
      if (this.currentUser) {
        this.currentUser.isLoggedIn = false;
      }

      this.currentUser = null;
    },
  },
});
