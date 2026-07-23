// src/stores/todoStore.js

import { defineStore } from "pinia";

import { defaultTodos } from "../data/todos";
import { useUserStore } from "./userStore";

const TODOS_STORAGE_KEY = "todo-manager-todos";

/**
 * 初期TODOを複製します。
 * defaultTodosを直接変更しないための処理です。
 */
function cloneDefaultTodos() {
  return defaultTodos.map((todo) => ({
    ...todo,
  }));
}

/**
 * localStorageからTODOを読み込みます。
 *
 * 保存済みのデータがない場合や、
 * JSONの読み込みに失敗した場合は初期データを返します。
 */
function loadTodos() {
  const savedTodos = localStorage.getItem(TODOS_STORAGE_KEY);

  if (!savedTodos) {
    return cloneDefaultTodos();
  }

  try {
    const parsedTodos = JSON.parse(savedTodos);

    if (!Array.isArray(parsedTodos)) {
      return cloneDefaultTodos();
    }

    return parsedTodos;
  } catch (error) {
    console.error("TODOデータの読み込みに失敗しました。", error);

    return cloneDefaultTodos();
  }
}

/**
 * 達成率を0～100の範囲に収めます。
 */
function normalizeProgress(progress) {
  const numericProgress = Number(progress);

  if (Number.isNaN(numericProgress)) {
    return 0;
  }

  return Math.min(100, Math.max(0, numericProgress));
}

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: loadTodos(),
  }),

  getters: {
    /**
     * 現在ログイン中のユーザーが所有するTODOを返します。
     */
    currentUserTodos(state) {
      const userStore = useUserStore();
      const currentUserId = userStore.currentUser?.id;

      if (currentUserId === undefined) {
        return [];
      }

      return state.todos.filter((todo) => todo.userId === currentUserId);
    },

    /**
     * 現在ログイン中のユーザーの期限ありTODOを返します。
     *
     * このコミットでは、まだ締切順には並べません。
     */
    currentUserDeadlineTodos() {
      return this.currentUserTodos.filter((todo) => todo.hasDeadline);
    },

    /**
     * 現在ログイン中のユーザーの期限なしTODOを返します。
     */
    currentUserNoDeadlineTodos() {
      return this.currentUserTodos.filter((todo) => !todo.hasDeadline);
    },

    /**
     * IDを指定してTODOを取得する関数を返します。
     */
    getTodoById: (state) => (todoId) => {
      const numericId = Number(todoId);

      return state.todos.find((todo) => todo.id === numericId) ?? null;
    },

    /**
     * ユーザーIDを指定してTODOを取得する関数を返します。
     */
    getTodosByUserId: (state) => (userId) => {
      const numericUserId = Number(userId);

      return state.todos.filter((todo) => todo.userId === numericUserId);
    },
  },

  actions: {
    /**
     * 現在のTODO一覧をlocalStorageに保存します。
     */
    saveTodos() {
      localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(this.todos));
    },

    /**
     * 新しいTODOを追加します。
     *
     * @param {Object} todoData 入力されたTODO情報
     * @returns {Object} 追加されたTODO
     */
    addTodo(todoData) {
      const userStore = useUserStore();
      const currentUserId = userStore.currentUser?.id;

      if (currentUserId === undefined) {
        throw new Error("ログイン中のユーザーが見つかりません。");
      }

      const title =
        typeof todoData.title === "string" ? todoData.title.trim() : "";

      if (!title) {
        throw new Error("TODO名を入力してください。");
      }

      const hasDeadline = Boolean(todoData.hasDeadline);

      if (hasDeadline && !todoData.deadlineAt) {
        throw new Error("期限を設定してください。");
      }

      const repeatEnabled = hasDeadline && Boolean(todoData.repeatEnabled);

      const nextId =
        this.todos.length === 0
          ? 1
          : Math.max(...this.todos.map((todo) => todo.id)) + 1;

      const now = new Date().toISOString();

      const newTodo = {
        id: nextId,
        userId: currentUserId,

        title,

        hasDeadline,
        deadlineAt: hasDeadline ? todoData.deadlineAt : null,

        repeatEnabled,
        repeatType: repeatEnabled ? (todoData.repeatType ?? null) : null,

        progress: normalizeProgress(todoData.progress ?? 0),

        createdAt: now,
        updatedAt: now,
      };

      this.todos.push(newTodo);
      this.saveTodos();

      return newTodo;
    },

    /**
     * 指定されたTODOを更新します。
     *
     * @param {number} todoId 更新対象のTODO ID
     * @param {Object} updates 更新内容
     * @returns {boolean} 更新できた場合はtrue
     */
    updateTodo(todoId, updates) {
      const numericId = Number(todoId);

      const todo = this.todos.find((item) => item.id === numericId);

      if (!todo) {
        return false;
      }

      if (Object.prototype.hasOwnProperty.call(updates, "title")) {
        const title =
          typeof updates.title === "string" ? updates.title.trim() : "";

        if (!title) {
          throw new Error("TODO名を入力してください。");
        }

        todo.title = title;
      }

      if (Object.prototype.hasOwnProperty.call(updates, "hasDeadline")) {
        todo.hasDeadline = Boolean(updates.hasDeadline);
      }

      if (Object.prototype.hasOwnProperty.call(updates, "deadlineAt")) {
        todo.deadlineAt = updates.deadlineAt;
      }

      if (Object.prototype.hasOwnProperty.call(updates, "repeatEnabled")) {
        todo.repeatEnabled = Boolean(updates.repeatEnabled);
      }

      if (Object.prototype.hasOwnProperty.call(updates, "repeatType")) {
        todo.repeatType = updates.repeatType;
      }

      if (Object.prototype.hasOwnProperty.call(updates, "progress")) {
        todo.progress = normalizeProgress(updates.progress);
      }

      /*
       * 期限なしへ変更された場合は、
       * 期限と繰り返し設定を解除します。
       */
      if (!todo.hasDeadline) {
        todo.deadlineAt = null;
        todo.repeatEnabled = false;
        todo.repeatType = null;
      }

      /*
       * 繰り返しOFFの場合は、
       * 繰り返し単位を解除します。
       */
      if (!todo.repeatEnabled) {
        todo.repeatType = null;
      }

      todo.updatedAt = new Date().toISOString();

      this.saveTodos();

      return true;
    },

    /**
     * 達成率だけを更新します。
     */
    updateProgress(todoId, progress) {
      return this.updateTodo(todoId, {
        progress,
      });
    },

    /**
     * 指定されたTODOを削除します。
     *
     * @returns {boolean} 削除できた場合はtrue
     */
    deleteTodo(todoId) {
      const numericId = Number(todoId);

      const index = this.todos.findIndex((todo) => todo.id === numericId);

      if (index === -1) {
        return false;
      }

      this.todos.splice(index, 1);
      this.saveTodos();

      return true;
    },

    /**
     * localStorageのTODOを初期データへ戻します。
     * 開発・動作確認用の処理です。
     */
    resetTodos() {
      this.todos = cloneDefaultTodos();
      this.saveTodos();
    },
  },
});
