import { defineStore } from "pinia";

import todos from "../data/todos";

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos,
  }),
});
