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
    register(userName, email, password) {
      const exists = users.some((user) => user.email === email);

      if (exists) {
        return false;
      }

      users.push({
        id: users.length + 1,

        userName,

        email,

        password,

        friendIds: [],

        friendCount: 0,

        loginDays: 0,

        totalTodoCount: 0,

        createdAt: new Date().toISOString(),

        isLoggedIn: false,

        profileImage: "profile1.png",
      });

      return true;
    },
    findUserByEmail(email) {
      return users.find((user) => user.email === email);
    },
    changePassword(email, newPassword) {
      const user = users.find((user) => user.email === email);

      if (!user) {
        return false;
      }

      user.password = newPassword;

      return true;
    },
  },
});
