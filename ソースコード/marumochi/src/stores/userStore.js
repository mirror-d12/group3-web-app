import { defineStore } from "pinia";

import users from "../data/users";

export const useUserStore = defineStore("user", {
  state: () => ({
    users,

    currentUser: null,
  }),
});
